import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import verifierService from '@/api/services/verifier.service';
import {
  APPLICATION_STATUS,
  APPLICATION_TYPE,
  DOCUMENT_STATUS,
} from '../constants/verifierConstants';

/**
 * Verifier Store - Zustand State Management
 * 
 * ✅ Using real API endpoints
 * ✅ Document statuses persisted in localStorage
 * ❌ Mock data removed
 */

const useVerifierStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        applications: {
          doctors: [],
        },
        selectedApplication: null,
        // Document statuses cache - persists across modal open/close
        documentStatuses: {}, // { documentId: status }
        stats: {
          totalPending: 0,
          totalUnderReview: 0,
          totalApprovedToday: 0,
          totalRejected: 0,
          totalDoctors: 0,
        },
        loading: {
          applications: false,
          stats: false,
          action: false,
        },
        error: {
          applications: null,
          stats: null,
          action: null,
        },
        filters: {
          activeTab: APPLICATION_TYPE.DOCTOR,
          activeStatus: APPLICATION_STATUS.PENDING, // 5 (Sent), 1 (UnderReview), 2 (Verified), 3 (Rejected)
        },

        // Actions

        /**
         * Fetch doctors by status from API
         * Uses current activeStatus filter
         */
        /**
         * Fetch doctors by status from API
         * Uses current activeStatus filter
         * @param {boolean} showLoading - whether to show loading state (default: true)
         */
        fetchApplications: async (showLoading = true) => {
          if (showLoading) {
            set({ loading: { ...get().loading, applications: true } });
          }

          try {
            const { activeStatus } = get().filters;
            let doctors = [];

            console.log('🔍 [Verifier] Fetching doctors with status:', activeStatus, 'Loading:', showLoading);

            // Map status to API endpoint
            let response;
            switch (activeStatus) {
              case APPLICATION_STATUS.PENDING: // Sent (5)
                response = await verifierService.getDoctorsWithSentStatus(1, 50);
                break;
              case APPLICATION_STATUS.UNDER_REVIEW: // UnderReview (1)
                response = await verifierService.getDoctorsUnderReview(1, 50);
                break;
              case APPLICATION_STATUS.APPROVED: // Verified (2)
                response = await verifierService.getVerifiedDoctors(1, 50);
                break;
              case APPLICATION_STATUS.REJECTED: // Rejected (3)
                response = await verifierService.getRejectedDoctors(1, 50);
                break;
              default:
                console.warn('Unknown status:', activeStatus);
                response = { data: [] };
            }

            // Process Response
            if (activeStatus === APPLICATION_STATUS.PENDING) {
              const sentResponse = response;
              if (Array.isArray(sentResponse?.data)) {
                doctors = sentResponse.data;
              } else if (sentResponse?.data?.data && Array.isArray(sentResponse.data.data)) {
                doctors = sentResponse.data.data;
              } else {
                doctors = [];
              }
            } else {
              doctors = Array.isArray(response?.data) ? response.data : (response?.data?.data || []);
            }

            console.log('✅ [Verifier] Fetched doctors:', doctors.length);

            set({
              applications: {
                doctors,
              },
              loading: { ...get().loading, applications: false },
              error: { ...get().error, applications: null },
            });
          } catch (error) {
            console.error('❌ [Verifier] Fetch error:', error);
            set({
              loading: { ...get().loading, applications: false },
              error: { ...get().error, applications: error.message || 'فشل في جلب البيانات' },
            });
          }
        },

        /**
         * Fetch stats from API
         * Fetches counts from all status endpoints
         */
        fetchStats: async () => {
          // Stats usually don't need a heavy loading state blocking the UI
          // set({ loading: { ...get().loading, stats: true } }); 

          try {
            // Fetch all statuses in parallel
            const [sentRes, reviewRes, verifiedRes, rejectedRes] = await Promise.allSettled([
              verifierService.getDoctorsWithSentStatus(1, 1),
              verifierService.getDoctorsUnderReview(1, 1),
              verifierService.getVerifiedDoctors(1, 1),
              verifierService.getRejectedDoctors(1, 1),
            ]);

            const stats = {
              totalPending: sentRes.status === 'fulfilled' ? sentRes.value?.totalCount || 0 : get().stats.totalPending,
              totalUnderReview: reviewRes.status === 'fulfilled' ? reviewRes.value?.totalCount || 0 : get().stats.totalUnderReview,
              totalApprovedToday: verifiedRes.status === 'fulfilled' ? verifiedRes.value?.totalCount || 0 : get().stats.totalApprovedToday,
              totalRejected: rejectedRes.status === 'fulfilled' ? rejectedRes.value?.totalCount || 0 : get().stats.totalRejected,
              totalDoctors: 0,
            };

            console.log('📊 [Store] Stats breakdown:', {
              pending: sentRes.status === 'fulfilled' ? sentRes.value : 'failed',
              review: reviewRes.status === 'fulfilled' ? reviewRes.value : 'failed',
              verified: verifiedRes.status === 'fulfilled' ? verifiedRes.value : 'failed',
            });

            stats.totalDoctors = stats.totalPending + stats.totalUnderReview + stats.totalApprovedToday + stats.totalRejected;

            console.log('✅ [Verifier] Stats fetched:', stats);

            set({
              stats,
              loading: { ...get().loading, stats: false },
              error: { ...get().error, stats: null },
            });
          } catch (error) {
            console.error('❌ [Verifier] Stats error:', error);
            // Don't set error state to avoid breaking UI on minor stats fail
          }
        },

        /**
         * Set active tab (doctor, pharmacy, laboratory)
         */
        setActiveTab: (tab) => {
          set({
            filters: {
              ...get().filters,
              activeTab: tab,
            },
          });
        },

        /**
         * Set active status filter
         * Auto-fetches applications when status changes
         */
        setActiveStatus: async (status) => {
          console.log('🎯 [Store] setActiveStatus called with:', status);
          console.log('🔍 [Store] Current activeStatus:', get().filters.activeStatus);

          set({
            filters: {
              ...get().filters,
              activeStatus: status,
            },
          });

          console.log('✅ [Store] Status updated to:', get().filters.activeStatus);

          // Show loader when switching tabs (User Expectation)
          console.log('🔄 [Store] Fetching applications for status:', status);
          await get().fetchApplications(true);
        },

        /**
         * Select application for details view
         */
        selectApplication: (application) => {
          set({ selectedApplication: application });
        },

        /**
         * Fetch doctor's documents
         * GET /api/Verifier/doctors/{doctorId}/documents
         */
        fetchDoctorDocuments: async (doctorId) => {
          // This local loading is fine
          set({ loading: { ...get().loading, action: true } });

          try {
            console.log('📄 [Verifier] Fetching documents for doctor:', doctorId);

            const documents = await verifierService.getDoctorDocuments(doctorId);

            console.log('✅ [Verifier] Documents fetched:', documents);

            // Update selected application with documents
            const selectedApp = get().selectedApplication;
            if (selectedApp && selectedApp.id === doctorId) {
              set({
                selectedApplication: {
                  ...selectedApp,
                  documents: documents
                }
              });
            }

            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: null },
            });

            return { success: true, documents };
          } catch (error) {
            console.error('❌ [Verifier] Fetch documents error:', error);
            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: error.message || 'فشل في جلب المستندات' },
            });
            return { success: false, error: error.message };
          }
        },

        /**
         * Update document status in cache
         */
        updateDocumentStatusCache: (documentId, status) => {
          set({
            documentStatuses: {
              ...get().documentStatuses,
              [documentId]: status,
            },
          });
        },

        /**
         * Get document status from cache or application
         */
        getDocumentStatus: (documentId, defaultStatus) => {
          const cached = get().documentStatuses[documentId];
          return cached !== undefined ? cached : defaultStatus;
        },

        /**
         * Clear selected application
         */
        clearSelectedApplication: () => {
          set({ selectedApplication: null });
        },

        /**
         * Approve/Verify doctor
         * POST /api/Doctors/{id}/verify
         */
        approveApplication: async (doctorId) => {
          set({ loading: { ...get().loading, action: true } });

          try {
            // Optimistic Update: Remove doctor from list immediately
            const currentDocs = get().applications.doctors;
            const updatedDocs = currentDocs.filter(d => d.id !== doctorId);
            set({
              applications: { ...get().applications, doctors: updatedDocs }
            });

            console.log('✅ [Verifier] Approving doctor:', doctorId);

            const response = await verifierService.verifyDoctor(doctorId);

            console.log('✅ [Verifier] Doctor approved:', response);

            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: null },
            });

            // Silent Refresh (Background)
            get().fetchApplications(false);
            get().fetchStats();

            return { success: true, message: 'تم اعتماد الطبيب بنجاح' };
          } catch (error) {
            console.error('❌ [Verifier] Approve error:', error);
            // Revert Optimistic Update (Fetch again to restore)
            get().fetchApplications(false);

            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: error.message || 'فشل في اعتماد الطبيب' },
            });
            return { success: false, error: error.message };
          }
        },

        /**
         * Reject doctor
         * POST /api/Doctors/{id}/reject
         */
        rejectApplication: async (doctorId) => {
          set({ loading: { ...get().loading, action: true } });

          try {
            // Optimistic Update
            const currentDocs = get().applications.doctors;
            const updatedDocs = currentDocs.filter(d => d.id !== doctorId);
            set({
              applications: { ...get().applications, doctors: updatedDocs }
            });

            console.log('❌ [Verifier] Rejecting doctor:', doctorId);

            const response = await verifierService.rejectDoctor(doctorId);

            console.log('✅ [Verifier] Doctor rejected:', response);

            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: null },
            });

            // Silent Refresh
            get().fetchApplications(false);
            get().fetchStats();

            return { success: true, message: 'تم رفض الطبيب' };
          } catch (error) {
            console.error('❌ [Verifier] Reject error:', error);
            get().fetchApplications(false);
            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: error.message || 'فشل في رفض الطبيب' },
            });
            return { success: false, error: error.message };
          }
        },

        /**
         * Start review for doctor
         * POST /api/Doctors/{id}/start-review
         */
        startReview: async (doctorId) => {
          set({ loading: { ...get().loading, action: true } });

          try {
            // Optimistic Update
            const currentDocs = get().applications.doctors;
            const updatedDocs = currentDocs.filter(d => d.id !== doctorId);
            set({
              applications: { ...get().applications, doctors: updatedDocs }
            });

            console.log('🔄 [Verifier] Starting review for doctor:', doctorId);

            const response = await verifierService.startReview(doctorId);

            console.log('✅ [Verifier] Review started:', response);

            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: null },
            });

            // Silent Refresh
            get().fetchApplications(false);
            get().fetchStats();

            return { success: true, message: 'تم بدء المراجعة' };
          } catch (error) {
            console.error('❌ [Verifier] Start review error:', error);
            get().fetchApplications(false);
            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: error.message || 'فشل في بدء المراجعة' },
            });
            return { success: false, error: error.message };
          }
        },

        /**
         * Update document status (deprecated - use approveDocument/rejectDocument instead)
         * TODO: Replace with API call
         */
        updateDocumentStatus: async (applicationId, documentId, status, notes = '') => {
          set({ loading: { ...get().loading, action: true } });

          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update document status
            const { applications, filters } = get();
            const tabKey = `${filters.activeTab}s`;

            const updatedApplications = applications[tabKey].map(app =>
              app.id === applicationId
                ? {
                  ...app,
                  documents: app.documents.map(doc =>
                    doc.id === documentId
                      ? { ...doc, status, notes }
                      : doc
                  ),
                }
                : app
            );

            set({
              applications: {
                ...applications,
                [tabKey]: updatedApplications,
              },
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: null },
            });

            return { success: true };
          } catch (error) {
            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: error.message },
            });
            return { success: false, error: error.message };
          }
        },

        /**
         * Approve a document
         * POST /api/Verifier/documents/{documentId}/approve
         */
        approveDocument: async (documentId) => {
          set({ loading: { ...get().loading, action: true } });

          try {
            console.log('✅ [Verifier] Approving document:', documentId);

            const response = await verifierService.approveDocument(documentId);

            console.log('✅ [Verifier] Document approved:', response);

            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: null },
            });

            // Update cache immediately for instant UI feedback
            get().updateDocumentStatusCache(documentId, DOCUMENT_STATUS.APPROVED);

            // Refresh applications and stats
            await get().fetchApplications();
            await get().fetchStats();

            return { success: true, message: response.message || 'تم قبول المستند' };
          } catch (error) {
            console.error('❌ [Verifier] Approve document error:', error);
            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: error.message || 'فشل في قبول المستند' },
            });
            return { success: false, error: error.message };
          }
        },

        /**
         * Reject a document
         * POST /api/Verifier/documents/{documentId}/reject
         */
        rejectDocument: async (documentId, rejectionReason = null) => {
          set({ loading: { ...get().loading, action: true } });

          try {
            console.log('❌ [Verifier] Rejecting document:', documentId, 'Reason:', rejectionReason);

            const response = await verifierService.rejectDocument(documentId, rejectionReason);

            console.log('✅ [Verifier] Document rejected:', response);

            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: null },
            });

            // Update cache immediately for instant UI feedback
            get().updateDocumentStatusCache(documentId, DOCUMENT_STATUS.REJECTED);

            // Refresh applications and stats
            await get().fetchApplications();
            await get().fetchStats();

            return { success: true, message: response.message || 'تم رفض المستند' };
          } catch (error) {
            console.error('❌ [Verifier] Reject document error:', error);
            set({
              loading: { ...get().loading, action: false },
              error: { ...get().error, action: error.message || 'فشل في رفض المستند' },
            });
            return { success: false, error: error.message };
          }
        },

        /**
         * Get filtered applications based on active tab and status
         */
        getFilteredApplications: () => {
          const { applications, filters } = get();

          // Map tab type to applications key
          const tabKeyMap = {
            [APPLICATION_TYPE.DOCTOR]: 'doctors',
          };

          const tabKey = tabKeyMap[filters.activeTab];
          const appList = applications[tabKey] || [];

          console.log('🔍 [Store] Filtering applications:', {
            tabKey,
            totalApps: appList.length,
            filterStatus: filters.activeStatus,
            apps: appList.map(a => ({ id: a.id, name: a.fullName, status: a.verificationStatus }))
          });

          // Filter by verificationStatus (from API)
          const filtered = appList.filter(
            app => app.verificationStatus === filters.activeStatus
          );

          console.log('✅ [Store] Filtered result:', filtered.length, 'applications');

          return filtered;
        },

        /**
         * Clear all errors
         */
        clearErrors: () => {
          set({
            error: {
              applications: null,
              stats: null,
              action: null,
            },
          });
        },

        /**
         * Reset store
         */
        reset: () => {
          set({
            applications: {
              doctors: [],
            },
            selectedApplication: null,
            documentStatuses: {},
            stats: {
              totalPending: 0,
              totalUnderReview: 0,
              totalApprovedToday: 0,
              totalRejected: 0,
              totalDoctors: 0,
            },
            loading: {
              applications: false,
              stats: false,
              action: false,
            },
            error: {
              applications: null,
              stats: null,
              action: null,
            },
            filters: {
              activeTab: APPLICATION_TYPE.DOCTOR,
              activeStatus: APPLICATION_STATUS.PENDING,
            },
          });
        },
      }),
      {
        name: 'verifier-storage',
        // Only persist documentStatuses to avoid storing large application data
        partialize: (state) => ({
          documentStatuses: state.documentStatuses
        }),
      }
    ),
    { name: 'VerifierStore' }
  )
);

export default useVerifierStore;

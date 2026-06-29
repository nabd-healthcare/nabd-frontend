import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import doctorService from '@/api/services/doctor.service';
import { mockPatients, simulateApiDelay } from '../data/mockData';

// Toggle this to force mock data
const USE_MOCK_DATA = false; // Merges mock data with real data for testing

export const usePatientsStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ==================== State ====================
        patients: [],
        selectedPatient: null,
        loading: false,
        error: null,

        // Pagination
        pagination: {
          pageNumber: 1,
          pageSize: 20,
          totalCount: 0,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        },

        // Search & Filter
        searchTerm: '',
        filterStatus: 'all', // 'all' | 'recent' | 'archived'
        sortBy: 'lastVisit', // 'lastVisit' | 'name' | 'sessions'

        // Patient Details (for modals)
        medicalRecord: null,
        sessionDocumentations: null,
        prescriptions: null,
        detailsLoading: false,
        detailsError: null,

        // ==================== Actions ====================

        /**
         * Fetch patients list with pagination
         * Only returns patients with COMPLETED appointments
         */
        fetchPatients: async (pageNumber = 1, pageSize = 20) => {
          console.log(' fetchPatients called:', { pageNumber, pageSize });
          set({ loading: true, error: null });

          //  Removed early return for mock data to allow merging below

          try {
            const response = await doctorService.getPatients({ pageNumber, pageSize });

            console.log('═══════════════════════════════════════');
            console.log(' Patients API Response:', response);
            console.log(' response.isSuccess:', response.isSuccess);
            console.log(' response.data exists:', !!response.data);
            console.log(' Full Response:', JSON.stringify(response, null, 2));
            console.log('═══════════════════════════════════════');

            if (response.isSuccess && response.data) {
              const { data: patientsData, ...paginationData } = response.data;

              console.log(' Patients Data:', patientsData);
              console.log(' Patients Count:', patientsData?.length);
              console.log(' Pagination:', paginationData);

              if (patientsData && patientsData.length > 0) {
                console.log(' First Patient:', patientsData[0]);
                console.log(' First Patient Keys:', Object.keys(patientsData[0]));
              }

              let finalPatients = patientsData || [];
              let finalPagination = paginationData;

              if (USE_MOCK_DATA) {
                console.log('️ Merging MOCK DATA for patients');
                const enrichedMockPatients = mockPatients.map(p => ({
                  ...p,
                  totalSessions: Math.floor(Math.random() * 10) + 1,
                  lastVisitDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
                  rating: (4 + Math.random()).toFixed(1)
                }));
                finalPatients = [...finalPatients, ...enrichedMockPatients];
                finalPagination.totalCount += enrichedMockPatients.length;
              }

              set({
                patients: finalPatients,
                pagination: finalPagination,
                loading: false,
              });

              console.log(' Patients loaded successfully:', finalPatients.length);
            } else {
              console.error(' Response validation failed:', {
                isSuccess: response.isSuccess,
                hasData: !!response.data,
                message: response.message
              });
              set({
                error: response.message || 'فشل في تحميل المرضى',
                loading: false
              });
            }
          } catch (error) {
            console.error('═══════════════════════════════════════');
            console.error(' Error fetching patients:', error);
            console.error(' Error response:', error.response);
            console.error(' Error response data:', error.response?.data);
            console.error('═══════════════════════════════════════');

            console.error(' API Failed, failed to fetch patients');
            set({
              error: 'فشل في تحميل المرضى',
              loading: false
            });
          }
        },

        /**
         * Fetch patient by ID
         */
        fetchPatientById: async (patientId) => {
          set({ loading: true, error: null });

          try {
            const response = await doctorService.getPatientById(patientId);

            if (response.isSuccess && response.data) {
              set({
                selectedPatient: response.data,
                loading: false,
              });
              return response.data;
            } else {
              set({
                error: response.message || 'فشل في تحميل بيانات المريض',
                loading: false
              });
              return null;
            }
          } catch (error) {
            console.error(' Error fetching patient:', error);
            set({
              error: error.response?.data?.message || error.message || 'حدث خطأ في تحميل بيانات المريض',
              loading: false
            });
            return null;
          }
        },

        /**
         * Set search term
         */
        setSearchTerm: (term) => {
          set({ searchTerm: term });
        },

        /**
         * Set filter status
         */
        setFilterStatus: (status) => {
          set({ filterStatus: status });
        },

        /**
         * Set sort by
         */
        setSortBy: (sortBy) => {
          set({ sortBy });
        },

        /**
         * Select patient
         */
        selectPatient: (patient) => {
          set({ selectedPatient: patient });
        },

        /**
         * Clear selected patient
         */
        clearSelectedPatient: () => {
          set({ selectedPatient: null });
        },

        /**
         * Clear error
         */
        clearError: () => {
          set({ error: null });
        },

        /**
         * Fetch patient medical record
         */
        fetchMedicalRecord: async (patientId) => {
          set({ detailsLoading: true, detailsError: null, medicalRecord: null });

          // MOCK DATA HANDLER
          if (USE_MOCK_DATA) {
            try {
              await simulateApiDelay(400);
              console.log('️ Using MOCK DATA for medical record');

              const mockRecord = {
                chronicDiseases: [
                  { diseaseName: 'السكري - النوع الثاني', diagnosedDate: '2020-01-15' },
                  { diseaseName: 'ارتفاع ضغط الدم', diagnosedDate: '2019-06-20' }
                ],
                drugAllergies: [
                  { drugName: 'البنسلين', severity: 'عالية' },
                  { drugName: 'الأسبرين', severity: 'متوسطة' }
                ],
                surgicalHistory: [],
                familyHistory: 'تاريخ عائلي لأمراض القلب'
              };

              set({
                medicalRecord: mockRecord,
                detailsLoading: false,
              });
              return mockRecord;
            } catch (err) {
              console.error('Error loading mock medical record:', err);
              set({
                detailsError: 'Failed to load mock medical record',
                detailsLoading: false
              });
              return null;
            }
          }

          try {
            const response = await doctorService.getPatientMedicalRecord(patientId);

            if (response.isSuccess && response.data) {
              set({
                medicalRecord: response.data,
                detailsLoading: false,
              });
              return response.data;
            } else {
              set({
                detailsError: response.message || 'فشل في تحميل السجل الطبي',
                detailsLoading: false
              });
              return null;
            }
          } catch (error) {
            console.error(' Error fetching medical record:', error);
            set({
              detailsError: error.response?.data?.message || error.message || 'حدث خطأ في تحميل السجل الطبي',
              detailsLoading: false
            });
            return null;
          }
        },

        /**
         * Fetch patient session documentations
         */
        fetchSessionDocumentations: async (patientId) => {
          set({ detailsLoading: true, detailsError: null, sessionDocumentations: null });

          try {
            const response = await doctorService.getPatientSessionDocumentations(patientId);

            if (response.isSuccess && response.data) {
              set({
                sessionDocumentations: response.data,
                detailsLoading: false,
              });
              return response.data;
            } else {
              set({
                detailsError: response.message || 'فشل في تحميل توثيق الجلسات',
                detailsLoading: false
              });
              return null;
            }
          } catch (error) {
            console.error(' Error fetching session documentations:', error);
            set({
              detailsError: error.response?.data?.message || error.message || 'حدث خطأ في تحميل توثيق الجلسات',
              detailsLoading: false
            });
            return null;
          }
        },

        /**
         * Fetch patient prescriptions
         */
        fetchPrescriptions: async (patientId, doctorId) => {
          set({ detailsLoading: true, detailsError: null, prescriptions: null });

          // MOCK DATA HANDLER
          if (USE_MOCK_DATA) {
            try {
              await simulateApiDelay(400);
              console.log('️ Using MOCK DATA for prescriptions');

              const mockPrescriptions = [
                {
                  id: 'rx1',
                  prescriptionNumber: 'PR-2024-001',
                  createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
                  diagnosis: 'التهاب المفاصل الروماتويدي',
                  medications: [
                    { medicationName: 'ميثوتريكسات (Methotrexate) 10mg', dosage: 'قرص واحد', frequency: 'مرة أسبوعياً', durationDays: 90 },
                    { medicationName: 'حمض الفوليك (Folic Acid) 5mg', dosage: 'قرص واحد', frequency: 'يومياً', durationDays: 90 },
                    { medicationName: 'ديكلوفيناك (Diclofenac) 50mg', dosage: 'قرص واحد', frequency: 'مرتين يومياً بعد الأكل', durationDays: 30 }
                  ]
                },
                {
                  id: 'rx2',
                  prescriptionNumber: 'PR-2024-002',
                  createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
                  diagnosis: 'ارتفاع ضغط الدم والكوليسترول',
                  medications: [
                    { medicationName: 'أملوديبين (Amlodipine) 10mg', dosage: 'قرص واحد', frequency: 'مرة يومياً صباحاً', durationDays: 180 },
                    { medicationName: 'أتورفاستاتين (Atorvastatin) 20mg', dosage: 'قرص واحد', frequency: 'مرة يومياً مساءً', durationDays: 180 },
                    { medicationName: 'أسبرين (Aspirin) 75mg', dosage: 'قرص واحد', frequency: 'مرة يومياً', durationDays: 180 }
                  ]
                },
                {
                  id: 'rx3',
                  prescriptionNumber: 'PR-2024-003',
                  createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
                  diagnosis: 'السكري من النوع الثاني',
                  medications: [
                    { medicationName: 'ميتفورمين (Metformin) 850mg', dosage: 'قرص واحد', frequency: '3 مرات يومياً مع الوجبات', durationDays: 180 },
                    { medicationName: 'جليمبيريد (Glimepiride) 2mg', dosage: 'قرص واحد', frequency: 'مرة يومياً قبل الإفطار', durationDays: 180 }
                  ]
                }
              ];

              set({
                prescriptions: mockPrescriptions,
                detailsLoading: false,
              });
              return mockPrescriptions;
            } catch (err) {
              console.error('Error loading mock prescriptions:', err);
              set({
                detailsError: 'Failed to load mock prescriptions',
                detailsLoading: false
              });
              return null;
            }
          }

          try {
            console.log(' Fetching prescriptions for patient:', patientId, 'doctor:', doctorId);
            const response = await doctorService.getPatientPrescriptions(patientId, doctorId);

            console.log(' Prescriptions response:', response);
            console.log(' Response.isSuccess:', response.isSuccess);
            console.log(' Response.data:', response.data);
            console.log(' Response.data type:', typeof response.data);
            console.log(' Response.data is array:', Array.isArray(response.data));

            if (response.isSuccess && response.data) {
              console.log(' Setting prescriptions:', response.data);
              set({
                prescriptions: response.data,
                detailsLoading: false,
              });
              return response.data;
            } else {
              console.log(' Response not successful or no data');
              console.log(' isSuccess:', response.isSuccess);
              console.log(' data:', response.data);
              set({
                detailsError: response.message || 'فشل في تحميل الروشتات',
                detailsLoading: false
              });
              return null;
            }
          } catch (error) {
            console.error(' Error fetching prescriptions:', error);
            set({
              detailsError: error.response?.data?.message || error.message || 'حدث خطأ في تحميل الروشتات',
              detailsLoading: false
            });
            return null;
          }
        },

        /**
         * Fetch prescription details
         */
        fetchPrescriptionDetails: async (patientId, doctorId, prescriptionId) => {
          // MOCK DATA HANDLER
          if (USE_MOCK_DATA) {
            try {
              await simulateApiDelay(300);
              console.log('️ Using MOCK DATA for prescription details');

              const mockDetails = {
                id: prescriptionId,
                prescriptionNumber: prescriptionId === 'rx1' ? 'PR-2024-001' : prescriptionId === 'rx2' ? 'PR-2024-002' : 'PR-2024-003',
                patientId,
                doctorId,
                patientName: 'محمد أحمد محمود',
                doctorName: 'د. أحمد محمد',
                createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
                diagnosis: 'التهاب المفاصل الروماتويدي',
                symptoms: 'ألم وتورم في المفاصل، تيبس صباحي، إرهاق عام',
                medications: [
                  {
                    medicationName: 'ميثوتريكسات (Methotrexate) 10mg',
                    dosage: 'قرص واحد',
                    frequency: 'مرة أسبوعياً',
                    durationDays: 90,
                    specialInstructions: 'يؤخذ يوم الأحد من كل أسبوع، يفضل مع الطعام'
                  },
                  {
                    medicationName: 'حمض الفوليك (Folic Acid) 5mg',
                    dosage: 'قرص واحد',
                    frequency: 'يومياً',
                    durationDays: 90,
                    specialInstructions: 'يؤخذ يومياً ما عدا يوم الميثوتريكسات'
                  },
                  {
                    medicationName: 'ديكلوفيناك (Diclofenac) 50mg',
                    dosage: 'قرص واحد',
                    frequency: 'مرتين يومياً بعد الأكل',
                    durationDays: 30,
                    specialInstructions: 'للألم والالتهاب، يؤخذ بعد الوجبات'
                  }
                ],
                generalInstructions: 'متابعة دورية كل شهر لفحص وظائف الكبد والكلى. تجنب الكحول. الإكثار من شرب الماء.',
                followUpDate: new Date(Date.now() + 30 * 86400000).toISOString()
              };

              return mockDetails;
            } catch (err) {
              console.error('Error loading mock prescription details:', err);
              return null;
            }
          }

          try {
            console.log(' Fetching prescription details:', { patientId, doctorId, prescriptionId });
            const response = await doctorService.getPrescriptionDetails(patientId, doctorId, prescriptionId);

            console.log(' Prescription details response:', response);

            if (response.isSuccess && response.data) {
              console.log(' Prescription details loaded:', response.data);
              return response.data;
            } else {
              console.error(' Failed to load prescription details');
              return null;
            }
          } catch (error) {
            console.error(' Error fetching prescription details:', error);
            return null;
          }
        },

        /**
         * Clear patient details
         */
        clearPatientDetails: () => {
          set({
            medicalRecord: null,
            sessionDocumentations: null,
            prescriptions: null,
            detailsError: null,
          });
        },

        /**
         * Get filtered and sorted patients
         */
        getFilteredPatients: () => {
          const { patients, searchTerm, filterStatus, sortBy } = get();
          let filtered = [...patients];

          // Search filter
          if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(patient =>
              patient.fullName?.toLowerCase().includes(term) ||
              patient.email?.toLowerCase().includes(term) ||
              patient.phoneNumber?.includes(term)
            );
          }

          // Status filter
          if (filterStatus === 'recent') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            filtered = filtered.filter(p =>
              p.lastVisitDate && new Date(p.lastVisitDate) >= thirtyDaysAgo
            );
          } else if (filterStatus === 'archived') {
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            filtered = filtered.filter(p =>
              p.lastVisitDate && new Date(p.lastVisitDate) < ninetyDaysAgo
            );
          }

          // Sort
          filtered.sort((a, b) => {
            if (sortBy === 'lastVisit') {
              return new Date(b.lastVisitDate || 0) - new Date(a.lastVisitDate || 0);
            }
            if (sortBy === 'name') {
              return (a.fullName || '').localeCompare(b.fullName || '', 'ar');
            }
            if (sortBy === 'sessions') {
              return (b.totalSessions || 0) - (a.totalSessions || 0);
            }
            return 0;
          });

          return filtered;
        },

        /**
         * Reset store
         */
        reset: () => {
          set({
            patients: [],
            selectedPatient: null,
            loading: false,
            error: null,
            searchTerm: '',
            filterStatus: 'all',
            sortBy: 'lastVisit',
            pagination: {
              pageNumber: 1,
              pageSize: 20,
              totalCount: 0,
              totalPages: 0,
              hasPreviousPage: false,
              hasNextPage: false,
            },
            medicalRecord: null,
            sessionDocumentations: null,
            prescriptions: null,
            detailsLoading: false,
            detailsError: null,
          });
        },
      }),
      {
        name: 'patients-storage',
        partialize: (state) => ({
          // Only persist these fields
          filterStatus: state.filterStatus,
          sortBy: state.sortBy,
        }),
      }
    ),
    { name: 'PatientsStore' }
  )
);

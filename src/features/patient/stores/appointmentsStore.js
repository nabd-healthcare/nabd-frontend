import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import patientService from '@/api/services/patient.service';

/**
 * Patient Appointments Store
 * Manages patient's appointments (upcoming & past)
 */
const useAppointmentsStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ==========================================
        // State
        // ==========================================
        upcomingAppointments: [],
        pastAppointments: [],
        selectedAppointment: null,
        loading: false,
        error: null,

        // Active tab
        activeTab: 'upcoming', // 'upcoming' | 'past'

        // Filters
        filters: {
          searchTerm: '',
        },

        // ==========================================
        // Actions
        // ==========================================

        /**
         * Fetch upcoming appointments
         */
        /**
         * Fetch upcoming appointments
         */
        fetchUpcomingAppointments: async () => {
          set({ loading: true, error: null });

          try {
            console.log('📅 Fetching upcoming appointments...');

            // MOCK DATA
            const appointments = [
              {
                id: 'mock-apt-1',
                doctorName: 'د. أحمد محمد',
                doctorProfileImageUrl: null,
                medicalSpecialtyName: 'الباطنة العامة',
                scheduledStartTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                scheduledEndTime: new Date(Date.now() + 90000000).toISOString(),
                status: 1, // Confirmed
                consultationType: 1, // New
                consultationFee: 350,
                sessionDurationMinutes: 30,
                doctor: {
                  id: 'd1',
                  fullName: 'د. أحمد محمد',
                  profileImageUrl: null,
                  medicalSpecialtyName: 'الباطنة العامة'
                }
              }
            ];

            // const appointments = await patientService.getUpcomingAppointments();

            console.log('✅ Upcoming appointments:', appointments);

            set({
              upcomingAppointments: appointments || [],
              loading: false,
            });
          } catch (error) {
            console.error('❌ Error fetching upcoming appointments:', error);
            set({
              error: error.response?.data?.message || 'فشل في تحميل المواعيد القادمة',
              loading: false
            });
          }
        },

        /**
         * Fetch past appointments
         */
        fetchPastAppointments: async () => {
          set({ loading: true, error: null });

          try {
            console.log('📅 Fetching past appointments...');

            // MOCK DATA
            const appointments = [
              {
                id: 'mock-apt-2',
                doctorName: 'د. أحمد محمد',
                doctorProfileImageUrl: null,
                medicalSpecialtyName: 'الباطنة العامة',
                scheduledStartTime: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                scheduledEndTime: new Date(Date.now() - 171000000).toISOString(),
                status: 4, // Completed
                consultationType: 1, // New
                consultationFee: 350,
                sessionDurationMinutes: 30,
                doctor: {
                  id: 'd1',
                  fullName: 'د. أحمد محمد',
                  profileImageUrl: null,
                  medicalSpecialtyName: 'الباطنة العامة'
                }
              },
              {
                id: 'mock-apt-3',
                doctorName: 'د. سارة علي',
                doctorProfileImageUrl: null,
                medicalSpecialtyName: 'طب الأطفال',
                scheduledStartTime: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
                scheduledEndTime: new Date(Date.now() - 860400000).toISOString(),
                status: 4, // Completed
                consultationType: 2, // Followup
                consultationFee: 250,
                sessionDurationMinutes: 20,
                doctor: {
                  id: 'd2',
                  fullName: 'د. سارة علي',
                  profileImageUrl: null,
                  medicalSpecialtyName: 'طب الأطفال'
                }
              },
              {
                id: 'mock-apt-4',
                doctorName: 'د. محمد حسن',
                doctorProfileImageUrl: null,
                medicalSpecialtyName: 'القلب والأوعية الدموية',
                scheduledStartTime: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
                scheduledEndTime: new Date(Date.now() - 2588400000).toISOString(),
                status: 4, // Completed
                consultationType: 1, // New
                consultationFee: 400,
                sessionDurationMinutes: 45,
                doctor: {
                  id: 'd3',
                  fullName: 'د. محمد حسن',
                  profileImageUrl: null,
                  medicalSpecialtyName: 'القلب والأوعية الدموية'
                }
              },
              {
                id: 'mock-apt-5',
                doctorName: 'د. خالد محمود',
                doctorProfileImageUrl: null,
                medicalSpecialtyName: 'جراحة العظام',
                scheduledStartTime: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
                scheduledEndTime: new Date(Date.now() - 428400000).toISOString(),
                status: 2, // Cancelled
                cancellationReason: 'ظروف طارئة',
                consultationType: 1, // New
                consultationFee: 300,
                sessionDurationMinutes: 30,
                doctor: {
                  id: 'd4',
                  fullName: 'د. خالد محمود',
                  profileImageUrl: null,
                  medicalSpecialtyName: 'جراحة العظام'
                }
              }
            ];

            // const appointments = await patientService.getPastAppointments();

            set({
              pastAppointments: appointments,
              loading: false,
            });
          } catch (error) {
            console.error('❌ Error fetching past appointments:', error);
            set({
              error: error.response?.data?.message || 'فشل في تحميل المواعيد السابقة',
              loading: false
            });
          }
        },

        /**
         * Fetch all appointments (both upcoming and past)
         */
        fetchAllAppointments: async () => {
          await Promise.all([
            get().fetchUpcomingAppointments(),
            get().fetchPastAppointments(),
          ]);
        },

        /**
         * Fetch appointment details
         */
        fetchAppointmentDetails: async (appointmentId) => {
          set({ loading: true, error: null });

          try {
            console.log('📋 Fetching appointment details:', appointmentId);

            const appointment = await patientService.getAppointmentDetails(appointmentId);

            console.log('✅ Appointment details:', appointment);

            set({
              selectedAppointment: appointment,
              loading: false,
            });
          } catch (error) {
            console.error('❌ Error fetching appointment details:', error);
            set({
              error: error.response?.data?.message || 'فشل في تحميل تفاصيل الموعد',
              loading: false
            });
          }
        },

        /**
         * Cancel appointment
         */
        cancelAppointment: async (appointmentId, cancellationReason) => {
          set({ loading: true, error: null });

          try {
            console.log('❌ Cancelling appointment:', appointmentId, cancellationReason);

            await patientService.cancelAppointment(appointmentId, cancellationReason);

            console.log('✅ Appointment cancelled successfully');

            // Refresh appointments list
            await get().fetchAllAppointments();

            set({ loading: false });

            return { success: true };
          } catch (error) {
            console.error('❌ Error cancelling appointment:', error);
            set({
              error: error.response?.data?.message || 'فشل في إلغاء الموعد',
              loading: false
            });
            return { success: false, error: error.response?.data?.message };
          }
        },

        /**
         * Reschedule appointment
         */
        rescheduleAppointment: async (appointmentId, newStartTime, newEndTime) => {
          set({ loading: true, error: null });

          try {
            console.log('🔄 Rescheduling appointment:', appointmentId);
            console.log('🔄 New Start Time:', newStartTime);
            console.log('🔄 New End Time:', newEndTime);

            const result = await patientService.rescheduleAppointment(appointmentId, {
              newScheduledStartTime: newStartTime,
              newScheduledEndTime: newEndTime,
            });

            console.log('✅ Appointment rescheduled successfully:', result);

            // Refresh appointments list
            await get().fetchAllAppointments();

            set({ loading: false });

            return { success: true };
          } catch (error) {
            console.error('❌ Error rescheduling appointment:', error);
            console.error('❌ Error details:', error.response?.data);
            set({
              error: error.response?.data?.message || 'فشل في إعادة جدولة الموعد',
              loading: false
            });
            return { success: false, error: error.response?.data?.message };
          }
        },

        /**
         * Set active tab
         */
        setActiveTab: (tab) => {
          set({ activeTab: tab });
        },

        /**
         * Set search term (local filter)
         */
        setSearchTerm: (searchTerm) => {
          set((state) => ({
            filters: {
              ...state.filters,
              searchTerm,
            },
          }));
        },

        /**
         * Reset filters
         */
        resetFilters: () => {
          set({
            filters: {
              searchTerm: '',
            },
          });
        },

        /**
         * Get filtered appointments (client-side search)
         */
        getFilteredAppointments: () => {
          const { upcomingAppointments, pastAppointments, activeTab, filters } = get();

          const appointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

          if (!filters.searchTerm) {
            return appointments;
          }

          const searchLower = filters.searchTerm.toLowerCase();

          return appointments.filter((apt) => {
            // Search by doctor name (support both formats)
            const doctorName = apt.doctor?.fullName || apt.doctorName || '';
            return doctorName.toLowerCase().includes(searchLower);
          });
        },
      }),
      {
        name: 'patient-appointments-storage',
        partialize: (state) => ({
          activeTab: state.activeTab,
        }),
      }
    ),
    { name: 'PatientAppointmentsStore' }
  )
);

export default useAppointmentsStore;

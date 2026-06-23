import { useState, useEffect } from 'react';
import doctorService from '@/api/services/doctor.service';
import { mockAppointments, simulateApiDelay } from '../data/mockData';

// Toggle this to force mock data
const USE_MOCK_DATA = true; // Merges mock data with real data for testing

/**
 * Custom Hook for ALL Appointments (Past, Today, Future)
 * Used in AppointmentsPage to show complete appointments history
 * @returns {Object} { appointments, loading, error, pagination, refreshAppointments }
 */
export const useAllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null); // ✅ Add statistics state
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 12, // ✅ Backend pagination: 12 items per page
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  /**
   * Fetch ALL appointments from API (NO DATE FILTER)
   * ✅ Using the new /Doctors/me/appointments endpoint
   */
  const fetchAppointments = async (pageNumber = 1, pageSize = 12) => {
    console.log('🚀 useAllAppointments: fetchAppointments called');
    console.log('✅ Using /Doctors/me/appointments endpoint (NEW)');
    console.log('📄 Page:', pageNumber, '| Size:', pageSize);

    setLoading(true);
    setError(null);

    // ❌ Removed early return for mock data to allow merging below

    try {
      const response = await doctorService.getAllAppointments({
        pageNumber,
        pageSize
        // ✅ Backend handles sorting: InProgress → CheckedIn → Others by date
      });

      console.log('═══════════════════════════════════════');
      console.log('📡 ALL Appointments API Response:', response);
      console.log('═══════════════════════════════════════');

      if (response.isSuccess && response.data) {
        const { data: appointmentsData, statistics: statsData, ...paginationData } = response.data;

        console.log('📋 ALL Appointments Data (NO FILTER):', appointmentsData);
        console.log('📋 Count:', appointmentsData?.length);
        console.log('📊 Statistics from API:', statsData); // ✅ Log statistics

        let finalAppointments = [];
        let finalStats = statsData || { total: 0, pending: 0, confirmed: 0, checkedIn: 0, inProgress: 0, completed: 0, noShow: 0, cancelled: 0 };
        let finalPagination = { ...paginationData, totalCount: paginationData?.totalCount || 0 };

        if (appointmentsData && appointmentsData.length > 0) {
          finalAppointments = appointmentsData.map(mapAppointment);
        }

        // ✅ Merge Mock Data if enabled
        if (USE_MOCK_DATA) {
           console.log('⚠️ Merging MOCK DATA with real appointments');
           const mappedMock = mockAppointments.map(mapAppointment);
           finalAppointments = [...finalAppointments, ...mappedMock];
           
           finalStats = {
              total: (finalStats.total || 0) + mappedMock.length,
              pending: (finalStats.pending || 0),
              confirmed: (finalStats.confirmed || 0) + mappedMock.filter(a => a.apiStatus === 1).length,
              checkedIn: (finalStats.checkedIn || 0) + mappedMock.filter(a => a.apiStatus === 2).length,
              inProgress: (finalStats.inProgress || 0) + mappedMock.filter(a => a.apiStatus === 3).length,
              completed: (finalStats.completed || 0) + mappedMock.filter(a => a.apiStatus === 4).length,
              noShow: (finalStats.noShow || 0) + mappedMock.filter(a => a.apiStatus === 5).length,
              cancelled: (finalStats.cancelled || 0) + mappedMock.filter(a => a.apiStatus === 6).length,
           };
           finalPagination.totalCount += mappedMock.length;
        }

        console.log('✅ Final Mapped Appointments:', finalAppointments);

        setAppointments(finalAppointments);
        setPagination(finalPagination);
        setStatistics(finalStats);
      } else {
        console.error('❌ Response validation failed:', {
          isSuccess: response.isSuccess,
          hasData: !!response.data,
          message: response.message
        });
        throw new Error(response.message || 'فشل في تحميل المواعيد');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'فشل في تحميل المواعيد';
      setError(errorMessage);
      console.error('═══════════════════════════════════════');
      console.error('❌ Error fetching all appointments:', err);
      console.error('═══════════════════════════════════════');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Map API appointment data to frontend format
   */
  const mapAppointment = (apiData) => {
    return {
      id: apiData.id,
      patientId: apiData.patientId,
      patientName: apiData.patientName,
      patientInitial: apiData.patientName?.charAt(0) || '؟',
      phoneNumber: apiData.patientPhoneNumber,
      time: formatTime(apiData.appointmentTime),
      appointmentDate: apiData.appointmentDate,
      bookingDate: apiData.bookingDate || apiData.createdAt, // ✅ تاريخ الحجز
      duration: apiData.duration,
      status: apiData.appointmentType === 'regular' ? 'كشف عام' : 'متابعة',
      appointmentType: apiData.appointmentType,
      apiStatus: apiData.status,
      isCancelled: apiData.status === 6, // ✅ Status 6 = Cancelled (ملغي)
      notes: apiData.notes,
      price: apiData.price,
    };
  };

  /**
   * Format time from 24-hour to 12-hour with AM/PM in Arabic
   * @param {string} time24 - Time in 24-hour format (HH:mm or HH:mm:ss)
   * @returns {string} Time in 12-hour format with Arabic AM/PM
   */
  const formatTime = (time24) => {
    if (!time24) return '--:--';

    try {
      // Handle both HH:mm and HH:mm:ss formats
      const parts = time24.split(':');
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);

      if (isNaN(hours) || isNaN(minutes)) return '--:--';

      const period = hours >= 12 ? 'م' : 'ص';
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.error('❌ Error formatting time:', time24, error);
      return '--:--';
    }
  };

  // Fetch appointments on mount
  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pagination handlers
  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      fetchAppointments(pagination.pageNumber + 1, pagination.pageSize);
    }
  };

  const goToPreviousPage = () => {
    if (pagination.hasPreviousPage) {
      fetchAppointments(pagination.pageNumber - 1, pagination.pageSize);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      fetchAppointments(pageNumber, pagination.pageSize);
    }
  };

  /**
   * Refresh appointments - always from page 1 to avoid stale state
   */
  const refreshCurrentPage = () => {
    console.log('🔄 Refreshing all appointments - from page 1');
    return fetchAppointments(1, 12);
  };

  return {
    appointments,
    loading,
    error,
    pagination,
    statistics, // ✅ Return statistics
    refreshAppointments: refreshCurrentPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  };
};

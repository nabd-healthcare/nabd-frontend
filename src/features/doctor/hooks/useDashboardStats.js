import { useState, useEffect } from 'react';
import doctorService from '@/api/services/doctor.service';
import { mockStats, simulateApiDelay } from '../data/mockData';
import {
  FaCalendarAlt,
  FaUsers,
  FaStar,
  FaDollarSign
} from 'react-icons/fa';

// Toggle this to force mock data
const USE_MOCK_DATA = false; // Merges mock data with real data for testing

/**
 * Custom Hook for Doctor Dashboard Statistics
 * Fetches real-time stats from backend and maps to UI format
 * @returns {Object} { stats, loading, error, refreshStats }
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Map API data to stats array format for UI
   * Using Landing Page color scheme
   */
  const mapStatsToArray = (apiData) => [
    {
      id: 'patients',
      label: 'إجمالي المرضى',
      value: apiData.totalPatients,
      unit: 'مريض',
      description: 'عدد المرضى المسجلين',
      icon: FaUsers,
      color: '#3B82F6', // Blue
      colorDark: '#2563EB',
      bgColor: '#EFF6FF',
    },
    {
      id: 'appointments',
      label: 'المواعيد اليوم',
      value: apiData.todayAppointments,
      unit: 'موعد',
      description: 'مواعيد اليوم',
      icon: FaCalendarAlt,
      color: '#1C8B8F', // Teal - Primary color
      colorDark: '#14666A',
      bgColor: '#F0FDFA',
    },
    {
      id: 'rating',
      label: 'التقييم العام',
      value: apiData.averageRating || 0,
      unit: '',
      description: 'متوسط التقييمات',
      icon: FaStar,
      color: '#F59E0B', // Amber/Orange
      colorDark: '#D97706',
      bgColor: '#FEF3C7',
    },
    {
      id: 'revenue',
      label: 'الإيرادات الشهرية',
      value: apiData.monthlyRevenue.toLocaleString('ar-EG'),
      unit: 'ج.م',
      description: 'إيرادات هذا الشهر',
      icon: FaDollarSign,
      color: '#8B5CF6', // Purple
      colorDark: '#7C3AED',
      bgColor: '#F5F3FF',
    },
  ];

  /**
   * Fetch dashboard statistics from API
   */
  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    //  Removed early return for mock data to allow merging below
    try {
      const response = await doctorService.getDashboardStats();

      if (response.isSuccess && response.data) {
        let finalStatsObject = response.data;

        if (USE_MOCK_DATA) {
            console.log('️ Merging MOCK DATA with real dashboard stats');
            finalStatsObject = {
                totalPatients: (finalStatsObject.totalPatients || 0) + mockStats.totalPatients,
                todayAppointments: (finalStatsObject.todayAppointments || 0) + mockStats.todayAppointments,
                averageRating: finalStatsObject.averageRating > 0 ? finalStatsObject.averageRating : mockStats.averageRating,
                monthlyRevenue: (finalStatsObject.monthlyRevenue || 0) + mockStats.monthlyRevenue,
            };
        }

        const statsArray = mapStatsToArray(finalStatsObject);
        setStats(statsArray);
      } else {
        throw new Error(response.message || 'فشل في تحميل الإحصائيات');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'فشل في تحميل الإحصائيات';
      setError(errorMessage);
      console.error(' Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
};

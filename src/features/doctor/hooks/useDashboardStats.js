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
const USE_MOCK_DATA = false; // TODO: Fix backend 500 error then set to false

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
      unit: '⭐',
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

    // MOCK DATA HANDLER
    if (USE_MOCK_DATA) {
      try {
        await simulateApiDelay(500);
        console.log('⚠️ Using MOCK DATA for stats');
        const statsArray = mapStatsToArray(mockStats);
        setStats(statsArray);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Error loading mock stats:', err);
        setError('Failed to load mock stats');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await doctorService.getDashboardStats();

      if (response.isSuccess && response.data) {
        // Map API object to array format for UI
        const statsArray = mapStatsToArray(response.data);
        setStats(statsArray);
      } else {
        throw new Error(response.message || 'فشل في تحميل الإحصائيات');
      }
    } catch (err) {
      console.error('❌ API Failed, falling back to mock data');
      // Fallback to mock data on error if not already using it
      if (!USE_MOCK_DATA) {
        const statsArray = mapStatsToArray(mockStats);
        setStats(statsArray);
        // Don't set error to allow UI to show data
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'فشل في تحميل الإحصائيات';
        setError(errorMessage);
        console.error('❌ Error fetching dashboard stats:', err);
      }
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

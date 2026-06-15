import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt, FaFilter, FaSearch, FaTimes, FaChevronDown,
  FaCheck, FaClock, FaCalendarDay, FaChartLine, FaChevronLeft, FaChevronRight,
  FaHourglassHalf, FaPlay, FaUserCheck, FaUserTimes, FaBan, FaEllipsisV,
  FaStethoscope, FaUserMd, FaNotesMedical, FaDoorOpen
} from 'react-icons/fa';
import ActiveSessionWarning from '../components/ActiveSessionWarning';
import { useAllAppointments } from '../hooks/useAllAppointments';
import { useSessionManager } from '../hooks/useSessionManager';
import { formatDate } from '@/utils/helpers';

/**
 * AppointmentsPage - Clinical Command Center Edition
 * High-density Vertical Timeline for medical schedule management
 */
const AppointmentsPage = () => {
  const navigate = useNavigate();
  const {
    appointments,
    loading,
    error,
    pagination,
    statistics,
    goToNextPage,
    goToPreviousPage,
    goToPage
  } = useAllAppointments();
  const { startOrResumeSession, sessionLoading } = useSessionManager();

  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const filterRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter appointments
  const filteredAppointments = appointments?.filter(apt => {
    const matchesSearch = !searchTerm ||
      apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phoneNumber?.includes(searchTerm);
    const matchesType = filterType === 'all' || apt.status === filterType;
    return matchesSearch && matchesType;
  }) || [];

  const getFilterLabel = () => {
    const labels = { 'all': 'جميع الحالات', 'كشف عام': 'كشف عام', 'متابعة': 'متابعة' };
    return labels[filterType] || 'جميع الحالات';
  };

  const handleStartAppointment = (appointment) => {
    navigate(`/doctor/session/${appointment.id}`);
  };

  const statusCounts = statistics || {
    completed: appointments?.filter(apt => apt.apiStatus === 4).length || 0,
    confirmed: appointments?.filter(apt => apt.apiStatus === 1).length || 0,
    cancelled: appointments?.filter(apt => apt.apiStatus === 6).length || 0,
    total: pagination?.totalCount || 0
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="rtl">
      <ActiveSessionWarning />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        {/* Header - Clinical OS Style */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[#0070CD] mb-2 font-black tracking-widest text-xs uppercase">
              <div className="w-2 h-2 rounded-full bg-[#0070CD] animate-pulse"></div>
              <span>جدول المواعيد اليومي</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
              سجل <span className="text-[#0070CD]">المواعيد</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg">
              إدارة التدفق اليومي والجدول الزمني الطبي
            </p>
          </div>

          {/* High-Density Stats Bar */}
          <div className="flex flex-wrap items-center gap-4">
            {[
              { label: 'إجمالي الحالات', value: statusCounts.total, color: 'text-slate-900', bg: 'bg-slate-100', icon: FaCalendarDay },
              { label: 'جلسات مكتملة', value: statusCounts.completed, color: 'text-[#0070CD]', bg: 'bg-[#0070CD]/10', icon: FaCheck },
              { label: 'مؤكدة', value: statusCounts.confirmed || 0, color: 'text-blue-600', bg: 'bg-blue-50', icon: FaUserCheck },
              { label: 'ملغاة', value: statusCounts.cancelled, color: 'text-rose-600', bg: 'bg-rose-50', icon: FaBan },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm transition-transform hover:scale-105">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="text-sm" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{stat.label}</div>
                  <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar - Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0070CD] transition-colors" />
            <input
              type="text"
              placeholder="البحث السريع عن مريض (اسم أو رقم هاتف)..."
              className="w-full bg-white border border-slate-200 focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/10 rounded-2xl pr-14 pl-6 py-5 text-lg font-bold text-slate-800 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="h-full bg-white border border-slate-200 hover:border-[#0070CD] px-8 rounded-2xl flex items-center gap-3 font-black text-slate-700 transition-all"
            >
              <FaFilter className="text-[#0070CD]" />
              <span>{getFilterLabel()}</span>
              <FaChevronDown className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterOpen && (
              <div className="absolute left-0 top-full mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95">
                {['all', 'كشف عام', 'متابعة'].map((t) => (
                  <button
                    key={t}
                    onClick={() => { setFilterType(t); setIsFilterOpen(false); }}
                    className={`w-full text-right px-6 py-4 font-bold text-sm transition-all ${filterType === t ? 'bg-[#0070CD] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {t === 'all' ? 'جميع المواعيد' : t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Timeline Content */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="text-slate-300 text-4xl" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">لا يوجد مواعيد مسجلة</h3>
            <p className="text-slate-500 font-bold">حاول تغيير معايير البحث أو الفلترة</p>
          </div>
        ) : (
          <div className="relative">
            {/* Main Timeline Axis */}
            <div className="absolute right-[45px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#0070CD] via-[#0070CD]/20 to-transparent"></div>

            <div className="space-y-6 relative">
              {filteredAppointments.map((apt, idx) => {
                const isActive = apt.apiStatus === 3;
                const isCompleted = apt.apiStatus === 4;
                const isCancelled = apt.apiStatus === 6;

                return (
                  <div key={apt.id} className="relative group pr-[90px]">
                    {/* Node */}
                    <div className={`absolute right-9 top-1/2 -translate-y-1/2 w-[20px] h-[20px] rounded-full border-4 shadow-sm z-10 transition-all duration-300 group-hover:scale-150 ${
                      isActive ? 'bg-[#0070CD] border-[#0070CD]/20 scale-125' : 
                      isCompleted ? 'bg-emerald-500 border-emerald-100' :
                      isCancelled ? 'bg-rose-500 border-rose-100' :
                      'bg-white border-slate-200 group-hover:border-[#0070CD]'
                    }`}>
                      {isActive && <div className="absolute inset-0 rounded-full bg-[#0070CD] animate-ping opacity-50"></div>}
                    </div>

                    {/* Timeline Card */}
                    <div className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-center gap-6 p-4 ${
                      isActive ? 'border-[#0070CD] shadow-[0_15px_40px_rgba(0,112,205,0.15)] ring-1 ring-[#0070CD]/10' : 
                      'border-slate-100 hover:border-[#0070CD]/30 hover:shadow-xl hover:-translate-x-2 shadow-sm'
                    }`}>
                      {/* Time Slot */}
                      <div className={`flex flex-col items-center justify-center py-4 px-8 min-w-[120px] rounded-2xl ${
                        isActive ? 'bg-[#0070CD] text-white' : 'bg-slate-50 text-slate-800'
                      }`}>
                        <span className="text-xl font-black leading-none">{apt.time}</span>
                        <span className="text-[10px] font-black uppercase tracking-wider mt-1 opacity-70">الموعد</span>
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1 flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white ${
                          isActive ? 'bg-[#0070CD] shadow-lg grow-0 shrink-0' : 'bg-slate-800'
                        }`}>
                          {apt.patientName?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-black text-slate-900">{apt.patientName}</h3>
                            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              isActive ? 'bg-[#0070CD]/10 text-[#0070CD] border-[#0070CD]/20' :
                              isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
                            <span className="flex items-center gap-2"><FaClock className="text-xs opacity-50" /> {apt.duration} دقيقة</span>
                            <span className="flex items-center gap-2 tracking-widest">{apt.phoneNumber}</span>
                            {apt.appointmentDate && <span>• {formatDate(apt.appointmentDate, 'DD MMMM YYYY')}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-4 px-4 w-full md:w-auto">
                        <button
                          onClick={() => handleStartAppointment(apt)}
                          disabled={sessionLoading === apt.id || isCancelled}
                          className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 ${
                            isCancelled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                            isActive ? 'bg-[#0070CD] text-white shadow-[#0070CD]/30 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95' :
                            isCompleted ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' :
                            'bg-[#0070CD]/5 text-[#0070CD] hover:bg-[#0070CD] hover:text-white'
                          }`}
                        >
                          {sessionLoading === apt.id ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              {isActive ? <FaPlay className="text-xs" /> : <FaDoorOpen className="text-xs" />}
                              <span>{isActive ? 'متابعة الجلسة' : isCompleted ? 'عرض السجل' : 'بدء الجلسة'}</span>
                            </>
                          )}
                        </button>
                        <button className="p-4 text-slate-300 hover:text-slate-600 transition-colors">
                          <FaEllipsisV />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination UI - Clinical Style */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between bg-white border border-slate-100 p-4 rounded-[2.5rem] shadow-sm">
                <button
                  onClick={goToPreviousPage}
                  disabled={!pagination.hasPreviousPage}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-[#0070CD] hover:bg-[#0070CD]/5 disabled:opacity-30 transition-all"
                >
                  <FaChevronRight />
                  <span>السابق</span>
                </button>
                
                <div className="flex gap-2">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`w-12 h-12 rounded-xl font-black text-sm transition-all ${
                        pagination.pageNumber === i + 1 
                        ? 'bg-[#0070CD] text-white shadow-lg' 
                        : 'text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={!pagination.hasNextPage}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-[#0070CD] hover:bg-[#0070CD]/5 disabled:opacity-30 transition-all font-black"
                >
                  <span>التالي</span>
                  <FaChevronLeft />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;

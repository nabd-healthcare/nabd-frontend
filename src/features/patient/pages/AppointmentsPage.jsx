import React, { useState, useEffect } from 'react';
import {
  FaCalendarCheck,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaHistory,
  FaFilter,
  FaSortAmountDown
} from 'react-icons/fa';
import PatientAppointmentCard from '../components/PatientAppointmentCard';
import CancelAppointmentModal from '../components/CancelAppointmentModal';
import RescheduleAppointmentModal from '../components/RescheduleAppointmentModal';
import usePatientAppointments from '../hooks/usePatientAppointments';

/**
 * Patient Appointments Page
 * Premium design with advanced filters, search, and pagination
 */
const AppointmentsPage = () => {
  const {
    upcomingAppointments,
    pastAppointments,
    loading,
    error,
    activeTab,
    filters,
    fetchAllAppointments,
    cancelAppointment,
    rescheduleAppointment,
    setActiveTab,
    setSearchTerm,
    getFilteredAppointments,
  } = usePatientAppointments();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // New states for Advanced Filtering & Sorting
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('nearest'); // 'nearest' or 'newest'

  // Fetch appointments on mount
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchAllAppointments();
  }, []);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Reset local filters on tab change
  useEffect(() => {
    setStatusFilter('all');
  }, [activeTab]);

  // Handle cancel appointment
  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalOpen(true);
  };

  // Confirm cancel
  const handleConfirmCancel = async (cancellationReason) => {
    const result = await cancelAppointment(selectedAppointment.id, cancellationReason);
    if (result.success) {
      setCancelModalOpen(false);
      setSelectedAppointment(null);
    } else {
      alert(` فشل في إلغاء الموعد:\n\n${result.error}`);
    }
  };

  // Handle reschedule appointment
  const handleRescheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleModalOpen(true);
  };

  // Confirm reschedule
  const handleConfirmReschedule = async (newStartTime, newEndTime) => {
    const result = await rescheduleAppointment(selectedAppointment.id, newStartTime, newEndTime);
    if (result.success) {
      setRescheduleModalOpen(false);
      setSelectedAppointment(null);
    } else {
      alert(` فشل في إعادة جدولة الموعد:\n\n${result.error}`);
    }
  };

  // 1. Get base store filtered appointments (handles search term internally)
  const baseAppointments = getFilteredAppointments();

  // 2. Apply Custom UI Status Filter
  let displayAppointments = [...baseAppointments];
  if (statusFilter !== 'all') {
    displayAppointments = displayAppointments.filter(
      (a) => a.status === parseInt(statusFilter, 10)
    );
  }

  // 3. Apply Custom UI Sorting
  displayAppointments.sort((a, b) => {
    const dateA = new Date(a.scheduledStartTime || a.createdAt);
    const dateB = new Date(b.scheduledStartTime || b.createdAt);

    if (sortOrder === 'nearest') {
      if (activeTab === 'past') {
        // For past: nearest means closest to today (most recent past date)
        return dateB - dateA;
      }
      // For upcoming: nearest means soonest future date
      return dateA - dateB;
    } else {
      // 'newest' created or newest updated
      const createdA = new Date(a.createdAt || a.scheduledStartTime);
      const createdB = new Date(b.createdAt || b.scheduledStartTime);
      return createdB - createdA;
    }
  });

  // Calculate stats
  const stats = {
    upcoming: upcomingAppointments.length,
    past: pastAppointments.length,
    scheduled: upcomingAppointments.filter(a => a.status === 0).length,
    confirmed: upcomingAppointments.filter(a => a.status === 1).length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Page Header - Natural Scrolling Behavior */}
      <div className="bg-white border-b border-slate-200 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-[#0070CD] mb-2 font-black tracking-widest text-xs uppercase">
                <div className="w-2 h-2 rounded-full bg-[#0070CD] animate-pulse shadow-[0_0_8px_rgba(0,112,205,0.6)]"></div>
                <span>سجل المواعيد الطبية</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
                مواعيدي <span className="text-[#0070CD]">الطبية</span>
              </h1>
              <p className="text-[#64748B] font-medium text-base mt-3">
                إدارة ومتابعة كافة مواعيدك الطبية بكل سهولة
              </p>
            </div>

            {/* Smart Sliding Tabs */}
            <div className="relative flex p-1.5 bg-slate-100 rounded-2xl shadow-inner w-full md:w-auto h-[60px] md:h-auto">
              {/* Sliding Background Indicator */}
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-1.5px)] bg-white rounded-xl shadow-md border border-slate-200/50 transition-all duration-500 ease-out z-0
                 ${activeTab === 'upcoming' ? 'translate-x-0 right-1.5' : '-translate-x-full right-1.5'}`}
              />

              <button
                onClick={() => setActiveTab('upcoming')}
                className={`relative flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors duration-300 z-10 w-1/2 md:w-auto ${activeTab === 'upcoming'
                  ? 'text-[#0070CD]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
              >
                <FaCalendarCheck className={activeTab === 'upcoming' ? 'text-[#0070CD]' : 'text-slate-400'} />
                <span>الـقـادمـة</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'upcoming' ? 'bg-[#0070CD]/10 text-[#0070CD]' : 'bg-slate-200 text-[#64748B]'
                  }`}>{stats.upcoming}</span>
              </button>

              <button
                onClick={() => setActiveTab('past')}
                className={`relative flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors duration-300 z-10 w-1/2 md:w-auto ${activeTab === 'past'
                  ? 'text-[#0070CD]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
              >
                <FaHistory className={activeTab === 'past' ? 'text-[#0070CD]' : 'text-slate-400'} />
                <span>الـسـابـقـة</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'past' ? 'bg-[#0070CD]/10 text-[#0070CD]' : 'bg-slate-200 text-[#64748B]'
                  }`}>{stats.past}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

        {/* 2. Stats Summary (Top) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'جلسات قادمة', value: stats.upcoming, color: 'text-[#0070CD]', bg: 'bg-[#0070CD]/10', border: 'border-[#0070CD]/20', icon: FaCalendarCheck },
            { label: 'مجدول (إنتظار)', value: stats.scheduled, color: 'text-[#F59E0B]', bg: 'bg-amber-50', border: 'border-amber-200', icon: FaHourglassHalf },
            { label: 'مؤكد (جاهز)', value: stats.confirmed, color: 'text-[#10B981]', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: FaCheckCircle },
            { label: 'جلسات سابقة', value: stats.past, color: 'text-[#64748B]', bg: 'bg-slate-100', border: 'border-slate-200', icon: FaHistory },
          ].map((stat, i) => (
            <div key={i} className={`flex flex-col justify-between p-5 rounded-3xl bg-white border ${stat.border} shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group`}>
              <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full ${stat.bg} opacity-50 group-hover:scale-[2] transition-transform duration-500`}></div>
              <div className="flex items-center justify-between relative z-10 mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shadow-sm`}>
                  <stat.icon className={`text-base ${stat.color}`} />
                </div>
                <div className={`text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</div>
              </div>
              <div className="relative z-10">
                <div className="text-sm text-[#64748B] font-bold">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Search & Filter Controls Ribbon */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm items-center">

          {/* Search Box */}
          <div className="w-full lg:w-1/2 relative group">
            <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#0070CD] transition-colors" />
            <input
              type="text"
              placeholder="ابحث عن اسم الطبيب أو العيادة..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="w-full h-[3.5rem] bg-slate-50 border border-slate-200 focus:border-[#0070CD] focus:ring-2 focus:ring-[#0070CD]/10 rounded-2xl pr-12 pl-12 text-sm font-bold text-[#0F172A] transition-all outline-none"
            />
            {filters.searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-200 hover:bg-[#E11D48]/10 text-slate-500 hover:text-[#E11D48] rounded-xl transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>

          <div className="w-full h-px lg:w-px lg:h-10 bg-slate-200 my-2 lg:my-0 lg:mx-2 hidden lg:block"></div>

          {/* Filters & Sorting */}
          <div className="w-full lg:w-1/2 flex items-center gap-3 justify-between lg:justify-end">

            {/* Status Filter */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-sm font-bold text-[#64748B] rounded-2xl pl-10 pr-10 py-3.5 focus:outline-none focus:border-[#0070CD] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <option value="all">جميع الحالات</option>
                {activeTab === 'upcoming' ? (
                  <>
                    <option value="0">مجدول (قيد الانتظار)</option>
                    <option value="1">مؤكد</option>
                  </>
                ) : (
                  <>
                    <option value="4">مكتمل</option>
                    <option value="2">ملغي (طبيب)</option>
                    <option value="6">ملغي (مريض)</option>
                    <option value="5">لم يحضر</option>
                  </>
                )}
              </select>
              <FaFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Sorting */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-sm font-bold text-[#64748B] rounded-2xl pl-10 pr-10 py-3.5 focus:outline-none focus:border-[#0070CD] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <option value="nearest">الأقرب تاريخاً</option>
                <option value="newest">الأحدث إضافة</option>
              </select>
              <FaSortAmountDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

          </div>
        </div>

        {/* 4. Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[380px] bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
            ))}
          </div>
        )}

        {/* 5. Error State */}
        {error && !loading && (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center max-w-2xl mx-auto mt-12">
            <div className="w-20 h-20 bg-[#E11D48]/10 rounded-full flex items-center justify-center mb-6">
              <FaTimesCircle className="text-4xl text-[#E11D48]" />
            </div>
            <h3 className="text-2xl font-black text-[#0F172A] mb-3">عذراً، حدث خطأ</h3>
            <p className="text-[#64748B] font-bold text-base mb-8 max-w-md">{error}</p>
            <button
              onClick={fetchAllAppointments}
              className="px-8 py-3.5 bg-[#0070CD] hover:bg-[#005ba3] active:scale-95 text-white rounded-xl font-bold transition-all shadow-md focus:ring-4 focus:ring-[#0070CD]/20"
            >
              إعادة التحميل
            </button>
          </div>
        )}

        {/* 6. Empty State */}
        {!loading && !error && displayAppointments.length === 0 && (
          <div className="bg-white rounded-[2.5rem] p-24 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center max-w-4xl mx-auto mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#0070CD]/5 to-transparent rounded-bl-full -z-10"></div>
            <div className="absolute pl-10 bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-slate-100 to-transparent rounded-tr-full -z-10"></div>

            <div className="w-28 h-28 bg-[#0070CD]/5 rounded-[2rem] flex items-center justify-center mb-8 relative border-8 border-white shadow-[0_0_0_1px_rgba(0,112,205,0.05)] border-solid">
              <div className="absolute w-full h-full bg-[#0070CD]/5 animate-ping rounded-[2rem]"></div>
              <FaCalendarCheck className="text-[#0070CD] text-5xl relative z-10" />
            </div>

            <h3 className="text-3xl font-black text-[#0F172A] mb-4">لا توجد مواعيد متاحة</h3>
            <p className="text-[#64748B] font-bold text-lg mb-10 max-w-lg leading-relaxed">
              {filters.searchTerm || statusFilter !== 'all'
                ? 'لم يتم العثور على أي مواعيد تطابق الفلاتر المدخلة. يرجى إزالة الفلاتر أو تغيير الحالات المختارة للاستمرار.'
                : activeTab === 'upcoming'
                  ? 'جدول مواعيدك القادمة فارغ. استكشف الأطباء المتاحين الآن وقم بحجز أول موعد لك بكل سهولة!'
                  : 'سجل مواعيدك الطبية السابقة فارغ حالياً.'}
            </p>

            {(filters.searchTerm || statusFilter !== 'all') ? (
              <button
                onClick={() => { handleClearSearch(); setStatusFilter('all'); }}
                className="px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 border border-slate-200"
              >
                مسح التصفيات وإعادة التحميل
              </button>
            ) : activeTab === 'upcoming' && (
              <a href="/patient/search" className="px-10 py-4 bg-[#0070CD] hover:bg-[#005ba3] text-white rounded-2xl font-black transition-all hover:shadow-[0_8px_30px_rgba(0,112,205,0.3)] active:scale-95 text-lg flex items-center gap-2">
                ابحث عن طبيب
                <FaSearch className="text-sm" />
              </a>
            )}
          </div>
        )}

        {/* 7. Appointments Grid */}
        {!loading && !error && displayAppointments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {displayAppointments.map((appointment) => (
              <PatientAppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
                onReschedule={handleRescheduleAppointment}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CancelAppointmentModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleConfirmCancel}
        loading={loading}
      />

      <RescheduleAppointmentModal
        isOpen={rescheduleModalOpen}
        onClose={() => {
          setRescheduleModalOpen(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleConfirmReschedule}
        loading={loading}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default AppointmentsPage;

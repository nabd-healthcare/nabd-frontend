import React, { useState, useRef, useEffect } from 'react';
import { FaCalendarAlt, FaPlay, FaFilter, FaClock, FaChevronDown, FaCheck, FaSpinner, FaArrowRight } from 'react-icons/fa';

/**
 * Today's Appointments Component
 * Clean modern design matching landing page
 * @component
 */
const TodayAppointments = ({
  appointments,
  filterType = 'all',
  onStartAppointment,
  onFilterChange,
  loading = false,
  sessionLoading = null
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Get filter label in Arabic
   */
  const getFilterLabel = () => {
    const labels = {
      'all': 'الكل',
      'كشف عام': 'كشف عام',
      'متابعة': 'متابعة',
    };
    return labels[filterType] || 'الكل';
  };

  /**
   * Get status badge styling
   */
  const getStatusBadge = (status) => {
    const badges = {
      'كشف عام': {
        bg: 'bg-[#F0FDFA]',
        text: 'text-[#1C8B8F]',
      },
      'متابعة': {
        bg: 'bg-[#FEF3C7]',
        text: 'text-[#F59E0B]',
      },
    };

    return badges[status] || badges['كشف عام'];
  };

  return (
    <section className="mb-0" aria-labelledby="appointments-heading">
      {/* High-density container */}
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#0070CD]/5 rounded-xl flex items-center justify-center border border-[#0070CD]/10">
              <FaCalendarAlt className="w-5 h-5 text-[#0070CD]" />
            </div>
            <div>
              <h2 id="appointments-heading" className="text-lg font-black text-[#1F2E3C] tracking-tight">جدول المواعيد</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Daily Schedule</p>
            </div>
          </div>

          <div className="relative group" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 hover:text-[#0070CD] transition-all">
              <FaFilter className="w-3 h-3" />
              <span className="text-[11px] font-black tracking-tight">{getFilterLabel()}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 z-50 p-1">
                {['all', 'كشف عام', 'متابعة'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => { onFilterChange(filter); setIsDropdownOpen(false); }}
                    className={`w-full text-right px-3 py-2 text-[11px] rounded-lg ${filterType === filter ? 'bg-[#0070CD] text-white' : 'hover:bg-slate-50'}`}>
                    {filter === 'all' ? 'الكل' : filter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Timeline View */}
        <div className="relative p-6 sm:p-8">
          {/* Vertical Timeline Line */}
          <div className="absolute right-[43px] top-10 bottom-10 w-px bg-slate-100"></div>

          <div className="space-y-6">
            {loading ? (
              <div className="py-10 text-center"><FaSpinner className="animate-spin inline text-[#0070CD]" /></div>
            ) : appointments?.length === 0 ? (
              <div className="py-10 text-center text-slate-300 text-sm font-bold italic">لا توجد مواعيد</div>
            ) : (
              appointments?.map((appointment) => {
                const isInProgress = appointment.apiStatus === 'InProgress' || appointment.apiStatus === 3;
                const isCompleted = appointment.apiStatus === 'Completed' || appointment.apiStatus === 4;
                return (
                  <article key={appointment.id} className="relative flex items-start gap-5 group">
                    {/* Timeline Node */}
                    <div className={`relative z-10 w-9 h-9 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-[#0070CD] scale-110' : 'bg-slate-100 group-hover:bg-[#0070CD]/20'}`}>
                       {isCompleted ? <FaCheck className="text-white w-2.5 h-2.5" /> : isInProgress ? <FaPlay className="text-white w-2 h-2" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#0070CD]"></div>}
                    </div>

                    {/* Compact Card */}
                    <div className={`flex-1 p-4 rounded-2xl border transition-all ${isCompleted ? 'border-emerald-100 bg-emerald-50/30' : isInProgress ? 'border-[#0070CD] bg-[#0070CD]/5' : 'border-slate-50 hover:bg-slate-50 hover:border-slate-100'}`}>
                      <div className="flex items-center justify-between gap-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-[#0070CD] border border-slate-100">
                             {appointment.patientInitial}
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-[#1F2E3C] leading-none mb-1 group-hover:text-[#0070CD] transition-colors">{appointment.patientName}</h4>
                               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                                  <span className="flex items-center gap-1"><FaClock className="w-2.5 h-2.5" /> {appointment.time}</span>
                                  <span className="opacity-50">•</span>
                                  <span>{appointment.status}</span>
                               </div>
                            </div>
                         </div>

                         {isCompleted ? (
                           <div className="h-8 px-4 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1.5 opacity-80 cursor-default">
                             <FaCheck className="w-2.5 h-2.5" />
                             <span>مكتمل</span>
                           </div>
                         ) : (
                           <button
                             onClick={() => onStartAppointment?.(appointment)}
                             disabled={sessionLoading === appointment.id}
                             className={`h-8 px-4 rounded-lg text-[10px] font-black transition-all ${isInProgress ? 'bg-[#0070CD] text-white shadow-lg' : 'bg-white text-[#0070CD] border border-[#0070CD]/20 hover:bg-[#0070CD] hover:text-white'}`}>
                             {sessionLoading === appointment.id ? <FaSpinner className="animate-spin" /> : isInProgress ? 'متابعة' : 'بدء'}
                           </button>
                         )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TodayAppointments;

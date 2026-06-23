import React, { useState, useEffect } from 'react';
import { useAppointment } from '../hooks/useAppointment';
import WeeklyScheduleCalendar from './WeeklyScheduleCalendar';
import {
  FaCalendarAlt,
  FaClock,
  FaCalendarPlus,
  FaCheckCircle,
  FaSave,
  FaExclamationCircle
} from 'react-icons/fa';

/**
 * AppointmentSection - Clinical Scheduling Hub
 * Optimized for high-density time matrix management.
 */
const AppointmentSection = () => {
  const {
    weeklySchedule,
    exceptionalDates,
    loading,
    error,
    success,
    updateSchedule,
    addException,
    removeException,
    enabledDays,
  } = useAppointment({ autoFetch: true });

  const [localSchedule, setLocalSchedule] = useState(weeklySchedule);
  const [newException, setNewException] = useState({
    date: '',
    fromTime: '',
    toTime: '',
    fromPeriod: 'AM',
    toPeriod: 'PM',
    isClosed: false
  });

  const daysOfWeek = [
    { key: 'saturday', name: 'السبت', label: 'S' },
    { key: 'sunday', name: 'الأحد', label: 'S' },
    { key: 'monday', name: 'الاثنين', label: 'M' },
    { key: 'tuesday', name: 'الثلاثاء', label: 'T' },
    { key: 'wednesday', name: 'الأربعاء', label: 'W' },
    { key: 'thursday', name: 'الخميس', label: 'T' },
    { key: 'friday', name: 'الجمعة', label: 'F' }
  ];

  useEffect(() => {
    setLocalSchedule(weeklySchedule);
  }, [weeklySchedule]);

  useEffect(() => {
    if (!localSchedule || Object.keys(localSchedule).length === 0) return;
    const hasChanged = JSON.stringify(localSchedule) !== JSON.stringify(weeklySchedule);
    if (!hasChanged) return;

    const enabledDaysKeys = Object.keys(localSchedule).filter(key => localSchedule[key]?.enabled);
    let isValid = true;
    for (const dayKey of enabledDaysKeys) {
      const day = localSchedule[dayKey];
      if (!day.fromTime || !day.toTime || !day.fromTime.includes(':') || !day.toTime.includes(':')) {
        isValid = false;
        break;
      }
    }
    if (!isValid) return;

    const timer = setTimeout(async () => {
      try {
        await updateSchedule(localSchedule);
      } catch (e) {
        console.error('Auto-save error:', e);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [localSchedule]);

  // Convert 24h "HH:mm" from <input type="time"> to 12h "hh:mm" + period for the backend
  const to12h = (time24) => {
    if (!time24) return { time: '', period: 'AM' };
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return { time: `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')}`, period };
  };

  const handleAddException = async () => {
    if (!newException.date) return;
    try {
      const from = to12h(newException.fromTime);
      const to = to12h(newException.toTime);
      const result = await addException({
        date: newException.date,
        fromTime: newException.isClosed ? "" : from.time,
        toTime: newException.isClosed ? "" : to.time,
        fromPeriod: newException.isClosed ? "AM" : from.period,
        toPeriod: newException.isClosed ? "PM" : to.period,
        isClosed: newException.isClosed
      });
      if (result.success) {
        setNewException({ date: '', fromTime: '', toTime: '', fromPeriod: 'AM', toPeriod: 'PM', isClosed: false });
      }
    } catch (e) { console.error(e); }
  };

  const getStatusColor = () => {
    if (loading.schedule || loading.exceptions) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (success.schedule || success.exceptions) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    return 'bg-slate-50 text-slate-400 border-slate-100';
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      {/* Module Header */}
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#0070CD]/5 rounded-xl flex items-center justify-center text-[#0070CD]">
            <FaCalendarAlt className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">إعدادات المواعيد</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">إدارة الماتريكس الزمنية والبيانات الاستثنائية</p>
          </div>
        </div>

        {/* Tactical Status Indicator */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all duration-500 ${getStatusColor()}`}>
          {(loading.schedule || loading.exceptions) && <FaSave className="text-xs animate-bounce" />}
          {(success.schedule || success.exceptions) && <FaCheckCircle className="text-xs" />}
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            {loading.schedule || loading.exceptions ? 'جاري المزامنة' : (success.schedule || success.exceptions) ? 'تم الحفظ' : 'مؤمن'}
          </span>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Tactical Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-[2rem] p-6 flex items-center gap-6">
             <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#0070CD]">
                <FaClock className="text-xl" />
             </div>
             <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">الأيام المفعلة</span>
                <div className="flex gap-1.5">
                   {daysOfWeek.map(day => (
                     <div 
                       key={day.key} 
                       title={day.name}
                       className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-black transition-all ${localSchedule[day.key]?.enabled ? 'bg-[#0070CD] text-white' : 'bg-slate-200 text-slate-400'}`}
                     >
                       {day.label}
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-100 rounded-[2rem] p-6 flex items-center gap-6">
             <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#0070CD]">
                <FaCalendarPlus className="text-xl" />
             </div>
             <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">البيانات الاستثنائية</span>
                <div className="flex items-center gap-2">
                   <span className="text-xl font-black text-slate-900">{exceptionalDates.length}</span>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">تاريخ محدد</span>
                </div>
             </div>
          </div>
        </div>

        {/* Main Schedule Interface */}
        <div className="space-y-4">
           {(error.schedule || error.exceptions) && (
             <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600">
               <FaExclamationCircle className="flex-shrink-0" />
               <p className="text-[10px] font-black uppercase tracking-widest">{error.schedule || error.exceptions}</p>
             </div>
           )}
           
           <WeeklyScheduleCalendar
             weeklySchedule={localSchedule}
             isEditing={true}
             onScheduleChange={setLocalSchedule}
             exceptionalDates={exceptionalDates}
             onRemoveException={removeException}
             newException={newException}
             onNewExceptionChange={setNewException}
             onAddException={handleAddException}
             loading={loading}
           />
        </div>
      </div>
    </div>
  );
};

export default AppointmentSection;

import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/ar';
import { FaToggleOn, FaToggleOff, FaClock, FaCalendarPlus, FaPlus, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import TimePicker from '@/components/ui/TimePicker';

moment.locale('ar');
const localizer = momentLocalizer(moment);

/**
 * WeeklyScheduleCalendar - Clinical Command Edition
 * High-performance scheduling matrix for medical professionals.
 */
const WeeklyScheduleCalendar = ({
  weeklySchedule,
  isEditing,
  onScheduleChange,
  exceptionalDates = [],
  onRemoveException,
  newException,
  onNewExceptionChange,
  onAddException,
  loading = {}
}) => {
  // Days configuration
  const daysConfig = [
    { key: 'saturday', name: 'السبت', dayIndex: 6 },
    { key: 'sunday', name: 'الأحد', dayIndex: 0 },
    { key: 'monday', name: 'الاثنين', dayIndex: 1 },
    { key: 'tuesday', name: 'الثلاثاء', dayIndex: 2 },
    { key: 'wednesday', name: 'الأربعاء', dayIndex: 3 },
    { key: 'thursday', name: 'الخميس', dayIndex: 4 },
    { key: 'friday', name: 'الجمعة', dayIndex: 5 }
  ];

  // Convert schedule to calendar events
  const events = useMemo(() => {
    const eventsList = [];
    daysConfig.forEach(day => {
      const schedule = weeklySchedule[day.key];
      if (schedule && schedule.enabled && schedule.fromTime && schedule.toTime) {
        const dayDate = moment().day(day.dayIndex);
        const fromHour = parseInt(schedule.fromTime.split(':')[0]);
        const fromMinute = parseInt(schedule.fromTime.split(':')[1] || 0);
        const toHour = parseInt(schedule.toTime.split(':')[0]);
        const toMinute = parseInt(schedule.toTime.split(':')[1] || 0);

        let adjFrom = fromHour;
        let adjTo = toHour;
        if (schedule.fromPeriod === 'PM' && fromHour !== 12) adjFrom += 12;
        else if (schedule.fromPeriod === 'AM' && fromHour === 12) adjFrom = 0;
        if (schedule.toPeriod === 'PM' && toHour !== 12) adjTo += 12;
        else if (schedule.toPeriod === 'AM' && toHour === 12) adjTo = 0;

        const start = dayDate.clone().hour(adjFrom).minute(fromMinute).toDate();
        const end = dayDate.clone().hour(adjTo).minute(toMinute).toDate();

        eventsList.push({
          id: day.key,
          title: `${schedule.fromTime}${schedule.fromPeriod === 'AM' ? 'ص' : 'م'} - ${schedule.toTime}${schedule.toPeriod === 'AM' ? 'ص' : 'م'}`,
          start,
          end,
          resource: { dayName: day.name }
        });
      }
    });
    return eventsList;
  }, [weeklySchedule]);

  const handleToggleDay = (dayKey) => {
    if (!isEditing) return;
    onScheduleChange({
      ...weeklySchedule,
      [dayKey]: { ...weeklySchedule[dayKey], enabled: !weeklySchedule[dayKey].enabled }
    });
  };

  const handleTimeChange = (dayKey, field, value) => {
    if (!isEditing) return;
    onScheduleChange({
      ...weeklySchedule,
      [dayKey]: { ...weeklySchedule[dayKey], [field]: value }
    });
  };

  const eventStyleGetter = () => ({
    className: '!bg-[#0070CD] !border-none !rounded-xl !shadow-sm !py-1 !px-2 !text-[10px] !font-black !uppercase !tracking-widest'
  });

  return (
    <div className="space-y-8">
      {/* Day Command Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {daysConfig.map(day => {
          const schedule = weeklySchedule[day.key] || { enabled: false, fromTime: '', toTime: '', fromPeriod: 'AM', toPeriod: 'PM' };
          return (
            <div
              key={day.key}
              className={`
                group relative p-6 rounded-[2rem] border transition-all duration-500
                ${schedule.enabled 
                  ? 'bg-white border-[#0070CD] shadow-lg shadow-[#0070CD]/5' 
                  : 'bg-slate-50 border-slate-100 opacity-60 hover:opacity-100'}
              `}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${schedule.enabled ? 'bg-[#0070CD] text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {day.name.charAt(0)}
                  </div>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{day.name}</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleToggleDay(day.key)}
                  className={`w-10 h-6 rounded-full p-1 transition-all ${schedule.enabled ? 'bg-[#0070CD]' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${schedule.enabled ? '-translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className={`space-y-4 transition-all ${!schedule.enabled ? 'grayscale pointer-events-none' : ''}`}>
                 <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">بداية الكشف</span>
                    <TimePicker
                      value={schedule.fromTime || ''}
                      period={schedule.fromPeriod || 'AM'}
                      onChange={(time) => handleTimeChange(day.key, 'fromTime', time)}
                      onPeriodChange={(period) => handleTimeChange(day.key, 'fromPeriod', period)}
                    />
                 </div>
                 <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">نهاية الكشف</span>
                    <TimePicker
                      value={schedule.toTime || ''}
                      period={schedule.toPeriod || 'PM'}
                      onChange={(time) => handleTimeChange(day.key, 'toTime', time)}
                      onPeriodChange={(period) => handleTimeChange(day.key, 'toPeriod', period)}
                    />
                 </div>
              </div>
            </div>
          );
        })}

        {/* Tactical Exceptions Module */}
        <div className="xl:col-span-2 p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#0070CD]/20 blur-[60px] rounded-full"></div>
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#0070CD]">
                       <FaCalendarPlus />
                    </div>
                    <div>
                       <h4 className="text-sm font-black uppercase tracking-widest">المواعيد الاستثنائية</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">الإجازات والمواعيد الخاصة</p>
                    </div>
                 </div>
                 <span className="text-[10px] font-black text-[#0070CD] uppercase tracking-widest">{exceptionalDates.length} نشط</span>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Quick Add Form */}
                 <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">التاريخ</label>
                       <input
                         type="date"
                         value={newException.date}
                         onChange={(e) => onNewExceptionChange({ ...newException, date: e.target.value })}
                         className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white focus:ring-4 focus:ring-[#0070CD]/20"
                         dir="ltr"
                       />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group">
                       <input
                         type="checkbox"
                         checked={newException.isClosed}
                         onChange={(e) => onNewExceptionChange({ ...newException, isClosed: e.target.checked })}
                         className="hidden"
                       />
                       <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${newException.isClosed ? 'bg-[#0070CD] border-[#0070CD]' : 'border-white/20'}`}>
                          {newException.isClosed && <FaCheckCircle className="text-white text-[10px]" />}
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest">يوم إجازة (مغلق)</span>
                    </label>

                    <button
                      onClick={onAddException}
                      disabled={!newException.date || loading.exceptions}
                      className="w-full bg-[#0070CD] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#0070CD]/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      <FaPlus /> إضافة بيان
                    </button>
                 </div>

                 {/* Active Exceptions List */}
                 <div className="space-y-3 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                    {exceptionalDates.length > 0 ? exceptionalDates.map((exc, idx) => (
                      <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                         <div>
                            <span className="text-[10px] font-black block uppercase tracking-widest">{new Date(exc.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}</span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{exc.isClosed ? 'إجـازة' : `${exc.fromTime} - ${exc.toTime}`}</span>
                         </div>
                         <button onClick={() => onRemoveException(exc.id)} className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <FaTrash className="text-xs" />
                         </button>
                      </div>
                    )) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-30">
                         <FaCalendarPlus className="text-3xl mb-2" />
                         <span className="text-[9px] font-black uppercase tracking-widest">لا توجد بيانات</span>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Unified Master View: Clinical Calendar */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm">
         <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-[#0070CD] rounded-full"></div>
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">الماتريكس الزمنية الأسبوعية</h4>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-[#0070CD] rounded-full"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تشغيل آلي</span>
            </div>
         </div>
         
         <div className="h-[500px] clinical-calendar" dir="ltr">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              defaultView="week"
              views={['week']}
              eventPropGetter={eventStyleGetter}
              messages={{
                week: 'أسبوع',
                today: 'اليوم',
                previous: 'السابق',
                next: 'التالي'
              }}
              formats={{
                dayHeaderFormat: (date) => moment(date).format('dddd'),
                dayRangeHeaderFormat: ({ start, end }) =>
                  `${moment(start).format('D MMM')} - ${moment(end).format('D MMM YYYY')}`
              }}
            />
         </div>
      </div>

      <style jsx="true">{`
        .clinical-calendar .rbc-calendar { font-family: inherit; }
        .clinical-calendar .rbc-header { padding: 20px 0; border-bottom: 2px solid #f8fafc; text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; color: #94a3b8; }
        .clinical-calendar .rbc-time-content { border-top: none; }
        .clinical-calendar .rbc-timeslot-group { border-bottom: 1px solid #f8fafc; min-height: 60px; }
        .clinical-calendar .rbc-today { background-color: #f8fafc; }
        .clinical-calendar .rbc-event { padding: 4px 12px; }
        .clinical-calendar .rbc-time-view { border: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 112, 205, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default WeeklyScheduleCalendar;

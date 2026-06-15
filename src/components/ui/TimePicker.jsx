import React from 'react';
import { FaClock } from 'react-icons/fa';

/**
 * TimePicker - Tactical Command Version
 * High-density time selection module for clinical scheduling.
 */
const TimePicker = ({ 
  value = '', 
  period = 'AM', 
  onChange, 
  onPeriodChange,
  disabled = false,
  className = ''
}) => {
  const parseTime = (timeStr) => {
    if (!timeStr || !timeStr.includes(':')) {
      return { hours: '', minutes: '' };
    }
    const [hours, minutes] = timeStr.split(':');
    return { 
      hours: hours.padStart(2, '0'), 
      minutes: minutes.padStart(2, '0') 
    };
  };

  const { hours, minutes } = parseTime(value);

  const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = (i + 1).toString().padStart(2, '0');
    return { value: hour, label: hour };
  });

  const minuteOptions = Array.from({ length: 60 }, (_, i) => {
    const minute = i.toString().padStart(2, '0');
    return { value: minute, label: minute };
  });

  const handleHourChange = (newHour) => {
    if (!newHour) {
      onChange('');
      return;
    }
    const newTime = `${newHour}:${minutes || '00'}`;
    onChange(newTime);
  };

  const handleMinuteChange = (newMinute) => {
    if (!newMinute) {
      onChange('');
      return;
    }
    const newTime = `${hours || '09'}:${newMinute}`;
    onChange(newTime);
  };

  return (
    <div className={`flex gap-1.5 items-center ${className}`}>
      {/* Hour Selector */}
      <div className="relative group flex-1">
        <select
          value={hours}
          onChange={(e) => handleHourChange(e.target.value)}
          disabled={disabled}
          className="w-full pl-3 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:ring-4 focus:ring-[#0070CD]/10 focus:border-[#0070CD] focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50"
          dir="ltr"
        >
          <option value="">--</option>
          {hourOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="text-[8px] font-black text-slate-400 uppercase">H</span>
        </div>
      </div>

      <span className="text-slate-300 font-black text-xs">:</span>

      {/* Minute Selector */}
      <div className="relative group flex-1">
        <select
          value={minutes}
          onChange={(e) => handleMinuteChange(e.target.value)}
          disabled={disabled}
          className="w-full pl-3 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:ring-4 focus:ring-[#0070CD]/10 focus:border-[#0070CD] focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50"
          dir="ltr"
        >
          <option value="">--</option>
          {minuteOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="text-[8px] font-black text-slate-400 uppercase">M</span>
        </div>
      </div>

      {/* Period Selector (AM/PM) */}
      <select
        value={period}
        onChange={(e) => onPeriodChange(e.target.value)}
        disabled={disabled}
        className="px-4 py-3 bg-[#0070CD] text-white rounded-xl text-xs font-black hover:bg-[#005a9e] transition-all cursor-pointer disabled:bg-slate-300"
      >
        <option value="AM">ص</option>
        <option value="PM">م</option>
      </select>
    </div>
  );
};

export default TimePicker;

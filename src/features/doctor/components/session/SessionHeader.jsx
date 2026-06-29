import React from 'react';
import { 
  FaHeart, 
  FaRobot, 
  FaFileAlt, 
  FaPrescriptionBottleAlt, 
  FaTimes, 
  FaUser, 
  FaStopCircle,
  FaTerminal,
  FaClock
} from 'react-icons/fa';
import SessionTimer from './SessionTimer';

/**
 * SessionHeader - Clinical Command Bar
 * Optimized for high-stakes medical consultation.
 */
const SessionHeader = ({
  patientInfo,
  currentSession,
  loading,
  onClose,
  onEndSession,
  activeTab,
  onTabChange,
  timeRemaining,
  isExpiring
}) => {
  const shouldShowEndButton = currentSession?.status !== 4 && currentSession?.status !== 'Completed';

  const tabs = [
    { id: 'medical', label: 'تاريخ المريض', icon: FaHeart },
    { id: 'ai_diagnosis', label: 'مساعد AI', icon: FaRobot },
    { id: 'documentation', label: 'توثيق الحالة', icon: FaFileAlt },
    { id: 'prescription', label: 'الروشتة', icon: FaPrescriptionBottleAlt },
  ];

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8 pt-6 pb-2 transition-all duration-300 sticky top-0 z-[200] bg-slate-50">
      <header className="w-full max-w-[1600px] bg-white/90 backdrop-blur-xl shadow-xl shadow-[#0070CD]/10 border-2 border-white rounded-[2rem] lg:rounded-[2.5rem] px-3 sm:px-6 py-3 flex flex-col lg:flex-row flex-wrap items-center justify-between gap-4">
      {/* Tactical Status & Patient Link */}
      <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
        <button
          onClick={onClose}
          className="w-11 h-11 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-200 shadow-sm"
          title="خروج"
        >
          <FaTimes className="text-sm" />
        </button>

        <div className="w-px h-8 bg-slate-100"></div>

        <div className="flex items-center gap-4">
           <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                 {patientInfo?.patientProfileImageUrl ? (
                   <img src={patientInfo.patientProfileImageUrl} className="w-full h-full object-cover" alt="Patient" />
                 ) : (
                   <FaUser className="text-slate-300" />
                 )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
           </div>
           <div>
              <h2 className="text-sm font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">
                 {patientInfo?.patientFullName || 'تحميل البيانات...'}
              </h2>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-[#0070CD] uppercase tracking-widest bg-[#0070CD]/5 px-2 py-0.5 rounded-md">
                   {currentSession?.sessionType === 1 ? 'جـلسة جـديدة' : 'متـابعة'}
                 </span>
              </div>
           </div>
        </div>
      </div>

      {/* Center Navigation - Command Tabs */}
      <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-[1.25rem] border border-slate-100 overflow-x-auto w-full lg:w-auto no-scrollbar">
         {tabs.map(tab => {
           const Icon = tab.icon;
           const isActive = activeTab === tab.id;
           return (
             <button
               key={tab.id}
               onClick={() => onTabChange(tab.id)}
               className={`
                 flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0
                 ${isActive 
                   ? 'bg-white text-[#0070CD] shadow-sm border border-slate-100' 
                   : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}
               `}
             >
               <Icon className={`text-xs ${isActive ? 'text-[#0070CD]' : 'opacity-40'}`} />
               <span>{tab.label}</span>
             </button>
           );
         })}
      </div>

      {/* Global Clinical Actions */}
      <div className="flex items-center gap-4 sm:gap-8 w-full lg:w-auto justify-between lg:justify-end">
        <SessionTimer timeRemaining={timeRemaining} isExpiring={isExpiring} compact={true} />
        
        {shouldShowEndButton && (
          <button
            onClick={onEndSession}
            disabled={loading}
            className="flex items-center gap-3 px-6 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-rose-100 hover:bg-rose-600 hover:text-white transition-all transform active:scale-95 shadow-sm"
          >
            <FaStopCircle className="text-sm" />
            <span>إنهاء الجلسة</span>
          </button>
        )}
      </div>
      </header>
    </div>
  );
};

export default SessionHeader;

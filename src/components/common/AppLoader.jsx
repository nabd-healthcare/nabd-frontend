import React from 'react';
import { FaHeartbeat } from 'react-icons/fa';

/**
 * Global App Loader
 * Aligned with the Nabd Modern Blue Design System
 */
const AppLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] relative overflow-hidden" dir="rtl">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-tr from-[#0070CD]/5 to-transparent rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="text-center relative z-10 flex flex-col items-center">
        
        {/* Core Brand Logo */}
        <div className="mb-8 relative auto-animate">
           {/* Pulsing Backlight */}
           <div className="absolute inset-0 bg-[#0070CD] rounded-3xl blur-xl opacity-20 animate-pulse"></div>
           
           <div className="w-24 h-24 bg-[#0070CD] rounded-3xl flex items-center justify-center text-white shadow-[0_12px_40px_rgba(0,112,205,0.25)] relative z-10 animate-bounce">
             <FaHeartbeat className="w-12 h-12" />
           </div>
        </div>

        {/* Brand Text Identity */}
        <div className="flex flex-col mb-12">
            <h1 className="text-5xl font-black text-[#1F2E3C] tracking-tight leading-none mb-2">
              نبض <span className="text-[#0070CD]">NABD</span>
            </h1>
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
               Medical OS
            </span>
        </div>

        {/* Loading Spinner Dots */}
        <div className="flex justify-center items-center gap-2 mb-4 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
          <div className="w-2.5 h-2.5 bg-[#0070CD] opacity-90 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2.5 h-2.5 bg-[#0070CD] opacity-60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2.5 h-2.5 bg-[#0070CD] opacity-30 rounded-full animate-bounce"></div>
          <span className="text-[#64748B] text-sm font-black mr-2 tracking-wide">جاري التحميل...</span>
        </div>

      </div>
    </div>
  );
};

export default AppLoader;

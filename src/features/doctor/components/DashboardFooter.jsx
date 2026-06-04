import React from 'react';
import { FaHeart, FaArrowUp, FaTerminal } from 'react-icons/fa';

/**
 * DashboardFooter - Tactical Metadata Module
 * Optimized for the high-density Clinical Command Center.
 */
const DashboardFooter = () => {
  return (
    <footer className="py-10 mt-auto border-t border-slate-50 bg-white/80 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-[#0070CD] rounded-full shadow-[0_0_12px_rgba(0,112,205,0.4)] animate-pulse"></div>
            <p className="font-black text-slate-500">© 2026 منصة نبض للرعاية المتكاملة. نظام التشغيل الطبي المعتمد.</p>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-6 opacity-40">
               <span className="hover:text-[#0070CD] cursor-pointer transition-colors">Privacy protocol</span>
               <span className="hover:text-[#0070CD] cursor-pointer transition-colors">Terms of access</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaSave, FaNotesMedical, FaHistory, FaUserMd, FaClipboardCheck, FaTasks, FaTerminal, FaBed, FaPrint } from 'react-icons/fa';

/**
 * DocumentationTab - Clinical Notes Module
 * Tactical input area for rapid medical documentation.
 */
const DocumentationTab = ({ docForm, onDocFormChange, autoSaveStatus, patientInfo, user }) => {
  const [sickLeaveDays, setSickLeaveDays] = useState(3);
  const fields = [
    {
      key: 'chiefComplaint',
      label: 'الشكوى الرئيسية',
      icon: FaNotesMedical,
      placeholder: 'الإبلاغ عن درجة الحرارة وصداع...',
      rows: 2,
    },
    {
      key: 'historyOfPresentIllness',
      label: 'تاريخ المرض الحالي',
      icon: FaHistory,
      placeholder: 'بدأت الأعراض منذ يومين، مع تفاقم تدريجي للشدة...',
      rows: 2,
    },
    {
      key: 'physicalExamination',
      label: 'الفحص السريري',
      icon: FaUserMd,
      placeholder: 'احتقان في الحلق، صوت صفير خفيف في الصدر...',
      rows: 2,
    },
    {
      key: 'diagnosis',
      label: 'التقييم والتشخيص',
      icon: FaClipboardCheck,
      placeholder: 'وصف الحالة المرضية الحالية...',
      rows: 2,
    },
    {
      key: 'managementPlan',
      label: 'الخطة العلاجية والدوائية',
      icon: FaTasks,
      placeholder: 'وصف دواء علاج موسع للشعب الهوائية، متابعة بعد 3 أيام...',
      rows: 3,
      fullWidth: true
    }
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Tactical Status Readout */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0070CD]/5 flex items-center justify-center text-[#0070CD]">
               <FaTerminal className="text-xs" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Documentation System v1.0</span>
         </div>

         <AnimatePresence>
           {autoSaveStatus && (
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all animate-in fade-in slide-in-from-right-2">
                {autoSaveStatus === 'saving' ? (
                  <div className="flex items-center gap-2 text-[#0070CD]">
                     <div className="animate-spin rounded-full h-2 w-2 border border-[#0070CD] border-t-transparent"></div>
                     <span>Syncing with server</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600">
                     <FaSave className="text-xs" />
                     <span>Cloud Persisted</span>
                  </div>
                )}
             </div>
           )}
         </AnimatePresence>
      </div>

      {/* High-Density Note Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div
              key={field.key}
              className={`flex flex-col group ${field.fullWidth ? 'md:col-span-2' : ''}`}
            >
              <label className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                   <Icon className="text-xs text-slate-300 group-focus-within:text-[#0070CD] transition-colors" />
                   <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{field.label}</span>
                </div>
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity">Active Entry</span>
              </label>
              
              <div className="relative">
                 <textarea
                   value={docForm[field.key]}
                   onChange={(e) => onDocFormChange(field.key, e.target.value)}
                   rows={field.rows}
                   className="w-full bg-white border border-slate-100 rounded-3xl px-6 py-5 text-sm font-bold text-slate-800 focus:border-[#0070CD]/30 focus:ring-4 focus:ring-[#0070CD]/5 transition-all resize-none placeholder:text-slate-300 leading-relaxed shadow-sm hover:border-slate-200"
                   placeholder={field.placeholder}
                 />
                 <div className="absolute bottom-4 left-6 pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-100 group-focus-within:bg-[#0070CD] transition-colors shadow-[0_0_8px_rgba(0,112,205,0)] group-focus-within:shadow-[0_0_8px_rgba(0,112,205,0.4)]"></div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sick Leave Generator */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center justify-between print:hidden">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-indigo-500 flex items-center justify-center text-xl">
               <FaBed />
            </div>
            <div>
               <h4 className="text-sm font-black text-slate-800">إصدار إجازة مرضية</h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sick Leave Certificate</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
               <button onClick={() => setSickLeaveDays(Math.max(1, sickLeaveDays - 1))} className="px-4 py-2 hover:bg-slate-50 font-black text-slate-600">-</button>
               <div className="px-4 py-2 font-black text-[#0070CD] border-x border-slate-200 min-w-[3rem] text-center">{sickLeaveDays}</div>
               <button onClick={() => setSickLeaveDays(sickLeaveDays + 1)} className="px-4 py-2 hover:bg-slate-50 font-black text-slate-600">+</button>
               <span className="px-4 py-2 text-xs font-bold text-slate-400 bg-slate-50">أيام</span>
            </div>
            <button
               onClick={() => window.print()}
               className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
               <FaPrint />
               Print Form
            </button>
         </div>
      </div>

      {/* --- Print Layout (Sick Leave Certificate) --- */}
      <div className="hidden print:flex fixed inset-0 bg-white z-[9999] p-12 text-slate-900 w-full h-full flex-col justify-center">
         <style type="text/css" media="print">
           {`@page { size: A5 landscape; margin: 15mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }`}
         </style>
         
         <div className="border-[4px] border-double border-[#0070CD]/20 p-8 rounded-3xl relative h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-8">
               <div>
                  <h1 className="text-3xl font-black text-[#0070CD] mb-1">Nabd Clinic</h1>
                  <p className="text-sm font-bold text-slate-500">د. {user?.fullName || 'الطبيب المعالج'}</p>
               </div>
               <div className="text-left">
                  <h2 className="text-xl font-black text-slate-800 mb-1">شهادة إجازة مرضية</h2>
                  <p className="text-xs font-bold text-slate-500">التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
               </div>
            </div>

            {/* Body */}
            <div className="flex-1">
               <p className="text-lg font-bold text-slate-700 leading-loose mb-6">
                  تشهد العيادة بأن المريض / <span className="font-black text-slate-900 underline decoration-slate-300 underline-offset-4 px-2">{patientInfo?.patientName || '................................'}</span>
               </p>
               <p className="text-lg font-bold text-slate-700 leading-loose mb-6">
                  قد تم توقيع الكشف الطبي عليه في عيادتنا اليوم، وبناءً على حالته الصحية، نوصي بمنحه راحة تامة لمدة <span className="font-black text-[#0070CD] bg-[#0070CD]/10 px-4 py-1 rounded-lg">({sickLeaveDays}) أيام</span> تبدأ من تاريخ هذه الشهادة.
               </p>
               {docForm.diagnosis && (
                 <p className="text-sm font-bold text-slate-500 leading-loose">
                    <span className="font-black text-slate-800">التشخيص المبدئي:</span> {docForm.diagnosis}
                 </p>
               )}
            </div>

            {/* Footer */}
            <div className="mt-12 flex justify-between items-end">
               <div className="text-[10px] text-slate-400 font-bold text-center">
                  <p>تم إصدار هذه الشهادة إلكترونياً عبر منصة Nabd</p>
                  <p>رقم السجل: {patientInfo?.patientId?.substring(0,8) || 'N/A'}</p>
               </div>
               <div className="text-center">
                  <div className="w-40 border-b border-slate-300 mb-2"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ختم وتوقيع الطبيب</p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default DocumentationTab;

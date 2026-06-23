import React, { useState, useEffect, useRef } from 'react';
import { useServices } from '../hooks/useServices';
import ServiceCard from './ServiceCard';
import {
  FaStethoscope,
  FaRedoAlt,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaSave,
  FaExclamationCircle
} from 'react-icons/fa';

/**
 * ServicesSection - High-Density Pricing Command
 * Manage medical service costs and clinical session durations.
 */
const ServicesSection = () => {
  const {
    regularCheckup,
    reExamination,
    loading,
    error,
    success,
    updateRegularCheckup,
    updateReExamination,
  } = useServices({ autoFetch: true });

  const [sharedDuration, setSharedDuration] = useState(null);
  const [regularCheckupData, setRegularCheckupData] = useState({ price: null });
  const [reExaminationData, setReExaminationData] = useState({ price: null });
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved'
  const autoSaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef(null);

  // Sync store data to local state
  useEffect(() => {
    setRegularCheckupData({ price: regularCheckup.price });
    if (regularCheckup.duration !== null) {
      setSharedDuration(regularCheckup.duration);
    } else if (reExamination.duration !== null) {
      setSharedDuration(reExamination.duration);
    }
  }, [regularCheckup, reExamination]);

  useEffect(() => {
    setReExaminationData({ price: reExamination.price });
  }, [reExamination]);

  const performAutoSave = async () => {
    const promises = [];
    
    if (regularCheckupData.price !== null && regularCheckupData.price !== '') {
      promises.push(updateRegularCheckup({ price: regularCheckupData.price, duration: sharedDuration }));
    }
    
    if (reExaminationData.price !== null && reExaminationData.price !== '') {
      promises.push(updateReExamination({ price: reExaminationData.price, duration: sharedDuration }));
    }

    if (promises.length === 0) return;

    setAutoSaveStatus('saving');
    try {
      await Promise.allSettled(promises);
      setAutoSaveStatus('saved');
      lastSavedDataRef.current = JSON.stringify({ regularCheckupData, reExaminationData, sharedDuration });
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (e) {
      setAutoSaveStatus('');
    }
  };

  useEffect(() => {
    // Only auto-save if something was actually modified
    const currentData = JSON.stringify({ regularCheckupData, reExaminationData, sharedDuration });
    // Initialize lastSavedDataRef on first render to prevent immediate save of empty data
    if (lastSavedDataRef.current === null) {
      lastSavedDataRef.current = currentData;
      return;
    }
    
    if (currentData === lastSavedDataRef.current) return;

    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    autoSaveTimeoutRef.current = setTimeout(performAutoSave, 1500);

    return () => clearTimeout(autoSaveTimeoutRef.current);
  }, [regularCheckupData, reExaminationData, sharedDuration]);

  const getStatusColor = () => {
    switch(autoSaveStatus) {
      case 'saving': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'saved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Module Header */}
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#0070CD]/5 rounded-xl flex items-center justify-center text-[#0070CD]">
            <FaMoneyBillWave className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">الخدمات والأسعار</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">إدارة التكاليف ومدة الجلسات</p>
          </div>
        </div>

        {/* Tactical Auto-save Indicator */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all duration-500 ${getStatusColor()}`}>
          {autoSaveStatus === 'saving' && <FaSave className="text-xs animate-bounce" />}
          {autoSaveStatus === 'saved' && <FaCheckCircle className="text-xs" />}
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            {autoSaveStatus === 'saving' ? 'جاري المزامنة' : autoSaveStatus === 'saved' ? 'تم الحفظ' : 'مؤمن'}
          </span>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Tactical Shared Duration Block */}
        <div className="bg-[#F8FAFC] border border-slate-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8">
           <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#0070CD] flex-shrink-0">
             <FaClock className="text-2xl" />
           </div>
           
           <div className="flex-1 space-y-1">
             <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">مدة الجلسة الموحدة</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">تطبق هذه المدة على جميع أنواع الكشوفات لتنظيم المواعيد</p>
           </div>

           <div className="w-full md:w-48 relative">
              <input
                type="number"
                min="5"
                max="120"
                step="5"
                value={sharedDuration || ''}
                onChange={(e) => setSharedDuration(parseFloat(e.target.value) || null)}
                placeholder="30"
                className={`
                  w-full pl-6 pr-16 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-900 text-left
                  focus:ring-4 focus:ring-[#0070CD]/10 focus:border-[#0070CD] transition-all
                  ${!sharedDuration ? 'border-rose-200' : ''}
                `}
                dir="ltr"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                دقيقة
              </div>
           </div>
        </div>

        {/* Services High-Density Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceCard
            title="الكشف العادي"
            description="الكشف الطبي الأولي والتشخيص"
            icon={FaStethoscope}
            price={regularCheckupData.price}
            duration={sharedDuration}
            onPriceChange={(value) => setRegularCheckupData(prev => ({ ...prev, price: value }))}
            isEditing={true}
            loading={loading.regularCheckup}
            hideDuration={true}
          />

          <ServiceCard
            title="إعادة الكشف"
            description="المتابعة والكشف الدوري"
            icon={FaRedoAlt}
            price={reExaminationData.price}
            duration={sharedDuration}
            onPriceChange={(value) => setReExaminationData(prev => ({ ...prev, price: value }))}
            isEditing={true}
            loading={loading.reExamination}
            hideDuration={true}
          />
        </div>

        {/* Tactical Alerts */}
        {(error.regularCheckup || error.reExamination) && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600">
             <FaExclamationCircle className="flex-shrink-0" />
             <p className="text-[10px] font-black uppercase tracking-widest">
               {error.regularCheckup || error.reExamination}
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesSection;
import React, { useEffect, useState, useCallback } from 'react';
import {
  FaTimes, FaPrescriptionBottleAlt, FaCalendarAlt,
  FaUser, FaPills, FaExclamationCircle, FaHashtag,
  FaUserMd
} from 'react-icons/fa';
import { usePatientsStore } from '../stores/patientsStore';
import { formatDate } from '@/utils/helpers';

/**
 * PrescriptionDetailsModal Component
 * Premium clean UI matching the new blue design system
 */
const PrescriptionDetailsModal = ({ isOpen, onClose, prescriptionId, patientId, doctorId }) => {
  const { fetchPrescriptionDetails } = usePatientsStore();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load prescription details function
  const loadPrescriptionDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    // MOCK DATA HANDLING
    if (prescriptionId && typeof prescriptionId === 'string' && prescriptionId.startsWith('mock-')) {
      setTimeout(() => {
        let mockData;
        if (prescriptionId === 'mock-1') {
          mockData = {
            id: 'mock-1',
            prescriptionNumber: 'PR-2024-001',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            status: 1,
            patientName: 'محمد أحمد محمود',
            doctorName: 'د. أحمد محمد',
            generalInstructions: 'يرجى الالتزام بمواعيد الدواء بدقة ومراجعة الطبيب بعد أسبوعين.',
            medications: [
              { medicationName: 'Panadol Advance 500mg', dosage: 'قرص واحد', frequency: 'كل 8 ساعات', durationDays: 5, specialInstructions: 'يؤخذ بعد الأكل' },
              { medicationName: 'Augmentin 1g', dosage: 'قرص واحد', frequency: 'كل 12 ساعة', durationDays: 7, specialInstructions: 'يجب إكمال الكورس العلاجي بالكامل' }
            ]
          };
        } else if (prescriptionId === 'mock-2') {
          mockData = {
            id: 'mock-2',
            prescriptionNumber: 'PR-2023-045',
            createdAt: new Date(Date.now() - 864000000).toISOString(),
            status: 3,
            patientName: 'محمد أحمد محمود',
            doctorName: 'د. سارة علي',
            generalInstructions: 'الراحة التامة وشرب سوائل دافئة.',
            medications: [
              { medicationName: 'Cough Syrup', dosage: 'ملعقة كبيرة', frequency: '3 مرات يومياً', durationDays: 5, specialInstructions: 'بدون سكر' },
              { medicationName: 'Vitamin C 1000mg', dosage: 'قرص فوار', frequency: 'مرة يومياً', durationDays: 10, specialInstructions: 'يذاب في نصف كوب ماء' }
            ]
          };
        } else {
          mockData = {
            id: 'mock-3',
            prescriptionNumber: 'PR-2023-022',
            createdAt: new Date(Date.now() - 2592000000).toISOString(),
            status: 4,
            patientName: 'محمد أحمد محمود',
            doctorName: 'د. محمد حسن',
            generalInstructions: 'متابعة ضغط الدم يومياً.',
            medications: [
              { medicationName: 'Concor 5mg', dosage: 'قرص واحد', frequency: 'صباحاً', durationDays: 30, specialInstructions: 'على الريق' },
              { medicationName: 'Aspirin Protect 100mg', dosage: 'قرص واحد', frequency: 'بعد الغداء', durationDays: 30, specialInstructions: '' }
            ]
          };
        }
        setPrescription(mockData);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const data = await fetchPrescriptionDetails(patientId, doctorId, prescriptionId);

      if (data) {
        setPrescription(data);
      } else {
        setError('فشل في تحميل تفاصيل الروشتة');
      }
    } catch {
      setError('حدث خطأ في تحميل الروشتة');
    } finally {
      if (!prescriptionId?.startsWith('mock-')) {
        setLoading(false);
      }
    }
  }, [fetchPrescriptionDetails, patientId, doctorId, prescriptionId]);

  // Fetch prescription details
  useEffect(() => {
    if (isOpen && prescriptionId) {
      loadPrescriptionDetails();
    }

    // Cleanup on close
    return () => {
      if (!isOpen) {
        setPrescription(null);
        setError(null);
      }
    };
  }, [isOpen, prescriptionId, loadPrescriptionDetails]);

  // Format date helper
  const formatPrescriptionDate = (date) => {
    if (!date) return 'غير محدد';
    try {
      return formatDate(date);
    } catch {
      return date;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-[#F8FAFC] rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fadeIn border border-slate-200/60 overflow-hidden">
        
        {/* Header - Clean White Base */}
        <div className="bg-white px-6 md:px-8 py-6 border-b border-slate-100 flex-shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-[#0070CD]/10 rounded-xl flex items-center justify-center border border-[#0070CD]/20 shadow-inner">
                  <FaPrescriptionBottleAlt className="text-[#0070CD] text-xl" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">تفاصيل الروشتة الطبية</h2>
                  <p className="text-[#64748B] text-sm font-bold mt-0.5">
                     {prescription?.prescriptionNumber || 'جاري التحميل...'}
                  </p>
               </div>
            </div>
            <button
               onClick={onClose}
               className="w-10 h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center transition-colors shadow-sm text-slate-500 hover:text-red-500"
               aria-label="Close modal"
            >
               <FaTimes className="text-lg" />
            </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
            {loading ? (
              /* Loading State */
              <div className="flex flex-col items-center justify-center py-24">
                  <div className="w-16 h-16 border-[5px] border-[#0070CD]/20 border-t-[#0070CD] rounded-full animate-spin mx-auto mb-6 shadow-sm"></div>
                  <p className="text-[#64748B] font-bold text-lg animate-pulse">جاري تحميل الروشتة...</p>
              </div>
            ) : error ? (
              /* Error State */
              <div className="text-center py-16 bg-white rounded-3xl border border-red-100 shadow-sm max-w-lg mx-auto mt-6 p-8">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <FaExclamationCircle className="text-4xl text-red-400" />
                </div>
                <h3 className="text-2xl font-black text-[#0F172A] mb-2">حدث خطأ</h3>
                <p className="text-[#64748B] font-medium mb-6 text-base">{error}</p>
                <button
                  onClick={loadPrescriptionDetails}
                  className="px-8 py-3.5 bg-[#0070CD] hover:bg-[#005ba3] text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : !prescription ? (
              /* No Data State */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                 <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 overflow-hidden">
                      <div className="w-full h-full bg-slate-200/50 flex items-center justify-center opacity-50 relative">
                           <FaPrescriptionBottleAlt className="text-5xl text-slate-400 absolute" />
                      </div>
                  </div>
                 <h3 className="text-2xl font-black text-[#0F172A] mb-3 mt-4">لا توجد بيانات</h3>
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Info Dashboard */}
                <div className="bg-white rounded-2xl p-6 border border-[#0070CD]/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute left-0 top-0 w-32 h-32 bg-[#0070CD]/5 rounded-br-full -z-0 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0070CD] border border-slate-100">
                         <FaHashtag className="text-lg" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-[#64748B] uppercase block">رقم الروشتة</span>
                        <span className="text-lg font-black text-[#0F172A]">{prescription.prescriptionNumber}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0070CD] border border-slate-100">
                         <FaCalendarAlt className="text-lg" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-[#64748B] uppercase block">تاريخ الإصدار</span>
                        <span className="text-lg font-black text-[#0F172A]">{formatPrescriptionDate(prescription.createdAt)}</span>
                      </div>
                    </div>

                    {prescription.patientName && (
                      <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0070CD] border border-slate-100">
                           <FaUser className="text-lg" />
                        </div>
                        <div>
                          <span className="text-[11px] font-black text-[#64748B] uppercase block">المريض</span>
                          <span className="text-lg font-black text-[#0F172A]">{prescription.patientName}</span>
                        </div>
                      </div>
                    )}

                    {prescription.doctorName && (
                      <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0070CD] border border-slate-100">
                           <FaUserMd className="text-lg" />
                        </div>
                        <div>
                          <span className="text-[11px] font-black text-[#64748B] uppercase block">الطبيب المعالج</span>
                          <span className="text-lg font-black text-[#0F172A]">{prescription.doctorName}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* General Instructions Block */}
                  {prescription.generalInstructions && (
                    <div className="mt-6 bg-[#0070CD]/5 rounded-xl p-5 border border-[#0070CD]/10 flex items-start gap-4">
                       <div className="p-2 bg-white rounded-lg shadow-sm text-[#0070CD]">
                          <FaExclamationCircle />
                       </div>
                       <div>
                          <span className="text-xs font-black text-[#0070CD] block mb-1">تعليمات عامة للطبيب</span>
                          <span className="text-sm font-bold text-slate-700 leading-relaxed">{prescription.generalInstructions}</span>
                       </div>
                    </div>
                  )}
                </div>

                {/* Medications List Wrapper */}
                <div>
                  <h3 className="text-xl font-black text-[#0F172A] flex items-center gap-3 mb-5 border-b border-slate-200 pb-3">
                      <FaPills className="text-[#0070CD]" />
                      الأدوية الموصوفة <span className="bg-[#0070CD]/10 text-[#0070CD] px-2.5 py-0.5 rounded-lg text-sm">{prescription.medications?.length || 0}</span>
                  </h3>

                  <div className="space-y-4">
                    {prescription.medications?.map((med, index) => (
                      <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#0070CD]/40 transition-colors shadow-sm relative overflow-hidden group/med">
                        <div className="flex items-start gap-5">
                          {/* Number Badge */}
                          <div className="w-12 h-12 bg-[#0070CD]/5 border border-[#0070CD]/10 text-[#0070CD] rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0 shadow-inner group-hover/med:bg-[#0070CD] group-hover/med:text-white transition-colors">
                            {index + 1}
                          </div>

                          {/* Medication Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xl font-black text-[#0F172A] mb-4 truncate">
                              {med.medicationName}
                            </h4>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                              <div className="p-2 border-r border-slate-200/60 first:border-0 pl-3">
                                <span className="text-[10px] text-[#64748B] font-bold block mb-1">الجرعة</span>
                                <span className="text-sm font-black text-[#0F172A]">{med.dosage}</span>
                              </div>

                              <div className="p-2 border-r border-slate-200/60 pl-3">
                                <span className="text-[10px] text-[#64748B] font-bold block mb-1">التكرار</span>
                                <span className="text-sm font-black text-[#0F172A]">{med.frequency}</span>
                              </div>

                              <div className="p-2 border-r md:border-r-0 border-slate-200/60 md:border-t-0 border-t col-span-2 md:col-span-1 pl-3">
                                <span className="text-[10px] text-[#64748B] font-bold block mb-1">المدة</span>
                                <span className="text-sm font-black text-[#0F172A]">{med.durationDays} يوم</span>
                              </div>
                            </div>

                            {med.specialInstructions && (
                                <div className="mt-4 bg-[#0070CD]/5 rounded-xl p-3 px-4 border border-[#0070CD]/10 text-sm flex items-center gap-3">
                                  <span className="w-1.5 h-1.5 bg-[#0070CD] rounded-full inline-block"></span>
                                  <span className="font-bold text-slate-700">{med.specialInstructions}</span>
                                </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 p-5 md:px-8 mt-auto flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full md:w-auto md:min-w-[160px] md:mr-auto block px-6 py-3.5 bg-slate-100/80 border border-slate-200 text-[#0F172A] hover:bg-slate-200 rounded-xl font-bold transition-all duration-200 shadow-sm active:scale-95 text-center"
          >
            إغلاق نافذة الروشتة
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailsModal;

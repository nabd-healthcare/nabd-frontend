import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FaTimes,
  FaFileAlt,
  FaPrescription,
  FaClipboardList,
  FaBook,
  FaStethoscope,
  FaSearchPlus,
  FaNotesMedical
} from 'react-icons/fa';
import apiClient from '../../../api/client';
import patientService from '../../../api/services/patient.service';
import { getSpecialtyById } from '@/utils/constants';

/**
 * Appointment Details Modal
 * Shows session documentation, lab tests, and prescription in tabs
 */
const AppointmentDetailsModal = ({ isOpen, onClose, appointment }) => {
  const [activeTab, setActiveTab] = useState('documentation'); // documentation, labs, prescription
  const [documentation, setDocumentation] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Fetch data when modal opens or tab changes
  useEffect(() => {
    if (isOpen && appointment) {
      if (activeTab === 'documentation') {
        fetchDocumentation();
      } else if (activeTab === 'prescription') {
        fetchPrescription();
      }
    } else if (!isOpen) {
      // Reset state when closing
      setActiveTab('documentation');
      setDocumentation(null);
      setPrescription(null);
      setError(null);
    }
  }, [isOpen, appointment, activeTab]);

  const fetchDocumentation = async () => {
    if (!appointment?.id) return;

    setLoading(true);
    setError(null);

    // MOCK DATA HANDLING
    if (appointment.id && typeof appointment.id === 'string' && appointment.id.startsWith('mock-')) {
      setTimeout(() => {
        setDocumentation({
          chiefComplaint: 'يعاني المريض من صداع مستمر منذ 3 أيام مع ارتفاع طفيف في درجة الحرارة.',
          historyOfPresentIllness: 'بدأت الأعراض تدريجياً، تزداد حدة الصداع في المساء. لا توجد أعراض غثيان أو قيء.',
          physicalExamination: 'ضغط الدم 120/80، النبض 75. الفحص السريري العام طبيعي. لا توجد علامات التهاب سحائي.',
          diagnosis: 'صداع توتري (Tension Headache) مع عدوى فيروسية بسيطة.',
          managementPlan: 'الراحة التامة، تناول سوائل دافئة، ومسكنات عند اللزوم.'
        });
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const response = await apiClient.get(`/Appointments/${appointment.id}/documentation`);

      if (response.data?.isSuccess || response.data?.success) {
        setDocumentation(response.data?.data || response.data);
      } else {
        setDocumentation(null);
      }
    } catch (err) {
      // 404 means no documentation exists - not an error
      if (err.response?.status === 404) {
        setDocumentation(null);
      } else {
        console.error('Error fetching documentation:', err);
        setError('فشل تحميل التوثيق');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescription = async () => {
    // MOCK DATA HANDLING
    if (appointment?.id && typeof appointment.id === 'string' && appointment.id.startsWith('mock-')) {
      setLoading(true);
      setTimeout(() => {
        setPrescription({
          prescriptionNumber: 'PR-2024-MOCK',
          createdAt: new Date().toISOString(),
          medications: [
            {
              medicationName: 'Panadol Extra',
              dosage: 'قرصين',
              frequency: 'عند اللزوم',
              durationDays: 5,
              specialInstructions: 'لا تتجاوز 8 أقراص يومياً'
            },
            {
              medicationName: 'Vitamin C 1000mg',
              dosage: 'قرص فوار',
              frequency: 'مرة يومياً',
              durationDays: 10,
              specialInstructions: ''
            }
          ]
        });
        setLoading(false);
      }, 500);
      return;
    }

    // Check if prescription exists for this appointment
    if (!appointment?.prescriptionId) {
      setPrescription(null);
      return;
    }

    // Check if we have required IDs
    if (!appointment?.patientId || !appointment?.doctorId) {
      setPrescription(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await patientService.getPrescriptionDetails(
        appointment.patientId,
        appointment.doctorId,
        appointment.prescriptionId
      );

      if (result.success && result.data) {
        setPrescription(result.data);
      } else {
        setPrescription(null);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err) {
      console.error(' Error fetching prescription:', err);
      setPrescription(null);
      setError('فشل تحميل الروشتة');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

  const tabs = [
    { id: 'documentation', label: 'توثيق الجلسة', icon: FaFileAlt },
    { id: 'prescription', label: 'الروشتة الطبية', icon: FaPrescription },
  ];

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative bg-[#F8FAFC] rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fadeIn border border-slate-200/60 overflow-hidden">

        {/* Header */}
        <div className="bg-[#0070CD] flex-shrink-0">
          <div className="p-6 md:px-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-white tracking-tight">تفاصيل الجلسة</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 text-white"
                aria-label="Close modal"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <p className="text-blue-100 font-medium opacity-90 text-sm">
              مع د. {appointment.doctor?.fullName || appointment.doctorName || 'طبيب غير محدد'}
            </p>
          </div>

          {/* Tabs - Attached to header bottom seamlessly */}
          <div className="flex px-6 md:px-8 gap-2 pb-0">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-6 py-4 rounded-t-2xl font-black text-sm transition-all duration-300 ${isActive
                    ? 'bg-[#F8FAFC] text-[#0070CD] translate-y-px shadow-sm'
                    : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                >
                  <TabIcon className={isActive ? 'text-lg' : 'text-base opacity-80'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">

          {/* Session Documentation Tab */}
          {activeTab === 'documentation' && (
            <div className="animate-fadeIn">
              {loading ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <div className="w-16 h-16 border-[5px] border-[#0070CD]/20 border-t-[#0070CD] rounded-full animate-spin mb-6 shadow-sm"></div>
                  <p className="text-[#64748B] font-bold text-lg animate-pulse">جاري تحميل التوثيق...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-red-100 shadow-sm max-w-lg mx-auto mt-6 p-8">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <FaFileAlt className="text-4xl text-red-400" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0F172A] mb-2">حدث خطأ</h3>
                  <p className="text-[#64748B] font-medium mb-6 text-base">{error}</p>
                  <button
                    onClick={fetchDocumentation}
                    className="px-8 py-3.5 bg-[#0070CD] hover:bg-[#005ba3] text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              ) : documentation ? (
                <div className="space-y-6">
                  {/* Chief Complaint */}
                  {documentation.chiefComplaint && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-black text-[#0F172A] mb-3 flex items-center gap-3 pb-3 border-b border-slate-100/60">
                        <div className="p-2 bg-blue-50 rounded-lg text-[#0070CD]">
                          <FaClipboardList className="text-lg" />
                        </div>
                        الشكوى الرئيسية
                      </h3>
                      <p className="text-[#475569] leading-relaxed font-medium">
                        {documentation.chiefComplaint}
                      </p>
                    </div>
                  )}

                  {/* History of Present Illness */}
                  {documentation.historyOfPresentIllness && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-black text-[#0F172A] mb-3 flex items-center gap-3 pb-3 border-b border-slate-100/60">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                          <FaBook className="text-lg" />
                        </div>
                        تاريخ المرض الحالي
                      </h3>
                      <p className="text-[#475569] leading-relaxed font-medium">
                        {documentation.historyOfPresentIllness}
                      </p>
                    </div>
                  )}

                  {/* Physical Examination */}
                  {documentation.physicalExamination && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-black text-[#0F172A] mb-3 flex items-center gap-3 pb-3 border-b border-slate-100/60">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                          <FaStethoscope className="text-lg" />
                        </div>
                        الفحص الجسدي
                      </h3>
                      <p className="text-[#475569] leading-relaxed font-medium">
                        {documentation.physicalExamination}
                      </p>
                    </div>
                  )}

                  {/* Diagnosis */}
                  {documentation.diagnosis && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-black text-[#0F172A] mb-3 flex items-center gap-3 pb-3 border-b border-slate-100/60">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                          <FaSearchPlus className="text-lg" />
                        </div>
                        التشخيص
                      </h3>
                      <p className="text-[#475569] leading-relaxed font-medium">
                        {documentation.diagnosis}
                      </p>
                    </div>
                  )}

                  {/* Management Plan */}
                  {documentation.managementPlan && (
                    <div className="bg-[#0070CD]/5 rounded-2xl p-6 border border-[#0070CD]/20 shadow-sm">
                      <h3 className="text-lg font-black text-[#0070CD] mb-3 flex items-center gap-3 pb-3 border-b border-[#0070CD]/10">
                        <div className="p-2 bg-[#0070CD]/10 rounded-lg text-[#0070CD]">
                          <FaNotesMedical className="text-lg" />
                        </div>
                        خطة العلاج
                      </h3>
                      <p className="text-[#1E293B] leading-relaxed font-bold">
                        {documentation.managementPlan}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 overflow-hidden">
                    <div className="w-full h-full bg-slate-200/50 flex items-center justify-center opacity-50 relative">
                      <FaFileAlt className="text-5xl text-slate-400 absolute" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-[#0F172A] mb-3 mt-4">لا يوجد توثيق</h3>
                  <p className="text-[#64748B] text-lg font-medium">لم يتم توثيق هذه الجلسة بعد من قبل الطبيب</p>
                </div>
              )}
            </div>
          )}

          {/* Prescription Tab */}
          {activeTab === 'prescription' && (
            <div className="animate-fadeIn">
              {loading ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <div className="w-16 h-16 border-[5px] border-[#0070CD]/20 border-t-[#0070CD] rounded-full animate-spin mb-6 shadow-sm"></div>
                  <p className="text-[#64748B] font-bold text-lg animate-pulse">جاري تحميل الروشتة...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-red-100 shadow-sm max-w-lg mx-auto mt-6 p-8">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <FaPrescription className="text-4xl text-red-400" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0F172A] mb-2">حدث خطأ</h3>
                  <p className="text-[#64748B] font-medium mb-6 text-base">{error}</p>
                  <button
                    onClick={fetchPrescription}
                    className="px-8 py-3.5 bg-[#0070CD] hover:bg-[#005ba3] text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              ) : prescription?.medications && prescription.medications.length > 0 ? (
                <div className="space-y-8">
                  {/* Prescription Header Info */}
                  <div className="bg-white rounded-2xl p-6 border border-[#0070CD]/20 shadow-sm relative overflow-hidden group">
                    {/* Decorative pattern */}
                    <div className="absolute left-0 top-0 w-32 h-32 bg-[#0070CD]/5 rounded-br-full -z-0 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                      <div>
                        <span className="text-xs text-[#64748B] font-bold block mb-1">رقم الروشتة</span>
                        <span className="text-xl font-black text-[#0070CD]">{prescription.prescriptionNumber}</span>
                      </div>
                      <div className="md:border-r border-slate-200/80 md:pr-6">
                        <span className="text-xs text-[#64748B] font-bold block mb-1">تاريخ الإنشاء</span>
                        <span className="text-lg font-black text-[#0F172A]">
                          {new Date(prescription.createdAt).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Medications Header */}
                  <h3 className="text-xl font-black text-[#0F172A] flex items-center gap-3">
                    <FaPrescription className="text-[#0070CD] opacity-80" />
                    الأدوية الموصوفة
                  </h3>

                  {/* Medications List */}
                  <div className="space-y-4">
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#0070CD]/40 transition-colors shadow-sm relative overflow-hidden">
                        <div className="flex items-start gap-4">
                          {/* Number Badge */}
                          <div className="w-12 h-12 bg-blue-50/80 border border-[#0070CD]/20 text-[#0070CD] rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0 shadow-inner">
                            {index + 1}
                          </div>

                          {/* Medication Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xl font-black text-[#0F172A] mb-4 truncate pr-1">
                              {med.medicationName}
                            </h4>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                              <div className="p-2 border-r border-slate-200/60 first:border-0 pl-3">
                                <span className="text-[10px] text-[#64748B] font-bold block mb-1 opacity-80">الجرعة</span>
                                <span className="text-sm font-black text-[#0F172A]">{med.dosage}</span>
                              </div>

                              <div className="p-2 border-r border-slate-200/60 pl-3">
                                <span className="text-[10px] text-[#64748B] font-bold block mb-1 opacity-80">التكرار</span>
                                <span className="text-sm font-black text-[#0F172A]">{med.frequency}</span>
                              </div>

                              {med.durationDays && (
                                <div className="p-2 border-r border-slate-200/60 md:border-t-0 border-t col-span-2 md:col-span-1 pl-3">
                                  <span className="text-[10px] text-[#64748B] font-bold block mb-1 opacity-80">المدة</span>
                                  <span className="text-sm font-black text-[#0F172A]">{med.durationDays} يوم</span>
                                </div>
                              )}
                            </div>

                            {med.specialInstructions && (
                              <div className="mt-4 bg-[#0070CD]/5 rounded-xl p-4 border border-[#0070CD]/20 flex items-start gap-3">
                                <div className="p-1.5 bg-white rounded-md shadow-sm border border-[#0070CD]/10 text-[#0070CD] mt-0.5">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>
                                </div>
                                <div>
                                  <span className="text-xs text-[#0070CD] font-black block mb-1">تعليمات خاصة للطوارئ</span>
                                  <span className="text-sm font-bold text-[#1E293B]">{med.specialInstructions}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 overflow-hidden">
                    <div className="w-full h-full bg-slate-200/50 flex items-center justify-center opacity-50 relative">
                      <FaPrescription className="text-5xl text-slate-400 absolute" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-[#0F172A] mb-3 mt-4">لا توجد روشتة</h3>
                  <p className="text-[#64748B] text-lg font-medium">لم يتم كتابة روشتة طبية ملحقة لهذه الجلسة</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 p-5 md:px-8 mt-auto flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full md:w-auto md:min-w-[160px] md:mr-auto block px-6 py-3.5 bg-slate-100/80 border border-slate-200 text-[#0F172A] hover:bg-slate-200 rounded-xl font-bold transition-all duration-200 shadow-sm active:scale-95 text-center"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AppointmentDetailsModal;

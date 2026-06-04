import React, { useState } from 'react';
import { usePatientProfile } from '../../hooks/usePatientProfile';
import {
  FaFileMedical,
  FaAllergies,
  FaHeartbeat,
  FaPills,
  FaProcedures,
  FaPlus,
  FaTrash,
  FaEdit,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';

/**
 * Premium Medical Record Section Component
 * 
 * Includes Enter-key submission behavior via semantic <form> logic,
 * loading states, and disabled-state handling during updates.
 */
const MedicalRecordSection = () => {
  const {
    medicalRecord,
    loading,
    error,
    updateMedicalRecord,
  } = usePatientProfile({ autoFetch: false });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Collapse States
  const [openSections, setOpenSections] = useState({
    diseases: true,
    medications: true,
    allergies: true,
    surgeries: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Content Add Forms states
  const [showForm, setShowForm] = useState({
    disease: false,
    medication: false,
    allergy: false,
    surgery: false
  });

  const [formValues, setFormValues] = useState({
    disease: '',
    medication: '',
    allergy: '',
    surgery: ''
  });

  // Edit States
  const [editingItem, setEditingItem] = useState({ type: null, id: null, value: '' });

  // -------------------------------------------------------------
  // Data Helpers
  // -------------------------------------------------------------
  const diseases = medicalRecord?.chronicDiseases || [];
  const medications = medicalRecord?.currentMedications || [];
  const allergies = medicalRecord?.drugAllergies || [];
  const surgeries = medicalRecord?.previousSurgeries || [];

  const hasMedicalData = diseases.length > 0 || medications.length > 0 || allergies.length > 0 || surgeries.length > 0;

  // -------------------------------------------------------------
  // General Add/Edit/Delete Handlers
  // -------------------------------------------------------------
  const handleToggleForm = (type) => {
    setShowForm(prev => ({ ...prev, [type]: !prev[type] }));
    setFormValues(prev => ({ ...prev, [type]: '' }));
  };

  // UNIVERSAL SAVE
  const handleSaveAdd = async (e, type) => {
    e.preventDefault();
    if (isSubmitting) return;

    const val = formValues[type].trim();
    if (!val) {
      alert('يرجى إدخال البيانات المطلوبة');
      return;
    }

    setIsSubmitting(true);

    let payload = {};
    if (type === 'disease') payload = { chronicDiseases: [...diseases, { diseaseName: val }] };
    if (type === 'medication') payload = { currentMedications: [...medications, { medicationName: val }] };
    if (type === 'allergy') payload = { drugAllergies: [...allergies, { drugName: val }] };
    if (type === 'surgery') payload = { previousSurgeries: [...surgeries, { surgeryName: val }] };

    const result = await updateMedicalRecord(payload);
    if (result.success) {
      handleToggleForm(type);
    }

    setIsSubmitting(false);
  };

  // UNIVERSAL EDIT INIT
  const handleInitEdit = (type, id, currentValue) => {
    setEditingItem({ type, id, value: currentValue });
  };

  // UNIVERSAL EDIT SAVE
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { type, id, value } = editingItem;
    if (!value.trim()) {
      alert('يرجى إدخال البيانات المطلوبة');
      return;
    }

    setIsSubmitting(true);

    let payload = {};
    if (type === 'disease') payload = { chronicDiseases: diseases.map(item => item.id === id ? { ...item, diseaseName: value } : item) };
    if (type === 'medication') payload = { currentMedications: medications.map(item => item.id === id ? { ...item, medicationName: value } : item) };
    if (type === 'allergy') payload = { drugAllergies: allergies.map(item => item.id === id ? { ...item, drugName: value } : item) };
    if (type === 'surgery') payload = { previousSurgeries: surgeries.map(item => item.id === id ? { ...item, surgeryName: value } : item) };

    const result = await updateMedicalRecord(payload);
    if (result.success) {
      setEditingItem({ type: null, id: null, value: '' });
    }

    setIsSubmitting(false);
  };

  // UNIVERSAL DELETE
  const handleDelete = async (type, id) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    let payload = {};
    if (type === 'disease') payload = { chronicDiseases: diseases.filter(i => i.id !== id) };
    if (type === 'medication') payload = { currentMedications: medications.filter(i => i.id !== id) };
    if (type === 'allergy') payload = { drugAllergies: allergies.filter(i => i.id !== id) };
    if (type === 'surgery') payload = { previousSurgeries: surgeries.filter(i => i.id !== id) };

    await updateMedicalRecord(payload);
    setIsSubmitting(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // -------------------------------------------------------------
  // Render Helpers
  // -------------------------------------------------------------

  const renderEmptyState = ({ title, icon: Icon, type, ctaText }) => (
    <div className="flex flex-col items-center justify-center p-10 bg-slate-50 border border-slate-100 border-dashed rounded-[2rem] text-center group transition-all hover:bg-slate-100/50">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-slate-100 group-hover:scale-105 transition-transform">
        <Icon className="w-8 h-8 text-[#0070CD]/40" />
      </div>
      <h4 className="text-xl font-black text-slate-800 mb-2">لا توجد سجلات {title}</h4>
      <p className="text-sm font-bold text-slate-500 mb-8 max-w-sm">
        إضافة تاريخك الطبي بدقة يساعد الأطباء على تقديم رعاية صحية أفضل لحالتك
      </p>
      <button
        onClick={() => handleToggleForm(type)}
        disabled={isSubmitting}
        className="px-8 py-3.5 bg-[#0070CD] hover:bg-[#005ba3] text-white rounded-xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaPlus />
        <span>{ctaText}</span>
      </button>
    </div>
  );

  const renderItemList = (items, type) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {items.map((item) => {
        const itemName = item.diseaseName || item.medicationName || item.drugName || item.surgeryName;
        const isEditing = editingItem.type === type && editingItem.id === item.id;

        return (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#0070CD]/30 transition-all flex items-center gap-4 group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              {type === 'disease' && <FaHeartbeat className="text-[#0070CD] text-lg" />}
              {type === 'medication' && <FaPills className="text-[#0070CD] text-lg" />}
              {type === 'allergy' && <FaAllergies className="text-[#0070CD] text-lg" />}
              {type === 'surgery' && <FaProcedures className="text-[#0070CD] text-lg" />}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={editingItem.value}
                  onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                  className="w-full bg-slate-50 border border-[#0070CD] rounded-lg px-3 py-2 text-sm font-bold focus:outline-none"
                  autoFocus
                  disabled={isSubmitting}
                />
                <button type="submit" disabled={isSubmitting} className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors disabled:opacity-50">
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                </button>
                <button type="button" onClick={() => setEditingItem({ type: null, id: null, value: '' })} disabled={isSubmitting} className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-200 transition-colors disabled:opacity-50">
                  <FaTimes />
                </button>
              </form>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-black text-[#0F172A] truncate">{itemName}</h4>
                  {item.createdAt && <p className="text-[10px] uppercase font-black text-slate-400 mt-1">تاريخ الإضافة: {formatDate(item.createdAt)}</p>}
                </div>

                <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
                  <button onClick={() => handleInitEdit(type, item.id, itemName)} disabled={isSubmitting} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#0070CD] hover:bg-blue-50 transition-colors disabled:opacity-50">
                    <FaEdit className="text-sm" />
                  </button>
                  <button onClick={() => handleDelete(type, item.id)} disabled={isSubmitting} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50">
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative mt-8">

      {/* GLOBAL SECTION HEADER */}
      <div className="border-b border-slate-100 px-8 py-8 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden bg-slate-50/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#0070CD]/10 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/4"></div>

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-[#0070CD]/5 rounded-[1.25rem] flex items-center justify-center shadow-inner border border-[#0070CD]/10">
            <FaFileMedical className="w-7 h-7 text-[#0070CD]" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#0F172A] mb-1">السجل الطبي للمريض</h3>
            <p className="text-slate-500 font-bold text-sm">
              يُمكنك إدارة وحفظ تاريخك المرضي لمساعدة أطبائك في بناء الخطة العلاجية الدقيقة
            </p>
          </div>
        </div>

        {hasMedicalData && (
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm relative z-10 w-fit">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-black text-slate-600 tracking-wider">سجل طبي نَشط</span>
          </div>
        )}
      </div>

      <div className="p-8 lg:p-10 space-y-10">

        {/* 1. MEDICAL SUMMARY WIDGET */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
          <div className="flex flex-col gap-2 border-l border-slate-200 pl-4 py-2">
            <span className="text-[11px] font-black uppercase text-slate-400 flex items-center gap-2"><FaHeartbeat /> الأمراض المزمنة</span>
            <span className="text-3xl font-black text-[#0F172A]">{diseases.length}</span>
          </div>
          <div className="flex flex-col gap-2 lg:border-l border-slate-200 pl-4 py-2">
            <span className="text-[11px] font-black uppercase text-slate-400 flex items-center gap-2"><FaPills /> الأدوية الحالية</span>
            <span className="text-3xl font-black text-[#0F172A]">{medications.length}</span>
          </div>
          <div className="flex flex-col gap-2 border-l border-slate-200 pl-4 py-2">
            <span className="text-[11px] font-black uppercase text-slate-400 flex items-center gap-2"><FaAllergies /> حساسية مسجلة</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-[#0F172A]">{allergies.length}</span>
              {allergies.length > 0 && <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-black rounded-lg">يوجد تحذير</span>}
            </div>
          </div>
          <div className="flex flex-col gap-2 py-2">
            <span className="text-[11px] font-black uppercase text-slate-400">آخر تحديث للسجل</span>
            <span className="text-sm font-black text-[#0070CD] bg-blue-50 px-3 py-1.5 rounded-xl w-fit mt-1">
              {medicalRecord?.updatedAt ? formatDate(medicalRecord.updatedAt) : 'اليوم'}
            </span>
          </div>
        </div>

        {/* Loading / Error Overlays */}
        {loading.medicalRecord && (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#0070CD]/20 border-t-[#0070CD] rounded-full animate-spin"></div>
          </div>
        )}

        {error.medicalRecord && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <FaExclamationTriangle className="text-red-500 text-xl" />
            <p className="text-sm text-red-700 font-black">حدث خطأ في تحميل الملف الطبي: {error.medicalRecord}</p>
          </div>
        )}

        {/* COLLAPSIBLE MODULES */}
        {!loading.medicalRecord && !error.medicalRecord && (
          <div className="space-y-6">

            {/* --- CHRONIC DISEASES --- */}
            <div className={`border rounded-[2rem] transition-colors ${openSections.diseases ? 'border-[#0070CD]/20 bg-slate-50/30' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => toggleSection('diseases')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center">
                    <FaHeartbeat className="text-[#0070CD] text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800">الأمراض المزمنة</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{diseases.length} سجلات مسجلة</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-transform">
                  {openSections.diseases ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {openSections.diseases && (
                <div className="p-6 pt-0 animate-fadeIn">
                  <div className="w-full h-px bg-slate-200 mb-6"></div>

                  {diseases.length > 0 && (
                    <div className="flex justify-end mb-4">
                      <button onClick={() => handleToggleForm('disease')} disabled={isSubmitting} className="px-6 py-2.5 bg-white border-2 border-[#0070CD] text-[#0070CD] hover:bg-[#0070CD] hover:text-white rounded-xl font-black text-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50">
                        <FaPlus className="text-xs" /> إضافة مرض آخر
                      </button>
                    </div>
                  )}

                  {showForm.disease && (
                    <form onSubmit={(e) => handleSaveAdd(e, 'disease')} className="bg-white p-5 rounded-2xl border border-[#0070CD]/30 shadow-sm mb-4 flex flex-col md:flex-row gap-4">
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={formValues.disease}
                        onChange={(e) => setFormValues({ ...formValues, disease: e.target.value })}
                        placeholder="أدخل اسم المرض (مثال: السكري، ضغط الدم)..."
                        className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#0070CD] focus:ring-2 focus:ring-[#0070CD]/10 rounded-xl px-5 py-3.5 font-bold text-sm outline-none transition-all disabled:opacity-50 disabled:bg-slate-100"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button type="submit" disabled={isSubmitting} className="px-8 py-3.5 bg-[#0070CD] hover:bg-[#005ba3] text-white rounded-xl font-black text-sm transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                          {isSubmitting && <FaSpinner className="animate-spin" />} حفظ السجل
                        </button>
                        <button type="button" onClick={() => handleToggleForm('disease')} disabled={isSubmitting} className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-sm transition-all disabled:opacity-50">إلغاء</button>
                      </div>
                    </form>
                  )}

                  {diseases.length > 0 ? renderItemList(diseases, 'disease') : (!showForm.disease && renderEmptyState({ title: 'للأمراض المزمنة', icon: FaHeartbeat, type: 'disease', ctaText: 'ابدأ بإضافة أول مرض' }))}
                </div>
              )}
            </div>

            {/* --- MEDICATIONS --- */}
            <div className={`border rounded-[2rem] transition-colors ${openSections.medications ? 'border-[#0070CD]/20 bg-slate-50/30' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => toggleSection('medications')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center">
                    <FaPills className="text-[#0070CD] text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800">الأدوية الحالية</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{medications.length} أدوية مسجلة</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-transform">
                  {openSections.medications ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {openSections.medications && (
                <div className="p-6 pt-0 animate-fadeIn">
                  <div className="w-full h-px bg-slate-200 mb-6"></div>

                  {medications.length > 0 && (
                    <div className="flex justify-end mb-4">
                      <button onClick={() => handleToggleForm('medication')} disabled={isSubmitting} className="px-6 py-2.5 bg-white border-2 border-[#0070CD] text-[#0070CD] hover:bg-[#0070CD] hover:text-white rounded-xl font-black text-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50">
                        <FaPlus className="text-xs" /> إضافة دواء آخر
                      </button>
                    </div>
                  )}

                  {showForm.medication && (
                    <form onSubmit={(e) => handleSaveAdd(e, 'medication')} className="bg-white p-5 rounded-2xl border border-[#0070CD]/30 shadow-sm mb-4 flex flex-col md:flex-row gap-4">
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={formValues.medication}
                        onChange={(e) => setFormValues({ ...formValues, medication: e.target.value })}
                        placeholder="أدخل اسم الدواء..."
                        className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#0070CD] focus:ring-2 focus:ring-[#0070CD]/10 rounded-xl px-5 py-3.5 font-bold text-sm outline-none transition-all disabled:opacity-50 disabled:bg-slate-100"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button type="submit" disabled={isSubmitting} className="px-8 py-3.5 bg-[#0070CD] hover:bg-[#005ba3] text-white rounded-xl font-black text-sm transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                          {isSubmitting && <FaSpinner className="animate-spin" />} حفظ السجل
                        </button>
                        <button type="button" onClick={() => handleToggleForm('medication')} disabled={isSubmitting} className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-sm transition-all disabled:opacity-50">إلغاء</button>
                      </div>
                    </form>
                  )}

                  {medications.length > 0 ? renderItemList(medications, 'medication') : (!showForm.medication && renderEmptyState({ title: 'للأدوية المجعلة', icon: FaPills, type: 'medication', ctaText: 'ابدأ بإضافة أول دواء' }))}
                </div>
              )}
            </div>

            {/* --- ALLERGIES --- */}
            <div className={`border rounded-[2rem] transition-colors ${openSections.allergies ? 'border-[#0070CD]/20 bg-slate-50/30' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => toggleSection('allergies')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center">
                    <FaAllergies className="text-[#0070CD] text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800">حساسية الأدوية والمركبات</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{allergies.length} تحذيرات مسجلة</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-transform">
                  {openSections.allergies ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {openSections.allergies && (
                <div className="p-6 pt-0 animate-fadeIn">
                  <div className="w-full h-px bg-slate-200 mb-6"></div>

                  {allergies.length > 0 && (
                    <div className="flex justify-end mb-4">
                      <button onClick={() => handleToggleForm('allergy')} disabled={isSubmitting} className="px-6 py-2.5 bg-white border-2 border-[#0070CD] text-[#0070CD] hover:bg-[#0070CD] hover:text-white rounded-xl font-black text-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50">
                        <FaPlus className="text-xs" /> تسجل تفاعل تحسسي
                      </button>
                    </div>
                  )}

                  {showForm.allergy && (
                    <form onSubmit={(e) => handleSaveAdd(e, 'allergy')} className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200 shadow-sm mb-4 flex flex-col md:flex-row gap-4">
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={formValues.allergy}
                        onChange={(e) => setFormValues({ ...formValues, allergy: e.target.value })}
                        placeholder="أدخل اسم المادة المصابة بالحساسية منها..."
                        className="flex-1 bg-white border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 rounded-xl px-5 py-3.5 font-bold text-sm outline-none transition-all disabled:opacity-50 disabled:bg-slate-100"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button type="submit" disabled={isSubmitting} className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-sm transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                          {isSubmitting && <FaSpinner className="animate-spin" />} تسجيل التحذير
                        </button>
                        <button type="button" onClick={() => handleToggleForm('allergy')} disabled={isSubmitting} className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-sm transition-all disabled:opacity-50">إلغاء</button>
                      </div>
                    </form>
                  )}

                  {allergies.length > 0 ? renderItemList(allergies, 'allergy') : (!showForm.allergy && renderEmptyState({ title: 'للتفاعلات التحسسية', icon: FaAllergies, type: 'allergy', ctaText: 'ابدأ بإضافة مسبب حساسية' }))}
                </div>
              )}
            </div>

            {/* --- SURGERIES --- */}
            <div className={`border rounded-[2rem] transition-colors ${openSections.surgeries ? 'border-[#0070CD]/20 bg-slate-50/30' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => toggleSection('surgeries')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center">
                    <FaProcedures className="text-[#0070CD] text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800">العمليات السابقة والتاريخ الجراحي</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{surgeries.length} عمليات مسجلة</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-transform">
                  {openSections.surgeries ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {openSections.surgeries && (
                <div className="p-6 pt-0 animate-fadeIn">
                  <div className="w-full h-px bg-slate-200 mb-6"></div>

                  {surgeries.length > 0 && (
                    <div className="flex justify-end mb-4">
                      <button onClick={() => handleToggleForm('surgery')} disabled={isSubmitting} className="px-6 py-2.5 bg-white border-2 border-[#0070CD] text-[#0070CD] hover:bg-[#0070CD] hover:text-white rounded-xl font-black text-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50">
                        <FaPlus className="text-xs" /> توثيق عملية أخرى
                      </button>
                    </div>
                  )}

                  {showForm.surgery && (
                    <form onSubmit={(e) => handleSaveAdd(e, 'surgery')} className="bg-white p-5 rounded-2xl border border-[#0070CD]/30 shadow-sm mb-4 flex flex-col md:flex-row gap-4">
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={formValues.surgery}
                        onChange={(e) => setFormValues({ ...formValues, surgery: e.target.value })}
                        placeholder="أدخل اسم الإجراء الجراحي..."
                        className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#0070CD] focus:ring-2 focus:ring-[#0070CD]/10 rounded-xl px-5 py-3.5 font-bold text-sm outline-none transition-all disabled:opacity-50 disabled:bg-slate-100"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button type="submit" disabled={isSubmitting} className="px-8 py-3.5 bg-[#0070CD] hover:bg-[#005ba3] text-white rounded-xl font-black text-sm transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                          {isSubmitting && <FaSpinner className="animate-spin" />} حفظ الجراحة
                        </button>
                        <button type="button" onClick={() => handleToggleForm('surgery')} disabled={isSubmitting} className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-sm transition-all disabled:opacity-50">إلغاء</button>
                      </div>
                    </form>
                  )}

                  {surgeries.length > 0 ? renderItemList(surgeries, 'surgery') : (!showForm.surgery && renderEmptyState({ title: 'للجراحات السابقة', icon: FaProcedures, type: 'surgery', ctaText: 'ابدأ بتوثيق أول عملية' }))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordSection;

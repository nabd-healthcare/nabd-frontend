import { useState, useEffect } from 'react';
import { FaPills, FaPrescriptionBottleAlt, FaPlus, FaTrash, FaSave, FaTerminal, FaSearch, FaClipboardList, FaPrint } from 'react-icons/fa';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Prescriptions from '../../../../api/services/prescriptions.service';

const DOSAGE_OPTIONS = [
  'قرص واحد', 'قرصين', '3 أقراص', 'نصف قرص', 'ربع قرص',
  'ملعقة صغيرة (5 مل)', 'ملعقة كبيرة (15 مل)',
  'كبسولة واحدة', 'كبسولتين', 'حقنة واحدة',
  'بخة واحدة', 'بختين', '3 بخات',
  'نقطة واحدة', 'نقطتين', '3 نقط',
];

const FREQUENCY_OPTIONS = [
  'مرة واحدة يومياً', 'مرتين يومياً', '3 مرات يومياً', '4 مرات يومياً',
  'مرة كل 12 ساعة', 'مرة كل 8 ساعات', 'مرة كل 6 ساعات',
  'مرة كل يومين', 'مرة أسبوعياً', 'مرتين في الأسبوع', '3 مرات في الأسبوع',
  'عند الحاجة', 'قبل النوم', 'صباحاً', 'مساءً',
];

const DURATION_OPTIONS = ['3', '5', '7', '10', '14', '21', '30', '60', '90'];

const SPECIAL_INSTRUCTIONS_OPTIONS = [
  'بعد الأكل', 'قبل الأكل', 'مع الأكل', 'على معدة فارغة',
  'قبل النوم', 'عند الاستيقاظ', 'مع كوب ماء كامل',
  'لا تقود السيارة بعد تناوله', 'تجنب التعرض للشمس',
  'احفظه في الثلاجة', 'رج الزجاجة قبل الاستخدام',
  'لا تتوقف عن تناوله دون استشارة الطبيب', 'أكمل الجرعة كاملة',
];

/**
 * PrescriptionTab - Tactical Medication Builder
 * High-density interface for rapid prescription creation.
 */
const PrescriptionTab = ({ currentSession, patientInfo, appointmentData, appointmentId, user, onCreatePrescription }) => {
  const [medications, setMedications] = useState([]);
  const [currentMedication, setCurrentMedication] = useState({
    medicationId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    durationDays: '',
    specialInstructions: '',
  });
  const [medOptions, setMedOptions] = useState([]);
  const [medicSearchVal, setMedicSearchVal] = useState('');
  const [selectedMedication, setSelectedMedication] = useState(null);

  const MOCK_MEDICINES = [
    { brandName: 'Panadol 500mg' },
    { brandName: 'Panadol Extra' },
    { brandName: 'Panadol Cold & Flu' },
    { brandName: 'Brufen 400mg' },
    { brandName: 'Brufen 600mg' },
    { brandName: 'Cataflam 50mg' },
    { brandName: 'Augmentin 1g' },
    { brandName: 'Augmentin 625mg' },
    { brandName: 'Concor 5mg' },
    { brandName: 'Concor 2.5mg' },
    { brandName: 'Flagyl 500mg' },
    { brandName: 'Antinal' },
    { brandName: 'Omez 20mg' },
    { brandName: 'Nexium 40mg' },
    { brandName: 'Voltaren Injection' },
    { brandName: 'Neurimax' },
    { brandName: 'Milga' },
    { brandName: 'Omega 3' },
    { brandName: 'Aspirin 81mg' },
    { brandName: 'Plavix' }
  ];

  useEffect(() => {
    if (!medicSearchVal) { setMedOptions([]); return; }
    const filtered = MOCK_MEDICINES.filter(m => m.brandName.toLowerCase().includes(medicSearchVal.toLowerCase()));
    setMedOptions(filtered);
  }, [medicSearchVal]);

  const handleAddMedication = () => {
    if (!currentMedication.medicationName || !currentMedication.dosage || !currentMedication.frequency || !currentMedication.durationDays) {
      alert('⚠️ يرجى ملء جميع الحقول المطلوبة'); return;
    }
    setMedications([...medications, { ...currentMedication, id: Date.now(), durationDays: parseInt(currentMedication.durationDays) || 0 }]);
    setCurrentMedication({ medicationId: '', medicationName: '', dosage: '', frequency: '', durationDays: '', specialInstructions: '' });
    setSelectedMedication(null); setMedicSearchVal('');
  };

  const handleSavePrescription = async () => {
    try {
      if (medications.length === 0) { alert('⚠️ يرجى إضافة دواء واحد على الأقل'); return; }
      const doctorId = currentSession?.doctorId || appointmentData?.doctorId || user?.id;
      const patientIdFromSession = patientInfo?.patientId || appointmentData?.patientId || currentSession?.patientId;
      if (!doctorId || !patientIdFromSession || !appointmentId) { alert('❌ بيانات الجلسة غير مكتملة'); return; }

      const preparedMedications = medications.map(({ id: _id, ...med }) => ({
        medicationId: med.medicationId || '00000000-0000-0000-0000-000000000000',
        medicationName: med.medicationName,
        dosage: med.dosage,
        frequency: med.frequency,
        durationDays: parseInt(med.durationDays) || 0,
        specialInstructions: med.specialInstructions || '',
      }));

      const result = await onCreatePrescription({
        appointmentId, doctorId, patientId: patientIdFromSession, medications: preparedMedications,
      });

      if (result.success) {
        alert('✅ تم حفظ الروشتة بنجاح!'); setMedications([]);
        setCurrentMedication({ medicationId: '', medicationName: '', dosage: '', frequency: '', durationDays: '', specialInstructions: '' });
        setSelectedMedication(null); setMedicSearchVal('');
      } else alert(`❌ فشل حفظ الروشتة: ${result.error}`);
    } catch (e) { alert('❌ حدث خطأ أثناء حفظ الروشتة'); }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-10">
      {/* Entry Panel (Left Logic) */}
      <div className="flex-1 space-y-6">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-[#0070CD]/5 flex items-center justify-center text-[#0070CD]">
                    <FaPills />
                 </div>
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">إضافة دواء جديد</h4>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medication Search</span>
           </div>

           <div className="space-y-6">
              {/* Search Field */}
              <div className="relative group">
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0070CD] transition-colors">
                    <FaSearch className="text-sm" />
                 </div>
                 <Autocomplete
                   freeSolo
                   disablePortal
                   filterOptions={(x) => x}
                   getOptionLabel={(option) => {
                     if (typeof option === 'string') return option;
                     return option.brandName || '';
                   }}
                   options={medOptions}
                   value={selectedMedication}
                   onChange={(event, newValue) => {
                     if (typeof newValue === 'string') {
                       setSelectedMedication({ brandName: newValue });
                       setCurrentMedication({ ...currentMedication, medicationId: '', medicationName: newValue });
                     } else if (newValue) {
                       setSelectedMedication(newValue);
                       setCurrentMedication({ ...currentMedication, medicationId: newValue.id || '', medicationName: newValue.brandName || '' });
                     } else {
                       setSelectedMedication(null);
                       setCurrentMedication({ ...currentMedication, medicationId: '', medicationName: '' });
                     }
                   }}
                   onInputChange={(event, newInputValue) => {
                     setMedicSearchVal(newInputValue);
                     setCurrentMedication(prev => ({ ...prev, medicationName: newInputValue }));
                   }}
                   renderInput={(params) => (
                     <TextField
                       {...params}
                       dir="rtl"
                       variant="outlined"
                       placeholder="ابحث عن الدواء (مثل: Panadol)..."
                       sx={{
                         '& .MuiOutlinedInput-root': {
                           padding: '12px 48px 12px 12px',
                           borderRadius: '24px',
                           fontSize: '14px',
                           fontWeight: '700',
                           backgroundColor: '#f8fafc',
                           '& fieldset': { borderColor: '#f1f5f9' },
                           '&:hover fieldset': { borderColor: '#e2e8f0' },
                           '&.Mui-focused fieldset': { borderColor: '#0070CD', borderWidth: '1px' },
                         }
                       }}
                     />
                   )}
                 />
              </div>

              {/* Grid of Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { key: 'dosage', label: 'الجرعة', options: DOSAGE_OPTIONS, placeholder: 'قرص واحد' },
                   { key: 'frequency', label: 'عدد المرات', options: FREQUENCY_OPTIONS, placeholder: '3 مرات يومياً' },
                   { key: 'durationDays', label: 'المدة (أيام)', options: DURATION_OPTIONS, placeholder: '7', type: 'number' },
                   { key: 'specialInstructions', label: 'تعليمات', options: SPECIAL_INSTRUCTIONS_OPTIONS, placeholder: 'بعد الأكل' }
                 ].map(field => (
                   <div key={field.key} className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{field.label}</label>
                     <Autocomplete
                       freeSolo
                       options={field.options}
                       value={currentMedication[field.key]}
                       onChange={(event, newValue) => setCurrentMedication({ ...currentMedication, [field.key]: newValue || '' })}
                       onInputChange={(event, newInputValue) => setCurrentMedication({ ...currentMedication, [field.key]: newInputValue })}
                       renderInput={(params) => (
                         <TextField 
                           {...params} 
                           placeholder={field.placeholder} 
                           dir="rtl" 
                           type={field.type || 'text'}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               borderRadius: '16px',
                               fontSize: '12px',
                               fontWeight: '700',
                               backgroundColor: '#f8fafc',
                               '& fieldset': { borderColor: '#f1f5f9' },
                               '&:hover fieldset': { borderColor: '#e2e8f0' },
                               '&.Mui-focused fieldset': { borderColor: '#0070CD', borderWidth: '1px' },
                             }
                           }}
                         />
                       )}
                     />
                   </div>
                 ))}
              </div>

              <button
                onClick={handleAddMedication}
                disabled={!currentMedication.medicationName || !currentMedication.dosage || !currentMedication.frequency || !currentMedication.durationDays}
                className="w-full py-5 bg-[#0070CD] text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#0070CD]/20 hover:scale-[1.02] transform transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
              >
                <FaPlus />
                إدراج في الروشتة
              </button>
           </div>
        </div>
      </div>

      {/* The Script Panel (Live Preview) */}
      <div className="w-full xl:w-[450px] space-y-6">
         <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 text-slate-900 min-h-[500px] flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0070CD]/5 flex items-center justify-center">
                    <FaClipboardList className="text-[#0070CD]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">الروشتة الحالية</h4>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{medications.length} Medications listed</span>
                  </div>
               </div>
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar max-h-[400px]">
               {medications.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                    <FaPrescriptionBottleAlt className="text-4xl mb-4 text-slate-200" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No medications added yet</p>
                 </div>
               ) : (
                 medications.map((med, index) => (
                   <div key={med.id} className="group relative bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-white hover:border-[#0070CD]/20 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between gap-4">
                         <div className="flex-1">
                            <h5 className="text-xs font-black mb-2 flex items-center gap-2 text-slate-800">
                               <span className="text-[#0070CD]">{index + 1}.</span>
                               {med.medicationName}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                               <span className="px-2 py-1 bg-white rounded-md text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 shadow-sm">{med.dosage}</span>
                               <span className="px-2 py-1 bg-white rounded-md text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 shadow-sm">{med.frequency}</span>
                               <span className="px-2 py-1 bg-[#0070CD]/5 rounded-md text-[9px] font-black text-[#0070CD] uppercase tracking-widest border border-[#0070CD]/20 shadow-sm">{med.durationDays} Days</span>
                            </div>
                            {med.specialInstructions && (
                               <p className="mt-3 text-[9px] text-slate-400 font-bold italic">Note: {med.specialInstructions}</p>
                            )}
                         </div>
                         <button onClick={() => setMedications(medications.filter(m => m.id !== med.id))} className="text-slate-400 hover:text-rose-500 transition-colors p-1">
                            <FaTrash className="text-xs" />
                         </button>
                      </div>
                   </div>
                 ))
               )}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex gap-4 print:hidden">
               <button
                 onClick={() => window.print()}
                 disabled={medications.length === 0}
                 className="py-5 px-6 bg-slate-100 text-slate-600 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[.3em] hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95 disabled:opacity-20 flex flex-col items-center justify-center gap-1"
                 title="طباعة كـ PDF"
               >
                 <FaPrint className="text-lg" />
               </button>
               <button
                 onClick={handleSavePrescription}
                 disabled={medications.length === 0}
                 className="flex-1 py-5 bg-[#0070CD] text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[.3em] shadow-xl shadow-[#0070CD]/20 hover:scale-[1.02] transform transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-2"
               >
                 <FaSave className="text-sm" />
                 Finalize Prescription
               </button>
            </div>

            {/* --- Print Layout (Hidden on Screen, Visible on Print) --- */}
            <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-10 text-slate-900 w-full h-full">
               <style type="text/css" media="print">
                 {`@page { size: A4; margin: 20mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }`}
               </style>
               
               {/* Prescription Header */}
               <div className="flex justify-between items-start border-b-2 border-[#0070CD] pb-6 mb-8">
                  <div>
                     <h1 className="text-3xl font-black text-[#0070CD] mb-2">Nabd Clinic</h1>
                     <p className="text-sm font-bold text-slate-500">د. {user?.fullName || 'الطبيب المعالج'}</p>
                     <p className="text-xs text-slate-400">التخصص: {user?.specialization || 'عام'}</p>
                  </div>
                  <div className="text-left">
                     <h2 className="text-2xl font-black text-slate-800 mb-2">وصفة طبية (Rx)</h2>
                     <p className="text-sm font-bold text-slate-500">التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                  </div>
               </div>

               {/* Patient Info */}
               <div className="bg-slate-50 p-4 rounded-2xl mb-10 flex justify-between">
                  <div>
                     <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block mb-1">اسم المريض</span>
                     <p className="text-sm font-bold text-slate-800">{patientInfo?.patientName || 'غير متوفر'}</p>
                  </div>
                  <div>
                     <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block mb-1">العمر</span>
                     <p className="text-sm font-bold text-slate-800">{patientInfo?.patientAge || '--'} سنة</p>
                  </div>
               </div>

               {/* Medications List */}
               <div className="space-y-6">
                  {medications.map((med, index) => (
                    <div key={med.id} className="border-b border-slate-100 pb-4">
                       <h3 className="text-lg font-black text-[#0070CD] mb-2 flex items-center gap-2">
                         <span className="text-slate-300">{index + 1}.</span> {med.medicationName}
                       </h3>
                       <div className="grid grid-cols-3 gap-4 text-sm font-bold text-slate-700">
                          <p>الجرعة: {med.dosage}</p>
                          <p>التكرار: {med.frequency}</p>
                          <p>المدة: {med.durationDays} أيام</p>
                       </div>
                       {med.specialInstructions && (
                          <p className="mt-2 text-xs italic text-slate-500 font-bold bg-slate-50 p-2 rounded-lg">
                            تعليمات خاصة: {med.specialInstructions}
                          </p>
                       )}
                    </div>
                  ))}
               </div>

               {/* Footer / Signature */}
               <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end border-t border-slate-200 pt-6">
                  <div className="text-xs text-slate-400 font-bold text-center">
                     <p>تم إصدار هذه الروشتة إلكترونياً عبر منصة Nabd</p>
                     <p>www.nabd-health.com</p>
                  </div>
                  <div className="text-center">
                     <div className="w-40 border-b-2 border-slate-300 mb-2"></div>
                     <p className="text-xs font-black uppercase tracking-widest text-slate-400">توقيع الطبيب</p>
                  </div>
               </div>
            </div>
         </div>


      </div>
    </div>
  );
};

export default PrescriptionTab;

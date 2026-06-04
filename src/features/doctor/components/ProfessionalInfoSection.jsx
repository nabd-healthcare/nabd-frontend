import React, { useMemo } from 'react';
import { FaFileImage, FaBriefcaseMedical, FaPaperPlane, FaStethoscope, FaSave, FaCheckCircle, FaExclamationCircle, FaAward, FaBookMedical } from 'react-icons/fa';
import { Field, Combobox, ComboboxOption, ComboboxLabel } from '@/components/common/Combobox';
import DocumentUpload from './DocumentUpload';
import MultiDocumentUpload from './MultiDocumentUpload';

/**
 * ProfessionalInfoSection - Bento Module
 * High-performance clinical credentials interface.
 */
const ProfessionalInfoSection = ({
  formData,
  handleChange,
  specialtyOptions = [],
  removeAwardsImage,
  removeResearchPapersImage,
  documentStatuses = {},
  onSubmitForReview,
  autoSaveStatus
}) => {

  const getStatusColor = () => {
    switch(autoSaveStatus) {
      case 'saving': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'saved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'error': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Module Header */}
      <div className="px-8 py-6 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#0070CD]/5 rounded-xl flex items-center justify-center text-[#0070CD]">
            <FaBriefcaseMedical className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">الاعتماد المهني</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">التراخيص والتخصص الطبي</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tactical Auto-save Indicator */}
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all duration-500 ${getStatusColor()}`}>
            {autoSaveStatus === 'saving' && <FaSave className="text-xs animate-bounce" />}
            {autoSaveStatus === 'saved' && <FaCheckCircle className="text-xs" />}
            {autoSaveStatus === 'error' && <FaExclamationCircle className="text-xs" />}
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
              {autoSaveStatus === 'saving' ? 'جاري الحفظ' : autoSaveStatus === 'saved' ? 'تم الحفظ' : autoSaveStatus === 'error' ? 'خطأ' : 'وضع الحماية نشط'}
            </span>
          </div>

          {/* Submit for Review Button */}
          {onSubmitForReview && (
            <button
              onClick={onSubmitForReview}
              className="bg-[#0070CD] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg shadow-[#0070CD]/20"
            >
              <FaPaperPlane className="text-[9px]" />
              إرسال للمراجعة
            </button>
          )}
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Core Credentials Dash */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-[#F8FAFC] rounded-[2rem] border border-slate-100">
          {/* Specialty */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <FaStethoscope className="text-[9px]" />
              <span>التخصص الطبي</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Field>
                <Combobox
                  name="specialty"
                  options={specialtyOptions}
                  displayValue={(option) => option?.label || ''}
                  value={specialtyOptions.find(opt => opt.label === formData.specialty) || null}
                  onChange={handleChange}
                >
                  {(option) => (
                    <ComboboxOption value={option}>
                      <ComboboxLabel>{option.label}</ComboboxLabel>
                    </ComboboxOption>
                  )}
                </Combobox>
              </Field>
            </div>
          </div>

          {/* Experience Years */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <FaBriefcaseMedical className="text-[9px]" />
              <span>سنوات الخبرة</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="experience"
              className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20 focus:border-[#0070CD] transition-all"
              value={formData.experience}
              onChange={handleChange}
              placeholder="مثال: 10"
              required
            />
          </div>
        </div>

        {/* Tactical Document Repository */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-1 h-4 bg-[#0070CD] rounded-full"></div>
             <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">وثائق إثبات الهوية والممارسة</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {useMemo(() => (
              <DocumentUpload
                key="nationalIdPhoto"
                name="nationalIdPhoto"
                label="البطاقة الشخصية"
                required={true}
                preview={formData.nationalIdPreview}
                handleChange={handleChange}
                status={documentStatuses.nationalId}
              />
            ), [formData.nationalIdPreview, handleChange, documentStatuses.nationalId])}

            {useMemo(() => (
              <DocumentUpload
                key="medicalLicensePhoto"
                name="medicalLicensePhoto"
                label="رخصة مزاولة المهنة"
                required={true}
                preview={formData.medicalLicensePreview}
                handleChange={handleChange}
                status={documentStatuses.medicalLicense}
              />
            ), [formData.medicalLicensePreview, handleChange, documentStatuses.medicalLicense])}

            {useMemo(() => (
              <DocumentUpload
                key="syndicateMembershipPhoto"
                name="syndicateMembershipPhoto"
                label="عضوية النقابة"
                required={true}
                preview={formData.syndicateMembershipPreview}
                handleChange={handleChange}
                status={documentStatuses.syndicateMembership}
              />
            ), [formData.syndicateMembershipPreview, handleChange, documentStatuses.syndicateMembership])}

            {useMemo(() => (
              <DocumentUpload
                key="graduationCertificatePhoto"
                name="graduationCertificatePhoto"
                label="شهادة التخرج"
                required={true}
                preview={formData.graduationCertificatePreview}
                handleChange={handleChange}
                status={documentStatuses.graduationCertificate}
              />
            ), [formData.graduationCertificatePreview, handleChange, documentStatuses.graduationCertificate])}

            {useMemo(() => (
              <DocumentUpload
                key="specializationCertificatePhoto"
                name="specializationCertificatePhoto"
                label="شهادة التخصص"
                required={false}
                preview={formData.specializationCertificatePreview}
                handleChange={handleChange}
                status={documentStatuses.specializationCertificate}
              />
            ), [formData.specializationCertificatePreview, handleChange, documentStatuses.specializationCertificate])}
          </div>
        </div>

        {/* Global Achievements Module */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
           <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
             <div className="flex items-center gap-3 mb-6">
                <FaAward className="text-[#0070CD] text-lg" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">الجوائز والشهادات التقديرية</span>
             </div>
             <MultiDocumentUpload
                name="awardsImages"
                label="الجوائز"
                maxFiles={3}
                files={formData.awardsImages || []}
                handleChange={handleChange}
                onRemove={removeAwardsImage}
              />
           </div>

           <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
             <div className="flex items-center gap-3 mb-6">
                <FaBookMedical className="text-[#0070CD] text-lg" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">الأبحاث والمنشورات العلمية</span>
             </div>
             <MultiDocumentUpload
                name="researchPapersImages"
                label="الأبحاث"
                maxFiles={3}
                files={formData.researchPapersImages || []}
                handleChange={handleChange}
                onRemove={removeResearchPapersImage}
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoSection;

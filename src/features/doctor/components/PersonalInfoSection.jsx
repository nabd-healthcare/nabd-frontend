import React from 'react';
import PropTypes from 'prop-types';
import { FaUserMd, FaEnvelope, FaPhone, FaCalendarAlt, FaVenusMars, FaSave, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { Combobox, ComboboxLabel, ComboboxOption, Field } from '@/components/common/Combobox';
import CircularProfileImage from '@/components/common/CircularProfileImage';
import { GENDER_OPTIONS } from '@/utils/constants';

/**
 * PersonalInfoSection - Bento Module
 * High-performance personal data interface with Medical Blue branding.
 */
const PersonalInfoSection = ({
  formData,
  profileImagePreview,
  handleChange,
  autoSaveStatus,
  onSubmitForReview
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
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#0070CD]/5 rounded-xl flex items-center justify-center text-[#0070CD]">
            <FaUserMd className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">الهوية الشخصية</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">البيانات الأساسية للطبيب</p>
          </div>
        </div>

        {/* Tactical Auto-save Indicator */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all duration-500 ${getStatusColor()}`}>
          {autoSaveStatus === 'saving' && <FaSave className="text-xs animate-bounce" />}
          {autoSaveStatus === 'saved' && <FaCheckCircle className="text-xs" />}
          {autoSaveStatus === 'error' && <FaExclamationCircle className="text-xs" />}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {autoSaveStatus === 'saving' ? 'جاري الحفظ' : autoSaveStatus === 'saved' ? 'تم الحفظ' : autoSaveStatus === 'error' ? 'خطأ' : 'وضع الحماية نشط'}
          </span>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Profile Avatar Strategy */}
        <div className="relative group flex items-center justify-center p-8 bg-[#F8FAFC] rounded-[2rem] border border-slate-100 ring-4 ring-white shadow-inner">
           <div className="text-center">
              <CircularProfileImage
                name="profilePicture"
                onImageChange={handleChange}
                initialImage={profileImagePreview}
                initialFileName={formData.profilePicture?.name}
                disabled={false}
              />
              <div className="mt-4">
                 <p className="text-[10px] text-[#0070CD] font-black uppercase tracking-widest bg-[#0070CD]/5 inline-block px-4 py-2 rounded-full border border-[#0070CD]/10 transition-colors">انقر لتغيير الصورة المهنية</p>
              </div>
           </div>
        </div>

        {/* High-Performance Form Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <span>الاسم الأول</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20 focus:border-[#0070CD] transition-all group-hover:bg-white"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="الاسم الأول"
              required
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <span>الاسم الأخير</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20 focus:border-[#0070CD] transition-all group-hover:bg-white"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="الاسم الأخير"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <FaEnvelope className="text-[9px]" />
              <span>البريد الإلكتروني</span>
            </label>
            <input
              type="email"
              name="email"
              dir="ltr"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20 focus:border-[#0070CD] transition-all group-hover:bg-white"
              value={formData.email}
              onChange={handleChange}
              placeholder="doctor@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <FaPhone className="text-[9px]" />
              <span>رقم الهاتف</span>
            </label>
            <input
              type="tel"
              name="phone"
              dir="ltr"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20 focus:border-[#0070CD] transition-all group-hover:bg-white"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+20 XXXXXXXXX"
              required
            />
          </div>

          {/* Gender Combo */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <FaVenusMars className="text-[9px]" />
              <span>الجنس</span>
            </label>
            <div className="relative">
              <Field>
                <Combobox
                  name="gender"
                  options={GENDER_OPTIONS}
                  displayValue={(option) => option?.name || ''}
                  value={GENDER_OPTIONS.find(opt => opt.name === formData.gender) || null}
                  onChange={handleChange}
                >
                  {(option) => (
                    <ComboboxOption value={option}>
                      <ComboboxLabel>{option.name}</ComboboxLabel>
                    </ComboboxOption>
                  )}
                </Combobox>
              </Field>
            </div>
          </div>

          {/* DOB */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <FaCalendarAlt className="text-[9px]" />
              <span>تاريخ الميلاد</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              dir="ltr"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 focus:text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20 focus:border-[#0070CD] transition-all group-hover:bg-white"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Clinical Bio */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
            <span>النبذة التعريفية</span>
          </label>
          <textarea
            name="bio"
            rows="4"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20 focus:border-[#0070CD] transition-all group-hover:bg-white resize-none leading-relaxed"
            value={formData.bio}
            onChange={handleChange}
            placeholder="اكتب نبذة مهنية مختصرة تظهر للمرضى..."
            maxLength="500"
          />
          <div className="flex justify-end pr-2">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{formData.bio?.length || 0} / 500</span>
          </div>
        </div>

        {/* Submit for Review Action */}
        {onSubmitForReview && (
          <div className="pt-8 border-t border-slate-50 flex justify-end">
            <button 
              onClick={onSubmitForReview}
              className="px-10 py-4 bg-[#0070CD] hover:bg-[#0070CD]/90 text-white rounded-[1.5rem] text-sm font-black transition-all shadow-xl shadow-[#0070CD]/20 transform active:scale-95 flex items-center gap-3"
            >
              <span>إرسال الملف للمراجعة</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

PersonalInfoSection.propTypes = {
  formData: PropTypes.object.isRequired,
  profileImagePreview: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  autoSaveStatus: PropTypes.string,
  onSubmitForReview: PropTypes.func,
};

export default PersonalInfoSection;

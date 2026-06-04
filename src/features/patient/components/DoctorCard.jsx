/**
 * DoctorCard Component - Premium Luxury Design
 * Displays doctor in premium card with glow effects and smooth animations
 */

import { FaStar, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import { getSpecialtyById } from '@/utils/constants';

const DoctorCard = ({ doctor, onViewProfile, onBook }) => {
  const {
    id,
    fullName,
    medicalSpecialtyName,
    medicalSpecialty,
    profileImageUrl,
    averageRating,
    regularConsultationFee,
    governorate,
    city,
    nextAvailableSlot,
  } = doctor;

  // Get specialty name - prefer number over string (Backend bug workaround)
  const specialtyName = medicalSpecialty
    ? getSpecialtyById(medicalSpecialty)?.name
    : medicalSpecialtyName || 'تخصص غير محدد';

  // Format next available slot with time
  const formatAvailableSlot = (slot) => {
    if (!slot) return 'أقرب موعد: غير متاح';

    // Parse the date string properly
    const date = new Date(slot);

    // Get today and tomorrow in local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);

    // Format time in 12-hour format
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'م' : 'ص';
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const timeStr = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;

    if (slotDate.getTime() === today.getTime()) {
      return `أقرب موعد: اليوم ${timeStr}`;
    } else if (slotDate.getTime() === tomorrow.getTime()) {
      return `أقرب موعد: غداً ${timeStr}`;
    } else {
      const dateStr = date.toLocaleDateString('ar-EG', {
        day: 'numeric',
        month: 'short',
      });
      return `أقرب موعد: ${dateStr} ${timeStr}`;
    }
  };

  return (
    <div className="group relative bg-white rounded-[2rem] border border-slate-200/80 hover:border-[#0070CD]/40 p-6 md:p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,112,205,0.1)] shadow-sm overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0070CD]/0 to-[#0070CD]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Top Section: Avatar & Info */}
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0 group/avatar">
          {profileImageUrl ? (
            <div className="relative w-28 h-28 md:w-24 md:h-24">
               <div className="absolute inset-0 bg-[#0070CD]/20 rounded-[1.5rem] blur-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"></div>
               <img
                src={profileImageUrl}
                alt={fullName}
                className="relative w-full h-full rounded-[1.5rem] object-cover ring-2 ring-slate-100 shadow-md group-hover:ring-[#0070CD]/30 group-hover:shadow-lg transition-all"
               />
            </div>
          ) : (
            <div className="relative w-28 h-28 md:w-24 md:h-24 rounded-[1.5rem] bg-[#0070CD] flex items-center justify-center text-white text-4xl font-black shadow-md group-hover:shadow-lg">
              {fullName?.charAt(fullName.indexOf(' ') + 1) || 'د'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-center sm:text-right w-full flex flex-col">
          {/* Header & Rating */}
          <div className="flex justify-between items-start gap-3 mb-2 flex-col sm:flex-row">
             <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start w-full">
                <h3 className="text-xl md:text-2xl font-black text-[#0F172A] group-hover:text-[#0070CD] transition-colors break-words leading-snug">
                  {fullName}
                </h3>
                <p className="text-[#0070CD] font-bold text-sm mt-1">{specialtyName}</p>
             </div>
             
             {/* Rating Pill */}
             <div className="flex-shrink-0 mt-2 sm:mt-0">
               {averageRating ? (
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/50">
                  <FaStar className="text-amber-400 text-sm drop-shadow-sm" />
                  <span className="text-sm font-black text-amber-600">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
               ) : (
                <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                   <span className="text-[11px] font-bold text-slate-500">بدون تقييم</span>
                </div>
               )}
             </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100 mt-3 mx-auto sm:mx-0">
            <FaMapMarkerAlt className="text-slate-400 text-xs" />
            <span className="text-xs font-semibold text-slate-600">
              {city && governorate ? `${city} - ${governorate}` : city || governorate || 'الموقع غير محدد'}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Appointment & Price */}
      <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mt-auto">
        <div className="flex flex-col gap-1.5 p-2 px-3 border-l border-slate-200/60">
          <span className="text-[10px] text-[#64748B] font-bold">أقرب موعد متاح</span>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-[#0070CD] text-sm hidden lg:block flex-shrink-0" />
            <span className="text-sm font-black text-[#0F172A]">{formatAvailableSlot(nextAvailableSlot).replace('أقرب موعد:', '')}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 p-2 px-3">
          <span className="text-[10px] text-[#64748B] font-bold">سعر الكشف</span>
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-[#0070CD] text-sm hidden lg:block flex-shrink-0" />
            <span className="text-sm font-black text-[#0070CD]">{regularConsultationFee || 0} <span className="text-[10px]">ج.م</span></span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Actions */}
      <div className="flex items-center gap-3 mt-auto">
        <button
          onClick={() => onViewProfile(id)}
          className="flex-1 px-4 py-3.5 bg-white hover:bg-slate-50 text-[#0F172A] hover:text-[#0070CD] border border-slate-200 hover:border-[#0070CD]/30 rounded-xl transition-all duration-300 font-black text-sm text-center active:scale-95 shadow-sm hover:shadow-md"
        >
          عرض الملف
        </button>
        <button
          onClick={() => onBook(doctor)}
          className="flex-1 px-4 py-3.5 bg-[#0070CD] hover:bg-[#005ba3] text-white rounded-xl transition-all duration-300 font-black text-sm text-center shadow-md hover:shadow-lg active:scale-95"
        >
          احجز موعد
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;

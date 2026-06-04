import React, { memo } from 'react';
import {
  FaUser, FaPhone, FaCalendarAlt, FaStethoscope,
  FaFileMedical, FaPrescriptionBottleAlt,
  FaCheckCircle, FaChevronLeft, FaStar, FaMapMarkerAlt
} from 'react-icons/fa';
import { formatDate } from '@/utils/helpers';

/**
 * PatientCard Component - Premium Design
 * Modern, airy, bento-style card using Nabd brand colors.
 */
const PatientCard = ({ patient, onMedicalRecordClick, onPrescriptionClick }) => {
  // Format last visit date
  const formatLastVisit = (date) => {
    if (!date) return 'غير محدد';
    try {
      return formatDate(date);
    } catch {
      return date;
    }
  };

  return (
    <article className="group relative bg-white rounded-[2rem] p-1.5 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-[#0070CD]/20 overflow-hidden flex flex-col h-full">
      
      {/* Top Banner / Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0070CD] to-[#005099] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

      <div className="bg-slate-50/50 rounded-[1.5rem] p-5 flex-1 flex flex-col relative z-10">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-5">
          {/* Avatar */}
          <div className="relative">
            {patient.profileImageUrl ? (
              <img
                src={patient.profileImageUrl}
                alt={patient.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#0070CD] text-2xl font-black ring-4 ring-white shadow-sm border border-slate-100">
                <FaUser className="text-[#0070CD] text-2xl" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
               <FaCheckCircle className="text-white text-[8px]" />
            </div>
          </div>

          {/* Patient Info */}
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-black text-slate-900 group-hover:text-[#0070CD] transition-colors leading-tight mb-1">
              {patient.fullName || 'غير محدد'}
            </h3>
            
            {patient.address && (
              <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                <FaMapMarkerAlt className="text-[#0070CD]/60 text-[10px]" />
                <span className="text-xs font-bold">{patient.address}</span>
              </div>
            )}

            {patient.rating && typeof patient.rating === 'number' && (
              <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <FaStar className="text-amber-500 text-[10px]" />
                <span className="text-xs font-bold text-amber-700">{patient.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white p-3 rounded-[1.25rem] border border-slate-100 flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-400">
              <FaStethoscope className="text-[10px]" />
              <span className="text-[9px] font-black uppercase tracking-wider">الجلسات</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#0070CD]">{patient.totalSessions || 0}</span>
              <span className="text-[10px] text-slate-500 font-bold">جلسة</span>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-[1.25rem] border border-slate-100 flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-400">
              <FaCalendarAlt className="text-[10px]" />
              <span className="text-[9px] font-black uppercase tracking-wider">آخر زيارة</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-slate-700 truncate pt-1">{formatLastVisit(patient.lastVisitDate)}</span>
            </div>
          </div>
        </div>

        {/* Contact Tag */}
        {patient.phoneNumber && (
          <div className="mb-5 flex justify-start">
            <div className="inline-flex items-center gap-2 bg-[#0070CD]/5 px-4 py-2 rounded-full border border-[#0070CD]/10">
               <FaPhone className="text-[#0070CD] text-[10px]" />
               <span className="text-[#0070CD] font-black text-xs tracking-wider direction-ltr">{patient.phoneNumber}</span>
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-3">
          <button
            onClick={() => onMedicalRecordClick?.(patient)}
            className="flex items-center justify-center gap-2 py-3 px-2 bg-white hover:bg-[#0070CD] hover:text-white text-slate-700 rounded-xl transition-all shadow-sm border border-slate-100 group/btn"
          >
            <FaFileMedical className="text-sm text-[#0070CD] group-hover/btn:text-white transition-colors" />
            <span className="text-xs font-black transition-colors">السجل الطبي</span>
          </button>

          <button
            onClick={() => onPrescriptionClick?.(patient)}
            className="flex items-center justify-center gap-2 py-3 px-2 bg-white hover:bg-[#0070CD] hover:text-white text-slate-700 rounded-xl transition-all shadow-sm border border-slate-100 group/btn"
          >
            <FaPrescriptionBottleAlt className="text-sm text-[#0070CD] group-hover/btn:text-white transition-colors" />
            <span className="text-xs font-black transition-colors">الروشتات</span>
          </button>
        </div>

      </div>
    </article>
  );
};

export default memo(PatientCard);

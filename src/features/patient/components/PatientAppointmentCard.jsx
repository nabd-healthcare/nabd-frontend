import React, { useState } from 'react';
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaBan,
  FaEye,
  FaRegCalendarTimes,
  FaRegEdit,
  FaStethoscope
} from 'react-icons/fa';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import { formatDate } from '@/utils/helpers';
import { getSpecialtyById } from '@/utils/constants';

/**
 * Patient Appointment Card Component
 * Premium Modern Redesign
 */
const PatientAppointmentCard = ({ appointment, onCancel, onReschedule }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Status mapping
  const getStatusInfo = (status) => {
    const statusMap = {
      0: { label: 'مجدول (قيد الانتظار)', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: FaClock },
      1: { label: 'مؤكد', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: FaCheckCircle },
      2: { label: 'ملغي (طبيب)', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: FaTimesCircle },
      3: { label: 'جاري الان', color: 'bg-[#0070CD]/10 text-[#0070CD] border-[#0070CD]/20', icon: FaSpinner },
      4: { label: 'مكتمل', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: FaCheckCircle },
      5: { label: 'لم يحضر', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: FaBan },
      6: { label: 'ملغي (مريض)', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: FaTimesCircle },
    };
    return statusMap[status] || statusMap[0];
  };

  const statusInfo = getStatusInfo(appointment.status);
  const StatusIcon = statusInfo.icon;

  // Format Time (12-hour)
  const formatTime = (isoDateTime) => {
    if (!isoDateTime) return '--:--';
    try {
      const date = new Date(isoDateTime);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? 'م' : 'ص';
      const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      return '--:--';
    }
  };

  // Conditions
  const canCancel = appointment.status === 0 || appointment.status === 1;
  const isPast = appointment.status === 4 || appointment.status === 2 || appointment.status === 5 || appointment.status === 6;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200/80 hover:border-[#0070CD]/40 hover:shadow-[0_12px_40px_rgba(0,112,205,0.12)] transition-all duration-500 overflow-hidden group flex flex-col h-full relative group hover:-translate-y-1.5">

      {/* Decorative Blur Background on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0070CD]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"></div>

      {/* Top Main Dynamic Bar */}
      <div className={`absolute top-0 inset-x-0 h-1.5 transition-colors ${appointment.status === 1 ? 'bg-[#10B981]' :
          appointment.status === 4 ? 'bg-[#10B981]' :
            appointment.status === 2 || appointment.status === 6 ? 'bg-[#E11D48]' :
              appointment.status === 3 ? 'bg-[#0070CD]' :
                'bg-[#F59E0B]'
        }`} />

      <div className="p-7 flex-1 flex flex-col z-10 relative">

        {/* HEADER SECTION: Badges & Tags */}
        <div className="flex items-center justify-between mb-6">

          {/* Date Ribbon */}
          <div className="flex flex-col">
            <span className="text-[11px] font-black tracking-widest uppercase text-slate-400 mb-1">تاريخ الموعد</span>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-[#0070CD]" />
              <span className="font-black text-[#0F172A]">{appointment.scheduledStartTime ? formatDate(appointment.scheduledStartTime) : 'غير محدد'}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-black shadow-sm border ${statusInfo.color}`}>
            <StatusIcon className={`text-sm ${appointment.status === 3 ? 'animate-spin' : ''}`} />
            <span>{statusInfo.label}</span>
          </div>
        </div>

        <div className="bg-slate-100/50 h-px w-full mb-6 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-3.5 bg-white px-3 text-slate-300">
            <FaStethoscope />
          </div>
        </div>

        {/* DOCTOR & PROFILE SECTION */}
        <div className="flex items-center gap-5 flex-1 mb-6">
          <div className="relative group-hover:scale-105 transition-transform duration-300">
            <div className="w-[4.5rem] h-[4.5rem] rounded-2xl bg-[#0070CD]/5 flex items-center justify-center text-[#0070CD] border-2 border-white shadow-[0_4px_12px_rgba(0,112,205,0.15)] ring-2 ring-[#0070CD]/10 flex-shrink-0 text-3xl font-black relative overflow-hidden z-10">
              {appointment.doctor?.profileImageUrl || appointment.doctorProfileImageUrl ? (
                <img
                  src={appointment.doctor?.profileImageUrl || appointment.doctorProfileImageUrl}
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserMd />
              )}
            </div>
            {/* Ambient shadow behind avatar */}
            <div className="absolute inset-0 bg-[#0070CD]/20 rounded-2xl blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-[#0F172A] truncate leading-tight transition-colors group-hover:text-[#0070CD]">
              {appointment.doctor?.fullName || appointment.doctorName || 'طبيب غير محدد'}
            </h3>
            <p className="text-sm text-[#64748B] font-bold truncate mt-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0070CD] opacity-70"></span>
              {appointment.doctor?.medicalSpecialtyName ||
                appointment.medicalSpecialtyName ||
                (appointment.doctor?.medicalSpecialty && getSpecialtyById(appointment.doctor.medicalSpecialty)?.name) ||
                'تخصص غير محدد'}
            </p>
          </div>
        </div>

        {/* APPOINTMENT SPECIFICS (Type, Cost, Time) */}
        <div className="grid grid-cols-3 gap-3 mb-8 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">

          <div className="col-span-1 flex flex-col justify-center border-l border-slate-200 pl-3">
            <span className="text-[10px] text-[#64748B] font-bold mb-1 line-clamp-1">وقت الجلسة</span>
            <div className="flex items-center gap-1.5 text-[#0F172A] font-black text-sm">
              <FaClock className="text-[#0070CD] shrink-0" />
              <span className="truncate">{formatTime(appointment.scheduledStartTime)}</span>
            </div>
          </div>

          <div className="col-span-1 flex flex-col justify-center border-l border-slate-200 pl-3 pr-3">
            <span className="text-[10px] text-[#64748B] font-bold mb-1 line-clamp-1">نوع الكشف</span>
            <span className="text-sm font-black text-[#0F172A] truncate">
              {appointment.consultationType === 1 ? 'كشف جديد' : 'متابعة'}
            </span>
          </div>

          <div className="col-span-1 flex flex-col justify-center pr-3">
            <span className="text-[10px] text-[#64748B] font-bold mb-1 line-clamp-1">التكلفة</span>
            {appointment.consultationFee ? (
              <span className="text-base font-black text-[#0070CD] truncate">
                {appointment.consultationFee} <span className="text-[10px] font-bold text-[#64748B]">ج.م</span>
              </span>
            ) : (
              <span className="text-sm font-black text-slate-400">---</span>
            )}
          </div>
        </div>

        {/* CANCELLATION INFO BAR */}
        {(appointment.status === 2 || appointment.status === 6) && appointment.cancellationReason && (
          <div className="w-full px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl mb-6 flex items-start gap-3">
            <FaTimesCircle className="text-rose-500 mt-1 flex-shrink-0" />
            <p className="text-xs text-rose-700 font-bold leading-relaxed">
              <span className="font-black">سبب الإلغاء:</span> {appointment.cancellationReason}
            </p>
          </div>
        )}

        {/* PRIMARY ACTION BUTTONS */}
        <div className="mt-auto flex flex-col gap-3">
          {canCancel && !isPast && (
            <div className="flex gap-3">
              <button
                onClick={() => onReschedule?.(appointment)}
                className="flex-1 px-4 py-3.5 bg-[#0070CD]/5 text-[#0070CD] rounded-2xl font-black text-sm hover:bg-[#0070CD] hover:text-white hover:shadow-[0_8px_20px_rgba(0,112,205,0.3)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 group/btn"
              >
                <FaRegEdit className="text-lg group-hover/btn:-rotate-12 transition-transform" />
                <span>إعادة جدولة</span>
              </button>

              <button
                onClick={() => onCancel?.(appointment)}
                className="w-[40%] px-4 py-3.5 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm hover:bg-rose-500 hover:text-white hover:shadow-[0_8px_20px_rgba(244,63,94,0.3)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
              >
                <FaRegCalendarTimes className="text-lg" />
                <span>إلغاء</span>
              </button>
            </div>
          )}

          {/* VIEW DETAILS FOR COMPLETED */}
          {appointment.status === 4 && (
            <button
              onClick={() => setShowDetailsModal(true)}
              className="w-full px-4 py-3.5 bg-[#0070CD] text-white rounded-2xl font-black text-sm hover:bg-[#005ba3] hover:shadow-[0_8px_25px_rgba(0,112,205,0.35)] transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <FaEye className="text-lg" />
              <span>عرض تفاصيل الجلسة والروشتة</span>
            </button>
          )}
        </div>

        {/* Details Modal */}
        <AppointmentDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          appointment={appointment}
        />
      </div>
    </div>
  );
};

export default PatientAppointmentCard;

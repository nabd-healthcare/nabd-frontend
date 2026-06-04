import React from 'react';
import {
  FaClock, FaPlay, FaPhone, FaCalendarCheck,
  FaStethoscope, FaMapMarkerAlt, FaCheckCircle, FaSpinner, FaDoorOpen,
  FaCalendarPlus, FaBan
} from 'react-icons/fa';
import { formatDate } from '@/utils/helpers';

/**
 * AppointmentCard Component - Matching New Visual Identity
 * Clean, elegant card for displaying appointment information
 */
const AppointmentCard = ({ appointment, onStartAppointment, loading = false }) => {
  // Get patient initials
  const getInitials = () => {
    if (!appointment.patientName) return '؟';
    const names = appointment.patientName.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return names[0].charAt(0);
  };

  // Get status styling with new colors
  const getStatusStyle = () => {
    // Completed session
    if (appointment.apiStatus === 4) {
      return {
        bg: 'bg-[#1C8B8F]',
        text: 'text-white',
        icon: appointment.status === 'كشف عام' ? FaStethoscope : FaCalendarCheck,
      };
    }

    // InProgress session
    if (appointment.apiStatus === 3) {
      return {
        bg: 'bg-[#1C8B8F]',
        text: 'text-white',
        icon: appointment.status === 'كشف عام' ? FaStethoscope : FaCalendarCheck,
      };
    }

    // Pending/Confirmed
    return {
      bg: 'bg-slate-500',
      text: 'text-white',
      icon: appointment.status === 'كشف عام' ? FaStethoscope : FaCalendarCheck,
    };
  };

  const statusStyle = getStatusStyle();
  const StatusIcon = statusStyle.icon;

  return (
    <article className={`group relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 overflow-hidden ${appointment.isCancelled
      ? 'bg-red-50 border-red-300'
      : appointment.apiStatus === 4 || appointment.apiStatus === 3  // Completed or InProgress
        ? 'bg-white border-[#1C8B8F]/30'
        : 'bg-white border-slate-200'
      }`}>
      {/* Left accent bar */}
      <div className={`absolute right-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${appointment.isCancelled
        ? 'bg-red-500'
        : appointment.apiStatus === 4 || appointment.apiStatus === 3
          ? 'bg-[#1C8B8F]'
          : 'bg-slate-400'
        }`}></div>

      <div className="relative p-5">
        {/* Header - Time & Status */}
        <div className="flex items-center justify-between mb-4 gap-2">
          {/* Status Badge - Right */}
          {appointment.isCancelled ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-red-600">
              <FaBan className="text-sm" />
              <span className="text-xs font-bold whitespace-nowrap">ملغي</span>
            </div>
          ) : (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border flex-1 justify-center max-w-[50%] ${appointment.apiStatus === 4 || appointment.apiStatus === 3
                ? 'bg-[#1C8B8F] border-[#1C8B8F] text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600'
              }`}>
              <StatusIcon className={`text-sm ${appointment.apiStatus === 4 || appointment.apiStatus === 3 ? 'text-white' : 'text-slate-500'
                }`} />
              <span className="text-xs font-bold whitespace-nowrap truncate">{appointment.status}</span>
            </div>
          )}

          {/* Time Badge - Left */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border flex-1 justify-center max-w-[50%] ${appointment.isCancelled
              ? 'bg-red-50 border-red-100'
              : appointment.apiStatus === 4 || appointment.apiStatus === 3
                ? 'bg-[#1C8B8F]/10 border-[#1C8B8F]/30'
                : 'bg-slate-50 border-slate-200'
            }`}>
            <FaClock className={`text-sm ${appointment.isCancelled
                ? 'text-red-500'
                : appointment.apiStatus === 4 || appointment.apiStatus === 3
                  ? 'text-[#1C8B8F]'
                  : 'text-slate-500'
              }`} />
            <div className="flex items-center gap-1 leading-none">
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">الموعد:</span>
              <span className={`text-sm font-bold whitespace-nowrap ${appointment.isCancelled ? 'text-red-600' : 'text-slate-800'
                }`}>{appointment.time}</span>
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold ring-2 transition-all duration-300 ${appointment.isCancelled
              ? 'bg-gradient-to-br from-red-500 to-red-600 ring-red-200 group-hover:ring-red-400'
              : appointment.apiStatus === 4 || appointment.apiStatus === 3
                ? 'bg-gradient-to-br from-[#1C8B8F] to-[#14666A] ring-[#1C8B8F]/30 group-hover:ring-[#1C8B8F]'
                : 'bg-gradient-to-br from-slate-400 to-slate-500 ring-slate-200 group-hover:ring-slate-400'
              }`}>
              {getInitials()}
            </div>
            {/* Status indicator */}
            {!appointment.isCancelled && (
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${appointment.apiStatus === 4
                ? 'bg-emerald-500'
                : appointment.apiStatus === 3
                  ? 'bg-[#1C8B8F] animate-pulse'
                  : 'bg-slate-400'
                }`}>
                <FaCheckCircle className="text-white text-[8px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            )}
          </div>

          {/* Patient Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold truncate mb-1 text-slate-900 group-hover:text-[#1C8B8F] transition-colors">
              {appointment.patientName}
            </h3>

            {/* Phone */}
            {appointment.phoneNumber && (
              <div className="flex items-center gap-1.5 mb-2">
                <FaPhone className="text-[9px] text-slate-400" />
                <span className="text-xs font-medium direction-ltr text-slate-600">{appointment.phoneNumber}</span>
              </div>
            )}

            {/* Duration & Appointment Date */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Appointment Date */}
              {appointment.appointmentDate && (
                <div className="flex items-center gap-1 px-2 py-1 rounded border-2 bg-slate-50 border-slate-200">
                  <FaCalendarPlus className="text-[9px] text-slate-500" />
                  <span className="text-[11px] font-semibold text-slate-700">{formatDate(appointment.appointmentDate, 'DD/MM/YYYY')}</span>
                </div>
              )}

              <div className={`flex items-center gap-1 px-2 py-1 rounded border-2 ${appointment.isCancelled
                ? 'bg-red-50 border-red-200'
                : 'bg-slate-50 border-slate-200'
                }`}>
                <FaClock className={`text-[9px] ${appointment.isCancelled ? 'text-red-500' : 'text-slate-500'
                  }`} />
                <span className="text-[11px] font-semibold text-slate-700">{appointment.duration} دقيقة</span>
              </div>

              {/* Session Number if available */}
              {appointment.sessionNumber && (
                <div className="flex items-center gap-1 bg-[#1C8B8F]/10 px-2 py-1 rounded border-2 border-[#1C8B8F]/30">
                  <span className="text-[11px] font-semibold text-[#1C8B8F]">جلسة #{appointment.sessionNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button - Full Width */}
        <button
          onClick={() => onStartAppointment?.(appointment)}
          disabled={loading || appointment.isCancelled}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm shadow-lg hover:shadow-xl group/btn ${loading
            ? 'bg-slate-400 cursor-not-allowed'
            : appointment.isCancelled
              ? 'bg-red-400 cursor-not-allowed opacity-60'
              : appointment.apiStatus === 4 || appointment.apiStatus === 3
                ? 'bg-[#1C8B8F] hover:bg-[#156f72]'
                : 'bg-slate-500 hover:bg-slate-600'
            } text-white`}
        >
          <div className="w-7 h-7 bg-white/20 rounded-md flex items-center justify-center">
            {loading ? (
              <FaSpinner className="text-white text-xs animate-spin" />
            ) : (
              <FaDoorOpen className="text-white text-xs" />
            )}
          </div>
          <span>
            {loading
              ? 'جاري التحميل...'
              : appointment.isCancelled
                ? 'موعد ملغي'
                : appointment.apiStatus === 4
                  ? 'الدخول للجلسة'
                  : appointment.apiStatus === 3
                    ? 'متابعة الجلسة'
                    : 'بدء الجلسة'
            }
          </span>
          {!loading && (
            <div className="mr-auto opacity-0 group-hover/btn:opacity-100 transition-opacity">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          )}
        </button>
      </div>
    </article>
  );
};

export default AppointmentCard;

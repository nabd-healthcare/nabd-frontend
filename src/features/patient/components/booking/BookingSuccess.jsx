import React, { useState } from 'react';
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaDownload,
  FaWhatsapp,
  FaExclamationTriangle,
} from 'react-icons/fa';
import PaymentModal from '../payment/PaymentModal';
import { usePaymentStore } from '../../stores/paymentStore';

/**
 * BookingSuccess - Step 6: Booking confirmed and paid successfully
 */
const BookingSuccess = ({ bookingResult, onClose, onDownload }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { openPaymentModal } = usePaymentStore();

  // If we have a booking result, check if payment is required. Otherwise assume paid.
  const isPaymentRequired = bookingResult 
    ? (!bookingResult.paymentStatus || bookingResult.paymentStatus !== 2)
    : false;
  
  if (bookingResult) {
    console.log('💳 [BookingSuccess] Payment check:', {
      bookingId: bookingResult.id,
      paymentStatus: bookingResult.paymentStatus,
      isPaymentRequired,
      totalAmount: bookingResult.totalAmount
    });
  }

  const handlePayNow = () => {
    if (!bookingResult) return;
    openPaymentModal(
      'appointment',
      bookingResult.id,
      bookingResult.totalAmount
    );
    setIsPaymentModalOpen(true);
  };

  // Format date to Arabic
  const formatDateArabic = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${dayNames[date.getDay()]}، ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Format time from 24h to 12h
  const formatTime12h = (time24) => {
    if (!time24) return '--:--';
    try {
      const parts = time24.split(':');
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      
      if (isNaN(hours) || isNaN(minutes)) return '--:--';
      
      const period = hours >= 12 ? 'م' : 'ص';
      const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      return '--:--';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Animation Header */}
      <div className="text-center">
        <div className="relative inline-block mt-8 mb-6">
          {/* Animated Circles */}
          <div className="absolute inset-0 animate-ping">
            <div className="w-28 h-28 rounded-full bg-[#0070CD] opacity-20 -m-2"></div>
          </div>
          <div className="absolute inset-0 animate-pulse">
            <div className="w-28 h-28 rounded-full bg-[#0070CD] opacity-30 -m-2"></div>
          </div>
          
          {/* Main Icon */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-[#0070CD] to-blue-400 shadow-[0_10px_30px_rgba(0,112,205,0.4)]">
            <FaCheckCircle className="text-white text-5xl" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-[#0F172A] mt-6 mb-3">
          تم تأكيد الدفع بنجاح!
        </h2>
        <p className="text-[#0070CD] font-bold text-lg mb-2">
          سيتم التواصل معك من قبل الدكتور قريباً
        </p>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          تم استلام الدفعة وتأكيد الموعد بشكل نهائي. يمكنك متابعة حالة الحجز من خلال لوحة التحكم الخاصة بك.
        </p>
      </div>

      {/* Booking Details Card - Only show if we have actual data */}
      {bookingResult && (
        <>
          <div className="bg-white border-2 border-[#0070CD]/20 rounded-2xl overflow-hidden shadow-lg shadow-[#0070CD]/10">
            {/* Header */}
            <div className="bg-[#0070CD] p-4 text-white text-center">
              <p className="text-sm text-white/80">رقم الحجز</p>
              <p className="text-2xl font-bold mt-1" dir="ltr">
                #{bookingResult.id?.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <FaCalendarAlt className="text-sm" />
                    <span className="text-xs font-semibold">التاريخ</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {formatDateArabic(bookingResult.appointmentDate)}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <FaClock className="text-sm" />
                    <span className="text-xs font-semibold">الوقت</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {formatTime12h(bookingResult.appointmentTime)}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="bg-[#0070CD]/5 border border-[#0070CD]/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0070CD]/10 rounded-lg p-2">
                      <FaCheckCircle className="text-[#0070CD]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#0070CD] font-semibold">حالة الحجز</p>
                      <p className="text-sm font-bold text-[#005ba3]">
                        {bookingResult.status === 'Confirmed' ? 'مؤكد' : bookingResult.status}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#0070CD] text-white px-3 py-1 rounded-full text-xs font-bold">
                    نشط
                  </div>
                </div>
              </div>

              {/* Consultation Type */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-2">نوع الاستشارة</p>
                <p className="text-sm font-bold text-slate-800">
                  {bookingResult.consultationType === 0 ? 'كشف جديد' : 'كشف متابعة'}
                </p>
              </div>

              {/* Payment Status */}
              {isPaymentRequired ? (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 rounded-lg p-2">
                        <FaExclamationTriangle className="text-amber-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs text-amber-700 font-semibold">حالة الدفع</p>
                        <p className="text-lg font-bold text-amber-900">
                          في انتظار الدفع
                        </p>
                      </div>
                    </div>
                    <div className="bg-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                      {bookingResult.totalAmount} جنيه
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 rounded-lg p-2">
                        <FaCheckCircle className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs text-green-700 font-semibold">حالة الدفع</p>
                        <p className="text-lg font-bold text-green-900">
                          تم الدفع بنجاح
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                      {bookingResult.totalAmount} جنيه
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Notice */}
          {isPaymentRequired ? (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 rounded-lg p-2 mt-0.5">
                  <FaExclamationTriangle className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-amber-800 font-bold mb-1">
                    ⚠️ تنبيه هام
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    يرجى إتمام الدفع خلال 30 دقيقة للحفاظ على الموعد. في حالة عدم الدفع، سيتم إلغاء الحجز تلقائياً.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-lg p-2 mt-0.5">
                  <FaCalendarAlt className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-800 font-bold mb-1">
                    📌 ملاحظات هامة
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    يرجى الحضور قبل الموعد بـ 15 دقيقة. في حالة التأخير، يمكنك إلغاء أو تعديل الموعد قبل 24 ساعة على الأقل.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Action Buttons */}
      {!bookingResult ? (
        <button
          onClick={onClose}
          className="
            w-full py-5 rounded-2xl bg-[#0070CD] 
            text-white text-lg font-black hover:shadow-2xl hover:scale-105
            transition-all duration-200
            flex items-center justify-center gap-3
          "
        >
          <FaCheckCircle className="text-2xl" />
          <span>تم - إغلاق</span>
        </button>
      ) : isPaymentRequired ? (
        <div className="space-y-3">
          <button
            onClick={handlePayNow}
            className="
              w-full py-5 rounded-2xl bg-[#0070CD] 
              text-white text-lg font-black hover:shadow-2xl hover:scale-105
              transition-all duration-200
              flex items-center justify-center gap-3
            "
          >
            <FaCreditCard className="text-2xl" />
            <span>إتمام الدفع الآن</span>
          </button>
          <button
            onClick={onClose}
            className="
              w-full py-4 rounded-xl border-2 border-slate-300 
              text-slate-700 text-base font-bold hover:bg-slate-50
              transition-all duration-200
            "
          >
            الدفع لاحقاً
          </button>
        </div>
      ) : (
        <button
          onClick={onClose}
          className="
            w-full py-5 rounded-2xl bg-[#0070CD] 
            text-white text-lg font-black hover:shadow-2xl hover:scale-105
            transition-all duration-200
            flex items-center justify-center gap-3
          "
        >
          <FaCheckCircle className="text-2xl" />
          <span>تم - إغلاق</span>
        </button>
      )}



      {/* Payment Modal */}
      {bookingResult && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          orderType="appointment"
          orderId={bookingResult.id}
          amount={bookingResult.totalAmount}
          orderDetails={{
            title: 'موعد استشارة طبية',
            items: [
              {
                label: 'نوع الاستشارة',
                value: bookingResult.consultationType === 0 ? 'كشف جديد' : 'كشف متابعة',
              },
              {
                label: 'التاريخ',
                value: formatDateArabic(bookingResult.appointmentDate),
              },
              {
                label: 'الوقت',
                value: formatTime12h(bookingResult.appointmentTime),
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default BookingSuccess;

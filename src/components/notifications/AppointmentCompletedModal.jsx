import React, { useState, useEffect, Suspense } from 'react';
import { FaCheckCircle, FaTimes, FaStar, FaCalendarAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import notificationsService from '@/api/services/notifications.service';
import { formatDateTime, getRelativeTime } from '@/utils/dateFormatter';

// Lazy load RatingModal to avoid potential circular dependencies or blocking main thread
const RatingModal = React.lazy(() => import('./RatingModal'));

/**
 * Modal يظهر عند انتهاء الجلسة
 * يعرض تفاصيل الجلسة مع خيار التقييم
 */
const AppointmentCompletedModal = ({ notification, onClose, onRate }) => {
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Helper function to safely format appointment date
  const getFormattedAppointmentDate = () => {
    // Debug: Log available date fields
    console.log('🔍 [Modal] Available date fields:', {
      appointmentDate: appointmentDetails?.appointmentDate,
      createdAt: appointmentDetails?.createdAt,
      updatedAt: appointmentDetails?.updatedAt,
      notificationTimestamp: notification?.timestamp,
      appointmentDetails: appointmentDetails
    });

    // Try different date sources in order of preference
    const dateOptions = [
      appointmentDetails?.appointmentDate,
      appointmentDetails?.createdAt,
      appointmentDetails?.updatedAt,
      notification?.timestamp,
      new Date().toISOString() // Fallback to current date
    ];

    for (const dateStr of dateOptions) {
      if (dateStr) {
        try {
          console.log('🔍 [Modal] Trying to format date:', dateStr);
          const formatted = formatDateTime(dateStr);
          console.log('✅ [Modal] Formatted result:', formatted);
          if (formatted && formatted !== '') {
            return formatted;
          }
        } catch (error) {
          console.warn('❌ [Modal] Failed to format date:', dateStr, error);
          continue;
        }
      }
    }

    console.warn('⚠️ [Modal] No valid date found, using fallback');
    return 'غير محدد';
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await notificationsService.getAppointmentDetails(
          notification.data.relatedEntityId
        );
        setAppointmentDetails(details);
      } catch (err) {
        console.error('❌ Failed to fetch appointment details:', err);
        setError('فشل تحميل تفاصيل الجلسة');
      } finally {
        setLoading(false);
      }
    };

    if (notification?.data?.relatedEntityId) {
      fetchDetails();
    }
  }, [notification]);

  const handleRate = () => {
    // Open rating modal instead of calling onRate directly
    setIsRatingModalOpen(true);
  };

  const handleRatingSuccess = () => {
    // Close both modals after successful rating
    setIsRatingModalOpen(false);
    onClose();

    // Call onRate callback if provided
    if (onRate && appointmentDetails) {
      onRate(appointmentDetails);
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Disable background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const displayDoctorName = appointmentDetails?.doctor?.fullName || appointmentDetails?.doctor?.user?.fullName || appointmentDetails?.doctorName;

  return (
    <>
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#0070CD] p-6 text-white relative">
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <FaCheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black">انتهت جلستك</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0070CD]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#0070CD] text-white rounded-lg hover:bg-[#005ba6] transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : (
              <>
                {/* Message */}
                <p className="text-slate-700 text-center mb-6">
                  {notification?.message || 'تم إنهاء جلستك بنجاح'}
                </p>

                {/* Appointment Details */}
                {appointmentDetails && (
                  <div className="space-y-4 mb-6">
                    {/* Doctor Name */}
                    {displayDoctorName && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-10 h-10 bg-[#0070CD]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#0070CD] font-bold">د</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">الطبيب</p>
                          <p className="font-semibold text-slate-800">
                            {displayDoctorName}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <FaCalendarAlt className="text-[#0070CD]" />
                        <div>
                          <p className="text-xs text-slate-500">التاريخ</p>
                          <p className="font-semibold text-slate-800 text-sm">
                            {getFormattedAppointmentDate()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <FaClock className="text-[#0070CD]" />
                        <div>
                          <p className="text-xs text-slate-500">المدة</p>
                          <p className="font-semibold text-slate-800 text-sm">
                            {appointmentDetails.sessionDurationMinutes
                              ? `${appointmentDetails.sessionDurationMinutes} دقيقة`
                              : appointmentDetails.duration
                                ? `${appointmentDetails.duration} دقيقة`
                                : '30 دقيقة'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cost */}
                    {appointmentDetails.consultationFee && (
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <FaMoneyBillWave className="text-[#0070CD]" />
                        <div>
                          <p className="text-xs text-slate-500">التكلفة</p>
                          <p className="font-semibold text-slate-800">
                            {appointmentDetails.consultationFee} جنيه
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Time ago (if old notification) */}
                    {notification?.timestamp && (
                      <div className="text-center">
                        <p className="text-l text-amber-600 bg-amber-50 px-3 py-2 rounded-lg inline-block">
                          ⚠️ {getRelativeTime(notification.timestamp)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleRate}
                    className="flex-1 bg-[#0070CD] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <FaStar className="w-4 h-4" />
                    تقييم الجلسة
                  </button>

                  <button
                    onClick={handleClose}
                    className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <Suspense fallback={null}>
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          appointmentId={notification?.data?.relatedEntityId}
          doctorName={displayDoctorName || 'الطبيب'}
          onSubmitSuccess={handleRatingSuccess}
        />
      </Suspense>
    </>
  );
};

export default AppointmentCompletedModal;

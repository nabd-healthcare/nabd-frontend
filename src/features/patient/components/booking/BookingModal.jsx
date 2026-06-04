import React, { useEffect } from 'react';
import {
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
  FaStethoscope,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaCreditCard,
  FaCheckDouble
} from 'react-icons/fa';
import { useBooking } from '../../hooks/useBooking';
import ServiceSelection from './ServiceSelection';
import DatePicker from './DatePicker';
import TimeSlotPicker from './TimeSlotPicker';
import BookingSummary from './BookingSummary';
import PaymentStep from './PaymentStep';
import BookingSuccess from './BookingSuccess';

/**
 * BookingModal - Multi-step booking flow
 * Steps: 1-Service → 2-Date → 3-Time → 4-Summary → 5-Payment → 6-Success
 */
const BookingModal = ({ isOpen, onClose, doctor }) => {
  const {
    // State
    currentStep,
    services,
    selectedService,
    selectedServiceDetails,
    selectedDate,
    selectedTime,
    weeklySchedule,
    exceptionalDates,
    availableSlots,
    loading,
    error,
    bookingResult,

    // Actions
    initializeBooking,
    fetchDoctorAvailability,
    selectService,
    selectDate,
    selectTime,
    confirmBooking,
    goToStep,
    resetBooking,
    clearError,
    startAutoRefresh,
    stopAutoRefresh,
  } = useBooking();

  // Initialize booking when modal opens
  useEffect(() => {
    if (isOpen && doctor) {
      initializeBooking(
        doctor.id,
        doctor.fullName,
        doctor.medicalSpecialtyName,
        doctor.profileImageUrl
      );
      fetchDoctorAvailability(doctor.id);
    }
  }, [isOpen, doctor]);

  // Start auto-refresh when on time selection step
  useEffect(() => {
    if (isOpen && currentStep === 3 && selectedDate) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }

    return () => stopAutoRefresh();
  }, [isOpen, currentStep, selectedDate]);

  // Close handler
  const handleClose = () => {
    stopAutoRefresh();
    resetBooking();
    onClose();
  };

  // Handle payment completion
  const handlePaymentComplete = (paymentData) => {
    // Store payment info and proceed to success
    console.log('Payment completed:', paymentData);
    goToStep(6);
  };

  // Download booking (placeholder)
  const handleDownload = () => {
    alert('سيتم تحميل تفاصيل الحجز قريباً...');
  };

  if (!isOpen) return null;

  // Step configuration
  const steps = [
    { number: 1, title: 'نوع الكشف', icon: <FaStethoscope /> },
    { number: 2, title: 'التاريخ', icon: <FaCalendarAlt /> },
    { number: 3, title: 'الوقت', icon: <FaClock /> },
    { number: 4, title: 'المراجعة', icon: <FaCheckCircle /> },
    { number: 5, title: 'الدفع', icon: <FaCreditCard /> },
    { number: 6, title: 'تاكيد', icon: <FaCheckDouble /> },
  ];

  // Can go back
  const canGoBack = currentStep > 1 && currentStep < 6;

  // Go back handler
  const handleGoBack = () => {
    if (currentStep === 2) {
      goToStep(1);
    } else if (currentStep === 3) {
      goToStep(2);
    } else if (currentStep === 4) {
      goToStep(3);
    } else if (currentStep === 5) {
      goToStep(4);
    }
  };

  // Can go forward
  const canGoForward =
    (currentStep === 1 && selectedService) ||
    (currentStep === 2 && selectedDate) ||
    (currentStep === 3 && selectedTime);

  // Go forward handler
  const handleGoForward = () => {
    if (currentStep === 1 && selectedService) {
      // Already handled by selectService
    } else if (currentStep === 2 && selectedDate) {
      // Already handled by selectDate
    } else if (currentStep === 3 && selectedTime) {
      goToStep(4);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0F172A]/70 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-4xl max-h-[95vh] bg-[#F8FAFC] rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="bg-white p-6 md:p-8 border-b border-slate-200 flex-shrink-0 z-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">حجز موعد طبي</h2>
              <p className="text-sm font-bold text-slate-500 mt-1">أكمل الخطوات التالية لتأكيد حجزك بنجاح</p>
            </div>
            <button
              onClick={handleClose}
              className="w-12 h-12 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-red-500 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                {/* Step Circle */}
                <div className="flex flex-col items-center gap-3 relative z-10 w-16">
                  <div
                    className={`
                      w-14 h-14 rounded-[1.25rem] flex items-center justify-center
                      transition-all duration-300 text-xl shadow-sm border
                      ${currentStep === step.number
                        ? 'bg-[#0070CD] text-white border-[#0070CD] shadow-[0_8px_20px_rgba(0,112,205,0.3)] scale-110 font-black'
                        : currentStep > step.number
                          ? 'bg-[#0070CD]/10 text-[#0070CD] border-[#0070CD]/20 font-black'
                          : 'bg-white text-slate-300 border-slate-200 font-bold'
                      }
                    `}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`
                      text-[10px] uppercase tracking-wider font-black transition-all duration-300
                      ${currentStep === step.number ? 'text-[#0070CD]' : currentStep > step.number ? 'text-slate-600' : 'text-slate-400'}
                    `}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1.5 mx-1 md:mx-2 rounded-full transition-all duration-500 mb-6
                      ${currentStep > step.number
                        ? 'bg-[#0070CD]/30'
                        : 'bg-slate-100'
                      }
                    `}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-[#F8FAFC] custom-scrollbar">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-red-100 rounded-lg p-2">
                <FaTimes className="text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800 mb-1">حدث خطأ</p>
                <p className="text-xs text-red-700">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          )}

          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <ServiceSelection
              services={services}
              selectedService={selectedService}
              onSelectService={selectService}
            />
          )}

          {/* Step 2: Date Selection */}
          {currentStep === 2 && (
            <DatePicker
              weeklySchedule={weeklySchedule}
              exceptionalDates={exceptionalDates}
              selectedDate={selectedDate}
              onSelectDate={selectDate}
            />
          )}

          {/* Step 3: Time Selection */}
          {currentStep === 3 && (
            <TimeSlotPicker
              selectedDate={selectedDate}
              availableSlots={availableSlots}
              selectedTime={selectedTime}
              onSelectTime={selectTime}
              loading={loading}
            />
          )}

          {/* Step 4: Summary */}
          {currentStep === 4 && (
            <BookingSummary
              doctorName={doctor?.fullName}
              doctorSpecialty={doctor?.medicalSpecialtyName}
              doctorImage={doctor?.profileImageUrl}
              serviceDetails={selectedServiceDetails}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onEdit={goToStep}
              onConfirm={() => {
                confirmBooking();
                goToStep(5);
              }}
              loading={loading}
            />
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <PaymentStep
              doctorName={doctor?.fullName}
              serviceDetails={selectedServiceDetails}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onPaymentComplete={handlePaymentComplete}
              loading={loading}
            />
          )}

          {/* Step 6: Success */}
          {currentStep === 6 && (
            <BookingSuccess
              bookingResult={bookingResult}
              onClose={handleClose}
              onDownload={handleDownload}
            />
          )}
        </div>

        {/* Footer Navigation */}
        {currentStep < 4 && currentStep !== 5 && (
          <div className="border-t border-slate-200 p-6 md:px-8 bg-white flex-shrink-0 z-20">
            <div className="flex items-center justify-between gap-4">
              {/* Forward Button (Next -> goes left since RTL) */}
              <button
                onClick={handleGoForward}
                disabled={!canGoForward}
                className={`
                  flex items-center gap-3 px-8 py-4 rounded-xl font-black text-base
                  transition-all duration-200 shadow-sm
                  ${canGoForward
                    ? 'bg-[#0070CD] text-white hover:bg-[#005ba3] hover:shadow-[0_8px_20px_rgb(0,112,205,0.3)] active:scale-95 hover:-translate-y-0.5'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  }
                `}
              >
                <span>متابعة للخطوة القادمة</span>
                <FaChevronLeft className="text-sm" />
              </button>

              {/* Back Button */}
              <button
                onClick={handleGoBack}
                disabled={!canGoBack}
                className={`
                  flex items-center gap-2 px-6 py-4 rounded-xl font-bold
                  transition-all duration-200
                  ${canGoBack
                    ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
                    : 'opacity-0 pointer-events-none'
                  }
                `}
              >
                <FaChevronRight className="text-xs" />
                <span>الخطوة السابقة</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;

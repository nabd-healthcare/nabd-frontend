import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimesCircle, FaSpinner, FaHome, FaRedo } from 'react-icons/fa';
import { usePaymentStore } from '../stores/paymentStore';
import { getPaymentStatusName } from '@/api/services/payment.service';

/**
 * PaymentFailedPage - Callback page after failed payment
 */
const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  
  const { verifyPayment, currentPayment, loading, error } = usePaymentStore();
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (!paymentId) {
        console.error(' No payment_id in URL');
        return;
      }

      console.log(' Verifying payment:', paymentId);
      const result = await verifyPayment(paymentId);

      if (result.success) {
        console.log(' Payment verified:', result.data);
        setVerificationComplete(true);
      }
    };

    verifyPaymentStatus();
  }, [paymentId, verifyPayment]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-12 text-center max-w-md w-full border border-slate-100">
          <FaSpinner className="text-6xl text-[#0070CD] animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-black text-[#0F172A] mb-2">
            جاري التحقق من الدفع...
          </h2>
          <p className="text-[#64748B] font-bold">
            يرجى الانتظار قليلاً
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-12 text-center max-w-md w-full border border-slate-100">
          <div className="w-24 h-24 rounded-2xl bg-[#E11D48]/10 flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="text-5xl text-[#E11D48]" />
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] mb-4">
            فشل التحقق من الدفع
          </h2>
          <p className="text-[#64748B] font-bold mb-8">
            {error}
          </p>
          <button
            onClick={() => navigate('/patient/search')}
            className="w-full py-4 rounded-2xl bg-[#0070CD] text-white font-black hover:bg-[#005ba3] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <FaHome className="text-xl" />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>
    );
  }

  if (!verificationComplete || !currentPayment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-xl p-12 text-center max-w-md w-full border border-slate-100">
        {/* Failed Animation */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-[2rem] bg-[#E11D48] flex items-center justify-center">
            <FaTimesCircle className="text-white text-5xl" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-[#0F172A] mb-4">
          فشلت عملية الدفع
        </h2>
        <p className="text-[#64748B] font-bold text-lg mb-8">
          لم تتم عملية الدفع بنجاح. يرجى المحاولة مرة أخرى.
        </p>

        {/* Payment Details */}
        <div className="bg-[#E11D48]/5 rounded-2xl p-6 mb-8 text-right border border-[#E11D48]/20">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#64748B] font-bold">رقم العملية</span>
              <span className="font-black text-[#0F172A]" dir="ltr">
                #{currentPayment.id?.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#64748B] font-bold">المبلغ</span>
              <span className="font-black text-[#0F172A]">
                {currentPayment.amount} جنيه
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#64748B] font-bold">الحالة</span>
              <span className="font-black text-[#E11D48]">
                {getPaymentStatusName(currentPayment.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Possible Reasons */}
        <div className="bg-[#0070CD]/5 border border-[#0070CD]/20 rounded-2xl p-4 mb-8 text-right">
          <p className="text-sm text-[#0070CD] font-black mb-2">
            أسباب محتملة لفشل الدفع:
          </p>
          <ul className="text-xs text-[#64748B] font-bold space-y-1 mr-4 list-disc">
            <li>رصيد غير كافٍ في البطاقة</li>
            <li>بيانات البطاقة غير صحيحة</li>
            <li>انتهاء صلاحية البطاقة</li>
            <li>مشكلة في الاتصال بالإنترنت</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 rounded-2xl bg-[#0070CD] text-white font-black hover:bg-[#005ba3] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <FaRedo className="text-xl" />
            <span>إعادة المحاولة</span>
          </button>

          <button
            onClick={() => navigate('/patient/search')}
            className="w-full py-4 rounded-2xl border-2 border-slate-200 text-[#64748B] font-black hover:bg-[#F8FAFC] hover:border-[#0070CD]/30 hover:text-[#0070CD] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <FaHome className="text-xl" />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;

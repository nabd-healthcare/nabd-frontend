// src/features/auth/pages/VerifyEmailPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaShieldAlt, FaCheckCircle, FaRedo } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { verifyEmailSchema } from '../schemas/authSchemas';
import authService from '@/api/services/auth.service';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, loading, error, clearError } = useAuthStore();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    // Timer countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    clearError();

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      return;
    }

    clearError();
    try {
      await verifyEmail(email, otpCode);
      
      // Get user from store after verification
      const { user } = useAuthStore.getState();
      
      console.log('✅ Email verified successfully');
      console.log('User:', user);
      console.log('User Role:', user?.role);
      console.log('User Role Type:', typeof user?.role);
      console.log('🔍 CRITICAL - isEmailVerified:', user?.isEmailVerified);
      console.log('🔍 User Email:', user?.email);
      
      // Navigate based on user role (role is already lowercase from store)
      let redirectPath = '/doctor/dashboard'; // default
      
      const roleLower = user?.role?.toLowerCase();
      console.log('🔄 Role (lowercase):', roleLower);
      
      if (roleLower === 'patient') {
        redirectPath = '/patient/search';
      } else if (roleLower === 'doctor') {
        redirectPath = '/doctor/dashboard';
      } else if (roleLower === 'pharmacy') {
        redirectPath = '/pharmacy/dashboard';
      } else if (roleLower === 'laboratory' || roleLower === 'lab') {
        redirectPath = '/lab/dashboard';
      } else if (roleLower === 'verifier') {
        redirectPath = '/verifier/statistics';
      }
      
      console.log('🎯 Navigating to:', redirectPath);
      console.log('📍 Role used for navigation:', roleLower);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      // Error handled in store
      console.error('Verification error:', error);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    try {
      await authService.resendVerification(email);
      setResendSuccess(true);
      setTimer(300); // Reset timer
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend failed:', err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0070CD]/5 via-white to-[#0070CD]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0070CD]/10 rounded-2xl mb-4 shadow-inner">
            <FaShieldAlt className="text-2xl text-[#0070CD]" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            تأكيد حسابك
          </h1>
          <p className="text-slate-500 mb-2 font-medium">
            تم إرسال رمز التحقق إلى بريدك الإلكتروني
          </p>
          <p className="text-sm text-[#0070CD] font-bold bg-[#0070CD]/5 inline-block px-4 py-1.5 rounded-full">{email}</p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6 rounded-2xl">
            {error}
          </Alert>
        )}

        {resendSuccess && (
          <Alert variant="success" className="mb-6 rounded-2xl">
            تم إرسال رمز التحقق بنجاح
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4 text-center">
              أدخل رمز التحقق المكون من 6 أرقام
            </label>
            <div className="flex justify-center gap-2 sm:gap-3" dir="ltr" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/10 focus:outline-none transition-all duration-300"
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <div className="text-center bg-slate-50 py-3 rounded-2xl">
            {timer > 0 ? (
              <p className="text-sm font-medium text-slate-500">
                انتهاء صلاحية الرمز خلال:{' '}
                <span className="font-mono font-bold text-rose-500 text-lg ml-1">{formatTime(timer)}</span>
              </p>
            ) : (
              <p className="text-sm text-rose-500 font-bold">
                انتهت صلاحية الرمز. يرجى طلب رمز جديد
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full py-4 bg-gradient-to-r from-[#0070cd] to-[#1a8cff] hover:from-[#005099] hover:to-[#0070cd] text-white rounded-[1.5rem] text-lg font-black transition-all duration-300 shadow-xl shadow-blue-500/30 flex items-center justify-center transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'جاري التحقق...' : 'تأكيد الرمز'}
          </button>

          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading || timer > 240}
              className="text-sm font-bold text-slate-500 hover:text-[#0070CD] disabled:text-slate-300 disabled:cursor-not-allowed inline-flex items-center gap-2 transition-colors duration-300"
            >
              <FaRedo className={resendLoading ? 'animate-spin text-[#0070CD]' : ''} />
              {resendLoading ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
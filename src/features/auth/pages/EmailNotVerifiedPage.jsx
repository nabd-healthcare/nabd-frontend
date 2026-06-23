// src/features/auth/pages/EmailNotVerifiedPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaExclamationTriangle, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import authService from '@/api/services/auth.service';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const EmailNotVerifiedPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // Redirect to login if no email
  React.useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleVerifyNow = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Send new OTP to user's email
      await authService.resendVerification(email);
      
      // Navigate to verification page
      navigate('/verify-email', { 
        state: { email },
        replace: true 
      });
    } catch (err) {
      console.error('Failed to send verification:', err);
      
      const errorMessage = err.response?.data?.message || '';
      const errorLower = errorMessage.toLowerCase();
      
      // ✅ CRITICAL FIX: Check if email is already verified
      if (errorLower.includes('already verified') || 
          errorLower.includes('مفعّل بالفعل') ||
          errorLower.includes('تم التفعيل')) {
        
        console.log('✅ Email already verified, redirecting to login...');
        
        // Navigate to login with success message
        navigate('/login', {
          state: { 
            message: 'حسابك مفعّل بالفعل! يمكنك الآن تسجيل الدخول.',
            messageType: 'success'
          },
          replace: true
        });
        return;
      }
      
      // Otherwise, show error
      setError(errorMessage || 'فشل إرسال رمز التحقق. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0070CD]/5 via-white to-[#0070CD]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-2xl mb-4 shadow-inner relative">
            <FaExclamationTriangle className="text-2xl text-rose-500 relative z-10" />
            <div className="absolute inset-0 bg-rose-400 rounded-2xl animate-ping opacity-20"></div>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            البريد غير مفعّل
          </h1>
          
          <p className="text-slate-500 mb-4 font-medium">
            يجب تفعيل حسابك للمتابعة
          </p>
          
          <div className="text-sm text-[#0070CD] font-bold bg-[#0070CD]/5 inline-flex items-center gap-2 px-4 py-2 rounded-full">
            <FaEnvelope />
            <span>{email}</span>
          </div>
        </div>

        {error && (
          <Alert variant="error" className="mb-6 rounded-2xl">
            {error}
          </Alert>
        )}

        <button
          type="button"
          onClick={handleVerifyNow}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-[#0070cd] to-[#1a8cff] hover:from-[#005099] hover:to-[#0070cd] text-white rounded-[1.5rem] text-lg font-black transition-all duration-300 shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-6"
        >
          {loading ? (
             <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <FaEnvelope className="text-lg" />
              <span>إرسال رمز التحقق الآن</span>
              <FaArrowRight className="text-lg" />
            </>
          )}
        </button>

        <div className="text-center bg-slate-50 py-3 rounded-2xl mb-6">
          <p className="text-sm font-medium text-slate-500">
            سيتم إرسال رمز مكون من 6 أرقام إلى بريدك
          </p>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-slate-400 font-bold uppercase tracking-wider">أو</span>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-slate-500 hover:text-[#0070CD] transition-colors duration-300"
          >
            العودة إلى تسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailNotVerifiedPage;

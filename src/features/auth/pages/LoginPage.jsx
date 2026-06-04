// src/features/auth/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff, AlertCircle, Check, Loader2, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { loginSchema } from '../schemas/authSchemas';
import GoogleLoginButton from '../components/GoogleLoginButton';
import NavbarLogo from '@/features/patient/components/navbar/NavbarLogo';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuthStore();

  const successMessage = location.state?.message;
  const messageType = location.state?.messageType;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    clearError();
    try {
      await login(data.email, data.password);

      const { user } = useAuthStore.getState();

      if (user && !user.isEmailVerified) {
        navigate('/email-not-verified', {
          state: { email: data.email },
          replace: true
        });
        return;
      }

      let redirectPath = '/doctor/dashboard';

      if (user?.role === 'patient' || user?.roles?.includes('patient')) {
        redirectPath = '/patient/search';
      } else if (user?.role === 'doctor' || user?.roles?.includes('doctor')) {
        redirectPath = '/doctor/dashboard';
      } else if (user?.role === 'verifier' || user?.roles?.includes('verifier')) {
        redirectPath = '/verifier/statistics';
      }

      const from = location.state?.from || redirectPath;
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = error.message || '';
      const errorLower = errorMessage.toLowerCase();

      if (errorLower.includes('email not verified') ||
        errorLower.includes('البريد الإلكتروني غير مفعل') ||
        errorLower.includes('not verified')) {
        navigate('/email-not-verified', {
          state: { email: data.email },
          replace: true
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row bg-white font-sans" dir="rtl">
      
      {/* FORM SECTION (Visual Right in RTL, Bottom on Mobile) */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-6 lg:p-12 bg-white relative overflow-y-auto max-h-screen pb-16 custom-scrollbar">
        
        <div className="w-full max-w-[420px] pt-4 lg:pt-10">
          
          <div className="mb-8 text-right">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight mb-2">تسجيل الدخول</h2>
            <p className="text-slate-500 font-medium text-base">سجل دخولك لمتابعة لوحة التحكم الخاصة بك</p>
          </div>

          {/* Alerts */}
          {successMessage && messageType === 'success' && (
            <div className="mb-6 bg-emerald-50/80 border border-emerald-100 rounded-xl p-3 flex items-start gap-2.5 shadow-sm">
              <Check className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-emerald-800 font-bold">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-rose-50/80 border border-rose-100 rounded-xl p-3 flex items-start gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-rose-800 font-bold leading-relaxed">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 block">
                البريد الإلكتروني
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0070CD] transition-colors pointer-events-none">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  autoFocus
                  placeholder="أدخل بريدك الإلكتروني"
                  {...register('email')}
                  className={`w-full pr-11 pl-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 ${
                    errors.email
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-100 focus:border-[#0070CD] focus:ring-[#0070CD]/20'
                  } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-300 placeholder:text-slate-400 font-medium text-slate-800`}
                  dir="rtl"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1.5 font-bold animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 block">
                كلمة المرور
              </label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0070CD] transition-colors pointer-events-none">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  {...register('password')}
                  className={`w-full pr-11 pl-12 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 ${
                    errors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-100 focus:border-[#0070CD] focus:ring-[#0070CD]/20'
                  } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-300 placeholder:text-slate-400 font-medium text-slate-800`}
                  dir="rtl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#0070CD] hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1.5 font-bold animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={12} /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-4 h-4 border-2 border-slate-300 rounded-md bg-white checked:bg-[#0070CD] checked:border-[#0070CD] hover:border-[#0070CD] transition-all duration-200 cursor-pointer"
                  />
                  <Check size={12} strokeWidth={3} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" />
                </div>
                <span className="text-sm text-slate-600 font-bold select-none group-hover:text-slate-900 transition-colors">تذكرني</span>
              </label>
              
              <Link
                to="/forgot-password"
                className="text-sm text-[#0070CD] font-bold hover:text-[#004a8c] hover:underline underline-offset-4 transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#005ba6] to-[#0070CD] hover:from-[#004a8c] hover:to-[#005ba6] text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_8px_20px_rgba(0,112,205,0.25)] hover:shadow-[0_12px_25px_rgba(0,112,205,0.35)] hover:-translate-y-0.5 transform transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2.5 mt-2 text-base border border-white/10"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <span>تسجيل الدخول</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-bold uppercase tracking-wider">أو</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="mb-6">
            <div className="transform hover:-translate-y-0.5 transition-transform duration-300">
              <GoogleLoginButton />
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center pt-1">
            <p className="text-sm text-slate-600 font-medium">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-[#0070CD] font-black hover:text-[#004a8c] hover:underline underline-offset-4 transition-colors ml-1">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* BRANDING SECTION (Visual Left in RTL, Top on Mobile) */}
      <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 xl:p-16 overflow-hidden bg-[#0070CD] lg:min-h-screen">
        
        {/* Back to Home Navigation (Absolute Top Right) */}
        <Link to="/" className="absolute top-6 right-6 lg:top-8 lg:right-8 z-20 inline-flex items-center gap-1.5 text-blue-200/80 hover:text-white transition-all duration-300 font-medium text-sm drop-shadow-sm group">
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          <span>العودة للرئيسية</span>
        </Link>

        {/* Deep Layered Gradient & Glowing Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#003B73] via-[#005ba6] to-[#0070CD] z-0"></div>
        <div className="absolute top-0 right-0 w-full h-full opacity-40 mix-blend-overlay z-0" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.4) 0%, transparent 40%)' }}></div>
        <div className="absolute -bottom-[20%] -left-[20%] w-[80%] h-[80%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse hidden lg:block" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] bg-[#00A1FF]/20 rounded-full blur-[100px] animate-pulse hidden lg:block" style={{ animationDuration: '12s' }}></div>

        {/* Floating Shapes for Visual Depth - Desktop Only */}
        <div className="absolute top-[25%] right-[15%] w-24 h-24 bg-white/5 rounded-3xl rotate-12 backdrop-blur-sm border border-white/10 z-0 shadow-[0_0_40px_rgba(255,255,255,0.1)] hidden lg:block"></div>
        <div className="absolute bottom-[30%] left-[10%] w-32 h-32 bg-white/5 rounded-full backdrop-blur-md border border-white/10 z-0 shadow-[0_0_60px_rgba(0,112,205,0.5)] hidden lg:block"></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-lg mx-auto space-y-8 mt-12 lg:mt-0">
          
          {/* Exact Navbar Logo in a floating premium glass pill */}
          <div 
            className="inline-flex bg-white p-3 pr-4 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.1)] transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            title="العودة للصفحة الرئيسية"
          >
            <div className="pointer-events-none scale-90 origin-center">
              <NavbarLogo />
            </div>
          </div>

          {/* Mobile Short Text */}
          <p className="lg:hidden text-white font-bold text-base drop-shadow-sm">
            ابدأ رحلتك الصحية بثقة
          </p>

          {/* Desktop Headline & Copy & Bullets */}
          <div className="hidden lg:flex flex-col items-center space-y-6">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              ابدأ رحلتك الصحية <br/> <span className="text-blue-200">بثقة وأمان.</span>
            </h1>
            <p className="text-base lg:text-lg text-blue-100/90 font-medium leading-relaxed drop-shadow-sm max-w-md mx-auto">
              النظام الطبي المتكامل الأفضل لإدارة سجلاتك وحجوزاتك الطبية بكل سهولة، من أي مكان وفي أي وقت.
            </p>

            <div className="flex flex-col items-center gap-4 pt-4">
              {[
                { text: 'سهولة الاستخدام والوصول السريع' },
                { text: 'سرعة في حجز المواعيد وإدارة الملفات' },
                { text: 'أمان تام وموثوقية عالية لبياناتك' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 w-fit px-5 py-2.5 rounded-xl border border-white/10 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:bg-white/20 transition-colors">
                  <CheckCircle2 className="text-emerald-400 shrink-0 w-5 h-5 drop-shadow-sm" />
                  <span className="text-white font-bold text-sm tracking-wide">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info in branding section - Desktop Only */}
        <div className="relative z-10 mt-auto pt-12 hidden lg:block">
          <p className="text-blue-200/70 text-xs font-medium">© 2026 منصة نبض الطبية. جميع الحقوق محفوظة.</p>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
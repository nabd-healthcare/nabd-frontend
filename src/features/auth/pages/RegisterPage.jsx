// src/features/auth/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  User,
  Stethoscope,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  Mail,
  CheckCircle2,
  Loader2,
  ArrowRight
} from 'lucide-react';
import authService from '@/api/services/auth.service';
import { SPECIALTIES } from '@/utils/constants';
import NavbarLogo from '@/features/patient/components/navbar/NavbarLogo';
import GoogleLoginButton from '../components/GoogleLoginButton';

// Validation Schemas
const patientSchema = yup.object().shape({
  firstName: yup.string().min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل').required('الاسم الأول مطلوب'),
  lastName: yup.string().min(2, 'الاسم الأخير يجب أن يكون حرفين على الأقل').required('الاسم الأخير مطلوب'),
  email: yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
  password: yup.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم').required('كلمة المرور مطلوبة'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة').required('تأكيد كلمة المرور مطلوب'),
  terms: yup.boolean().oneOf([true], 'يجب الموافقة على الشروط'),
});

const doctorSchema = patientSchema.shape({
  medicalSpecialty: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .typeError('يرجى اختيار التخصص الطبي من القائمة')
    .positive('يجب اختيار تخصص طبي صحيح')
    .required('التخصص الطبي مطلوب'),
});

const RegisterPage = () => {
  const [userType, setUserType] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const getSchema = () => {
    switch (userType) {
      case 'doctor': return doctorSchema;
      default: return patientSchema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(getSchema()),
    mode: 'onChange',
  });

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');
  const termsChecked = watch('terms', false);

  const isMatch = confirmPassword && password === confirmPassword;
  const isMismatch = confirmPassword && password !== confirmPassword;

  // Password strength calculation
  useEffect(() => {
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.length > 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(Math.min(strength, 4));
  }, [password]);

  const getStrengthColor = (level) => {
    if (!password) return 'bg-slate-200';
    if (passwordStrength > level) {
      if (passwordStrength <= 1) return 'bg-rose-400';
      if (passwordStrength === 2) return 'bg-yellow-400';
      if (passwordStrength === 3) return 'bg-emerald-400';
      return 'bg-emerald-500';
    }
    return 'bg-slate-200';
  };

  const getStrengthLabel = () => {
    if (!password) return '';
    if (passwordStrength <= 1) return { text: 'ضعيف', color: 'text-rose-500' };
    if (passwordStrength === 2) return { text: 'مقبول', color: 'text-yellow-500' };
    if (passwordStrength === 3) return { text: 'جيد', color: 'text-emerald-500' };
    return { text: 'قوي جداً', color: 'text-emerald-600' };
  };

  const strengthData = getStrengthLabel();

  const handleUserTypeChange = (type) => {
    if (userType !== type) {
      setUserType(type);
      reset();
      setError('');
    }
  };

  const onSubmit = async (data) => {
    setError('');
    setIsSubmitting(true);

    try {
      let response;
      switch (userType) {
        case 'patient':
          response = await authService.registerPatient(data);
          break;
        case 'doctor':
          response = await authService.registerDoctor(data);
          break;
        default:
          throw new Error('نوع مستخدم غير صحيح');
      }

      if (response.isSuccess) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/verify-email', { state: { email: data.email } });
        }, 2000);
      } else {
        setError(response.message || 'حدث خطأ أثناء التسجيل');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans" dir="rtl">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-md w-full text-center space-y-6 border-t-[5px] border-[#0070CD] animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
            <Check size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">تم التسجيل بنجاح!</h2>
          <p className="text-slate-600 font-medium leading-relaxed text-lg">
            {userType === 'doctor'
              ? 'مرحباً بك في منصة نبض. سيتم تحويلك لصفحة التحقق...'
              : 'مرحباً بك في منصة نبض. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row bg-white font-sans" dir="rtl">
      
      {/* FORM SECTION (Visual Right in RTL, Bottom on Mobile) */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-6 lg:p-12 bg-white relative overflow-y-auto max-h-screen pb-16 custom-scrollbar">
        
        <div className="w-full max-w-[440px] pt-4 lg:pt-10">
          
          <div className="mb-8 text-right">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight mb-2">إنشاء حساب جديد</h2>
            <p className="text-slate-500 font-medium text-base">اختر نوع الحساب وأدخل بياناتك للبدء</p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 bg-rose-50/80 border border-rose-100 rounded-xl p-3 flex items-start gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-rose-800 font-bold leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* GROUP 1: Account Type Selector */}
            <div className="relative flex bg-slate-100/80 p-1 rounded-xl shadow-inner">
              {/* Sliding Background Pill */}
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] right-1 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-in-out ${
                  userType === 'doctor' ? '-translate-x-full' : 'translate-x-0'
                }`}
              />
              
              <button
                type="button"
                onClick={() => handleUserTypeChange('patient')}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3 z-10 font-bold text-sm transition-colors duration-300 ${
                  userType === 'patient' ? 'text-[#0070CD]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/30 rounded-lg'
                }`}
              >
                <User size={18} className={`transition-colors duration-300 ${userType === 'patient' ? 'text-[#0070CD]' : 'text-slate-400'}`} />
                مريض
              </button>
              
              <button
                type="button"
                onClick={() => handleUserTypeChange('doctor')}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3 z-10 font-bold text-sm transition-colors duration-300 ${
                  userType === 'doctor' ? 'text-[#0070CD]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/30 rounded-lg'
                }`}
              >
                <Stethoscope size={18} className={`transition-colors duration-300 ${userType === 'doctor' ? 'text-[#0070CD]' : 'text-slate-400'}`} />
                طبيب
              </button>
            </div>

            {/* GROUP 2: Personal Info */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 block">الاسم الأول <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="أدخل الاسم الأول"
                    {...register('firstName')}
                    className={`w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 ${
                      errors.firstName ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-100 focus:border-[#0070CD] focus:ring-[#0070CD]/20'
                    } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-300 font-medium text-slate-800`}
                  />
                  {errors.firstName && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-bold"><AlertCircle size={12} /> {errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 block">اسم العائلة <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="أدخل اسم العائلة"
                    {...register('lastName')}
                    className={`w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 ${
                      errors.lastName ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-100 focus:border-[#0070CD] focus:ring-[#0070CD]/20'
                    } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-300 font-medium text-slate-800`}
                  />
                  {errors.lastName && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-bold"><AlertCircle size={12} /> {errors.lastName.message}</p>}
                </div>
              </div>

              {/* Animated Specialty Dropdown (Doctor Only) */}
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${userType === 'doctor' ? 'max-h-32 opacity-100 mt-3.5' : 'max-h-0 opacity-0 m-0'}`}>
                <div className="space-y-1.5 pb-1">
                  <label className="text-sm font-bold text-slate-700 block">التخصص الطبي <span className="text-rose-500">*</span></label>
                  <div className="relative group">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0070CD] transition-colors pointer-events-none">
                      <Stethoscope size={18} />
                    </div>
                    <select
                      {...register('medicalSpecialty')}
                      className={`w-full pr-11 pl-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 ${
                        errors.medicalSpecialty ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-100 focus:border-[#0070CD] focus:ring-[#0070CD]/20'
                      } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-300 font-medium text-slate-800 appearance-none cursor-pointer`}
                    >
                      <option value="">اختر التخصص الطبي</option>
                      {SPECIALTIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  {errors.medicalSpecialty && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-bold"><AlertCircle size={12} /> {errors.medicalSpecialty.message}</p>}
                </div>
              </div>
            </div>

            {/* GROUP 3: Credentials */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 block">البريد الإلكتروني <span className="text-rose-500">*</span></label>
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0070CD] transition-colors pointer-events-none">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    className={`w-full pr-11 pl-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 ${
                      errors.email ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-100 focus:border-[#0070CD] focus:ring-[#0070CD]/20'
                    } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-300 font-medium text-slate-800`}
                    dir="ltr"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-bold"><AlertCircle size={12} /> {errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 block">كلمة المرور <span className="text-rose-500">*</span></label>
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0070CD] transition-colors pointer-events-none">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    {...register('password')}
                    className={`w-full pr-11 pl-12 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 ${
                      errors.password ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-100 focus:border-[#0070CD] focus:ring-[#0070CD]/20'
                    } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-300 font-medium text-slate-800`}
                    dir="rtl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#0070CD] hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-1.5 animate-in fade-in duration-300">
                    <div className="flex gap-1 h-1 mb-1">
                      {[0, 1, 2, 3].map((level) => (
                        <div key={level} className={`flex-1 rounded-full transition-all duration-500 ${getStrengthColor(level)}`} />
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <span className={`text-[11px] font-bold ${strengthData.color}`}>{strengthData.text}</span>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-bold"><AlertCircle size={12} /> {errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 block">تأكيد كلمة المرور <span className="text-rose-500">*</span></label>
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0070CD] transition-colors pointer-events-none">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="أعد إدخال كلمة المرور"
                    {...register('confirmPassword')}
                    className={`w-full pr-11 pl-11 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 ${
                      isMatch ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20 bg-emerald-50/30' :
                      isMismatch || errors.confirmPassword ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 
                      'border-slate-100 focus:border-[#0070CD] focus:ring-[#0070CD]/20'
                    } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all duration-300 font-medium text-slate-800`}
                    dir="rtl"
                  />
                  {isMatch && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-300">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </div>
                {errors.confirmPassword && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-bold"><AlertCircle size={12} /> {errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* GROUP 4: Terms & Submit */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer group mb-5 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    {...register('terms')}
                    className={`peer appearance-none w-4 h-4 border-2 ${errors.terms && !termsChecked ? 'border-rose-400' : 'border-slate-300'} rounded-md bg-white checked:bg-[#0070CD] checked:border-[#0070CD] hover:border-[#0070CD] transition-all duration-200 cursor-pointer shrink-0`}
                  />
                  <Check size={12} strokeWidth={3} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" />
                </div>
                <span className={`text-[13px] ${errors.terms && !termsChecked ? 'text-rose-500 font-bold' : 'text-slate-600 font-medium'} group-hover:text-slate-900 transition-colors leading-relaxed`}>
                  أوافق على <Link to="/terms" className="text-[#0070CD] font-bold hover:underline" onClick={e => e.stopPropagation()}>شروط الخدمة</Link> و <Link to="/privacy" className="text-[#0070CD] font-bold hover:underline" onClick={e => e.stopPropagation()}>سياسة الخصوصية</Link> الخاصة بمنصة نبض.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting || (!isValid && isDirty) || !termsChecked}
                className="w-full bg-gradient-to-r from-[#005ba6] to-[#0070CD] hover:from-[#004a8c] hover:to-[#005ba6] text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_8px_20px_rgba(0,112,205,0.25)] hover:shadow-[0_12px_25px_rgba(0,112,205,0.35)] hover:-translate-y-0.5 transform transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-base border border-white/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>جاري الإنشاء...</span>
                  </>
                ) : (
                  <span>إنشاء حساب</span>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-400 font-bold uppercase tracking-wider">أو المتابعة عبر</span>
              </div>
            </div>

            {/* Google Login Button */}
            <div className="mb-5">
              <div className="transform hover:-translate-y-0.5 transition-transform duration-300">
                <GoogleLoginButton userType={userType} />
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="text-[#0070CD] font-black hover:text-[#004a8c] hover:underline underline-offset-4 transition-colors ml-1">
                  تسجيل الدخول
                </Link>
              </p>
            </div>

          </form>
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
            انضم إلى شبكة نبض الطبية
          </p>

          {/* Desktop Headline & Copy & Bullets */}
          <div className="hidden lg:flex flex-col items-center space-y-6">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              ابدأ رحلتك الصحية <br/> <span className="text-blue-200">بثقة وأمان.</span>
            </h1>
            <p className="text-base lg:text-lg text-blue-100/90 font-medium leading-relaxed drop-shadow-sm max-w-md mx-auto">
              انضم إلى النظام الطبي المتكامل الأفضل لإدارة سجلاتك وحجوزاتك الطبية بكل سهولة وموثوقية.
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

export default RegisterPage;
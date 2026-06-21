import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeartbeat } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const inputClass = `
    w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2
    border-slate-100 focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/15
    rounded-xl text-sm focus:outline-none transition-all duration-300 font-medium text-slate-800
    placeholder:text-slate-400
`.trim();

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setShowSuccess(false), 4000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1F2E3C]" dir="rtl">
            <Header />
            <main>

                {/* ── Hero Section ── */}
                <div className="relative bg-gradient-to-br from-[#003B73] via-[#005ba6] to-[#0070CD] pt-36 pb-28 px-6 overflow-hidden">
                    {/* Ambient glows */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3399FF]/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
                    {/* Dot grid */}
                    <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
                    </div>

                    <div className="max-w-4xl mx-auto relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 shadow-sm">
                                <MessageCircle className="w-4 h-4 text-blue-200" />
                                <span className="text-white/90 text-sm font-bold tracking-wide">نحن هنا لخدمتك</span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black text-white mb-6 tracking-tight leading-[1.2]">
                                تواصل مع{' '}
                                <span className="text-blue-200">فريق نبض</span>
                            </h1>

                            <p className="text-base md:text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed font-medium">
                                فريق الدعم الفني وخدمة العملاء جاهز للإجابة على جميع استفساراتك وتقديم المساعدة على مدار الساعة.
                            </p>
                        </motion.div>
                    </div>

                    {/* Smooth fade into page background */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent"></div>
                </div>

                {/* ── Main Form & Sidebar ── */}
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* ── Contact Form — 7 cols ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="lg:col-span-7"
                        >
                            <div className="bg-white rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,112,205,0.07)] border border-slate-100 p-8 md:p-12">

                                {/* Form header */}
                                <div className="mb-10">
                                    <div className="inline-flex items-center gap-2 bg-[#F0F7FF] border border-[#0070CD]/15 px-4 py-2 rounded-full mb-5">
                                        <Sparkles className="w-4 h-4 text-[#0070CD]" />
                                        <span className="text-[#0070CD] text-sm font-bold">راسلنا مباشرة</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-[#1F2E3C] mb-3 tracking-tight">أرسل رسالة مباشرة</h2>
                                    <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                                        املأ النموذج أدناه، وسنحرص على الرد عليك في غضون 24 ساعة.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">

                                    {/* Name + Email row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label htmlFor="name" className="block text-sm font-bold text-slate-700">
                                                الاسم الكامل <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={inputClass}
                                                placeholder="د. أحمد محمد"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                                                البريد الإلكتروني <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={inputClass}
                                                placeholder="ahmed@email.com"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="subject" className="block text-sm font-bold text-slate-700">
                                            موضوع الرسالة <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className={inputClass}
                                            placeholder="استفسار بخصوص إدارة العيادات..."
                                        />
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="message" className="block text-sm font-bold text-slate-700">
                                            محتوى الرسالة <span className="text-rose-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows="6"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className={`${inputClass} resize-none leading-relaxed`}
                                            placeholder="نرجو كتابة كافة التفاصيل لمساعدتك بشكل أفضل..."
                                        />
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`
                                                flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-black text-white text-sm md:text-base transition-all duration-300
                                                ${isSubmitting
                                                    ? 'bg-slate-300 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-[#005ba6] to-[#0070CD] hover:from-[#004a8c] hover:to-[#005ba6] shadow-[0_8px_20px_rgba(0,112,205,0.3)] hover:shadow-[0_12px_28px_rgba(0,112,205,0.4)] hover:-translate-y-0.5 active:translate-y-0'
                                                }
                                            `}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>جاري الإرسال...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>إرسال الطلب الآن</span>
                                                    <Send className="w-4 h-4 rtl:rotate-180" />
                                                </>
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {showSuccess && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-3 text-sm text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-5 py-4 rounded-xl mt-4"
                                                >
                                                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                    <span>شكراً لتواصلك! استلمنا رسالتك وسنرد عليك قريباً.</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </form>
                            </div>
                        </motion.div>

                        {/* ── Sidebar — 5 cols ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                            className="lg:col-span-5 space-y-6"
                        >
                            {/* Info card — branded gradient panel */}
                            <div className="bg-gradient-to-br from-[#003B73] via-[#005ba6] to-[#0070CD] rounded-[2rem] shadow-[0_20px_50px_rgba(0,112,205,0.25)] p-8 text-white relative overflow-hidden">
                                {/* Corner glow */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] pointer-events-none"></div>
                                {/* Dot grid */}
                                <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '22px 22px' }}>
                                </div>

                                {/* Logo inside card */}
                                <div className="relative z-10 flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                        <FaHeartbeat className="w-5 h-5 text-[#0070CD]" />
                                    </div>
                                    <div>
                                        <span className="text-lg font-black text-white tracking-tight leading-none">
                                            نبض <span className="text-blue-200">NABD</span>
                                        </span>
                                        <div className="text-[9px] font-black text-blue-300 uppercase tracking-[0.2em] mt-0.5">Medical OS</div>
                                    </div>
                                </div>

                                <h2 className="text-xl md:text-2xl font-black mb-7 relative z-10 tracking-tight">المقر الرئيسي</h2>

                                <div className="space-y-6 relative z-10">
                                    {/* Address */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="font-bold text-base mb-1">الفرع الرئيسي للتطوير</h3>
                                            <p className="text-sm text-blue-100/80 font-medium leading-relaxed">
                                                شارع التسعين الشمالي، التجمع الخامس<br />
                                                القاهرة، جمهورية مصر العربية
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hours */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="font-bold text-base mb-1">أوقات العمل الرسمية</h3>
                                            <p className="text-sm text-blue-100/80 font-medium">السبت — الخميس</p>
                                            <p className="text-sm text-blue-100/80 font-medium">9:00 صباحاً حتى 6:00 مساءً</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="font-bold text-base mb-1">خط الدعم الفني</h3>
                                            <p className="text-sm text-blue-100/80 font-medium" dir="ltr">+20 111 222 3333</p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="font-bold text-base mb-1">البريد الإلكتروني</h3>
                                            <p className="text-sm text-blue-100/80 font-medium" dir="ltr">support@nabd.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map card */}
                            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,112,205,0.07)] border border-slate-100 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#0070CD]/10 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-[#0070CD]" />
                                    </div>
                                    <span className="font-bold text-sm text-[#1F2E3C]">الموقع على الخريطة</span>
                                </div>
                                <div className="h-72 relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-[#0070CD]/8 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27628.676924040974!2d31.319737449999997!3d30.05948385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e5d7a876775%3A0x6e7220116094726d!2sNasr%20City%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1709647890000!5m2!1sen!2seg"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Nabd Location"
                                        className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;

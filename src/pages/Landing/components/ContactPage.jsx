import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageCircle, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            
            // Hide success message after 3 seconds
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1F2E3C] overflow-hidden" dir="rtl">
            <Header />
            <main>
                {/* Hero Section with Modern Tech Gradient */}
                <div className="relative bg-[#0B1423] pt-32 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    {/* Abstract Blue Shapes */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0070CD]/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3399FF]/10 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 shadow-sm">
                                <MessageCircle className="w-5 h-5 text-[#3399FF]" />
                                <span className="text-white/90 text-sm font-bold tracking-wide">نحن هنا لخدمتك</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
                                تواصل مع  <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#3399FF] to-[#0070CD]">فريق نبض</span>
                            </h1>
                            <p className="text-xl text-blue-100/70 max-w-2xl mx-auto leading-relaxed font-medium">
                                فريق الدعم الفني وخدمة العملاء جاهز للإجابة على جميع استفساراتك وتقديم المساعدة والمشورة على مدار الساعة.
                            </p>
                        </motion.div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent z-20"></div>
                </div>

                {/* Contact Interface Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-30 pb-24">
                    {/* Quick Contact Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,112,205,0.1)] p-8 border border-white hover:border-[#0070CD]/20 hover:shadow-[0_20px_40px_-10px_rgba(0,112,205,0.15)] transition-all duration-300 hover:-translate-y-2 text-center group"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-[#0070CD] to-[#005099] rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-[#0070CD]/20 group-hover:scale-110 transition-transform">
                                <Phone className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2E3C] mb-2">الدعم الهاتفي</h3>
                            <p className="text-slate-500 text-sm mb-4 font-medium">متاحون على مدار الساعة للرد السريع</p>
                            <p className="text-[#0070CD] font-black text-xl" dir="ltr">+20 111 222 3333</p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,112,205,0.1)] p-8 border border-white hover:border-[#0070CD]/20 hover:shadow-[0_20px_40px_-10px_rgba(0,112,205,0.15)] transition-all duration-300 hover:-translate-y-2 text-center group"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-[#0070CD] to-[#005099] rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-[#0070CD]/20 group-hover:scale-110 transition-transform">
                                <Mail className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2E3C] mb-2">البريد الإلكتروني</h3>
                            <p className="text-slate-500 text-sm mb-4 font-medium">المراسلات الرسمية والاستفسارات المفصلة</p>
                            <p className="text-[#0070CD] font-bold text-lg font-sans">support@nabd.com</p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,112,205,0.1)] p-8 border border-white hover:border-[#0070CD]/20 hover:shadow-[0_20px_40px_-10px_rgba(0,112,205,0.15)] transition-all duration-300 hover:-translate-y-2 text-center group"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-[#0070CD] to-[#005099] rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-[#0070CD]/20 group-hover:scale-110 transition-transform">
                                <Headphones className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2E3C] mb-2">محادثة مباشرة</h3>
                            <p className="text-slate-500 text-sm mb-4 font-medium">تواصل فوري مع أخصائيي الدعم</p>
                            <p className="text-[#0070CD] font-bold text-lg">ابدأ الدردشة الآن</p>
                        </motion.div>
                    </div>

                    {/* Main Contact Form & Location */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Contact Form - Takes 7 columns */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-7"
                        >
                            <div className="bg-white rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,112,205,0.15)] p-10 md:p-12 border border-slate-100">
                                <div className="mb-10">
                                    <h2 className="text-3xl font-black text-[#1F2E3C] mb-4">أرسل رسالة مباشرة</h2>
                                    <p className="text-slate-500 font-medium">املأ النموذج أدناه بدقة، وسنحرص على الرد عليك في غضون 24 ساعة.</p>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-bold text-[#1F2E3C] mb-2">
                                                الاسم الكامل <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 placeholder:text-slate-400 hover:border-[#0070CD]/30 focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/10 outline-none transition-all bg-slate-50/50 focus:bg-white"
                                                placeholder="د. أحمد محمد"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-bold text-[#1F2E3C] mb-2">
                                                البريد الإلكتروني <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 placeholder:text-slate-400 hover:border-[#0070CD]/30 focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/10 outline-none transition-all bg-slate-50/50 focus:bg-white text-left"
                                                placeholder="ahmed@email.com"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-bold text-[#1F2E3C] mb-2">
                                            موضوع الرسالة <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 placeholder:text-slate-400 hover:border-[#0070CD]/30 focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/10 outline-none transition-all bg-slate-50/50 focus:bg-white"
                                            placeholder="استفسار بخصوص إدارة العيادات..."
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-bold text-[#1F2E3C] mb-2">
                                            محتوى الرسالة <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows="5"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 placeholder:text-slate-400 hover:border-[#0070CD]/30 focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/10 outline-none transition-all resize-none bg-slate-50/50 focus:bg-white leading-relaxed"
                                            placeholder="نرجو كتابة كافة التفاصيل لمساعدتك بشكل أفضل..."
                                        ></textarea>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`
                                                w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-white transition-all transform
                                                ${isSubmitting 
                                                    ? 'bg-slate-300 cursor-not-allowed' 
                                                    : 'bg-[#0070CD] hover:bg-[#005099] shadow-[0_10px_20px_rgba(0,112,205,0.3)] hover:-translate-y-1'
                                                }
                                            `}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>جاري إرسال الرسالة...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>إرسال الطلب الآن</span>
                                                    <Send className="w-5 h-5 rtl:rotate-180" />
                                                </>
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {showSuccess && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-5 py-4 rounded-2xl mt-4 border border-emerald-100"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                    <span>شكراً لتواصلك! لقد استلمنا رسالتك وسنقوم بالرد قريباً.</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </form>
                            </div>
                        </motion.div>

                        {/* Contact Info & Map - Takes 5 columns */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="lg:col-span-5 space-y-6"
                        >
                            {/* Contact Details Card */}
                            <div className="bg-[#0070CD] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                                
                                <h2 className="text-3xl font-black mb-8 relative z-10">المقر الرئيسي</h2>
                                
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-start gap-5">
                                        <div className="w-14 h-14 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="font-bold text-lg mb-1">الفرع الرئيسي للتطوير</h3>
                                            <p className="text-blue-100 font-medium leading-relaxed">شارع التسعين الشمالي، التجمع الخامس<br/>القاهرة، جمهورية مصر العربية</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="w-14 h-14 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="font-bold text-lg mb-1">أوقات العمل الرسمية</h3>
                                            <p className="text-blue-100 font-medium">السبت - الخميس</p>
                                            <p className="text-blue-100 font-medium">من 9:00 صباحاً حتى 6:00 مساءً</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="bg-white rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,112,205,0.15)] overflow-hidden border border-slate-100 p-2">
                                <div className="h-64 rounded-[2rem] overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-[#0070CD]/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                                    <iframe 
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27628.676924040974!2d31.319737449999997!3d30.05948385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e5d7a876775%3A0x6e7220116094726d!2sNasr%20City%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1709647890000!5m2!1sen!2seg" 
                                        width="100%" 
                                        height="100%" 
                                        style={{ border: 0 }} 
                                        allowFullScreen="" 
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Nabd Location"
                                        className="grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                                    ></iframe>
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

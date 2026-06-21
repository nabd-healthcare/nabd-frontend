import React from 'react';
import { Smartphone, Star, Calendar, Shield, Activity, Brain } from 'lucide-react';
import { FaHeartbeat, FaApple, FaGooglePlay } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DownloadApp = () => {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-white relative overflow-hidden">
            {/* Ambient glows matching the rest of the landing page */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#0070CD]/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3399FF]/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-br from-[#003B73] via-[#005ba6] to-[#0070CD] rounded-[3rem] overflow-hidden relative shadow-[0_30px_80px_-15px_rgba(0,112,205,0.45)]"
                >
                    {/* Background dot pattern */}
                    <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }}>
                    </div>

                    {/* Corner glow accents */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3399FF]/20 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0070CD]/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center p-5 sm:p-8 lg:p-20">

                        {/* Content */}
                        <div className="text-white space-y-8 order-2 lg:order-1">

                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm w-fit"
                            >
                                <Smartphone className="w-4 h-4 text-blue-200" />
                                <span className="text-sm font-bold tracking-wide">متاح الآن للتنزيل</span>
                            </motion.div>

                            {/* Heading */}
                            <motion.h2
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-[24px] sm:text-[30px] md:text-[38px] lg:text-[44px] font-black leading-[1.3] tracking-tight"
                            >
                                حمّل تطبيق نبض{' '}
                                <span className="text-blue-200">واجعل صحتك في متناول يدك</span>
                            </motion.h2>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="text-blue-100/85 text-base md:text-lg leading-relaxed font-medium max-w-lg"
                            >
                                احصل على رعاية صحية متكاملة في جيبك. احجز مواعيدك بسهولة، تواصل مع طبيبك المفضل، واحتفظ بملفك الطبي بأمان تام.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="flex flex-col sm:flex-row gap-3 pt-2"
                            >
                                {/* iOS Button */}
                                <button className="group px-7 py-3.5 md:py-4 bg-white text-[#0070CD] rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base w-full sm:w-auto">
                                    <FaApple className="w-5 h-5 flex-shrink-0" />
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-400 leading-none mb-0.5">تنزيل من</div>
                                        <div className="font-black leading-none">App Store</div>
                                    </div>
                                </button>

                                {/* Android Button */}
                                <button className="group px-7 py-3.5 md:py-4 bg-white/10 text-white border border-white/25 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-3 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base w-full sm:w-auto">
                                    <FaGooglePlay className="w-5 h-5 flex-shrink-0" />
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-blue-200 leading-none mb-0.5">تنزيل من</div>
                                        <div className="font-black leading-none">Google Play</div>
                                    </div>
                                </button>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                className="flex items-center flex-wrap gap-4 sm:gap-8 lg:gap-10 pt-6 md:pt-8 mt-4 border-t border-white/15"
                            >
                                <div>
                                    <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">+50K</div>
                                    <div className="text-blue-200 text-sm font-semibold mt-1">تنزيل نشط</div>
                                </div>
                                <div className="w-px h-12 bg-white/20 flex-shrink-0"></div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">4.9</span>
                                        <Star className="w-6 h-6 text-amber-400 fill-current" />
                                    </div>
                                    <div className="text-blue-200 text-sm font-semibold mt-1">متوسط التقييمات</div>
                                </div>
                                <div className="w-px h-12 bg-white/20 flex-shrink-0"></div>
                                <div>
                                    <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">98%</div>
                                    <div className="text-blue-200 text-sm font-semibold mt-1">رضا المستخدمين</div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Phone Mockup */}
                        <div className="relative hidden lg:flex items-center justify-center order-1 lg:order-2 min-h-[600px]">
                            <motion.div
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.3 }}
                                className="relative mx-auto z-10"
                            >
                                {/* Blue glow behind phone */}
                                <div className="absolute inset-0 bg-[#0070CD]/40 blur-[60px] rounded-full scale-75 translate-y-8 pointer-events-none"></div>

                                {/* Phone shell */}
                                <div className="relative w-[290px] h-[590px] bg-[#1F2E3C] rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] p-3 border-4 border-[#2d3d4f]">
                                    {/* Dynamic island / notch */}
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-[#1F2E3C] rounded-full z-20 flex items-center justify-center gap-1.5">
                                        <div className="w-2 h-2 bg-[#2d3d4f] rounded-full"></div>
                                        <div className="w-3 h-3 bg-[#2d3d4f] rounded-full"></div>
                                    </div>

                                    {/* Screen content */}
                                    <div className="w-full h-full bg-gradient-to-br from-[#003B73] via-[#005ba6] to-[#0070CD] rounded-[2.8rem] flex flex-col items-center justify-center relative overflow-hidden">

                                        {/* Screen dot pattern */}
                                        <div className="absolute inset-0 opacity-[0.08]"
                                            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                                        </div>

                                        {/* Screen glow */}
                                        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-[#3399FF]/30 rounded-full blur-[50px]"></div>

                                        {/* Nabd Medical OS Logo centered */}
                                        <div className="relative z-10 flex flex-col items-center gap-4">
                                            {/* Icon box */}
                                            <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                                                <FaHeartbeat className="w-10 h-10 text-[#0070CD]" />
                                            </div>
                                            {/* Logo text */}
                                            <div className="flex flex-col items-center gap-0.5">
                                                <span className="text-2xl font-black text-white tracking-tight">
                                                    نبض <span className="text-blue-200">NABD</span>
                                                </span>
                                                <span className="text-[9px] font-black text-blue-300 uppercase tracking-[0.25em]">Medical OS</span>
                                            </div>

                                            {/* Mock UI bottom card */}
                                            <div className="mt-6 w-48 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3">
                                                <div className="w-8 h-8 bg-emerald-400/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <Activity className="w-4 h-4 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <div className="text-white text-[11px] font-black leading-tight">موعدك القادم</div>
                                                    <div className="text-blue-200 text-[10px] font-medium">اليوم — 3:00 م</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Scanning line animation */}
                                        <motion.div
                                            animate={{ y: ['0%', '500%', '0%'] }}
                                            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                                            className="absolute left-0 right-0 h-16 bg-gradient-to-b from-[#3399FF]/0 via-[#3399FF]/8 to-[#3399FF]/0 pointer-events-none"
                                        />
                                    </div>

                                    {/* Side buttons */}
                                    <div className="absolute -right-[6px] top-24 w-1 h-10 bg-[#2d3d4f] rounded-full"></div>
                                    <div className="absolute -left-[6px] top-20 w-1 h-8 bg-[#2d3d4f] rounded-full"></div>
                                    <div className="absolute -left-[6px] top-32 w-1 h-12 bg-[#2d3d4f] rounded-full"></div>
                                    <div className="absolute -left-[6px] top-48 w-1 h-12 bg-[#2d3d4f] rounded-full"></div>
                                </div>
                            </motion.div>

                            {/* Floating card — top right */}
                            <motion.div
                                animate={{ y: [0, -14, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-12 -right-4 bg-white rounded-2xl px-4 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.15)] z-20 flex items-center gap-3 border border-slate-100"
                            >
                                <div className="w-9 h-9 bg-[#0070CD]/10 rounded-xl flex items-center justify-center text-[#0070CD] flex-shrink-0">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[#1F2E3C] text-xs font-black leading-tight">حجز فوري</div>
                                    <div className="text-slate-400 text-[10px] font-medium">خلال 30 ثانية</div>
                                </div>
                            </motion.div>

                            {/* Floating card — bottom left */}
                            <motion.div
                                animate={{ y: [0, 16, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-24 -left-6 bg-white rounded-2xl px-4 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.15)] z-20 flex items-center gap-3 border border-slate-100"
                            >
                                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 flex-shrink-0">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[#1F2E3C] text-xs font-black leading-tight">بياناتك آمنة</div>
                                    <div className="text-slate-400 text-[10px] font-medium">تشفير كامل</div>
                                </div>
                            </motion.div>

                            {/* Floating card — top left */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                className="absolute top-1/2 -translate-y-1/2 -left-10 bg-white rounded-2xl px-4 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.15)] z-20 flex items-center gap-3 border border-slate-100"
                            >
                                <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 flex-shrink-0">
                                    <Brain className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[#1F2E3C] text-xs font-black leading-tight">تشخيص AI</div>
                                    <div className="text-slate-400 text-[10px] font-medium">دقة 98%</div>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DownloadApp;

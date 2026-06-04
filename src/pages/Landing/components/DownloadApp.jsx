import React from 'react';
import { Smartphone, Download, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import NabdAppScreen from '@/assets/NabdAppScreen.png';

const DownloadApp = () => {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-br from-[#0070CD] to-[#005099] rounded-[3rem] overflow-hidden relative shadow-[0_30px_60px_-15px_rgba(0,112,205,0.4)]"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay"
                        style={{ backgroundImage: 'radial-gradient(white 2px, transparent 2px)', backgroundSize: '40px 40px' }}>
                    </div>
                    
                    {/* Glowing Accent */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3399FF]/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center p-12 lg:p-20">

                        {/* Content */}
                        <div className="text-white space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm"
                            >
                                <Smartphone className="w-5 h-5 text-[#3399FF]" />
                                <span className="text-sm font-bold tracking-wide">متاح الآن للتنزيل</span>
                            </motion.div>

                            <motion.h2 
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-4xl lg:text-5xl font-black leading-[1.3]"
                            >
                                حمّل تطبيق نبض<br />
                                واجعل صحتك في متناول يدك
                            </motion.h2>

                            <motion.p 
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="text-blue-100 text-lg leading-relaxed max-w-xl font-medium"
                            >
                                احصل على رعاية صحية متكاملة في جيبك. احجز مواعيدك بسهولة، تواصل مع طبيبك المفضل، واحتفظ بملفك الطبي بأمان تام.
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="flex flex-col sm:flex-row gap-5 pt-2"
                            >
                                <button className="px-8 py-4 bg-white text-[#0070CD] rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1">
                                    <Download className="w-5 h-5" />
                                    تحميل للآيفون (iOS)
                                </button>
                                <button className="px-8 py-4 bg-transparent text-white border-2 border-white/30 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                                    <Download className="w-5 h-5" />
                                    تحميل للأندرويد
                                </button>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.7, duration: 1 }}
                                className="flex items-center gap-10 pt-8 mt-8 border-t border-white/10"
                            >
                                <div>
                                    <div className="text-3xl font-black">+50K</div>
                                    <div className="text-blue-200 text-sm font-medium mt-1">تنزيل نشط</div>
                                </div>
                                <div className="w-px h-12 bg-white/20"></div>
                                <div>
                                    <div className="flex items-center gap-1 text-3xl font-black">
                                        4.9 <Star className="w-6 h-6 text-amber-400 fill-current mb-1" />
                                    </div>
                                    <div className="text-blue-200 text-sm font-medium mt-1">متوسط التقييمات</div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Phone Mockup */}
                        <div className="relative hidden lg:block">
                            <motion.div 
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
                                className="relative mx-auto w-[280px] h-[550px] bg-slate-900 rounded-[3.5rem] shadow-2xl p-3 border-4 border-slate-700 z-10"
                            >
                                <div className="absolute top-0 w-1/2 h-[30px] bg-slate-900 left-1/2 -translate-x-1/2 rounded-b-[1.5rem] z-20"></div>
                                <div className="w-full h-full bg-[#F8FAFC] rounded-[2.5rem] flex items-center justify-center relative overflow-hidden">
                                    <img 
                                        src={NabdAppScreen} 
                                        alt="Nabd App Screen" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </motion.div>

                            {/* Floating Elements */}
                            <motion.div 
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 -right-8 bg-white p-4 rounded-2xl shadow-xl z-20"
                            >
                                <div className="text-3xl">👨‍⚕️</div>
                            </motion.div>
                            <motion.div 
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-20 -left-12 bg-white p-5 rounded-3xl shadow-xl z-20"
                            >
                                <div className="text-4xl">💙</div>
                            </motion.div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DownloadApp;

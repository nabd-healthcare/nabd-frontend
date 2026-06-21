import React from 'react';
import { ArrowLeft, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTA = () => {
    return (
        <section className="py-16 bg-[#F8FAFC] relative overflow-hidden">
            {/* Outer ambient glows — matching the rest of the landing page */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[500px] h-[500px] bg-[#0070CD]/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[400px] h-[400px] bg-[#3399FF]/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative bg-gradient-to-br from-[#003B73] via-[#005ba6] to-[#0070CD] rounded-[3rem] p-10 lg:p-20 overflow-hidden shadow-[0_30px_80px_-15px_rgba(0,112,205,0.45)]"
                >
                    {/* Ambient glows inside card */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3399FF]/20 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/3 pointer-events-none"></div>

                    {/* Dot grid — consistent with Hero, AISection, ContactPage */}
                    <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
                    </div>

                    <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto">

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm"
                        >
                            <HeartPulse className="w-4 h-4 text-blue-200" />
                            <span className="text-white/90 text-sm font-bold tracking-wide">منصة الرعاية الصحية الذكية</span>
                        </motion.div>

                        {/* Heading — italic removed, inline-block used to prevent clipping */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.25, duration: 0.6 }}
                            className="text-[32px] md:text-[38px] lg:text-[44px] font-black text-white leading-[1.25] tracking-tight"
                        >
                            ابدأ رحلتك الصحية{' '}
                            <span className="text-blue-200">اليوم</span>
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.35, duration: 0.6 }}
                            className="text-blue-100/80 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed"
                        >
                            انضم لآلاف المرضى والأطباء الذين يثقون في منصة نبض لإدارة ملفاتهم الطبية بأمان وكفاءة مطلقة.
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.45, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                        >
                            {/* Primary CTA */}
                            <Link
                                to="/register"
                                className="relative group/btn px-10 py-4 bg-white text-[#0070CD] rounded-2xl text-sm md:text-base font-black tracking-wide transition-all hover:bg-blue-50 overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
                            >
                                <span>سجل مجاناً الآن</span>
                                <ArrowLeft className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                            </Link>

                            {/* Secondary CTA */}
                            <Link
                                to="/contact"
                                className="px-10 py-4 bg-white/10 text-white border border-white/25 rounded-2xl text-sm md:text-base font-bold transition-all hover:bg-white/20 hover:border-white/35 flex items-center justify-center backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0"
                            >
                                تواصل مع فريق الدعم
                            </Link>
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;

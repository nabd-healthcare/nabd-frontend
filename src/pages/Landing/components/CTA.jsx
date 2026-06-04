import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTA = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative bg-gradient-to-br from-[#0B1423] via-[#122A4E] to-[#0B1423] rounded-[3rem] p-12 lg:p-24 overflow-hidden shadow-2xl group border border-[#0070CD]/20"
                >
                    {/* Decorative Ambient Glows */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#0070CD]/20 rounded-full blur-[120px] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3399FF]/10 rounded-full blur-[100px] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
                    
                    {/* Modern Grid Background */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                        style={{ backgroundImage: 'linear-gradient(#ffffff 2px, transparent 2px), linear-gradient(90deg, #ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }}>
                    </div>

                    <div className="relative z-10 text-center space-y-8">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-sm"
                        >
                            ابدأ رحلتك الصحية <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#3399FF] to-[#0070CD] italic">اليوم</span>
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-blue-100/70 text-xl font-medium max-w-2xl mx-auto leading-relaxed"
                        >
                            انضم لآلاف المبتكرين في الرعاية الصحية الذين يثقون في منصة "نبض" لإدارة ومتابعة أدق ملفاتهم الطبية بأمان وكفاءة مطلقة.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
                        >
                            <Link to="/register" className="relative group/btn px-12 py-5 bg-[#0070CD] text-white rounded-2xl font-black tracking-wide transition-all hover:bg-[#005099] overflow-hidden shadow-[0_10px_30px_rgba(0,112,205,0.4)] hover:-translate-y-1 active:translate-y-0.5 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[100%] group-hover/btn:-translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                                <div className="flex items-center justify-center gap-3 relative z-10">
                                    <span>سجل مجاناً الآن</span>
                                    <ArrowLeft className="w-5 h-5 group-hover/btn:-translate-x-2 transition-transform" />
                                </div>
                            </Link>
                            
                            <Link to="/contact" className="px-12 py-5 bg-white/5 backdrop-blur-md text-white border-2 border-white/10 rounded-2xl font-bold transition-all hover:bg-white/10 hover:border-white/20 flex items-center justify-center shadow-lg hover:-translate-y-1">
                                تواصل مع المبيعات
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;

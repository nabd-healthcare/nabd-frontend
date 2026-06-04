import React from 'react';
import { Sparkles, CheckCircle, ArrowRight, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';

const AISection = () => {
    return (
        <section id="ai-section" className="py-32 bg-[#0B1423] relative overflow-hidden">
            {/* Advanced Ambient Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#0070CD]/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#3399FF]/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Content Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="space-y-10"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#0070CD]/10 text-[#3399FF] border border-[#0070CD]/30 backdrop-blur-md shadow-2xl">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest">الذكاء الاصطناعي التوليدي</span>
                        </div>

                        <h2 className="text-5xl lg:text-7xl font-black text-white leading-[1.2] tracking-tight">
                            تحليل فوري، <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3399FF] to-[#0070CD]">رؤية طبية أعمق</span>
                        </h2>

                        <p className="text-slate-400 text-xl leading-relaxed font-medium">
                            تتجاوز تقنياتنا مجرد معالجة البيانات؛ فهي تفهم التعقيدات الطبية بصورة لحظية، مما يمنح الفريق الطبي أداة استرشادية ذكية تقلل من هامش الخطأ لضمان سلامة المرضى.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {[
                                "تحليل حيوي للأعراض",
                                "تنبؤات دقيقة 98%",
                                "كشف التداخلات الدوائية",
                                "متابعة ذكية ومستمرة"
                            ].map((item, index) => (
                                <motion.div 
                                    key={index} 
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#3399FF]/50 transition-colors shadow-sm"
                                >
                                    <div className="w-10 h-10 bg-[#0070CD]/20 rounded-xl flex items-center justify-center text-[#3399FF]">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-slate-300 font-bold">{item}</span>
                                </motion.div>
                            ))}
                        </div>

                        <button className="group relative px-8 py-4 bg-[#0070CD] text-white rounded-2xl font-bold transition-all hover:bg-[#005099] shadow-[0_8px_25px_rgba(0,112,205,0.3)] hover:shadow-[0_12px_30px_rgba(0,112,205,0.4)] flex items-center gap-4">
                            <span>استكشف الذكاء الاصطناعي</span>
                            <ArrowRight className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Visual Section: Diagnosis Canvas */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="relative perspective-1000"
                    >
                        {/* Interactive scanning container */}
                        <div className="bg-[#121E2F] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                            
                            {/* Scanning Animation Line */}
                            <motion.div 
                                animate={{ y: ['0%', '400%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                className="absolute left-0 right-0 h-24 bg-gradient-to-b from-[#3399FF]/0 via-[#3399FF]/10 to-[#3399FF]/0 z-20 pointer-events-none border-b border-[#3399FF]/30"
                            />

                            <div className="flex items-center gap-5 border-b border-white/10 pb-8 relative z-10 mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#005099] to-[#0070CD] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                                    <ScanLine className="w-8 h-8 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-white font-black text-xl tracking-tight">قراءة العلامات الحيوية</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                        <span className="text-[#3399FF] text-xs font-bold uppercase tracking-widest">Processing...</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="bg-black/20 rounded-2xl p-6 border border-white/5 transition-all hover:bg-black/40 hover:border-[#3399FF]/30">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-slate-400 font-bold text-sm">احتمالية التشخيص</span>
                                        <span className="text-[#3399FF] font-black text-xl">95%</span>
                                    </div>
                                    <div className="h-2.5 bg-[#0B1423] rounded-full overflow-hidden shadow-inner">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "95%" }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-[#005099] to-[#3399FF] shadow-[0_0_15px_rgba(51,153,255,0.6)]"
                                        />
                                    </div>
                                    <p className="text-white font-black text-lg mt-4 tracking-tight">التهاب الشعب الهوائية الحاد</p>
                                </div>

                                <div className="bg-black/10 rounded-2xl p-6 border border-white/5 opacity-70">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-slate-500 font-bold text-sm">احتمالية التشخيص</span>
                                        <span className="text-[#0070CD] font-black text-xl">82%</span>
                                    </div>
                                    <div className="h-2 bg-[#0B1423] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0070CD] w-[82%]"></div>
                                    </div>
                                    <p className="text-slate-400 font-bold text-lg mt-4">التهاب رئوي متقدم</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AISection;

import React from 'react';
import { Sparkles, CheckCircle, ArrowRight, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';

const AISection = () => {
    return (
        <section id="ai-section" className="py-32 bg-[#F8FAFC] relative overflow-hidden">
            {/* Ambient background glows — consistent with Hero & Features */}
            <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#0070CD]/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#3399FF]/5 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Subtle dot grid — matches Hero */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none"
                style={{ backgroundImage: 'radial-gradient(#005099 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Badge — matches Features section style */}
                        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-5 py-2 rounded-full">
                            <Sparkles className="w-4 h-4 text-[#0070CD]" />
                            <span className="text-[#0070CD] font-bold text-sm tracking-wide">الذكاء الاصطناعي التوليدي</span>
                        </div>

                        {/* Heading — improved line-height and spacing */}
                        <h2 className="text-[32px] md:text-[36px] lg:text-[40px] font-black text-[#1F2E3C] leading-[1.35] tracking-tight">
                            تحليل فوري،{' '}
                            <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#0070CD] to-[#3399FF] inline-block mt-4">
                                رؤية طبية أعمق
                            </span>
                        </h2>

                        {/* Body text — matches Features description style */}
                        <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium max-w-lg">
                            تتجاوز تقنياتنا مجرد معالجة البيانات؛ فهي تفهم التعقيدات الطبية بصورة لحظية، مما يمنح الفريق الطبي أداة استرشادية ذكية تقلل من هامش الخطأ لضمان سلامة المرضى.
                        </p>

                        {/* Feature cards grid — white surfaces on light bg */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { label: "تحليل حيوي للأعراض" },
                                { label: "تنبؤات دقيقة 98%" },
                                { label: "كشف التداخلات الدوائية" },
                                { label: "متابعة ذكية ومستمرة" },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 hover:border-[#0070CD]/30 hover:shadow-md transition-all shadow-sm"
                                >
                                    <div className="w-9 h-9 bg-[#0070CD]/10 rounded-xl flex items-center justify-center text-[#0070CD] flex-shrink-0">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-[#1F2E3C] font-bold text-sm">{item.label}</span>
                                </motion.div>
                            ))}
                        </div>

                       

                    </motion.div>

                    {/* Visual Section: Diagnosis Canvas */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="relative perspective-1000"
                    >
                        {/* Main card — white surface matching auth & patient pages */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,112,205,0.08)] relative overflow-hidden group">

                            {/* Scanning Animation Line */}
                            <motion.div
                                animate={{ y: ['0%', '400%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                className="absolute left-0 right-0 h-24 bg-gradient-to-b from-[#0070CD]/0 via-[#0070CD]/5 to-[#0070CD]/0 z-20 pointer-events-none border-b border-[#0070CD]/15"
                            />

                            {/* Decorative blue glow in card corner */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#0070CD]/5 rounded-full blur-[60px] pointer-events-none"></div>

                            {/* Card Header */}
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-7 relative z-10 mb-7">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#0070CD] to-[#005099] rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(0,112,205,0.25)] group-hover:rotate-12 transition-transform duration-500 flex-shrink-0">
                                    <ScanLine className="w-7 h-7 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[#1F2E3C] font-black text-lg tracking-tight">قراءة العلامات الحيوية</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                                        <span className="text-[#0070CD] text-sm font-bold uppercase tracking-widest">Processing...</span>
                                    </div>
                                </div>
                            </div>

                            {/* Diagnosis Results */}
                            <div className="space-y-5 relative z-10">
                                {/* Primary diagnosis — active/highlighted */}
                                <div className="bg-[#F0F7FF] rounded-2xl p-5 border border-[#0070CD]/15 hover:border-[#0070CD]/30 transition-all">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-slate-500 font-bold text-sm">احتمالية التشخيص</span>
                                        <span className="text-[#0070CD] font-black text-xl">95%</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner mb-4">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "95%" }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-[#005099] to-[#3399FF] rounded-full"
                                        />
                                    </div>
                                    <p className="text-[#1F2E3C] font-black text-lg tracking-tight">التهاب الشعب الهوائية الحاد</p>
                                </div>

                                {/* Secondary diagnosis — dimmed */}
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 opacity-70">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-slate-400 font-bold text-sm">احتمالية التشخيص</span>
                                        <span className="text-slate-500 font-black text-xl">82%</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-slate-400 rounded-full w-[82%]"></div>
                                    </div>
                                    <p className="text-slate-500 font-bold text-lg">التهاب رئوي متقدم</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating accent badge */}
                        <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_30px_rgba(0,112,205,0.12)] border border-slate-100 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[#1F2E3C] font-black text-sm">دقة تشخيص 98%</span>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AISection;

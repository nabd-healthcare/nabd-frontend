import React, { useState } from 'react';
import { Brain, FileText, Calendar, ShieldCheck, Smartphone, Users, ChevronLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const featuresList = [
    {
        id: 'ai',
        icon: <Brain className="w-8 h-8" />,
        title: "مساعد ذكي للأطباء",
        description: "تقليل أخطاء التشخيص باستخدام نماذج ذكاء اصطناعي مدربة تقترح الاحتمالات وتراجع التفاعلات الدوائية بشكل فوري ودقيق.",
        color: "from-blue-600 to-blue-400",
        shadow: "shadow-blue-500/20",
        bg: "bg-blue-50"
    },
    {
        id: 'records',
        icon: <FileText className="w-8 h-8" />,
        title: "سجل طبي موحد",
        description: "تاريخك المرضي الكامل، الروشتات السابقة، وتحاليلك الطبية محفوظة في مكان واحد آمن يسهل الوصول إليه في أي وقت.",
        color: "from-indigo-600 to-indigo-400",
        shadow: "shadow-indigo-500/20",
        bg: "bg-indigo-50"
    },
    {
        id: 'manage',
        icon: <Calendar className="w-8 h-8" />,
        title: "إدارة متكاملة الذكاء",
        description: "نظام حجز ذكي ومتقدم، وإدارة مواعيد العيادات التي توفر وقت الطبيب والمريض مع إشعارات تذكيرية تلقائية.",
        color: "from-cyan-600 to-cyan-400",
        shadow: "shadow-cyan-500/20",
        bg: "bg-cyan-50"
    },
    {
        id: 'security',
        icon: <ShieldCheck className="w-8 h-8" />,
        title: "أمان وخصوصية تامة",
        description: "تشفير شامل وحماية قصوى لبياناتك الطبية (End-to-End Encryption) تتوافق مع أعلى معايير الخصوصية العالمية.",
        color: "from-emerald-600 to-emerald-400",
        shadow: "shadow-emerald-500/20",
        bg: "bg-emerald-50"
    },
    {
        id: 'app',
        icon: <Smartphone className="w-8 h-8" />,
        title: "تطبيق متطور للمرضى",
        description: "حجز المواعيد، متابعة جرعات الأدوية، والتواصل مع أطبائك المفضلين مباشرة من هاتفك الذكي بكل سهولة.",
        color: "from-[#0070CD] to-[#3399FF]",
        shadow: "shadow-[#0070CD]/20",
        bg: "bg-[#0070CD]/5"
    },
    {
        id: 'community',
        icon: <Users className="w-8 h-8" />,
        title: "مجتمع طبي متصل",
        description: "تواصل مع نخبة الأطباء وشارك الاستشارات الطبية ضمن شبكة موثوقة تهدف للارتقاء بمستوى الرعاية الصحية.",
        color: "from-purple-600 to-purple-400",
        shadow: "shadow-purple-500/20",
        bg: "bg-purple-50"
    }
];

const Features = () => {
    const [activeFeature, setActiveFeature] = useState(featuresList[0]);

    return (
        <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#0070CD]/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-5 py-2 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-[#0070CD]" />
                        <span className="text-[#0070CD] font-bold text-sm tracking-wide">الجيل الجديد من الرعاية</span>
                    </div>
                    <h2 className="text-[32px] md:text-[36px] lg:text-[40px] font-black text-[#1F2E3C] mb-6 tracking-tight">
                        قدرات تقنية <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#0070CD] to-[#3399FF]">لا حدود لها</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
                        استكشف كيف يجمع "نبض" بين التطور التقني والرعاية الإنسانية لتقديم حلول شاملة لكل من الأطباء والمرضى.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    {/* Interactive List (Tabs) */}
                    <div className="lg:col-span-5 space-y-3">
                        {featuresList.map((feature, idx) => {
                            const isActive = activeFeature.id === feature.id;
                            return (
                                <motion.button
                                    key={feature.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    onClick={() => setActiveFeature(feature)}
                                    className={`w-full text-right p-5 rounded-2xl transition-all duration-300 flex items-center gap-5 group border-2 ${
                                        isActive 
                                        ? `bg-white border-[#0070CD]/20 shadow-lg ${feature.shadow}` 
                                        : 'bg-transparent border-transparent hover:bg-white/60 hover:border-slate-200'
                                    }`}
                                >
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                                        isActive 
                                        ? `bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-blue-500/30 scale-110` 
                                        : 'bg-white text-slate-400 shadow-sm group-hover:text-[#0070CD] group-hover:bg-blue-50'
                                    }`}>
                                        {feature.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`text-lg md:text-xl font-bold mb-1 transition-colors ${isActive ? 'text-[#0070CD]' : 'text-[#1F2E3C] group-hover:text-[#0070CD]'}`}>
                                            {feature.title}
                                        </h3>
                                        {/* Show brief preview for non-active if desired, or keep it clean */}
                                        <p className="text-sm text-slate-500 font-medium line-clamp-1">{feature.description}</p>
                                    </div>
                                    <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'opacity-100 text-[#0070CD] -translate-x-1' : 'opacity-0 text-slate-300 translate-x-2 group-hover:opacity-100'}`} />
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Active Feature Showcase */}
                    <div className="lg:col-span-7 h-[500px] lg:h-[600px] relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeFeature.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={`absolute inset-0 rounded-[3rem] ${activeFeature.bg} border-2 border-white/50 p-10 lg:p-14 overflow-hidden shadow-2xl flex flex-col justify-center`}
                            >
                                {/* Decorative Big Icon Background */}
                                <motion.div 
                                    initial={{ opacity: 0, rotate: -20, scale: 0.5 }}
                                    animate={{ opacity: 0.05, rotate: 10, scale: 2.5 }}
                                    transition={{ duration: 1 }}
                                    className="absolute -left-10 bottom-0 text-slate-900 pointer-events-none"
                                >
                                    {React.cloneElement(activeFeature.icon, { className: 'w-96 h-96' })}
                                </motion.div>

                                <div className="relative z-10">
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${activeFeature.color} text-white flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20`}>
                                        {React.cloneElement(activeFeature.icon, { className: 'w-10 h-10' })}
                                    </div>
                                    
                                    <h3 className="text-[32px] md:text-[36px] lg:text-[40px] font-black text-[#1F2E3C] mb-6 leading-tight">
                                        {activeFeature.title}
                                    </h3>
                                    
                                    <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-lg">
                                        {activeFeature.description}
                                    </p>


                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;

import React from 'react';
import { UserPlus, Search, CalendarCheck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
    {
        icon: <UserPlus className="w-8 h-8" />,
        title: "أنشئ حسابك",
        description: "سجل كطبيب أو مريض في ثوانٍ معدودة وابدأ رحلتك الصحية بسهولة وموثوقية."
    },
    {
        icon: <Search className="w-8 h-8" />,
        title: "ابحث عن طبيب",
        description: "تصفح قائمة من خيرة الأطباء، مع فلترة دقيقة حسب التخصص والتقييم والموقع."
    },
    {
        icon: <CalendarCheck className="w-8 h-8" />,
        title: "احجز موعدك",
        description: "اختر الموعد المناسب لك واحجز فوراً وبدون انتظار طويل في العيادات."
    },
    {
        icon: <FileText className="w-8 h-8" />,
        title: "احصل على الرعاية",
        description: "زر الطبيب واحتفظ بملفك الطبي ووصفاتك إلكترونياً بأمان تام."
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-32 bg-[#F8FAFC] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-gradient-to-l from-blue-50 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-[32px] md:text-[36px] lg:text-[40px] font-black text-[#1F2E3C] mb-6 tracking-tight">
                        كيف يوفر <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0070CD] to-[#3399FF]">نبض</span> الرعاية لك؟
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        خطوات بسيطة مصممة لتجعل وصولك للرعاية الصحية أسرع وأكثر أماناً وفعالية.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connecting Line path (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0"></div>
                    
                    {/* Animated fill line */}
                    <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "80%" }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                        className="hidden md:block absolute top-[60px] right-[10%] h-[2px] bg-gradient-to-l from-[#0070CD] to-[#3399FF] z-0"
                    ></motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="relative text-center group"
                            >
                                {/* Circle Number Indicator */}
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white text-[#0070CD] font-black rounded-full border-2 border-[#0070CD] flex items-center justify-center shadow-md z-20">
                                    {index + 1}
                                </div>

                                {/* Main Icon Hexagon shape approx */}
                                <div className="w-32 h-32 mx-auto bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,112,205,0.15)] flex items-center justify-center text-[#0070CD] mb-8 group-hover:-translate-y-3 group-hover:shadow-[0_25px_50px_-15px_rgba(0,112,205,0.25)] transition-all duration-300 border border-slate-50 group-hover:border-[#0070CD]/20 relative">
                                    <div className="absolute inset-0 bg-[#0070CD]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                                        {step.icon}
                                    </div>
                                </div>
                                
                                <h3 className="text-lg md:text-xl font-bold text-[#1F2E3C] mb-3">{step.title}</h3>
                                <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-[250px] mx-auto">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

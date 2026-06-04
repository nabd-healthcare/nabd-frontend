import React, { useState, useEffect } from 'react';
import { Quote, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
    {
        name: "أحمد علي",
        role: "مريض",
        rating: 5,
        text: "تجربة رائعة! تمكنت من حجز موعد مع طبيب القلب في دقائق، والذكاء الاصطناعي ساعد الطبيب في تشخيص حالتي بدقة عالية.",
        image: "https://ui-avatars.com/api/?name=Ahmed+Ali&background=0070CD&color=fff&size=100"
    },
    {
        name: "د. منى إبراهيم",
        role: "طبيبة أطفال",
        rating: 5,
        text: "نظام نبض وفر علي الكثير من الوقت في إدارة العيادة، والمساعد الذكي ساعدني في مراجعة التشخيصات والتفاعلات الدوائية.",
        image: "https://ui-avatars.com/api/?name=Mona+Ibrahim&background=3399FF&color=fff&size=100"
    },
    {
        name: "فاطمة محمد",
        role: "مريضة",
        rating: 5,
        text: "أخيراً أصبح لدي ملف طبي موحد يحتوي على كل تاريخي المرضي ووصفاتي. سهل جداً ومريح في الاستخدام!",
        image: "https://ui-avatars.com/api/?name=Fatma+Mohamed&background=005099&color=fff&size=100"
    },
    {
        name: "د. خالد عمر",
        role: "استشاري قلب",
        rating: 5,
        text: "المنصة توفر تواصلاً ممتازاً مع المرضى ومتابعة دقيقة لحالتهم الصحية عن بعد. أنصح بها بشدة لزملائي الأطباء.",
        image: "https://ui-avatars.com/api/?name=Khaled+Omar&background=1a8cff&color=fff&size=100"
    },
    {
        name: "سارة محمود",
        role: "صيدلانية",
        rating: 5,
        text: "سهولة التعامل مع الوصفات الإلكترونية وتقليل الأخطاء الطبية هو أكثر ما يميز نظام نبض عن أي نظام آخر.",
        image: "https://ui-avatars.com/api/?name=Sarah+Mahmoud&background=003d73&color=fff&size=100"
    },
    {
        name: "محمود حسن",
        role: "مريض",
        rating: 4,
        text: "التطبيق سهل الاستخدام جداً، وخدمة العملاء متعاونة وسريعة الاستجابة في حال واجهت أي مشكلة.",
        image: "https://ui-avatars.com/api/?name=Mahmoud+Hassan&background=008cff&color=fff&size=100"
    }
];

const Testimonials = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(1);
    
    // On mobile show 1, tablet 2, desktop 3
    // For simplicity in this static calculation, we group by 3 for desktop
    const itemsPerPage = 3;
    const totalPages = Math.ceil(testimonials.length / itemsPerPage);

    useEffect(() => {
        const interval = setInterval(() => {
            setDirection(1);
            setCurrentPage((prev) => (prev + 1) % totalPages);
        }, 5000);
        return () => clearInterval(interval);
    }, [totalPages]);

    const slides = Array.from({ length: totalPages }, (_, i) => 
        testimonials.slice(i * itemsPerPage, (i + 1) * itemsPerPage)
    );

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <section className="py-32 bg-[#F8FAFC] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0070CD]/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#3399FF]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <span className="text-[#0070CD] font-black text-xs uppercase tracking-widest mb-4 block">قصص نجاح</span>
                    <h2 className="text-4xl lg:text-5xl font-black text-[#1F2E3C] mb-6 tracking-tight">
                        آراء تعكس جودة <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0070CD] to-[#3399FF]">الرعاية</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                        آراء حقيقية من أطباء ومرضى يستخدمون منصة نبض يومياً لتحسين نمط حياتهم الصحي والمهني.
                    </p>
                </motion.div>

                <div className="relative w-full h-[450px] md:h-[300px]">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentPage}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.3 }
                            }}
                            className="absolute inset-0 w-full"
                        >
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 h-full">
                                {slides[currentPage]?.map((testimonial, index) => (
                                    <div key={index} className="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,112,205,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(0,112,205,0.15)] hover:-translate-y-2 transition-all duration-300 relative group border border-slate-100 flex flex-col h-full">
                                        <Quote className="absolute top-8 left-8 w-14 h-14 text-[#0070CD]/5 group-hover:text-[#0070CD]/10 transition-colors" />

                                        <div className="flex items-center gap-4 mb-6 relative z-10">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-[#0070CD]/20 rounded-full blur-md group-hover:blur-lg transition-all scale-110"></div>
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="w-16 h-16 rounded-full border-2 border-white relative z-10 shadow-sm"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1F2E3C] text-lg">{testimonial.name}</h4>
                                                <p className="text-sm font-medium text-[#0070CD]">{testimonial.role}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-1 mb-5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} 
                                                />
                                            ))}
                                        </div>

                                        <p className="text-slate-600 leading-relaxed font-medium relative z-10 flex-1">
                                            "{testimonial.text}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-3 mt-16 relative z-20">
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > currentPage ? 1 : -1);
                                setCurrentPage(idx);
                            }}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                idx === currentPage 
                                    ? 'bg-[#0070CD] w-10' 
                                    : 'bg-slate-300 hover:bg-slate-400 w-2.5'
                            }`}
                            aria-label={`Page ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

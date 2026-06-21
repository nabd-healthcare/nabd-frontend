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
    const [itemsPerPage, setItemsPerPage] = useState(3);

    // Responsive items per page
    useEffect(() => {
        const update = () => {
            if (window.innerWidth >= 1024) setItemsPerPage(3);
            else if (window.innerWidth >= 640) setItemsPerPage(2);
            else setItemsPerPage(1);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const totalPages = Math.ceil(testimonials.length / itemsPerPage);

    // Reset page when itemsPerPage changes to avoid going out of bounds
    useEffect(() => {
        setCurrentPage(0);
    }, [itemsPerPage]);

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
        enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 })
    };

    // Approximate container height per number of cards on screen
    const containerMinHeight = itemsPerPage === 1 ? 'min-h-[280px]' : 'min-h-[320px]';

    return (
        <section className="py-16 md:py-24 lg:py-32 bg-[#F8FAFC] relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0070CD]/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#3399FF]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10 md:mb-16 lg:mb-24"
                >
                    <span className="text-[#0070CD] font-black text-sm uppercase tracking-widest mb-4 block">قصص نجاح</span>
                    <h2 className="text-[26px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-black text-[#1F2E3C] mb-4 md:mb-6 tracking-tight">
                        آراء تعكس جودة{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0070CD] to-[#3399FF]">الرعاية</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed font-medium">
                        آراء حقيقية من أطباء ومرضى يستخدمون منصة نبض يومياً لتحسين نمط حياتهم الصحي والمهني.
                    </p>
                </motion.div>

                {/* Slider container — overflow:hidden clips exiting slides */}
                <div className={`relative w-full overflow-hidden ${containerMinHeight}`}>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={`${currentPage}-${itemsPerPage}`}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ x: { type: "tween", duration: 0.4, ease: "easeInOut" }, opacity: { duration: 0.25 } }}
                            className="w-full"
                        >
                            <div className={`grid gap-5 ${
                                itemsPerPage === 1 ? 'grid-cols-1' :
                                itemsPerPage === 2 ? 'grid-cols-2' :
                                'grid-cols-3'
                            }`}>
                                {slides[currentPage]?.map((testimonial, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-5 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,112,205,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(0,112,205,0.15)] hover:-translate-y-1 transition-all duration-300 relative group border border-slate-100 flex flex-col"
                                    >
                                        <Quote className="absolute top-5 left-5 w-10 h-10 md:w-14 md:h-14 text-[#0070CD]/5 group-hover:text-[#0070CD]/10 transition-colors" />

                                        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 relative z-10">
                                            <div className="relative flex-shrink-0">
                                                <div className="absolute inset-0 bg-[#0070CD]/20 rounded-full blur-md group-hover:blur-lg transition-all scale-110"></div>
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-white relative z-10 shadow-sm"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1F2E3C] text-base md:text-lg">{testimonial.name}</h4>
                                                <p className="text-xs sm:text-sm font-medium text-[#0070CD]">{testimonial.role}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-1 mb-3 md:mb-5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < testimonial.rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium relative z-10 flex-1">
                                            "{testimonial.text}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pagination dots */}
                <div className="flex justify-center gap-3 mt-8 md:mt-14 relative z-20">
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > currentPage ? 1 : -1);
                                setCurrentPage(idx);
                            }}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                idx === currentPage
                                    ? 'bg-[#0070CD] w-8 sm:w-10'
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

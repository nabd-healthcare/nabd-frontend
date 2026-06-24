import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, MapPin, Briefcase, Star } from 'lucide-react';

const doctorsData = [
    {
        name: 'د. يوسف حمدي',
        specialty: 'طبيب عام',
        rating: 4.9,
        reviews: 120,
        bio: "طبيب عام بخبرة واسعة في تشخيص وعلاج الحالات الطارئة والمزمنة، يهتم بتقديم رعاية صحية متكاملة.",
        experience: '5+ سنة خبرة',
        location: 'الجيزة - المهندسين',
        imageSrc: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=faces'
    },
    {
        name: 'د. علياء المصري',
        specialty: 'طبيبة أطفال',
        rating: 4.8,
        reviews: 95,
        bio: 'متخصصة في طب الأطفال وحديثي الولادة، تقدم متابعة شاملة لنمو الطفل وصحته.',
        experience: '2+ سنوات خبرة',
        location: 'القاهرة - مدينة نصر',
        imageSrc: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=faces'
    },
    {
        name: 'د. أحمد الشريف',
        specialty: 'جراح عظام',
        rating: 4.9,
        reviews: 210,
        bio: 'استشاري جراحة العظام متخصص في الإصابات الرياضية وتغيير المفاصل.',
        experience: '3+ سنة خبرة',
        location: 'الإسكندرية - سموحة',
        imageSrc: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=500&fit=crop&crop=faces'
    },
    {
        name: 'د. نورهان السيد',
        specialty: 'طبيبة نساء وتوليد',
        rating: 4.7,
        reviews: 88,
        bio: 'تقدم رعاية متكاملة لصحة المرأة، ومتابعة الحمل والولادة بأحدث التقنيات.',
        experience: '1+ سنوات خبرة',
        location: 'الزقازيق - زراعه',
        imageSrc: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=500&fit=crop&crop=faces'
    },
    {
        name: 'د. سارة إبراهيم',
        specialty: 'طبيبة جلدية',
        rating: 4.8,
        reviews: 150,
        bio: 'متخصصة في علاج الأمراض الجلدية والتجميل والليزر، عضو الجمعية المصرية للأمراض الجلدية.',
        experience: '7+ سنة خبرة',
        location: 'الجيزة - الشيخ زايد',
        imageSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=500&fit=crop&crop=faces'
    },
    {
        name: 'د. كريم عبد العزيز',
        specialty: 'طبيب قلب وأوعية دموية',
        rating: 5.0,
        reviews: 300,
        bio: 'استشاري أمراض القلب والقسطرة العلاجية، حاصل على الزمالة البريطانية لأمراض القلب.',
        experience: '2+ سنة خبرة',
        location: 'القاهرة - المعادي',
        imageSrc: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=500&fit=crop&crop=faces'
    }
];

const DoctorCard = ({ currentDoc, navigate }) => (
    <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col lg:flex-row overflow-hidden border border-slate-100 h-full">
        {/* Image */}
        <div className="lg:w-5/12 relative overflow-hidden shrink-0">
            <div className="relative w-full h-56 sm:h-64 lg:h-full lg:min-h-[420px] overflow-hidden">
                <div className="absolute inset-0 bg-[#0070CD]/20 mix-blend-overlay z-10"></div>
                <img
                    src={currentDoc.imageSrc}
                    alt={currentDoc.name}
                    className="w-full h-full object-cover object-[center_15%] lg:object-top"
                />
            </div>
        </div>

        {/* Content */}
        <div className="lg:w-7/12 p-5 sm:p-7 lg:p-10 xl:p-12 flex flex-col justify-center bg-[#F0F7FF]/50 grow">
            <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 mb-1 lg:mb-2">{currentDoc.name}</h3>
                    <p className="text-[#0070CD] font-bold text-sm sm:text-base lg:text-lg">{currentDoc.specialty}</p>
                </div>
                <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-full shadow-sm border border-slate-100 flex-shrink-0 ml-2">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-current" />
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">{currentDoc.rating}</span>
                    <span className="text-slate-400 text-xs hidden sm:inline">({currentDoc.reviews}+)</span>
                </div>
            </div>

            <p className="text-slate-600 text-sm lg:text-base leading-relaxed font-medium mb-5 lg:mb-8">
                {currentDoc.bio}
            </p>

            <div className="flex flex-col xs:flex-row gap-3 sm:gap-6 mb-5 lg:mb-10">
                <div className="flex items-center gap-2 sm:gap-3 text-slate-700">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#0070CD] flex-shrink-0">
                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm lg:text-base">{currentDoc.experience}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-slate-700">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#0070CD] flex-shrink-0">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm lg:text-base">{currentDoc.location}</span>
                </div>
            </div>

            <div className="flex gap-3 mt-auto">
                <button
                    onClick={() => navigate('/register?role=patient')}
                    className="flex-1 bg-[#0070CD] text-white py-3 lg:py-4 rounded-xl lg:rounded-2xl text-sm lg:text-base font-bold hover:bg-[#005099] shadow-[0_8px_20px_rgba(0,112,205,0.25)] hover:shadow-[0_10px_25px_rgba(0,112,205,0.35)] hover:-translate-y-0.5 transition-all"
                >
                    احجز الآن
                </button>
                <button
                    onClick={() => navigate('/register?role=patient')}
                    className="flex-1 bg-white text-[#0070CD] border-2 border-[#0070CD]/20 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-sm lg:text-base font-bold hover:bg-[#F0F7FF] transition-colors"
                >
                    الملف الشخصي
                </button>
            </div>
        </div>
    </div>
);

const DoctorsSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const navigate = useNavigate();

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % doctorsData.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + doctorsData.length) % doctorsData.length);
    };

    const variants = {
        enter: (direction) => ({ x: direction > 0 ? 40 : -40, opacity: 0, scale: 0.98 }),
        center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
        exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 40 : -40, opacity: 0, scale: 0.98 })
    };

    const currentDoc = doctorsData[currentIndex];

    return (
        <section id="doctors" className="py-16 md:py-24 lg:py-32 bg-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-16">
                    <span className="text-[#0070CD] font-black text-sm uppercase tracking-widest mb-4 block">نخبة الأطباء</span>
                    <h2 className="text-[26px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-black text-slate-900 mb-4 md:mb-6 tracking-tight">
                        رعاية طبية بأيدي{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#005099] to-[#3399FF]">خبراء</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                        اختر من بين أفضل القطاعات الطبية في مصر، تقييمات حقيقية وخبرات موثوقة.
                    </p>
                </div>

                {/* Mobile/Tablet Swipeable List */}
                <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 pt-4 -mx-4 sm:-mx-6 px-4 sm:px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {doctorsData.map((doc, idx) => (
                        <div key={idx} className="snap-center shrink-0 w-[85%] sm:w-[65%] md:w-[45%] h-auto">
                            <DoctorCard currentDoc={doc} navigate={navigate} />
                        </div>
                    ))}
                </div>

                {/* Desktop Slider */}
                <div className="relative w-full max-w-4xl mx-auto hidden lg:block">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "tween", duration: 0.4, ease: "easeOut" },
                                opacity: { duration: 0.3 },
                                scale: { duration: 0.3 }
                            }}
                            className="w-full"
                        >
                            <DoctorCard currentDoc={currentDoc} navigate={navigate} />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows — inside card boundary on mobile, outside on desktop */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-2 md:-left-14 z-20">
                        <button
                            onClick={prevSlide}
                            className="w-9 h-9 sm:w-12 sm:h-12 bg-white/90 md:bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-[#0070CD] hover:scale-110 hover:bg-[#F0F7FF] transition-all backdrop-blur-sm"
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 mr-0.5" />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-2 md:-right-14 z-20">
                        <button
                            onClick={nextSlide}
                            className="w-9 h-9 sm:w-12 sm:h-12 bg-white/90 md:bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-[#0070CD] hover:scale-110 hover:bg-[#F0F7FF] transition-all backdrop-blur-sm"
                        >
                            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 ml-0.5" />
                        </button>
                    </div>
                </div>

                {/* Pagination */}
                <div className="hidden lg:flex justify-center gap-3 mt-8 md:mt-14">
                    {doctorsData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? 'w-8 sm:w-10 bg-[#0070CD]'
                                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DoctorsSlider;

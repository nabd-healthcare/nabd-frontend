import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, MapPin, Briefcase, Star } from 'lucide-react';

const doctorsData = [
    {
        name: 'د. يوسف حمدي',
        specialty: 'طبيب عام',
        rating: 4.9,
        reviews: 120,
        bio: "طبيب عام بخبرة واسعة في تشخيص وعلاج الحالات الطارئة والمزمنة، يهتم بتقديم رعاية صحية متكاملة.",
        experience: '12+ سنة خبرة',
        location: 'الجيزة - المهندسين',
        imageSrc: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop'
    },
    {
        name: 'د. علياء المصري',
        specialty: 'طبيبة أطفال',
        rating: 4.8,
        reviews: 95,
        bio: 'متخصصة في طب الأطفال وحديثي الولادة، تقدم متابعة شاملة لنمو الطفل وصحته.',
        experience: '10+ سنوات خبرة',
        location: 'القاهرة - مدينة نصر',
        imageSrc: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop'
    },
    {
        name: 'د. أحمد الشريف',
        specialty: 'جراح عظام',
        rating: 4.9,
        reviews: 210,
        bio: 'استشاري جراحة العظام متخصص في الإصابات الرياضية وتغيير المفاصل.',
        experience: '18+ سنة خبرة',
        location: 'الإسكندرية - سموحة',
        imageSrc: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=500&fit=crop'
    },
    {
        name: 'د. نورهان السيد',
        specialty: 'طبيبة نساء وتوليد',
        rating: 4.7,
        reviews: 88,
        bio: 'تقدم رعاية متكاملة لصحة المرأة، ومتابعة الحمل والولادة بأحدث التقنيات.',
        experience: '9+ سنوات خبرة',
        location: 'القاهرة - التجمع الخامس',
        imageSrc: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=500&fit=crop'
    },
    {
        name: 'د. سارة إبراهيم',
        specialty: 'طبيبة جلدية',
        rating: 4.8,
        reviews: 150,
        bio: 'متخصصة في علاج الأمراض الجلدية والتجميل والليزر، عضو الجمعية المصرية للأمراض الجلدية.',
        experience: '11+ سنة خبرة',
        location: 'الجيزة - الشيخ زايد',
        imageSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=500&fit=crop'
    },
    {
        name: 'د. كريم عبد العزيز',
        specialty: 'طبيب قلب وأوعية دموية',
        rating: 5.0,
        reviews: 300,
        bio: 'استشاري أمراض القلب والقسطرة العلاجية، حاصل على الزمالة البريطانية لأمراض القلب.',
        experience: '20+ سنة خبرة',
        location: 'القاهرة - المعادي',
        imageSrc: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=500&fit=crop'
    }
];

const DoctorsSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % doctorsData.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + doctorsData.length) % doctorsData.length);
    };

    const variants = {
        enter: (direction) => {
            return {
                x: direction > 0 ? 100 : -100,
                opacity: 0,
                scale: 0.95
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 100 : -100,
                opacity: 0,
                scale: 0.95
            };
        }
    };

    const currentDoc = doctorsData[currentIndex];

    return (
        <section id="doctors" className="py-32 bg-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[#0070CD] font-black text-xs uppercase tracking-widest mb-4 block">نخبة الأطباء</span>
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        رعاية طبية بأيدي <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#005099] to-[#3399FF]">خبراء</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        اختر من بين أفضل القطاعات الطبية في مصر، تقييمات حقيقية وخبرات موثوقة.
                    </p>
                </div>

                <div className="relative w-full max-w-4xl mx-auto h-auto min-h-[500px]">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute inset-0 w-full"
                        >
                            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col md:flex-row overflow-hidden border border-slate-100 h-full">
                                {/* Image side */}
                                <div className="md:w-5/12 relative h-64 md:h-auto overflow-hidden">
                                    <div className="absolute inset-0 bg-[#0070CD]/20 mix-blend-overlay z-10"></div>
                                    <img 
                                        src={currentDoc.imageSrc} 
                                        alt={currentDoc.name} 
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>

                                {/* Content side */}
                                <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-[#F0F7FF]/50">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 mb-2">{currentDoc.name}</h3>
                                            <p className="text-[#0070CD] font-bold text-lg">{currentDoc.specialty}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                                            <span className="font-bold text-slate-800 text-sm">{currentDoc.rating}</span>
                                            <span className="text-slate-400 text-xs text-nowrap">({currentDoc.reviews}+)</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 leading-relaxed font-medium mb-8">
                                        {currentDoc.bio}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-6 mb-10">
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#0070CD]">
                                                <Briefcase className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-sm">{currentDoc.experience}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#0070CD]">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-sm">{currentDoc.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-auto">
                                        <button className="flex-1 bg-[#0070CD] text-white py-4 rounded-2xl font-bold hover:bg-[#005099] shadow-[0_8px_20px_rgba(0,112,205,0.25)] hover:shadow-[0_10px_25px_rgba(0,112,205,0.35)] hover:-translate-y-0.5 transition-all">
                                            احجز الآن
                                        </button>
                                        <button className="flex-1 bg-white text-[#0070CD] border-2 border-[#0070CD]/20 py-4 rounded-2xl font-bold hover:bg-[#F0F7FF] transition-colors">
                                            الملف الشخصي
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="absolute top-1/2 -mt-6 -left-6 md:-left-16 z-20">
                        <button 
                            onClick={prevSlide}
                            className="w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-[#0070CD] hover:scale-110 hover:bg-[#F0F7FF] transition-all"
                        >
                            <ChevronLeft className="w-6 h-6 mr-1" />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -mt-6 -right-6 md:-right-16 z-20">
                        <button 
                            onClick={nextSlide}
                            className="w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-[#0070CD] hover:scale-110 hover:bg-[#F0F7FF] transition-all"
                        >
                            <ChevronRight className="w-6 h-6 ml-1" />
                        </button>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-3 mt-16">
                    {doctorsData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                index === currentIndex 
                                ? 'w-10 bg-[#0070CD]' 
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

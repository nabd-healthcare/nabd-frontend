import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    });

    const isActive = (path) => {
        return location.pathname === path;
    };

    const isContact = location.pathname === '/contact';
    const isDarkBg = isContact && !scrolled;
    
    const textColorClass = isDarkBg ? 'text-white' : 'text-[#1F2E3C]';
    const textHoverClass = isDarkBg ? 'hover:text-[#3399FF]' : 'hover:text-[#0070CD]';

    const handleSectionClick = (e, sectionId) => {
        e.preventDefault();
        setIsOpen(false); // Close mobile menu if open
        if (location.pathname === '/') {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            window.location.href = `/#${sectionId}`;
        }
    };

    useEffect(() => {
        if (location.hash) {
            const sectionId = location.hash.substring(1);
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [location]);

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
                scrolled 
                ? 'py-2 px-4 sm:px-6' 
                : 'py-4 px-4 sm:px-8'
            }`}
        >
            <div className={`mx-auto transition-all duration-300 ease-in-out ${
                scrolled 
                ? 'max-w-6xl bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full border border-white/20' 
                : 'max-w-7xl bg-transparent'
            }`}>
                <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'h-16 px-6' : 'h-20 px-0'}`}>
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${isDarkBg ? 'bg-white/10 text-white' : 'bg-[#0070CD]/10 text-[#0070CD]'}`}>
                            <svg className="w-full h-full p-2" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 0 30 L 40 30 L 45 20 L 50 40 L 55 10 L 60 50 L 65 30 L 75 30 L 80 25 L 85 35 L 90 30 L 130 30 L 135 20 L 140 40 L 145 10 L 150 50 L 155 30 L 165 30 L 170 25 L 175 35 L 180 30 L 200 30" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" className="animate-ecg" />
                            </svg>
                        </div>
                        <span className={`text-2xl font-black tracking-tight ${textColorClass}`}>
                            نبض <span className={isDarkBg ? 'text-[#3399FF]' : 'text-[#0070CD]'}>Nabd</span>
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 whitespace-nowrap">
                        <a href="/#features" onClick={(e) => handleSectionClick(e, 'features')} className={`${textColorClass} ${textHoverClass} font-medium transition-all relative pb-1 group cursor-pointer text-sm lg:text-base`}>
                            المميزات
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-right rounded-full ${isDarkBg ? 'bg-[#3399FF]' : 'bg-[#0070CD]'}`}></span>
                        </a>
                        <a href="/#ai-section" onClick={(e) => handleSectionClick(e, 'ai-section')} className={`${textColorClass} ${textHoverClass} font-medium transition-all relative pb-1 group cursor-pointer text-sm lg:text-base`}>
                            الذكاء الاصطناعي
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-right rounded-full ${isDarkBg ? 'bg-[#3399FF]' : 'bg-[#0070CD]'}`}></span>
                        </a>
                        <a href="/#doctors" onClick={(e) => handleSectionClick(e, 'doctors')} className={`${textColorClass} ${textHoverClass} font-medium transition-all relative pb-1 group cursor-pointer text-sm lg:text-base`}>
                            الأطباء
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-right rounded-full ${isDarkBg ? 'bg-[#3399FF]' : 'bg-[#0070CD]'}`}></span>
                        </a>
                        <a href="/#how-it-works" onClick={(e) => handleSectionClick(e, 'how-it-works')} className={`${textColorClass} ${textHoverClass} font-medium transition-all relative pb-1 group cursor-pointer text-sm lg:text-base`}>
                            كيف يعمل
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-right rounded-full ${isDarkBg ? 'bg-[#3399FF]' : 'bg-[#0070CD]'}`}></span>
                        </a>
                        <Link 
                            to="/contact" 
                            className={`font-medium transition-all relative pb-1 text-sm lg:text-base ${isActive('/contact') ? (isDarkBg ? 'text-[#3399FF]' : 'text-[#0070CD]') : `${textColorClass} ${textHoverClass}`}`}
                        >
                            اتصل بنا
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-transform origin-right rounded-full ${isActive('/contact') ? 'scale-x-100' : 'scale-x-0'} ${isDarkBg ? 'bg-[#3399FF]' : 'bg-[#0070CD]'}`}></span>
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login" className={`px-6 py-2.5 rounded-full font-bold transition-colors ${isDarkBg ? 'text-white hover:bg-white/10' : 'text-[#1F2E3C] hover:bg-gray-100'}`}>
                            دخول
                        </Link>
                        <Link to="/register" className={`px-6 py-2.5 rounded-full font-bold shadow-[0_4px_14px_0_rgba(0,112,205,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(0,112,205,0.23)] hover:-translate-y-0.5 active:translate-y-0 ${isDarkBg ? 'bg-white text-[#0070CD] hover:bg-gray-50' : 'bg-[#0070CD] text-white hover:bg-[#005099]'}`}>
                            ابدأ الآن
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className={`${textColorClass} ${textHoverClass} p-2 rounded-full transition-colors ${isDarkBg ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden mt-2 mx-4 bg-white/95 backdrop-blur-2xl rounded-2xl border border-[#E7ECEF] shadow-xl overflow-hidden"
                >
                    <div className="p-4 space-y-2">
                        <a href="/#features" onClick={(e) => handleSectionClick(e, 'features')} className="block px-4 py-3 rounded-xl text-base font-semibold text-[#1F2E3C] hover:bg-gray-50 hover:text-[#0070CD] transition-colors">المميزات</a>
                        <a href="/#ai-section" onClick={(e) => handleSectionClick(e, 'ai-section')} className="block px-4 py-3 rounded-xl text-base font-semibold text-[#1F2E3C] hover:bg-gray-50 hover:text-[#0070CD] transition-colors">الذكاء الاصطناعي</a>
                        <a href="/#doctors" onClick={(e) => handleSectionClick(e, 'doctors')} className="block px-4 py-3 rounded-xl text-base font-semibold text-[#1F2E3C] hover:bg-gray-50 hover:text-[#0070CD] transition-colors">الأطباء</a>
                        <Link to="/contact" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${isActive('/contact') ? 'bg-[#0070CD]/10 text-[#0070CD]' : 'text-[#1F2E3C] hover:bg-gray-50 hover:text-[#0070CD]'}`}>
                            اتصل بنا
                        </Link>
                        <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-2">
                            <Link to="/login" className="w-full text-center px-4 py-3 rounded-xl text-[#0070CD] font-bold bg-[#0070CD]/5 hover:bg-[#0070CD]/10 transition-colors">
                                دخول
                            </Link>
                            <Link to="/register" className="w-full text-center px-4 py-3 rounded-xl bg-[#0070CD] text-white font-bold hover:bg-[#005099] shadow-md transition-all">
                                ابدأ الآن
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Header;


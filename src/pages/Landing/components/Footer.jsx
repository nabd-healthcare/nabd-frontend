import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#0B1423] text-white overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0070CD]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3399FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            {/* Top Border Gradient */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#0070CD] to-transparent opacity-50"></div>

            <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div className="lg:pr-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0070CD] to-[#005099] rounded-[1rem] flex items-center justify-center shadow-lg shadow-[#0070CD]/20 border border-white/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/20 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <svg
                                    className="w-full h-full p-2.5 text-white relative z-10"
                                    viewBox="0 0 200 60"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M 0 30 L 40 30 L 45 20 L 50 40 L 55 10 L 60 50 L 65 30 L 75 30 L 80 25 L 85 35 L 90 30 L 130 30 L 135 20 L 140 40 L 145 10 L 150 50 L 155 30 L 165 30 L 170 25 L 175 35 L 180 30 L 200 30"
                                        stroke="currentColor"
                                        strokeWidth="14"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="animate-ecg"
                                    />
                                </svg>
                            </div>
                            <span className="text-3xl font-black tracking-tight">نبض</span>
                        </div>
                        <p className="text-blue-100/60 leading-relaxed mb-8 font-medium">
                            نظام رعاية صحية ذكي يجمع بين التكنولوجيا المتطورة والطب الموثوق لتقديم أفضل تجربة علاجية للمرضى وأدوات متقدمة للأطباء.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#0070CD] hover:border-[#0070CD] hover:-translate-y-1 transition-all duration-300">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#0070CD] hover:border-[#0070CD] hover:-translate-y-1 transition-all duration-300">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#0070CD] hover:border-[#0070CD] hover:-translate-y-1 transition-all duration-300">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#0070CD] hover:border-[#0070CD] hover:-translate-y-1 transition-all duration-300">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white pb-2 border-b border-white/10 inline-block">رحلتك مع نبض</h3>
                        <ul className="space-y-4">
                            <li><a href="#features" className="text-blue-100/60 hover:text-[#3399FF] font-medium hover:translate-x-[-8px] transition-all flex items-center gap-2 pr-2 border-r-2 border-transparent hover:border-[#3399FF]">المميزات المتقدمة</a></li>
                            <li><a href="#ai-section" className="text-blue-100/60 hover:text-[#3399FF] font-medium hover:translate-x-[-8px] transition-all flex items-center gap-2 pr-2 border-r-2 border-transparent hover:border-[#3399FF]">ابتكارات الذكاء الاصطناعي</a></li>
                            <li><a href="#doctors" className="text-blue-100/60 hover:text-[#3399FF] font-medium hover:translate-x-[-8px] transition-all flex items-center gap-2 pr-2 border-r-2 border-transparent hover:border-[#3399FF]">دليل الأطباء</a></li>
                            <li><a href="#how-it-works" className="text-blue-100/60 hover:text-[#3399FF] font-medium hover:translate-x-[-8px] transition-all flex items-center gap-2 pr-2 border-r-2 border-transparent hover:border-[#3399FF]">دليلك لاستخدام المنصة</a></li>
                        </ul>
                    </div>

                    {/* For Doctors */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white pb-2 border-b border-white/10 inline-block">للأطباء والعيادات</h3>
                        <ul className="space-y-4">
                            <li><Link to="/register-doctor" className="text-blue-100/60 hover:text-[#3399FF] font-medium hover:translate-x-[-8px] transition-all flex items-center gap-2 pr-2 border-r-2 border-transparent hover:border-[#3399FF]">انضم لشبكة أطباء نبض</Link></li>
                            <li><a href="#" className="text-blue-100/60 hover:text-[#3399FF] font-medium hover:translate-x-[-8px] transition-all flex items-center gap-2 pr-2 border-r-2 border-transparent hover:border-[#3399FF]">النظام الذكي لإدارة العيادات</a></li>
                            <li><a href="#" className="text-blue-100/60 hover:text-[#3399FF] font-medium hover:translate-x-[-8px] transition-all flex items-center gap-2 pr-2 border-r-2 border-transparent hover:border-[#3399FF]">المساعد التشخيصي AI</a></li>
                            <li><a href="#" className="text-blue-100/60 hover:text-[#3399FF] font-medium hover:translate-x-[-8px] transition-all flex items-center gap-2 pr-2 border-r-2 border-transparent hover:border-[#3399FF]">الباقات والأسعار</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white pb-2 border-b border-white/10 inline-block">تواصل معنا</h3>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-blue-100/60 font-medium group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0070CD] transition-colors">
                                    <Mail className="w-4 h-4 text-white" />
                                </div>
                                <div className="pt-2">
                                    <span>info@nabd.health</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 text-blue-100/60 font-medium group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0070CD] transition-colors">
                                    <Phone className="w-4 h-4 text-white" />
                                </div>
                                <div className="pt-2 flex flex-col">
                                    <span dir="ltr">+20 123 456 7890</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 text-blue-100/60 font-medium group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0070CD] transition-colors">
                                    <MapPin className="w-4 h-4 text-white" />
                                </div>
                                <div className="pt-2">
                                    <span>شارع التسعين الشمالي، التجمع الخامس<br />القاهرة، مصر</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 mt-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-blue-100/50 text-sm font-medium">
                        &copy; {new Date().getFullYear()} 플랫폼 نبض - Nabd Health System. جميع الحقوق محفوظة.
                    </p>
                    <div className="flex gap-8 text-sm font-medium">
                        <a href="#" className="text-blue-100/50 hover:text-white transition-colors">سياسة الخصوصية</a>
                        <a href="#" className="text-blue-100/50 hover:text-white transition-colors">معايير الأمان</a>
                        <a href="#" className="text-blue-100/50 hover:text-white transition-colors">الشروط والأحكام</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

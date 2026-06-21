import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';

const Footer = () => {
    const linkClass =
        'text-sm text-blue-100/60 hover:text-[#3399FF] font-medium transition-colors duration-200';

    return (
        <footer className="bg-[#0B1423] text-white overflow-hidden relative">
            {/* Background ambient glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0070CD]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3399FF]/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0070CD]/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* ── Brand ── */}
                    <div className="lg:col-span-1">
                        {/* Navbar-identical logo */}
                        <Link to="/" className="flex items-center gap-3 group w-fit mb-6">
                            <div className="w-11 h-11 bg-[#0070CD] rounded-xl flex items-center justify-center text-white shadow-[0_8px_20px_rgba(0,112,205,0.2)] group-hover:scale-110 transition-transform duration-300">
                                <FaHeartbeat className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-white tracking-tight leading-none">
                                    نبض <span className="text-[#3399FF]">NABD</span>
                                </span>
                                <span className="text-[9px] font-black text-blue-300/70 uppercase tracking-[0.2em] mt-1">Medical OS</span>
                            </div>
                        </Link>

                        <p className="text-sm text-blue-100/55 leading-relaxed mb-8 font-medium max-w-[260px]">
                            منصة رعاية صحية ذكية تربط المرضى بالأطباء وتساعد في إدارة السجلات الطبية وتحسين جودة الرعاية الصحية.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-3">
                            {[
                                { icon: <Facebook className="w-4 h-4" />, href: '#' },
                                { icon: <Twitter className="w-4 h-4" />, href: '#' },
                                { icon: <Instagram className="w-4 h-4" />, href: '#' },
                                { icon: <Linkedin className="w-4 h-4" />, href: '#' },
                            ].map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    className="w-9 h-9 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#0070CD] hover:border-[#0070CD] hover:-translate-y-1 transition-all duration-300"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Quick Links ── */}
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 opacity-50">روابط سريعة</h3>
                        <ul className="space-y-3.5">
                            <li><a href="/#features" className={linkClass}>المميزات</a></li>
                            <li><a href="/#doctors" className={linkClass}>الأطباء</a></li>
                            <li><a href="/#ai-section" className={linkClass}>مساعد الذكاء الاصطناعي</a></li>
                            <li><Link to="/contact" className={linkClass}>تواصل معنا</Link></li>
                        </ul>
                    </div>

                    {/* ── Support ── */}
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 opacity-50">الدعم</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm text-blue-100/60 font-medium">
                                <Mail className="w-4 h-4 text-[#3399FF] flex-shrink-0" />
                                <span dir="ltr">support@nabd.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-blue-100/60 font-medium">
                                <Phone className="w-4 h-4 text-[#3399FF] flex-shrink-0" />
                                <span dir="ltr">+20 111 222 3333</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-blue-100/60 font-medium">
                                <MapPin className="w-4 h-4 text-[#3399FF] flex-shrink-0 mt-0.5" />
                                <span>شارع التسعين الشمالي، التجمع الخامس، القاهرة</span>
                            </li>
                        </ul>
                    </div>

                    {/* ── Legal ── */}
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 opacity-50">قانوني</h3>
                        <ul className="space-y-3.5">
                            <li><Link to="/privacy" className={linkClass}>سياسة الخصوصية</Link></li>
                            <li><Link to="/terms" className={linkClass}>شروط الاستخدام</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-blue-100/40 text-sm font-medium">
                        &copy; {new Date().getFullYear()} نبض — Nabd Medical OS. جميع الحقوق محفوظة.
                    </p>
                    <div className="flex gap-6 text-sm font-medium">
                        <Link to="/privacy" className="text-blue-100/40 hover:text-white transition-colors duration-200">سياسة الخصوصية</Link>
                        <Link to="/terms" className="text-blue-100/40 hover:text-white transition-colors duration-200">شروط الاستخدام</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

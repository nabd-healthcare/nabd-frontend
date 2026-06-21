import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, Stethoscope, Shield, Activity, Clock, Heart, ArrowLeft, Brain, FileText, Pill } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#F8FAFC]">
            {/* Very sophisticated background gradients */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[70%] bg-[#0070CD]/5 rounded-[100%] blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1a8cff]/10 rounded-[100%] blur-[120px] pointer-events-none"></div>

            {/* Micro grid pattern for modern touch */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none select-none"
                style={{ backgroundImage: 'radial-gradient(#005099 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center lg:text-right space-y-8"
                >
                    <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
                        <span className="bg-[#0070CD]/10 text-[#005099] border border-[#0070CD]/20 px-5 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 tracking-wide shadow-sm backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-[#0070CD]" />
                            مستقبل الرعاية الصحية بين يديك
                        </span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-[64px] font-black leading-[1.2] text-slate-900 tracking-tight">
                        منظومة صحية <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#005099] via-[#0070CD] to-[#3399FF] inline-block mt-2">
                             متكاملة و ذكية
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                        نبض يضع صحتك في مقدمة الأولويات عبر بيئة رقمية متطورة تربطك بأفضل الأطباء وتقدم لك تحليلات ذكية فورية لحالتك.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                        <button className="group relative px-8 py-4 bg-[#0070CD] text-white rounded-2xl text-sm md:text-base font-bold transition-all hover:bg-[#005099] shadow-[0_8px_25px_rgba(0,112,205,0.35)] hover:shadow-[0_12px_30px_rgba(0,112,205,0.45)] hover:-translate-y-1 active:translate-y-0 overflow-hidden flex items-center justify-center gap-3"
                            onClick={() => navigate('/register?role=patient')}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <User className="w-5 h-5 text-blue-100" />
                            <span>ابدأ كـ مريض</span>
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        
                        <button className="px-8 py-4 bg-white text-[#0070CD] border border-[#0070CD]/20 rounded-2xl text-sm md:text-base font-bold transition-all hover:bg-[#F0F7FF] flex items-center justify-center gap-3 shadow-md hover:-translate-y-1"
                            onClick={() => navigate('/register?role=doctor')}
                        >
                            <Stethoscope className="w-5 h-5" />
                            <span>انضم كـ طبيب</span>
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-600 font-semibold">
                        <span className="flex items-center gap-2"><Shield className="w-5 h-5 text-[#0070CD]" /> أمان تام</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        <span className="flex items-center gap-2"><Activity className="w-5 h-5 text-[#0070CD]" /> تشخيص AI</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-[#0070CD]" /> متوفر دائماً</span>
                    </motion.div>
                </motion.div>

                {/* Visual Content - Orbital Ecosystem Animation */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative hidden lg:flex items-center justify-center h-[600px] perspective-1000"
                >
                    {/* Glowing Backdrop */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[80%] h-[80%] bg-gradient-to-tr from-[#0070CD]/20 to-cyan-300/20 rounded-full blur-[80px]"></div>
                    </div>

                    {/* Central Pulsing Heart Node */}
                    <motion.div 
                        animate={{ 
                            boxShadow: [
                                "0px 0px 0px 0px rgba(0,112,205,0.4)", 
                                "0px 0px 0px 40px rgba(0,112,205,0)", 
                                "0px 0px 0px 0px rgba(0,112,205,0)"
                            ]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="relative z-20 w-36 h-36 bg-white rounded-full shadow-[0_20px_40px_-10px_rgba(0,112,205,0.3)] flex items-center justify-center border-4 border-[#0070CD]/10"
                    >
                        <div className="w-28 h-28 bg-gradient-to-br from-[#0070CD] to-[#005099] rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Heart className="w-12 h-12 text-white fill-white/20" />
                            </motion.div>
                            <svg className="absolute bottom-2 w-full h-8 stroke-white/30" viewBox="0 0 100 20" fill="none">
                                <path d="M0 10 H20 L25 5 L35 18 L45 2 L55 15 L60 10 H100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* First Orbital Ring (Inner) */}
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="absolute z-10 w-[300px] h-[300px] border border-[#0070CD]/15 text-[#0070CD]/10 rounded-full border-dashed"
                    >
                        {/* Inner Node 1 */}
                        <motion.div 
                            className="absolute -top-7 left-1/2 -ml-7 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-white"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Stethoscope className="w-5 h-5 text-[#0070CD]" />
                            </div>
                        </motion.div>

                        {/* Inner Node 2 */}
                        <motion.div 
                            className="absolute -bottom-7 left-1/2 -ml-7 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-white"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-indigo-500" />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Second Orbital Ring (Outer) */}
                    <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        className="absolute z-0 w-[480px] h-[480px] border border-[#0070CD]/10 rounded-full"
                    >
                        {/* Outer Node 1 (AI) */}
                        <motion.div 
                            className="absolute top-[15%] left-[5%] w-16 h-16 bg-[#1F2E3C] rounded-2xl shadow-2xl flex items-center justify-center border border-[#0070CD]/20"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#3399FF] blur-md opacity-30"></div>
                                <Brain className="w-8 h-8 text-[#3399FF] relative z-10" />
                            </div>
                        </motion.div>

                        {/* Outer Node 2 (Records) */}
                        <motion.div 
                            className="absolute bottom-[10%] left-[10%] w-16 h-16 bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.05)] flex items-center justify-center border border-slate-100"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                            <FileText className="w-8 h-8 text-teal-500" />
                        </motion.div>

                        {/* Outer Node 3 (Pills) */}
                        <motion.div 
                            className="absolute top-[20%] right-[5%] w-16 h-16 bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.05)] flex items-center justify-center border border-slate-100"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                            <Pill className="w-8 h-8 text-orange-500" />
                        </motion.div>

                        {/* Outer Node 4 (Security) */}
                        <motion.div 
                            className="absolute bottom-[15%] right-[5%] w-16 h-16 bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.05)] flex items-center justify-center border border-slate-100"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                            <Shield className="w-8 h-8 text-emerald-500" />
                        </motion.div>
                    </motion.div>

                    {/* Floating Connection Lines (Visual Polish) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ transform: "translateZ(-1px)" }}>
                        <motion.circle 
                            cx="50%" cy="50%" r="240" 
                            stroke="url(#gradient)" strokeWidth="1" fill="none" 
                            strokeDasharray="4 8"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                            style={{ transformOrigin: "center" }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0070CD" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#3399FF" stopOpacity="0" />
                                <stop offset="100%" stopColor="#0070CD" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                    </svg>

                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

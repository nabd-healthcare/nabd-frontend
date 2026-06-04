import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaCalendarAlt,
    FaUsers,
    FaStar,
    FaUser,
    FaSignOutAlt,
    FaHeart,
    FaBars,
    FaTimes,
    FaTerminal
} from 'react-icons/fa';
import useAuth from '@/features/auth/hooks/useAuth';
import { useSidebar } from '@/features/doctor/context/SidebarContext';

/**
 * DoctorSidebar - Clinical Navigation Module
 * Optimized for rapid context switching in the Clinical Command Center.
 */
const DoctorSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { isCollapsed, setIsCollapsed } = useSidebar();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems = [
        { path: '/doctor/dashboard', icon: FaHome, label: 'الرئيسية', exact: true },
        { path: '/doctor/appointments', icon: FaCalendarAlt, label: 'المواعيد' },
        { path: '/doctor/patients', icon: FaUsers, label: 'المرضى' },
        { path: '/doctor/reviews', icon: FaStar, label: 'التقييمات' },
        { path: '/doctor/profile', icon: FaUser, label: 'الملف الشخصي' }
    ];

    const handleLogout = () => {
        if (window.confirm('هل أنت متأكد من تسجيل الخروج من النظام؟')) {
            logout();
            navigate('/login');
        }
    };

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Menu Trigger */}
            {!isMobileOpen && (
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="lg:hidden fixed top-6 right-6 z-50 w-12 h-12 bg-white text-[#0070CD] border border-slate-100 rounded-2xl shadow-xl flex items-center justify-center">
                    <FaBars className="w-5 h-5" />
                </button>
            )}

            {/* Backdrop */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 transition-all duration-500"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Main Sidebar Container */}
            <aside
                className={`
                    flex-shrink-0 bg-white
                    transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
                    fixed top-0 h-screen z-[45]
                    flex flex-col border-l border-slate-100
                    lg:right-0
                    ${isCollapsed ? 'lg:w-[100px]' : 'lg:w-80'}
                    ${isMobileOpen ? 'right-0 w-80' : '-right-80 w-80'}
                `}
            >
                {/* Tactical Header */}
                <div className={`pt-12 pb-10 transition-all duration-500 ${isCollapsed ? 'px-6' : 'px-10'}`}>
                    <div className="flex items-center gap-6 group">
                        <div className="w-14 h-14 bg-[#0070CD] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl shadow-[#0070CD]/20 transform group-hover:rotate-[10deg] transition-all">
                            <FaHeart className="w-6 h-6 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                                <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none mb-1">نابـض</h1>
                                <div className="flex items-center gap-2">
                                   <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                   <p className="text-[9px] font-black text-[#0070CD] tracking-[0.4em] uppercase opacity-60">System v4.0</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Secure Nav Stack */}
                <nav className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar">
                    <div className="mb-4">
                       <span className={`text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] block mb-6 transition-opacity ${isCollapsed ? 'opacity-0' : 'px-4'}`}>
                          Clinical Index
                       </span>
                       <ul className="space-y-2.5">
                           {navItems.map((item) => {
                               const Icon = item.icon;
                               const active = isActive(item.path, item.exact);
                               return (
                                   <li key={item.path}>
                                       <Link
                                           to={item.path}
                                           onClick={() => setIsMobileOpen(false)}
                                           className={`
                                               group flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 relative
                                               ${active
                                                   ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/10'
                                                   : 'text-slate-500 hover:text-[#0070CD] hover:bg-slate-50'
                                               }
                                               ${isCollapsed ? 'justify-center' : ''}
                                           `}
                                       >
                                           <Icon className={`transition-all duration-500 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${active ? 'text-[#0070CD]' : 'group-hover:scale-110'}`} />
                                           {!isCollapsed && (
                                               <span className="text-[13px] font-black tracking-tight uppercase">{item.label}</span>
                                           )}
                                           {active && !isCollapsed && (
                                               <div className="absolute left-4 w-1 h-1 bg-[#0070CD] rounded-full"></div>
                                           )}
                                       </Link>
                                   </li>
                               );
                           })}
                       </ul>
                    </div>
                </nav>
                
                {/* Command Footer */}
                <div className="p-8 border-t border-slate-50 bg-slate-50/30">
                    <button
                        onClick={handleLogout}
                        className={`
                            group w-full flex items-center gap-5 p-4 rounded-2xl
                            bg-white text-slate-400 hover:bg-rose-50 hover:text-rose-600
                            transition-all duration-500 border border-slate-100 hover:border-rose-100 shadow-sm
                            ${isCollapsed ? 'justify-center px-0' : ''}
                        `}
                    >
                        <FaSignOutAlt className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} transition-transform group-hover:-translate-x-1`} />
                        {!isCollapsed && (
                            <span className="font-black text-[11px] uppercase tracking-widest">إنهاء الجلسة</span>
                        )}
                    </button>
                    
                    {!isCollapsed && (
                       <div className="mt-8 flex items-center gap-3 px-2">
                          <FaTerminal className="text-[#0070CD] text-[10px]" />
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Terminal Active</span>
                       </div>
                    )}
                </div>

                {/* Sidebar Fluid Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-24 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-300 hover:text-[#0070CD] transition-all shadow-xl hidden lg:flex group z-50"
                >
                    <div className={`transition-transform duration-700 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
                         <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="stroke-current stroke-3">
                             <path d="M1 9L5 5L1 1" strokeLinecap="round" strokeLinejoin="round"/>
                         </svg>
                    </div>
                </button>
            </aside>
        </>
    );
};

export default DoctorSidebar;

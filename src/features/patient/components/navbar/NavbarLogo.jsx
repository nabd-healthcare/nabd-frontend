import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';

/**
 * Navbar Logo Component - Patient
 * Clinical Command Center Style (matched with Doctor Page)
 * @component
 */
const NavbarLogo = () => {
  return (
    <Link to="/patient/search" className="flex items-center gap-3 group">
      <div className="w-11 h-11 bg-[#0070CD] rounded-xl flex items-center justify-center text-white shadow-[0_8px_20px_rgba(0,112,205,0.2)] group-hover:scale-110 transition-transform duration-500">
        <FaHeartbeat className="w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-black text-[#1F2E3C] tracking-tight leading-none group-hover:text-[#0070CD] transition-colors">
          نبض <span className="text-[#0070CD]">NABD</span>
        </span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Medical OS</span>
      </div>
    </Link>
  );
};

export default NavbarLogo;

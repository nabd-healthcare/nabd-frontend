import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DOCTOR_NAV_ITEMS } from '../../constants/navigation';

/**
 * Navbar Navigation Links Component - Control Bar Style
 * @component
 */
const NavbarLinks = () => {
  const location = useLocation();

  return (
    <div className="hidden lg:flex items-center gap-1">
      {DOCTOR_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.id}
            to={item.href}
            className={`
              relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
              ${
                isActive
                  ? 'bg-[#0070CD]/10 text-[#0070CD]'
                  : 'text-slate-500 hover:text-[#0070CD] hover:bg-slate-50'
              }
            `}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#0070CD]' : 'text-slate-400 group-hover:text-[#0070CD]'}`} />
            <span className="whitespace-nowrap tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default NavbarLinks;

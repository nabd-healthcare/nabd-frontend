import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PATIENT_NAV_ITEMS } from '../../constants/navigation';

/**
 * Navbar Navigation Links Component - Patient
 * @component
 */
const NavbarLinks = () => {
  const location = useLocation();

  return (
    <div className="hidden lg:flex items-center gap-6 xl:gap-8">
      {PATIENT_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || (item.path !== '/patient' && location.pathname.startsWith(item.path));

        return (
          <Link
            key={item.id}
            to={item.path}
            className={`
              relative flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-black transition-all duration-300 border
              ${isActive
                ? 'bg-[#0070CD] text-white shadow-[0_8px_20px_rgba(0,112,205,0.3)] transform scale-105 border-[#0070CD] active:scale-95'
                : 'text-slate-600 hover:bg-[#0070CD]/5 hover:text-[#0070CD] hover:scale-105 border-transparent hover:border-[#0070CD]/20 hover:shadow-sm'
              }
            `}
          >
            <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#0070CD]'}`} />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default NavbarLinks;

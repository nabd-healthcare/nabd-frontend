import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { DOCTOR_NAV_ITEMS } from '../../constants/navigation';

/**
 * Mobile Menu Component - Clinical White Style
 * @component
 */
const MobileMenu = ({ isOpen, onToggle, onClose }) => {
  const location = useLocation();

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="lg:hidden p-3 text-slate-500 hover:text-[#0070CD] hover:bg-slate-50 rounded-xl transition-all duration-300"
      >
        {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-[85px] left-4 right-4 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-4 space-y-2">
            {DOCTOR_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-4 px-6 py-5 rounded-[1.5rem] text-base font-black transition-all
                    ${
                      isActive
                        ? 'bg-[#0070CD]/10 text-[#0070CD]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }
                  `}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-[#0070CD]' : 'text-slate-400'}`} />
                  <span className="tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;

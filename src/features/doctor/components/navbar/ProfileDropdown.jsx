import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@features/auth';
import { useAuthStore } from '@/features/auth/store/authStore';
import { FaTerminal } from 'react-icons/fa';

import { resolveImageUrl } from '@/utils/helpers';

/**
 * ProfileDropdown - Identity Module
 * Optimized for the Clinical Command Center.
 */
const ProfileDropdown = ({ isOpen, onToggle, onClose }) => {
  const { logout, forceLogout } = useAuth();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      onClose();
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="relative">
      {/* Profile Button - Tactical Trigger */}
      <button
        onClick={onToggle}
        className={`
          flex items-center gap-3 p-1 rounded-2xl transition-all duration-300 transform active:scale-95
          ${isOpen ? 'bg-slate-100 ring-1 ring-slate-200 shadow-inner' : 'hover:bg-slate-50'}
        `}
      >
        <div className="relative">
          {user?.profilePictureUrl || user?.profileImageUrl ? (
            <img
              src={resolveImageUrl(user?.profilePictureUrl || user?.profileImageUrl)}
              alt="Profile"
              className="w-10 h-10 rounded-xl object-cover shadow-sm border border-white"
            />
          ) : (
            <div className="w-10 h-10 bg-[#0070CD] rounded-xl flex items-center justify-center shadow-lg shadow-[#0070CD]/20">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
        </div>

        <div className="hidden lg:block text-right pr-1">
          <p className="text-[11px] font-black text-slate-900 leading-none mb-0.5 uppercase tracking-tight">
            {user?.firstName ? `د. ${user.firstName} ${user.lastName || ''}` : (user?.fullName || 'د. طبيب')}
          </p>
          <p className="text-[9px] font-black text-[#0070CD] uppercase tracking-widest opacity-50">
            {user?.specialty || 'طبيب متخصص'}
          </p>
        </div>
      </button>

      {/* Dropdown Menu - Premium Clinical Terminal */}
      {isOpen && (
        <div className="absolute left-0 mt-4 w-64 bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-100 p-2 z-[110] animate-in fade-in zoom-in-95 duration-300 origin-top">
          <div className="space-y-1 mt-2">
            <button
              onClick={() => handleNavigate('/doctor/profile')}
              className="w-full flex items-center justify-start space-x-reverse space-x-3 px-4 py-3 text-slate-600 hover:bg-[#0070CD] hover:text-white rounded-[1.5rem] transition-all transform hover:scale-[1.02]"
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-[12px] font-black uppercase tracking-tight">الملف الشخصي</span>
            </button>

            <div className="h-px bg-slate-50 my-2 mx-4" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-start space-x-reverse space-x-3 px-4 py-3 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[1.5rem] transition-all transform hover:scale-[1.02]"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span className="text-[12px] font-black uppercase tracking-tight">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

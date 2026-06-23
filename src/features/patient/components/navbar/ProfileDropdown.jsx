import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@features/auth';
import { useAuthStore } from '@/features/auth/store/authStore';

/**
 * Profile Dropdown Component - Patient
 * @component
 */
const ProfileDropdown = ({ isOpen, onToggle, onClose }) => {
  const { logout, forceLogout } = useAuth();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      onClose();
      await logout();
      setTimeout(() => navigate('/login'), 100);
    } catch (error) {
      console.error('Logout error:', error);
      forceLogout();
    }
  };

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={onToggle}
        className={`
          transition-all duration-200 transform hover:scale-105
          ${isOpen
            ? 'ring-2 ring-[#0070CD]/40 rounded-full'
            : 'hover:ring-2 hover:ring-[#0070CD]/20 rounded-full'
          }
        `}
      >
        {/* Profile Image */}
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `<div class="w-12 h-12 bg-gradient-to-tr from-[#0070CD] to-blue-400 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,112,205,0.2)] border-2 border-white ring-2 ring-[#0070CD]/10"><span class="text-white font-black text-lg">${user?.firstName ? user.firstName.charAt(0) + (user.lastName ? user.lastName.charAt(0) : '') : 'م'}</span></div>`;
            }}
            className="w-12 h-12 rounded-full object-cover shadow-[0_4px_12px_rgba(0,112,205,0.2)] border-2 border-white ring-2 ring-[#0070CD]/10"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-tr from-[#0070CD] to-blue-400 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,112,205,0.2)] border-2 border-white ring-2 ring-[#0070CD]/10">
            <span className="text-white font-black text-lg">{user?.firstName ? `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}` : 'م'}</span>
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-3 w-60 bg-white rounded-2xl shadow-lg ring-1 ring-[#0070CD]/10 overflow-hidden z-[110] animate-fade-in">
          <div className="py-2">
            {/* Profile Link */}
            <button
              onClick={() => handleNavigate('/patient/profile')}
              className="w-full flex items-center justify-start space-x-reverse space-x-3 px-6 py-3 text-gray-700 hover:bg-[#0070CD]/5 hover:text-[#0070CD] transition-colors duration-200"
            >
              <UserIcon className="w-5 h-5" />
              <span>الملف الشخصي</span>
            </button>



            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-start space-x-reverse space-x-3 px-6 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

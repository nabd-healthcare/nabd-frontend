import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaStethoscope, FaBars, FaTimes, FaSignOutAlt, FaUserMd, FaHome, FaChartBar } from 'react-icons/fa';
import { useAuth } from '@/features/auth';
import { VERIFIER_NAV_ITEMS } from '../constants/verifierConstants';

// Icon mapping for tabs
const TAB_ICON_MAP = {
  FaUserMd,
};

// Icon mapping for navigation
const NAV_ICON_MAP = {
  FaHome,
  FaChartBar,
};

/**
 * Verifier Navbar Component
 * 
 * Top navigation bar for verifier dashboard with tabs
 * Matches patient/doctor navbar design
 */
const VerifierNavbar = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <nav className="bg-white/98 backdrop-blur-lg shadow-sm sticky top-0 z-[100] transition-all duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-reverse space-x-4">
            <Link to="/verifier/statistics" className="flex items-center space-x-reverse space-x-3 group">
              <div className="w-12 h-12 bg-[#1C8B8F]/10 rounded-full flex items-center justify-center text-[#1C8B8F] overflow-hidden group-hover:bg-[#1C8B8F]/20 transition-colors">
                <svg
                  className="w-full h-full p-2"
                  viewBox="0 0 200 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 0 30 L 40 30 L 45 20 L 50 40 L 55 10 L 60 50 L 65 30 L 75 30 L 80 25 L 85 35 L 90 30 L 130 30 L 135 20 L 140 40 L 145 10 L 150 50 L 155 30 L 165 30 L 170 25 L 175 35 L 180 30 L 200 30"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-ecg"
                  />
                </svg>
              </div>
              <div className="hidden sm:block text-right">
                <h1 className="text-2xl font-black text-[#1F2E3C] tracking-tight group-hover:text-[#1C8B8F] transition-colors">
                  نبض
                </h1>
                <p className="text-xs text-slate-500 -mt-1 font-bold tracking-wide">
                  لوحة المراجع
                </p>
              </div>
            </Link>
          </div>

          {/* Centered Desktop Navigation */}
          <div className="flex-1 flex justify-center">
            <div className="hidden lg:flex items-center gap-3">
              {/* Navigation Links */}
              {VERIFIER_NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                const NavIcon = NAV_ICON_MAP[item.icon];

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border
                      ${isActive
                        ? 'bg-[#1C8B8F] text-white shadow-lg shadow-[#1C8B8F]/20 border-[#1C8B8F] transform scale-105'
                        : 'text-slate-600 bg-white hover:bg-slate-50 hover:text-[#1C8B8F] border-slate-200 hover:border-[#1C8B8F]/30'
                      }
                    `}
                  >
                    {NavIcon && (
                      <NavIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#1C8B8F]'}`} />
                    )}
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}

              {/* Tabs - Navigate to separate pages */}
              <Link
                to="/verifier/doctors"
                className={`
                  flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border
                  ${location.pathname === '/verifier/doctors'
                    ? 'bg-[#1C8B8F] text-white shadow-lg shadow-[#1C8B8F]/20 border-[#1C8B8F] transform scale-105'
                    : 'text-slate-600 bg-white hover:bg-slate-50 hover:text-[#1C8B8F] border-slate-200 hover:border-[#1C8B8F]/30'
                  }
                `}
              >
                <FaUserMd className={`w-4 h-4 flex-shrink-0 ${location.pathname === '/verifier/doctors' ? 'text-white' : 'text-[#1C8B8F]'}`} />
                <span className="whitespace-nowrap">الأطباء</span>
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-reverse space-x-4">
            {/* Direct Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 font-semibold border border-red-200 hover:border-red-300"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="text-sm">تسجيل الخروج</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="w-6 h-6 text-gray-700" />
              ) : (
                <FaBars className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="py-4 space-y-2">
              {/* Mobile Navigation - All items */}
              <div className="px-4">
                <p className="text-xs font-bold text-gray-500 mb-3">القوائم</p>
                <div className="space-y-2">
                  {/* Navigation Links */}
                  {VERIFIER_NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    const NavIcon = NAV_ICON_MAP[item.icon];

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                          ${isActive
                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                            : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                          }
                        `}
                      >
                        {NavIcon && (
                          <NavIcon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-teal-500'}`} />
                        )}
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  {/* Tabs - Navigate to separate pages */}
                  <Link
                    to="/verifier/doctors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                      ${location.pathname === '/verifier/doctors'
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                      }
                    `}
                  >
                    <FaUserMd className={`w-5 h-5 flex-shrink-0 ${location.pathname === '/verifier/doctors' ? 'text-white' : 'text-teal-500'}`} />
                    <span>الأطباء</span>
                  </Link>
                </div>
              </div>

              {/* Mobile Logout */}
              <div className="px-4 pt-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 font-semibold border border-red-200"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default VerifierNavbar;

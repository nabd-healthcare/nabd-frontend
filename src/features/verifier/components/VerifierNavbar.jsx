import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaStethoscope, FaBars, FaTimes, FaSignOutAlt, FaUserMd, FaHome, FaChartBar, FaHeartbeat } from 'react-icons/fa';
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
    <div className={`w-full flex justify-center px-4 sm:px-6 lg:px-8 pt-6 pb-2 transition-all duration-300 sticky top-0 ${isMobileMenuOpen ? 'z-[400]' : 'z-[100]'} bg-slate-50/80 backdrop-blur-md`}>
      <nav className="pointer-events-auto w-full max-w-[1600px] bg-white/90 backdrop-blur-xl shadow-xl shadow-[#0070CD]/10 border-2 border-white rounded-[2.5rem] px-2 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-reverse space-x-4">
            <Link to="/verifier/statistics" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-11 h-11 bg-[#0070CD] rounded-xl flex items-center justify-center text-white shadow-[0_8px_20px_rgba(0,112,205,0.2)] group-hover:scale-110 transition-transform duration-500">
                <FaHeartbeat className="w-6 h-6" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none group-hover:text-[#0070CD] transition-colors text-[#1F2E3C]">
                  نبض <span className="text-[#0070CD]">NABD</span>
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 text-right">لوحة المراجع</span>
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
                        ? 'bg-[#0070CD] text-white shadow-lg shadow-[#0070CD]/20 border-[#0070CD] transform scale-105'
                        : 'text-slate-600 bg-white hover:bg-slate-50 hover:text-[#0070CD] border-slate-200 hover:border-[#0070CD]/30'
                      }
                    `}
                  >
                    {NavIcon && (
                      <NavIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#0070CD]'}`} />
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
                    ? 'bg-[#0070CD] text-white shadow-lg shadow-[#0070CD]/20 border-[#0070CD] transform scale-105'
                    : 'text-slate-600 bg-white hover:bg-slate-50 hover:text-[#0070CD] border-slate-200 hover:border-[#0070CD]/30'
                  }
                `}
              >
                <FaUserMd className={`w-4 h-4 flex-shrink-0 ${location.pathname === '/verifier/doctors' ? 'text-white' : 'text-[#0070CD]'}`} />
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
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                          }
                        `}
                      >
                        {NavIcon && (
                          <NavIcon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-blue-500'}`} />
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
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }
                    `}
                  >
                    <FaUserMd className={`w-5 h-5 flex-shrink-0 ${location.pathname === '/verifier/doctors' ? 'text-white' : 'text-blue-500'}`} />
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
      </nav>
    </div>
  );
};

export default VerifierNavbar;

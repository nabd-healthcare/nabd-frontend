import React, { useState, useEffect, useRef } from 'react';
import {
  NavbarLogo,
  NavbarLinks,
  ProfileDropdown,
  MobileMenu,
} from './navbar';

import NotificationCenter from '@/components/notifications/NotificationCenter';

/**
 * Patient Dashboard Navbar Component
 * Clean Architecture - Modular & Maintainable
 * @component
 */
const PatientNavbar = () => {
  // Dropdown states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  // Refs for click outside detection
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const toggleProfile = () => setIsProfileOpen((prev) => !prev);
  const closeProfile = () => setIsProfileOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);


  return (
    <div className={`w-full flex justify-center px-4 sm:px-6 lg:px-8 pt-6 pb-2 transition-all duration-300 sticky top-0 ${isProfileOpen || isMobileMenuOpen ? 'z-[400]' : 'z-[100]'} bg-[#F8FAFC]/80 backdrop-blur-md`}>
      <nav className="pointer-events-auto w-full max-w-[1600px] bg-white/90 backdrop-blur-xl shadow-xl shadow-[#0070CD]/10 border-2 border-white rounded-[2.5rem] px-2 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-reverse space-x-4">
            <NavbarLogo />
          </div>

          {/* Centered Desktop Navigation */}
          <div className="flex-1 flex justify-center">
            <NavbarLinks />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-reverse space-x-4">
            {/* Notification Bell */}
            <NotificationCenter />

            {/* Profile Menu */}
            <div ref={profileRef}>
              <ProfileDropdown
                isOpen={isProfileOpen}
                onToggle={toggleProfile}
                onClose={closeProfile}
              />
            </div>

            {/* Mobile Menu Button */}
            <div ref={mobileMenuRef}>
              <MobileMenu
                isOpen={isMobileMenuOpen}
                onToggle={toggleMobileMenu}
                onClose={closeMobileMenu}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default PatientNavbar;

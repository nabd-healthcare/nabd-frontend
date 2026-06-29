import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DoctorNavbar from '@/features/doctor/components/DoctorNavbar';

/**
 * Doctor Layout Component
 * Top Navigation architecture for maximum screen utilization
 * @component
 */
const DoctorLayout = () => {
  const location = useLocation();
  const isSessionPage = location.pathname.includes('/doctor/session');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation - Primary sticky control bar (Hidden in Session Page) */}
      {!isSessionPage && <DoctorNavbar />}

      {/* Main Content Area - Full width with top-nav offset */}
      <main className={!isSessionPage ? "min-h-[calc(100vh-80px)]" : "min-h-screen"}>
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;

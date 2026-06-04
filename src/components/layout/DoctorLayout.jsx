import React from 'react';
import { Outlet } from 'react-router-dom';
import DoctorNavbar from '@/features/doctor/components/DoctorNavbar';

/**
 * Doctor Layout Component
 * Top Navigation architecture for maximum screen utilization
 * @component
 */
const DoctorLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation - Primary sticky control bar */}
      <DoctorNavbar />

      {/* Main Content Area - Full width with top-nav offset */}
      <main className="min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;

import React from 'react';
import {
    FaUser,
    FaBriefcaseMedical,
    FaClinicMedical,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaChartLine
} from 'react-icons/fa';

/**
 * Profile Tabs Navigation Component
 * Horizontal tabs for doctor profile sections
 * @component
 */
const ProfileTabsNav = ({ activeSection, setActiveSection }) => {
    const tabs = [
        {
            id: 'personal',
            label: 'المعلومات الشخصية',
            icon: FaUser
        },
        {
            id: 'professional',
            label: 'المعلومات المهنية',
            icon: FaBriefcaseMedical
        },
        {
            id: 'clinic',
            label: 'معلومات العيادة',
            icon: FaClinicMedical
        },
        {
            id: 'services',
            label: 'الخدمات والأسعار',
            icon: FaMoneyBillWave
        },
        {
            id: 'appointment',
            label: 'إعدادات المواعيد',
            icon: FaCalendarAlt
        },

        {
            id: 'analytics',
            label: 'التحليلات',
            icon: FaChartLine
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E7ECEF] mb-6 overflow-hidden">
            {/* Tabs Container - Scrollable on mobile */}
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex min-w-max lg:min-w-0">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeSection === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id)}
                                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-medium
                  transition-all duration-200 border-b-2 whitespace-nowrap
                  ${isActive
                                        ? 'text-[#1C8B8F] border-[#1C8B8F] bg-[#F0FDFA] font-bold'
                                        : 'text-[#64748B] border-transparent hover:text-[#1C8B8F] hover:bg-[#F8FAFC]'
                                    }
                `}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1C8B8F]' : 'text-[#94A3B8]'}`} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProfileTabsNav;

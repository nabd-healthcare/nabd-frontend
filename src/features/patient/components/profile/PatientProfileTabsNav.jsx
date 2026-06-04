import React from 'react';
import {
    FaUser,
    FaFileMedical,
    FaMapMarkerAlt
} from 'react-icons/fa';

/**
 * Patient Profile Tabs Navigation Component
 * Horizontal tabs for patient profile sections
 * Matching the design of Doctor Profile Tabs
 */
const PatientProfileTabsNav = ({ activeTab, setActiveTab }) => {
    const tabs = [
        {
            id: 'personal',
            label: 'المعلومات الشخصية',
            icon: FaUser
        },
        {
            id: 'medical',
            label: 'الملف الطبي',
            icon: FaFileMedical
        }
    ];

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 mb-6 overflow-hidden">
            {/* Tabs Container - Scrollable on mobile */}
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex min-w-max lg:min-w-0">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-6 py-4 text-sm font-black
                                    transition-all duration-200 border-b-2 whitespace-nowrap
                                    ${isActive
                                        ? 'text-[#0070CD] border-[#0070CD] bg-[#0070CD]/5 font-black'
                                        : 'text-[#64748B] border-transparent hover:text-[#0070CD] hover:bg-[#F8FAFC]'
                                    }
                                `}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0070CD]' : 'text-[#94A3B8]'}`} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PatientProfileTabsNav;

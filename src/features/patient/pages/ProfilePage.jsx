import React, { useEffect, useState } from 'react';
import { usePatientProfile } from '../hooks/usePatientProfile';
import PatientProfileTabsNav from '../components/profile/PatientProfileTabsNav';
import { PersonalInfoSection, MedicalRecordSection } from '../components/profile';
import { FaSpinner, FaUser, FaFileMedical } from 'react-icons/fa';

/**
 * Patient Profile Page
 * 
 * Main page containing:
 * 1. Personal Information Section
 * 2. Medical Record Section
 */
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'medical'

  const {
    personalInfo,
    address,
    medicalRecord,
    loading,
    fetchPersonalInfo,
    fetchAddress,
    fetchMedicalRecord,
  } = usePatientProfile({ autoFetch: false });

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      await Promise.allSettled([
        fetchPersonalInfo(),
        fetchAddress(),
        fetchMedicalRecord(),
      ]);
    };

    fetchAll();
  }, [fetchPersonalInfo, fetchAddress, fetchMedicalRecord]);

  // Initial loading state
  const isInitialLoading =
    (loading.personalInfo && !personalInfo) ||
    (loading.address && !address) ||
    (loading.medicalRecord && !medicalRecord);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 text-[#0070CD] mb-2 font-black tracking-widest text-xs uppercase">
            <div className="w-2 h-2 rounded-full bg-[#0070CD] animate-pulse"></div>
            <span>ملفك الشخصي</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-none">
            الملف <span className="text-[#0070CD]">الشخصي</span>
          </h1>
        </div>
        {/* Initial Loading State */}
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="w-12 h-12 text-[#0070CD] animate-spin mb-4" />
            <p className="text-slate-600 font-medium">جاري تحميل البيانات...</p>
          </div>
        ) : (
          <>
            {/* Tabs Navigation */}
            <PatientProfileTabsNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'personal' ? (
                <PersonalInfoSection />
              ) : (
                <MedicalRecordSection />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

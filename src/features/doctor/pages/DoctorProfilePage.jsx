import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth';
import doctorService from '@/api/services/doctor.service';
import PersonalInfoSection from '../components/PersonalInfoSection.jsx';
import ProfessionalInfoSection from '../components/ProfessionalInfoSection';
import ClinicInfoSection from '../components/ClinicInfoSection';
import ServicesSection from '../components/ServicesSection';
import AppointmentSection from '../components/AppointmentSection';

import {
  mapGenderToArabic,
  mapGenderToNumber,
  SPECIALTIES,
  getDocumentTypeFromFieldName
} from '@/utils/constants';
import { DOCUMENT_STATUS, DOCUMENT_STATUS_LABELS } from '@/features/verifier/constants/verifierConstants';
import { FaUserMd, FaHospital, FaStethoscope, FaClock, FaIdCard, FaCheckCircle, FaExclamationCircle, FaTerminal, FaSave, FaChartLine, FaUserFriends } from 'react-icons/fa';
import ProfileSidebar from '../components/ProfileSidebar';

const formatDateFromISO = (isoDate) => {
  if (!isoDate) return '';
  return isoDate.split('T')[0];
};

/**
 * DoctorProfilePage - Clinical Command Center Edition
 * A unified, high-density Bento layout for comprehensive profile management.
 */
const DoctorProfilePage = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'
  const [activeSection, setActiveSection] = useState('personal');
  const hasChangesRef = useRef(false);
  const autoSaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef(null);
  const profileImageFileRef = useRef(null);

  const [documentStatuses, setDocumentStatuses] = useState({
    nationalId: null,
    medicalLicense: null,
    syndicateMembership: null,
    graduationCertificate: null,
    specializationCertificate: null,
  });

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    bio: user?.bio || '',
    profilePicture: null,
    profilePictureUrl: user?.profileImageUrl || null,
    specialty: user?.specialty || '',
    experience: user?.experience || '',
    education: user?.education || '',
    professionalMemberships: user?.professionalMemberships || '',
    nationalIdPhoto: null,
    nationalIdPreview: null,
    medicalLicensePhoto: null,
    medicalLicensePreview: null,
    syndicateMembershipPhoto: null,
    syndicateMembershipPreview: null,
    graduationCertificatePhoto: null,
    graduationCertificatePreview: null,
    specializationCertificatePhoto: null,
    specializationCertificatePreview: null,
    awardsImages: [],
    researchPapersImages: [],
    clinicName: user?.clinicName || '',
    clinicAddress: user?.clinicAddress || '',
    consultationFee: user?.consultationFee || '',
    appointmentDuration: user?.appointmentDuration || '30',
  });

  const [profileImagePreview, setProfileImagePreview] = useState(user?.profileImageUrl || user?.profilePictureUrl || null);

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await doctorService.getProfile();
      const profileData = response.data || response;
      setFormData(prev => ({
        ...prev,
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phone: profileData.phoneNumber || '',
        dateOfBirth: formatDateFromISO(profileData.dateOfBirth),
        gender: mapGenderToArabic(profileData.genderName),
        profilePictureUrl: profileData.profilePictureUrl || null,
        bio: profileData.biography || '',
      }));
      if (profileData.profilePictureUrl) setProfileImagePreview(profileData.profilePictureUrl);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const fetchSpecialtyExperience = useCallback(async () => {
    try {
      const response = await doctorService.getSpecialtyExperience();
      const data = response.data || response;
      const specialtyName = SPECIALTIES.find(s => s.value === data.medicalSpecialty)?.label || '';
      setFormData(prev => ({ ...prev, specialty: specialtyName, experience: data.yearsOfExperience?.toString() || '' }));
    } catch (e) { console.error(e); }
  }, []);

  const fetchProfessionalDocuments = useCallback(async () => {
    try {
      const [requiredDocs, researchDocs, awardDocs] = await Promise.allSettled([
        doctorService.getRequiredDocuments(),
        doctorService.getResearchDocuments(),
        doctorService.getAwardDocuments(),
      ]);

      if (requiredDocs.status === 'fulfilled') {
        const docs = requiredDocs.value.data || requiredDocs.value;
        if (Array.isArray(docs)) {
          const newStatuses = {};
          docs.forEach(doc => {
            let displayStatus = DOCUMENT_STATUS.NOT_SUBMITTED;
            if (doc.status === 1) displayStatus = DOCUMENT_STATUS.PENDING;
            else if (doc.status === 2) displayStatus = DOCUMENT_STATUS.APPROVED;
            else if (doc.status === 3 || doc.status === 4) displayStatus = DOCUMENT_STATUS.REJECTED;

            switch (doc.type) {
              case 0: setFormData(p => ({ ...p, nationalIdPreview: doc.documentUrl })); newStatuses.nationalId = displayStatus; break;
              case 1: setFormData(p => ({ ...p, medicalLicensePreview: doc.documentUrl })); newStatuses.medicalLicense = displayStatus; break;
              case 2: setFormData(p => ({ ...p, syndicateMembershipPreview: doc.documentUrl })); newStatuses.syndicateMembership = displayStatus; break;
              case 3: setFormData(p => ({ ...p, graduationCertificatePreview: doc.documentUrl })); newStatuses.graduationCertificate = displayStatus; break;
              case 4: setFormData(p => ({ ...p, specializationCertificatePreview: doc.documentUrl })); newStatuses.specializationCertificate = displayStatus; break;
            }
          });
          setDocumentStatuses(prev => ({ ...prev, ...newStatuses }));
        }
      }

      const researchFull = researchDocs.status === 'fulfilled' ? (researchDocs.value.data || researchDocs.value) : [];
      if (Array.isArray(researchFull)) {
        setFormData(prev => ({ ...prev, researchPapersImages: researchFull.map(d => ({ name: d.typeName || 'بحث', preview: d.documentUrl, file: null })) }));
      }

      const awardFull = awardDocs.status === 'fulfilled' ? (awardDocs.value.data || awardDocs.value) : [];
      if (Array.isArray(awardFull)) {
        setFormData(prev => ({ ...prev, awardsImages: awardFull.map(d => ({ name: d.typeName || 'جائزة', preview: d.documentUrl, file: null })) }));
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchProfileData();
      await fetchSpecialtyExperience();
      await fetchProfessionalDocuments();
      setTimeout(() => { lastSavedDataRef.current = JSON.stringify(formData); }, 100);
    };
    loadData();
  }, [fetchProfileData, fetchSpecialtyExperience, fetchProfessionalDocuments]);

  const handleChange = useCallback((e) => {
    const { name, value, files, type, multiple } = e.target;
    if (name === 'profilePicture' && files?.[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      profileImageFileRef.current = file;
      const reader = new FileReader();
      reader.onloadend = () => setProfileImagePreview(reader.result);
      reader.readAsDataURL(file);
      return;
    }
    if (type === 'file' && files?.[0] && !multiple) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      const previewFieldName = name.replace('Photo', 'Preview');
      const reader = new FileReader();
      reader.onloadend = () => setFormData(p => ({ ...p, [previewFieldName]: reader.result }));
      reader.readAsDataURL(file);
      return;
    }
    if (type === 'file' && files && multiple) {
      const newFiles = Array.from(files);
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            [name]: [...(prev[name] || []), { file, name: file.name, preview: reader.result }]
          }));
        };
        reader.readAsDataURL(file);
      });
      return;
    }
    if ((name === 'gender' || name === 'specialty') && typeof value === 'object') {
      setFormData(prev => ({ ...prev, [name]: value.label || value.name }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const performAutoSave = useCallback(async () => {
    const currentData = JSON.stringify(formData);
    if (currentData === lastSavedDataRef.current) return;
    setAutoSaveStatus('saving');
    try {
      const promises = [];
      const personalData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone || null,
        dateOfBirth: formData.dateOfBirth || null,
        gender: mapGenderToNumber(formData.gender),
        biography: formData.bio || null,
      };
      promises.push(doctorService.updatePersonalInfo(personalData));
      let newImageUrl = profileImagePreview;
      if (profileImageFileRef.current instanceof File) {
        const imageUploadPromise = doctorService.updateProfileImage(profileImageFileRef.current).then(res => {
          newImageUrl = res?.data?.profilePictureUrl || res?.profilePictureUrl || res?.data?.profileImageUrl || res?.profileImageUrl || newImageUrl;
          return res;
        });
        promises.push(imageUploadPromise);
        profileImageFileRef.current = null;
      }
      if (formData.specialty || formData.experience) {
        const specialtyEnum = SPECIALTIES.find(s => s.label === formData.specialty)?.value || 0;
        promises.push(doctorService.updateSpecialtyExperience({ medicalSpecialty: specialtyEnum, yearsOfExperience: parseInt(formData.experience) || 0 }));
      }
      ['nationalIdPhoto', 'medicalLicensePhoto', 'syndicateMembershipPhoto', 'graduationCertificatePhoto', 'specializationCertificatePhoto'].forEach(f => {
        if (formData[f] instanceof File) promises.push(doctorService.uploadRequiredDocument(formData[f], getDocumentTypeFromFieldName(f)));
      });
      formData.awardsImages.forEach(a => { if (a.file instanceof File) promises.push(doctorService.uploadAwardDocument(a.file)); });
      formData.researchPapersImages.forEach(r => { if (r.file instanceof File) promises.push(doctorService.uploadResearchDocument(r.file)); });

      const results = await Promise.allSettled(promises);
      if (results.some(r => r.status === 'fulfilled')) {
        setAutoSaveStatus('saved');
        lastSavedDataRef.current = currentData;
        
        // Update the global user store so the navbar immediately reflects changes
        updateUserProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          specialty: formData.specialty,
          profileImageUrl: newImageUrl || user?.profileImageUrl
        });

        setTimeout(() => setAutoSaveStatus(''), 2000);
      } else throw new Error('Failed');
    } catch (e) { setAutoSaveStatus('error'); setTimeout(() => setAutoSaveStatus(''), 3000); }
  }, [formData]);

  useEffect(() => {
    if (!hasChangesRef.current) { hasChangesRef.current = true; lastSavedDataRef.current = JSON.stringify(formData); return; }
    if (JSON.stringify(formData) === lastSavedDataRef.current) return;
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    autoSaveTimeoutRef.current = setTimeout(() => performAutoSave(), 3000);
    return () => { if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current); };
  }, [formData, performAutoSave]);

  const handleSubmitForReview = useCallback(async () => {
    try {
      const res = await doctorService.submitForReview();
      if (res.succeeded || res.isSuccess) {
        alert('✅ تم إرسال الملف للمراجعة بنجاح');
        await fetchProfileData(); await fetchProfessionalDocuments();
      }
    } catch (e) { alert(`❌ ${e.response?.data?.message || e.message}`); }
  }, [fetchProfileData, fetchProfessionalDocuments]);

  const sections = [
    { id: 'personal', title: 'البيانات الشخصية', icon: <FaUserMd /> },
    { id: 'professional', title: 'المسار المهني', icon: <FaIdCard /> },
    { id: 'clinic', title: 'العيادة والمكاتب', icon: <FaHospital /> },
    { id: 'services', title: 'الخدمات والأسعار', icon: <FaStethoscope /> },
    { id: 'appointments', title: 'ماتريكس المواعيد', icon: <FaClock /> },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-[1600px] mx-auto px-8 mt-10 flex flex-col lg:flex-row gap-10 relative" dir="rtl">
        {/* Profile Sidebar */}
        <ProfileSidebar
          formData={formData}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onSubmitForReview={handleSubmitForReview}
        />

        {/* Main Content Area */}
        <div className="flex-1 pb-20">
          {activeSection === 'personal' && (
            <PersonalInfoSection
              formData={formData}
              profileImagePreview={profileImagePreview}
              handleChange={handleChange}
              autoSaveStatus={autoSaveStatus}
              onSubmitForReview={handleSubmitForReview}
            />
          )}

          {activeSection === 'professional' && (
            <ProfessionalInfoSection
              formData={formData}
              handleChange={handleChange}
              specialtyOptions={SPECIALTIES}
              onSave={performAutoSave}
              documentStatuses={documentStatuses}
              removeAwardsImage={async (idx) => {
                setFormData(prev => ({
                  ...prev,
                  awardsImages: prev.awardsImages.filter((_, i) => i !== idx)
                }));
              }}
              removeResearchPapersImage={async (idx) => {
                setFormData(prev => ({
                  ...prev,
                  researchPapersImages: prev.researchPapersImages.filter((_, i) => i !== idx)
                }));
              }}
            />
          )}

          {activeSection === 'clinic' && (
            <ClinicInfoSection
              formData={formData}
              handleChange={handleChange}
              onSave={performAutoSave}
            />
          )}

          {activeSection === 'services' && (
            <ServicesSection
              consultationFee={formData.consultationFee}
              onSave={(val) => setFormData(p => ({ ...p, consultationFee: val }))}
            />
          )}

          {activeSection === 'appointment' && (
            <AppointmentSection />
          )}


        </div>
      </div>
      
      <style jsx="true">{`
        .scroll-mt-32 { scroll-margin-top: 8rem; }
      `}</style>
    </div>
  );
};

export default DoctorProfilePage;
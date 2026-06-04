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
import { FaUserMd, FaHospital, FaStethoscope, FaClock, FaIdCard, FaCheckCircle, FaExclamationCircle, FaTerminal, FaSave, FaChartLine } from 'react-icons/fa';

const formatDateFromISO = (isoDate) => {
  if (!isoDate) return '';
  return isoDate.split('T')[0];
};

/**
 * DoctorProfilePage - Clinical Command Center Edition
 * A unified, high-density Bento layout for comprehensive profile management.
 */
const DoctorProfilePage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'
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

  const [profileImagePreview, setProfileImagePreview] = useState(user?.profilePicture || null);

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
      if (profileImageFileRef.current instanceof File) {
        promises.push(doctorService.updateProfileImage(profileImageFileRef.current));
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
      {/* Tactical Top Bar */}
      <div className="sticky top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-[#0070CD] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0070CD]/20">
              <FaTerminal />
           </div>
           <div>
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">لوحة التحكم السريرية</h1>
              <p className="text-[10px] text-[#0070CD] font-bold uppercase tracking-wider">Clinical Command Center v2.0</p>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
             autoSaveStatus === 'saving' ? 'bg-blue-50 text-blue-600 border-blue-100' :
             autoSaveStatus === 'saved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
             'bg-slate-50 text-slate-400 border-slate-100'
           }`}>
              {autoSaveStatus === 'saving' && <FaSave className="animate-bounce" />}
              {autoSaveStatus === 'saved' && <FaCheckCircle />}
              <span>{autoSaveStatus === 'saving' ? 'جاري المزامنة' : autoSaveStatus === 'saved' ? 'تم الحفظ' : 'مؤمن'}</span>
           </div>

           <button 
             onClick={handleSubmitForReview}
             className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#0070CD] transition-all transform active:scale-95 shadow-lg shadow-slate-900/10"
           >
             إرسال للمراجعة
           </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 mt-10 flex gap-10 relative">
        {/* Floating Clinical Index Sidebar */}
        <div className="hidden xl:block w-72 sticky top-32 h-fit space-y-2">
           <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 block mb-6">فهرس المحتوى</span>
              <div className="space-y-2">
                 {sections.map(s => (
                   <button
                     key={s.id}
                     onClick={() => scrollToSection(s.id)}
                     className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group text-right"
                   >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#0070CD] group-hover:text-white transition-all">
                         {s.icon}
                      </div>
                      <span className="text-xs font-black text-slate-600 group-hover:text-slate-900 transition-all">{s.title}</span>
                   </button>
                 ))}
              </div>
           </div>

           {/* Clinical Health Stats Tile */}
           <div className="bg-[#0070CD] p-6 rounded-[2.5rem] text-white shadow-xl shadow-[#0070CD]/10">
              <div className="flex items-center gap-3 mb-4">
                 <FaChartLine className="text-xl opacity-60" />
                 <span className="text-[10px] font-black uppercase tracking-widest">مؤشر الجودة</span>
              </div>
              <div className="text-3xl font-black mb-2">85%</div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-400 w-[85%]"></div>
              </div>
           </div>
        </div>

        {/* Main Infinite Scroll Bento Layout */}
        <div className="flex-1 space-y-12 pb-20">
           {/* Header Highlight Card */}
           <div className="bg-[#0070CD] rounded-[3rem] p-12 text-white shadow-2xl shadow-[#0070CD]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                 <div className="relative">
                    <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
                       {profileImagePreview ? (
                         <img src={profileImagePreview} className="w-full h-full object-cover" alt="Doctor" />
                       ) : (
                         <FaUserMd className="text-5xl opacity-40" />
                       )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-[#0070CD] rounded-2xl flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 transition-all">
                       <FaSave className="text-xs" />
                       <input type="file" name="profilePicture" onChange={handleChange} className="hidden" />
                    </label>
                 </div>
                 <div className="flex-1 text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-end gap-3 mb-2">
                       <h2 className="text-3xl font-black">{formData.firstName} {formData.lastName}</h2>
                       <FaCheckCircle className="text-emerald-400 text-xl" />
                    </div>
                    <p className="text-white/70 font-black uppercase tracking-[0.2em] text-xs">
                       {formData.specialty || 'تخصص طبي'} • {formData.experience || '0'} سنوات خبرة
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center md:justify-end gap-3">
                       <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">{formData.email}</div>
                       <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">{formData.phone || 'N/A'}</div>
                    </div>
                 </div>
              </div>
           </div>

           <div id="personal" className="scroll-mt-32">
              <PersonalInfoSection formData={formData} handleChange={handleChange} onSave={performAutoSave} />
           </div>

           <div id="professional" className="scroll-mt-32">
              <ProfessionalInfoSection 
                formData={formData} 
                handleChange={handleChange} 
                onSave={performAutoSave} 
                documentStatuses={documentStatuses}
                removeAwardsImage={async (idx) => { setFormData(prev => ({...prev, awardsImages: prev.awardsImages.filter((_, i) => i !== idx)})); }}
                removeResearchPapersImage={async (idx) => { setFormData(prev => ({...prev, researchPapersImages: prev.researchPapersImages.filter((_, i) => i !== idx)})); }}
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div id="clinic" className="scroll-mt-32">
                 <ClinicInfoSection formData={formData} handleChange={handleChange} onSave={performAutoSave} />
              </div>
              <div id="services" className="scroll-mt-32">
                 <ServicesSection consultationFee={formData.consultationFee} onSave={(val) => setFormData(p => ({...p, consultationFee: val}))} />
              </div>
           </div>

           <div id="appointments" className="scroll-mt-32">
              <AppointmentSection />
           </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .scroll-mt-32 { scroll-margin-top: 8rem; }
      `}</style>
    </div>
  );
};

export default DoctorProfilePage;
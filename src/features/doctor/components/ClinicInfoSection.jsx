import React, { useState, useEffect, useRef } from 'react';
import { useClinic } from '../hooks/useClinic';
import { useClinicForm } from '../hooks/useClinicForm';
import { CLINIC_SERVICES } from '@/utils/constants';
import {
  convertFromPhoneNumbersArray,
  convertToPhoneNumbersArray
} from '../utils/phoneHelpers';
import MapPicker from '@/components/common/MapPicker';
import '@/styles/leaflet-custom.css';
import {
  FaHospital,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaMap,
  FaTags,
  FaBuilding,
  FaGlobeAmericas,
  FaTrash,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle,
  FaImages
} from 'react-icons/fa';

/**
 * ClinicInfoSection - Bento Module
 * High-density clinical facility management station.
 */
const ClinicInfoSection = () => {
  const {
    clinicInfo,
    clinicAddress,
    clinicImages,
    loading,
    error,
    success,
    updateInfo,
    updateAddress,
    uploadImage,
    deleteImage,
    clearErrors,
    refreshAll,
  } = useClinic({ autoFetch: true });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [localImages, setLocalImages] = useState([]);
  const isEditingRef = useRef(false);
  const hasInitializedInfoRef = useRef(false);
  const hasInitializedAddressRef = useRef(false);

  // Auto-save states
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved'
  const autoSaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef(null);
  const isRefreshingRef = useRef(false); 
  const [triggerAddressFetch, setTriggerAddressFetch] = useState(false); 

  // Initialize form for clinic info
  const {
    values: infoValues,
    handleChange: handleInfoChange,
    setFormValues: setInfoFormValues,
  } = useClinicForm({
    clinicName: '',
    clinicPhone1: '',
    clinicPhone2: '',
    clinicLandline: '',
    services: [],
  });

  // Initialize form for address
  const {
    values: addressValues,
    handleChange: handleAddressChange,
    setFormValues: setAddressFormValues,
  } = useClinicForm({
    governorate: '',
    city: '',
    street: '',
    buildingNumber: '',
    latitude: '',
    longitude: '',
  });

  // Update forms when data changes
  useEffect(() => {
    if (clinicInfo && !isEditingRef.current) {
      const phones = convertFromPhoneNumbersArray(clinicInfo.phoneNumbers);
      const servicesToUse = clinicInfo.services || [];

      setInfoFormValues({
        clinicName: clinicInfo.clinicName || '',
        clinicPhone1: phones.phone1 || '',
        clinicPhone2: phones.phone2 || '',
        clinicLandline: phones.landline || '',
        services: servicesToUse,
      });
      setSelectedServices(servicesToUse);

      if (!hasInitializedInfoRef.current) {
        hasInitializedInfoRef.current = true;
      }
    }
  }, [clinicInfo, setInfoFormValues]);

  useEffect(() => {
    if (clinicAddress && !isEditingRef.current) {
      const addressToUse = {
        governorate: clinicAddress.governorate || '',
        city: clinicAddress.city || '',
        street: clinicAddress.street || '',
        buildingNumber: clinicAddress.buildingNumber || '',
        latitude: clinicAddress.latitude ? String(clinicAddress.latitude) : '',
        longitude: clinicAddress.longitude ? String(clinicAddress.longitude) : '',
      };
      setAddressFormValues(addressToUse);
      if (!hasInitializedAddressRef.current) {
        hasInitializedAddressRef.current = true;
      }
    }
  }, [
    clinicAddress?.governorate,
    clinicAddress?.city,
    clinicAddress?.street,
    clinicAddress?.buildingNumber,
    clinicAddress?.latitude,
    clinicAddress?.longitude,
    setAddressFormValues
  ]);

  useEffect(() => {
    if (clinicImages && !isEditingRef.current) {
      setLocalImages(clinicImages);
    }
  }, [clinicImages]);

  const handleServiceChange = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    let newServices = isSelected 
      ? selectedServices.filter(s => s.id !== service.id)
      : [...selectedServices, service];
    setSelectedServices(newServices);
  };

  const handleClinicImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (localImages.length + files.length > 6) {
      alert('لا يمكن إضافة أكثر من 6 صور');
      return;
    }

    let currentOrder = localImages.length;
    for (const file of files) {
      const result = await uploadImage(file, currentOrder);
      if (result.success) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalImages(prev => [...prev, {
            preview: reader.result,
            file: file,
            order: currentOrder
          }]);
        };
        reader.readAsDataURL(file);
        currentOrder++;
      }
    }
  };

  const removeClinicImage = async (index) => {
    const image = localImages[index];
    if (image.id) {
      const result = await deleteImage(image.id);
      if (result.success) {
        setLocalImages(prev => prev.filter((_, i) => i !== index));
      }
    } else {
      setLocalImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const performAutoSave = async () => {
    const currentData = JSON.stringify({ infoValues, addressValues, selectedServices });
    if (currentData === lastSavedDataRef.current) return;

    setAutoSaveStatus('saving');
    try {
      const phoneNumbers = convertToPhoneNumbersArray({
        phone1: infoValues.clinicPhone1,
        phone2: infoValues.clinicPhone2,
        landline: infoValues.clinicLandline,
      });

      const infoResult = await updateInfo({
        clinicName: infoValues.clinicName,
        phoneNumbers: phoneNumbers,
        services: selectedServices,
      });

      const addressData = {
        governorate: addressValues.governorate,
        city: addressValues.city,
        street: addressValues.street,
        buildingNumber: addressValues.buildingNumber,
        latitude: parseFloat(addressValues.latitude) || 0,
        longitude: parseFloat(addressValues.longitude) || 0,
      };

      const addressResult = await updateAddress(addressData);

      if (infoResult.success && addressResult.success) {
        setAutoSaveStatus('saved');
        await refreshAll();
        setTimeout(() => {
          lastSavedDataRef.current = JSON.stringify({ infoValues, addressValues, selectedServices });
          isRefreshingRef.current = false;
        }, 200);
        setTimeout(() => setAutoSaveStatus(''), 2000);
      } else {
        throw new Error('فشل الحفظ');
      }
    } catch (error) {
      setAutoSaveStatus('');
    }
  };

  useEffect(() => {
    if (isRefreshingRef.current || !hasInitializedInfoRef.current) return;
    if (!lastSavedDataRef.current) {
      lastSavedDataRef.current = JSON.stringify({ infoValues, addressValues, selectedServices });
      return;
    }
    const currentData = JSON.stringify({ infoValues, addressValues, selectedServices });
    if (currentData === lastSavedDataRef.current) return;

    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, 3000);

    return () => {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
  }, [infoValues, addressValues, selectedServices]);

  const handleChange = (e) => {
    const { name } = e.target;
    if (['clinicName', 'clinicPhone1', 'clinicPhone2', 'clinicLandline'].includes(name)) {
      handleInfoChange(e);
    } else {
      handleAddressChange(e);
    }
  };

  const getStatusColor = () => {
    switch(autoSaveStatus) {
      case 'saving': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'saved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const formData = {
    ...infoValues,
    ...addressValues,
    services: selectedServices,
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Module Header */}
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#0070CD]/5 rounded-xl flex items-center justify-center text-[#0070CD]">
            <FaHospital className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">بيانات المنشأة</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">إدارة العيادة والموقع الجغرافي</p>
          </div>
        </div>

        {/* Tactical Auto-save Indicator */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all duration-500 ${getStatusColor()}`}>
          {autoSaveStatus === 'saving' && <FaSave className="text-xs animate-bounce" />}
          {autoSaveStatus === 'saved' && <FaCheckCircle className="text-xs" />}
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            {autoSaveStatus === 'saving' ? 'جاري المزامنة' : autoSaveStatus === 'saved' ? 'تم الحفظ' : 'مؤمن'}
          </span>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Core Identity Bento Tile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 bg-[#F8FAFC] rounded-[2rem] border border-slate-100">
           <div className="lg:col-span-1 space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <FaBuilding className="text-[9px]" />
                <span>اسم العيادة</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="clinicName"
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20 focus:border-[#0070CD] transition-all"
                value={formData.clinicName || ''}
                onChange={handleChange}
                placeholder="اسم العيادة"
                required
              />
           </div>

           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">هاتف 1</label>
                <input
                  type="tel"
                  name="clinicPhone1"
                  dir="ltr"
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20 focus:border-[#0070CD]"
                  value={formData.clinicPhone1 || ''}
                  onChange={handleChange}
                  placeholder="01..."
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">هاتف 2</label>
                <input
                  type="tel"
                  name="clinicPhone2"
                  dir="ltr"
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20 focus:border-[#0070CD]"
                  value={formData.clinicPhone2 || ''}
                  onChange={handleChange}
                  placeholder="01..."
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">أرضي</label>
                <input
                  type="tel"
                  name="clinicLandline"
                  dir="ltr"
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20 focus:border-[#0070CD]"
                  value={formData.clinicLandline || ''}
                  onChange={handleChange}
                  placeholder="02..."
                />
              </div>
           </div>
        </div>

        {/* Tactical Services Dash */}
        <div className="space-y-6">
           <div className="flex items-center gap-3">
             <div className="w-1 h-4 bg-[#0070CD] rounded-full"></div>
             <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">الخدمات والتشخيص المتاح</h4>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
             {CLINIC_SERVICES.map((service) => {
               const isSelected = selectedServices.some(s => s.id === service.id);
               return (
                 <button
                   key={service.id}
                   type="button"
                   onClick={() => handleServiceChange(service)}
                   className={`
                     px-4 py-4 rounded-2xl text-[10px] font-black transition-all border
                     ${isSelected
                       ? 'bg-[#0070CD] text-white border-[#0070CD] shadow-lg shadow-[#0070CD]/20 translate-y-[-2px]'
                       : 'bg-white text-slate-400 border-slate-100 hover:border-[#0070CD] hover:text-[#0070CD]'
                     }
                   `}
                 >
                   {service.label}
                 </button>
               );
             })}
           </div>
        </div>

        {/* Global Mapping Command Center */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 ring-1 ring-slate-100 rounded-[2.5rem] overflow-hidden bg-white shadow-inner">
           <div className="p-8 space-y-8">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#0070CD]" />
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">الموقع الجغرافي الدقيق</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">المحافظة</label>
                    <div className="px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-500">
                       {formData.governorate || 'بيان آلي'}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">المدينة</label>
                    <div className="px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-500">
                       {formData.city || 'بيان آلي'}
                    </div>
                 </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">الشارع والمبنى</label>
                <div className="px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-500 h-14 flex items-center">
                   {formData.street} {formData.buildingNumber ? `، مبنى ${formData.buildingNumber}` : ''}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                       <FaGlobeAmericas className="text-[8px]" /> Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20"
                      dir="ltr"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                       <FaGlobeAmericas className="text-[8px]" /> Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-[#0070CD]/20"
                      dir="ltr"
                    />
                 </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        handleAddressChange({ target: { name: 'latitude', value: lat } });
                        handleAddressChange({ target: { name: 'longitude', value: lng } });
                        setTriggerAddressFetch(true);
                        setTimeout(() => setTriggerAddressFetch(false), 100);
                      }
                    );
                  }
                }}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0070CD] transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <FaHospital className="text-xs" />
                تحديد موقعي الحالي
              </button>
           </div>

           <div className="h-[400px] xl:h-auto min-h-[400px] border-l border-slate-100">
             <MapPicker
                latitude={formData.latitude && !isNaN(parseFloat(formData.latitude)) ? parseFloat(formData.latitude) : 30.0444}
                longitude={formData.longitude && !isNaN(parseFloat(formData.longitude)) ? parseFloat(formData.longitude) : 31.2357}
                triggerAddressFetch={triggerAddressFetch}
                onLocationChange={(lat, lng, addressDetails) => {
                  handleAddressChange({ target: { name: 'latitude', value: lat } });
                  handleAddressChange({ target: { name: 'longitude', value: lng } });
                  if (addressDetails) {
                    if (addressDetails.governorate) handleAddressChange({ target: { name: 'governorate', value: addressDetails.governorate } });
                    if (addressDetails.city) handleAddressChange({ target: { name: 'city', value: addressDetails.city } });
                    if (addressDetails.street) handleAddressChange({ target: { name: 'street', value: addressDetails.street } });
                  }
                }}
                disabled={false}
              />
           </div>
        </div>

        {/* High-Fidelity Gallery Matrix */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <FaImages className="text-[#0070CD]" />
                 <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">معرض صور المنشأة الرقابة البصرية</h4>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{localImages.length} / 6 صور</span>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {localImages.map((image, index) => (
                <div key={index} className="relative group aspect-square rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:translate-y-[-4px]">
                  <img
                    src={image.preview || image.url}
                    alt={`Clinic ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button
                       type="button"
                       onClick={() => removeClinicImage(index)}
                       className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-rose-500 transition-colors flex items-center justify-center"
                     >
                       <FaTrash className="text-sm" />
                     </button>
                  </div>
                </div>
              ))}
              
              {localImages.length < 6 && (
                <div className="aspect-square">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleClinicImageChange}
                    className="hidden"
                    id="clinicImages"
                  />
                  <label
                    htmlFor="clinicImages"
                    className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:bg-[#0070CD]/5 hover:border-[#0070CD] transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#0070CD] transition-colors mb-2">
                       <FaCamera className="text-lg" />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">إضافة صورة</span>
                  </label>
                </div>
              )}
           </div>

           {localImages.length === 0 && (
             <div className="py-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-center">
                <FaImages className="text-slate-300 text-3xl mx-auto mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">برجاء رفع صور للعيادة لتعزيز ثقة المرضى</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ClinicInfoSection;

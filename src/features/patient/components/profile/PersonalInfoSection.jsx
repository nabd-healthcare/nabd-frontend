import React, { useState, useEffect, useRef } from 'react';
import { usePatientProfile } from '../../hooks/usePatientProfile';
import { EGYPTIAN_GOVERNORATES, GENDER_OPTIONS } from '@/utils/constants';
import MapPicker from '@/components/common/MapPicker';
import '@/styles/leaflet-custom.css';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
  FaVenusMars,
  FaCalendar,
  FaGlobeAmericas,
  FaSpinner,
} from 'react-icons/fa';

/**
 * Personal Info Section Component
 * 
 * Displays and manages patient personal information:
 * - First name, Last name
 * - Email, Phone
 * - Gender, Birth date
 * - Profile image
 * - Address (governorate, city, street, building, coordinates)
 * - Map integration (same as doctor clinic)
 */
const PersonalInfoSection = () => {
  const {
    personalInfo,
    address,
    error,
    success,
    updatePersonalInfo,
    updateProfileImage,
    updateAddress,
  } = usePatientProfile({ autoFetch: false }); // Fetched by parent

  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saved', 'error'
  const hasInitializedInfoRef = useRef(false);
  const hasInitializedAddressRef = useRef(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const hasChangesRef = useRef(false);
  const lastSavedInfoRef = useRef(null);
  const lastSavedAddressRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Form state for personal info
  const [infoValues, setInfoValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    birthDate: '',
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Form state for address
  const [addressValues, setAddressValues] = useState({
    governorate: '',
    city: '',
    street: '',
    buildingNumber: '',
    latitude: '',
    longitude: '',
  });

  // Initialize personal info from store
  useEffect(() => {
    if (personalInfo && !hasInitializedInfoRef.current) {
      console.log('🔧 Initializing personal info from store:', personalInfo);
      const infoToUse = {
        firstName: personalInfo.firstName || '',
        lastName: personalInfo.lastName || '',
        email: personalInfo.email || '',
        phoneNumber: personalInfo.phoneNumber || '',
        gender: personalInfo.gender || '',
        birthDate: personalInfo.birthDate ? personalInfo.birthDate.split('T')[0] : '',
      };

      console.log('📝 Setting initial values:', infoToUse);
      setInfoValues(infoToUse);
      setProfileImagePreview(personalInfo.profileImageUrl || null);
      lastSavedInfoRef.current = JSON.stringify(infoToUse);
      hasInitializedInfoRef.current = true;
    }
  }, [personalInfo]);

  // Initialize address from store
  useEffect(() => {
    if (address && !hasInitializedAddressRef.current) {
      console.log('🏠 Initializing address from store:', address);

      // Use default Cairo coordinates if address has no coordinates
      const lat = address.latitude != null && address.latitude !== 0 ? address.latitude : 30.0444;
      const lng = address.longitude != null && address.longitude !== 0 ? address.longitude : 31.2357;

      const addressToUse = {
        governorate: address.governorate ? String(address.governorate) : '', // Convert number to string for form
        city: address.city || '',
        street: address.street || '',
        buildingNumber: address.buildingNumber || '',
        latitude: String(lat),
        longitude: String(lng),
      };

      console.log('📍 Setting initial address:', addressToUse);
      setAddressValues(addressToUse);
      lastSavedAddressRef.current = JSON.stringify(addressToUse);
      hasInitializedAddressRef.current = true;
    }
  }, [address]);

  // Handle personal info change
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfoValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    hasChangesRef.current = true;
    setAutoSaveStatus(''); // Clear status when editing
  };

  // Handle address change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressValues(prev => ({ ...prev, [name]: value }));
    hasChangesRef.current = true;
    setAutoSaveStatus(''); // Clear status when editing
  };

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار صورة صالحة');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setProfileImageFile(file);

    // Create preview
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setProfileImagePreview(url);
    setProfileImageFile(file);
    hasChangesRef.current = true;
    setAutoSaveStatus(''); // Clear status when editing
  };

  // Handle map location change (from MapPicker)
  const handleMapLocationChange = (lat, lng, addressDetails) => {
    console.log('🗺️ PersonalInfoSection: Received from MapPicker:', { lat, lng, addressDetails });

    // Map governorate name to enum value (1-27) - matches backend exactly
    const governorateMap = {
      'القاهرة': 1, 'Cairo': 1,
      'الجيزة': 2, 'Giza': 2,
      'الإسكندرية': 3, 'Alexandria': 3,
      'الدقهلية': 4, 'Dakahlia': 4,
      'البحر الأحمر': 5, 'Red Sea': 5, 'RedSea': 5,
      'البحيرة': 6, 'Beheira': 6,
      'الفيوم': 7, 'Fayoum': 7,
      'الغربية': 8, 'Gharbia': 8,
      'الإسماعيلية': 9, 'Ismailia': 9,
      'المنوفية': 10, 'Menofia': 10, 'Monufia': 10,
      'المنيا': 11, 'Minya': 11,
      'القليوبية': 12, 'Qaliubiya': 12, 'Qalyubia': 12,
      'الوادي الجديد': 13, 'New Valley': 13, 'NewValley': 13,
      'شمال سيناء': 14, 'North Sinai': 14, 'NorthSinai': 14,
      'بورسعيد': 15, 'Port Said': 15, 'PortSaid': 15,
      'قنا': 16, 'Qena': 16,
      'الشرقية': 17, 'Sharqia': 17,
      'سوهاج': 18, 'Sohag': 18,
      'جنوب سيناء': 19, 'South Sinai': 19, 'SouthSinai': 19,
      'السويس': 20, 'Suez': 20,
      'أسوان': 21, 'Aswan': 21,
      'أسيوط': 22, 'Assiut': 22,
      'بني سويف': 23, 'Beni Suef': 23, 'BeniSuef': 23,
      'دمياط': 24, 'Damietta': 24,
      'كفر الشيخ': 25, 'Kafr El Sheikh': 25, 'KafrElSheikh': 25,
      'الأقصر': 26, 'Luxor': 26,
      'مرسى مطروح': 27, 'Matrouh': 27, 'مطروح': 27,
    };

    const governorateValue = addressDetails?.governorate
      ? (governorateMap[addressDetails.governorate] || 1)
      : addressValues.governorate || 1;

    setAddressValues(prev => ({
      ...prev,
      latitude: String(lat),
      longitude: String(lng),
      // Update address fields if addressDetails provided
      ...(addressDetails && {
        governorate: String(governorateValue), // Convert to string for select input
        city: addressDetails.city || prev.city,
        street: addressDetails.street || prev.street,
      }),
    }));

    hasChangesRef.current = true;
    setAutoSaveStatus('');

    console.log('✅ PersonalInfoSection: Address updated:', {
      governorate: governorateValue,
      city: addressDetails?.city,
      street: addressDetails?.street,
    });
  };

  // Reverse geocoding to get address from coordinates
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      const data = await response.json();

      if (data.address) {
        // Extract governorate (state/province)
        const governorateName = data.address.state || data.address.province || data.address.city || '';

        // Map governorate name to enum value (1-27) - matches backend exactly
        const governorateMap = {
          'القاهرة': 1, 'Cairo': 1,
          'الجيزة': 2, 'Giza': 2,
          'الإسكندرية': 3, 'Alexandria': 3,
          'الدقهلية': 4, 'Dakahlia': 4,
          'البحر الأحمر': 5, 'Red Sea': 5, 'RedSea': 5,
          'البحيرة': 6, 'Beheira': 6,
          'الفيوم': 7, 'Fayoum': 7,
          'الغربية': 8, 'Gharbia': 8,
          'الإسماعيلية': 9, 'Ismailia': 9,
          'المنوفية': 10, 'Menofia': 10, 'Monufia': 10,
          'المنيا': 11, 'Minya': 11,
          'القليوبية': 12, 'Qaliubiya': 12, 'Qalyubia': 12,
          'الوادي الجديد': 13, 'New Valley': 13, 'NewValley': 13,
          'شمال سيناء': 14, 'North Sinai': 14, 'NorthSinai': 14,
          'بورسعيد': 15, 'Port Said': 15, 'PortSaid': 15,
          'قنا': 16, 'Qena': 16,
          'الشرقية': 17, 'Sharqia': 17,
          'سوهاج': 18, 'Sohag': 18,
          'جنوب سيناء': 19, 'South Sinai': 19, 'SouthSinai': 19,
          'السويس': 20, 'Suez': 20,
          'أسوان': 21, 'Aswan': 21,
          'أسيوط': 22, 'Assiut': 22,
          'بني سويف': 23, 'Beni Suef': 23, 'BeniSuef': 23,
          'دمياط': 24, 'Damietta': 24,
          'كفر الشيخ': 25, 'Kafr El Sheikh': 25, 'KafrElSheikh': 25,
          'الأقصر': 26, 'Luxor': 26,
          'مرسى مطروح': 27, 'Matrouh': 27, 'مطروح': 27,
        };

        const governorateValue = governorateMap[governorateName] || 1;
        const city = data.address.city || data.address.town || data.address.village || '';
        const street = data.address.road || data.address.street || '';

        return {
          governorate: governorateValue,
          city,
          street,
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error fetching address from coordinates:', error);
      return null;
    }
  };

  // Get current location with auto-fill
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('المتصفح لا يدعم تحديد الموقع الجغرافي');
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log('📍 Current location:', { lat, lng });

        // Get address from coordinates
        const addressData = await getAddressFromCoordinates(lat, lng);
        console.log('🗺️ Address data from reverse geocoding:', addressData);

        setAddressValues((prev) => ({
          ...prev,
          latitude: String(lat),
          longitude: String(lng),
          ...(addressData && {
            governorate: String(addressData.governorate),
            city: addressData.city,
            street: addressData.street,
          }),
        }));

        hasChangesRef.current = true;
        setAutoSaveStatus('');
        setGettingLocation(false);
      },
      (error) => {
        console.error('❌ Error getting location:', error);
        alert('فشل الحصول على الموقع الحالي. تأكد من السماح بالوصول للموقع.');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Auto-save function
  const performAutoSave = async () => {
    try {
      // Check if there are changes
      const currentInfo = JSON.stringify(infoValues);
      const currentAddress = JSON.stringify(addressValues);

      const hasInfoChanges = currentInfo !== lastSavedInfoRef.current;
      const hasAddressChanges = currentAddress !== lastSavedAddressRef.current;
      const hasImageChanges = !!profileImageFile;

      console.log('📊 Change detection:', {
        hasInfoChanges,
        hasAddressChanges,
        hasImageChanges,
        currentInfo: currentInfo.substring(0, 100) + '...',
        lastSavedInfo: lastSavedInfoRef.current?.substring(0, 100) + '...',
      });

      if (!hasInfoChanges && !hasAddressChanges && !hasImageChanges) {
        console.log('⏭️ No changes to save, skipping...');
        hasChangesRef.current = false;
        return; // No changes to save
      }

      console.log('🔄 Auto-saving changes...');
      // Don't show "saving" status, just save silently

      // Basic validation
      const newErrors = {};
      if (!infoValues.firstName?.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
      if (!infoValues.lastName?.trim()) newErrors.lastName = 'الاسم الثاني مطلوب';
      if (!infoValues.phoneNumber?.trim()) newErrors.phoneNumber = 'رقم الهاتف مطلوب';

      if (Object.keys(newErrors).length > 0) {
        console.error('❌ Validation failed: Required fields are empty');
        setErrors(newErrors);
        setAutoSaveStatus('error');
        setTimeout(() => setAutoSaveStatus(''), 3000);
        return; // Don't auto-save if required fields are empty
      }

      console.log('✅ Validation passed!');

      // Prepare info data
      const infoData = {
        firstName: infoValues.firstName.trim(),
        lastName: infoValues.lastName.trim(),
        email: infoValues.email?.trim() || '',
        phoneNumber: infoValues.phoneNumber.trim(),
        gender: infoValues.gender ? parseInt(infoValues.gender, 10) : null, // Convert to number (1 or 2)
        birthDate: infoValues.birthDate || null,
      };

      // Prepare address data
      const lat = parseFloat(addressValues.latitude);
      const lng = parseFloat(addressValues.longitude);

      // Convert governorate from string to number (Backend expects enum 1-27)
      const governorateNum = addressValues.governorate ? parseInt(addressValues.governorate, 10) : null;

      const addressData = {
        street: addressValues.street?.trim() || '',
        city: addressValues.city?.trim() || '',
        governorate: governorateNum, // Number (enum)
        buildingNumber: addressValues.buildingNumber?.trim() || '',
        latitude: !isNaN(lat) && lat !== 0 ? lat : 30.0444, // Default Cairo coordinates
        longitude: !isNaN(lng) && lng !== 0 ? lng : 31.2357,
      };

      console.log('🗺️ Address coordinates:', {
        original: { lat: addressValues.latitude, lng: addressValues.longitude },
        parsed: { lat, lng },
        final: { lat: addressData.latitude, lng: addressData.longitude }
      });

      console.log('📤 Data to send:', {
        infoData,
        addressData,
        hasImage: !!profileImageFile,
        imageFileName: profileImageFile?.name,
        governorateType: typeof addressData.governorate,
        governorateValue: addressData.governorate
      });

      // Execute all updates in parallel
      // Personal info, profile image, and address as separate requests
      const promises = [];
      const promiseTypes = []; // Track which API each promise represents

      // Update personal info if it changed
      if (hasInfoChanges) {
        promises.push(updatePersonalInfo(infoData));
        promiseTypes.push('Personal Info');
      }

      // Update profile image if changed (separate endpoint)
      if (hasImageChanges && profileImageFile) {
        promises.push(updateProfileImage(profileImageFile));
        promiseTypes.push('Profile Image');
      }

      // Update address if it changed and has valid data
      if (hasAddressChanges) {
        // Validate address has at least governorate AND city (Backend requirement)
        if (addressData.governorate && addressData.city) {
          promises.push(updateAddress(addressData));
          promiseTypes.push('Address');
        } else {
          console.warn('⚠️ Skipping address update - governorate and city are required', {
            governorate: addressData.governorate,
            city: addressData.city
          });
        }
      }

      // If no promises, skip (shouldn't happen due to earlier check)
      if (promises.length === 0) {
        console.log('⚠️ No updates to perform');
        setAutoSaveStatus('');
        return;
      }

      const results = await Promise.allSettled(promises);
      console.log('📥 Save results:', results);
      console.log('📋 Promise types:', promiseTypes);
      console.log('🔢 Number of promises:', promises.length);
      console.log('🔢 Number of results:', results.length);

      // Check if all succeeded
      console.log('🔍 Starting success check...');
      const allSuccess = results.every((r, index) => {
        const apiName = promiseTypes[index] || `API ${index}`;

        console.log(`🔍 Checking ${apiName} result:`, {
          status: r.status,
          value: r.value,
          isSuccess: r.value?.isSuccess,
          hasIsSuccess: 'isSuccess' in (r.value || {}),
          valueType: typeof r.value,
          valueKeys: r.value ? Object.keys(r.value) : null,
          valueKeysLength: r.value ? Object.keys(r.value).length : null
        });

        if (r.status !== 'fulfilled') {
          console.error(`❌ ${apiName}: Request failed (rejected)`);
          return false;
        }

        // If value is empty object {}, consider it success (Backend issue)
        const isEmptyObject = r.value && typeof r.value === 'object' && Object.keys(r.value).length === 0;
        console.log(`🧪 ${apiName}: isEmptyObject check:`, {
          hasValue: !!r.value,
          isObject: typeof r.value === 'object',
          keysLength: r.value ? Object.keys(r.value).length : null,
          isEmptyObject
        });

        if (isEmptyObject) {
          console.log(`⚠️ ${apiName}: Backend returned empty response {}, considering it success`);
          return true;
        }

        // If value is null or undefined but status is fulfilled, consider it success
        if (!r.value) {
          console.log(`⚠️ ${apiName}: Backend returned null/undefined, considering it success`);
          return true;
        }

        // Check isSuccess (or succeeded)
        const hasIsSuccess = r.value?.isSuccess === true || r.value?.succeeded === true;

        // WORKAROUND: If Backend returns empty object or no isSuccess field,
        // but status is fulfilled (200 OK), consider it success
        const success = hasIsSuccess || (r.status === 'fulfilled' && !('isSuccess' in (r.value || {})));

        if (!hasIsSuccess && success) {
          console.warn(`⚠️ ${apiName}: No isSuccess field, but status is fulfilled - considering it success`);
        } else if (!success) {
          console.error(`❌ ${apiName}: isSuccess = ${r.value?.isSuccess}`);
        } else {
          console.log(`✅ ${apiName}: Success!`);
        }

        return success;
      });

      console.log('🎯 Final result: allSuccess =', allSuccess);

      if (allSuccess) {
        // Update last saved refs (no refresh to avoid loading)
        lastSavedInfoRef.current = currentInfo;
        lastSavedAddressRef.current = currentAddress;
        setProfileImageFile(null);
        hasChangesRef.current = false;
        setAutoSaveStatus('saved');
        console.log('✅ Auto-save complete!');

        // Clear saved status after 2 seconds
        setTimeout(() => {
          setAutoSaveStatus('');
        }, 2000);
      } else {
        console.error('⚠️ Auto-save failed:', results);
        // Log detailed error information
        results.forEach((result, index) => {
          const name = promiseTypes[index] || `API ${index}`;
          console.log(`${name} result:`, {
            status: result.status,
            value: result.value,
            reason: result.reason
          });
        });
        setAutoSaveStatus('error');
        // Clear error status after 3 seconds
        setTimeout(() => {
          setAutoSaveStatus('');
        }, 3000);
      }
    } catch (error) {
      console.error('🚨 Auto-save error:', error);
      setAutoSaveStatus('error');
      setTimeout(() => {
        setAutoSaveStatus('');
      }, 3000);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (hasChangesRef.current) {
      // Clear previous timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for 3 seconds
      autoSaveTimeoutRef.current = setTimeout(() => {
        performAutoSave();
      }, 3000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [infoValues, addressValues, profileImageFile]);

  return (
    <div className="space-y-8 animate-fadeIn mt-4">

      {/* 1. HERO PROFILE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative group p-8 lg:p-10 z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#0070CD]/10 to-transparent rounded-full blur-3xl -z-10 translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>

        {/* Profile Avatar Card */}
        <div className="relative flex-shrink-0 z-20">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full p-2 bg-gradient-to-tr from-[#0070CD] to-blue-400 shadow-xl relative group/avatar">
            <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <FaUser className="w-16 h-16 text-[#0070CD]/40" />
                </div>
              )}
            </div>
            {/* Floating Camera Button */}
            <label className="absolute bottom-1 left-1 w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl hover:scale-110 transition-all border border-slate-100 ring-4 ring-white">
              <FaCamera className="w-5 h-5 text-[#0070CD]" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Hero Info */}
        <div className="flex-1 text-center md:text-right">
          <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight mb-4">
            {infoValues.firstName && infoValues.lastName
              ? `${infoValues.firstName} ${infoValues.lastName}`
              : 'يتم التحميل...'}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            {infoValues.phoneNumber && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#0070CD]/10 flex items-center justify-center">
                  <FaPhone className="text-[#0070CD] text-sm" />
                </div>
                <span className="font-bold text-slate-700 font-mono tracking-wider " dir="ltr">{infoValues.phoneNumber}</span>
              </div>
            )}
            {infoValues.email && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl border-dashed">
                <div className="w-8 h-8 rounded-lg bg-[#0070CD]/10 flex items-center justify-center">
                  <FaEnvelope className="text-[#0070CD] text-sm" />
                </div>
                <span className="font-bold text-slate-700 leading-none">{infoValues.email}</span>
              </div>
            )}
          </div>

          {/* Auto-save states inline */}
          {autoSaveStatus && (
            <div className="mt-6 flex justify-center md:justify-start">
              <div className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm ${autoSaveStatus === 'saved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                  autoSaveStatus === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    'bg-blue-50 text-[#0070CD] border border-blue-200'
                }`}>
                {autoSaveStatus === 'saved' && <FaSave className="text-sm" />}
                {autoSaveStatus === 'error' && <FaTimes className="text-sm" />}
                <span className="font-bold text-sm">
                  {autoSaveStatus === 'saved' ? 'تم حفظ التغييرات بنجاح' :
                    autoSaveStatus === 'error' ? 'فشل الحفظ التلقائي' :
                      'جاري الحفظ التلقائي...'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* 2. BASIC INFO SECTION */}
        <div className="xl:col-span-12 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="border-b border-slate-100 px-8 py-6 flex items-center gap-4 bg-slate-50/50">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                <FaUser className="text-[#0070CD] text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0F172A]">البيانات الأساسية</h3>
                <p className="text-sm font-bold text-slate-500 mt-1">تحديث المعلومات الشخصية والتواصل</p>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-black text-[#94A3B8] mb-2">الاسم الأول <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    value={infoValues.firstName}
                    onChange={handleInfoChange}
                    className={`w-full px-5 py-4 border rounded-xl font-bold transition-all focus:outline-none focus:ring-4 ${errors.firstName ? 'border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 bg-slate-50/50 hover:border-[#0070CD]/40 focus:bg-white focus:border-[#0070CD] focus:ring-[#0070CD]/10'}`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-black text-[#94A3B8] mb-2">الاسم الثاني <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    value={infoValues.lastName}
                    onChange={handleInfoChange}
                    className={`w-full px-5 py-4 border rounded-xl font-bold transition-all focus:outline-none focus:ring-4 ${errors.lastName ? 'border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 bg-slate-50/50 hover:border-[#0070CD]/40 focus:bg-white focus:border-[#0070CD] focus:ring-[#0070CD]/10'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-black text-[#94A3B8] mb-2">رقم الهاتف <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={infoValues.phoneNumber}
                    onChange={handleInfoChange}
                    className={`w-full px-5 py-4 border rounded-xl font-bold transition-all focus:outline-none focus:ring-4 text-left ${errors.phoneNumber ? 'border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 bg-slate-50/50 hover:border-[#0070CD]/40 focus:bg-white focus:border-[#0070CD] focus:ring-[#0070CD]/10'}`}
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-black text-[#94A3B8] mb-2">البريد الإلكتروني <span className="font-medium text-slate-400 capitalize">(اختياري)</span></label>
                  <input
                    type="email"
                    name="email"
                    value={infoValues.email}
                    onChange={handleInfoChange}
                    className="w-full px-5 py-4 border border-slate-200 bg-slate-50/50 rounded-xl font-bold transition-all hover:border-[#0070CD]/40 focus:bg-white focus:outline-none focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/10 text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-black text-[#94A3B8] mb-2">الجنس</label>
                  <select
                    name="gender"
                    value={infoValues.gender}
                    onChange={handleInfoChange}
                    className="w-full px-5 py-4 border border-slate-200 bg-slate-50/50 rounded-xl font-bold transition-all hover:border-[#0070CD]/40 focus:bg-white focus:outline-none focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/10"
                  >
                    <option value="">تحديد</option>
                    {GENDER_OPTIONS.map(option => (
                      <option key={option.id} value={option.value}>{option.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-black text-[#94A3B8] mb-2">تاريخ الميلاد</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={infoValues.birthDate}
                    onChange={handleInfoChange}
                    className="w-full px-5 py-4 text-sm border border-slate-200 bg-slate-50/50 rounded-xl font-bold transition-all hover:border-[#0070CD]/40 focus:bg-white focus:outline-none focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/10 text-right"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ADDRESS & MAP SECTION */}
        <div className="xl:col-span-12 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
            <div className="border-b border-slate-100 px-8 py-6 flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-[#0070CD] text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0F172A]">العنوان الجغرافي</h3>
                  <p className="text-sm font-bold text-slate-500 mt-1">حدد مكانك لضمان سهولة التواصل وتسليم المستندات</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
                className="hidden md:flex px-6 py-3 bg-[#0070CD] text-white rounded-xl hover:bg-[#005ba3] hover:shadow-lg transition-all duration-300 items-center justify-center gap-2 font-black shadow-md disabled:opacity-50"
              >
                {gettingLocation ? <FaSpinner className="animate-spin text-sm" /> : <FaMapMarkerAlt className="text-sm" />}
                موقعي الحالي
              </button>
            </div>

            <div className="p-8 pb-4">
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
                className="md:hidden w-full mb-6 px-5 py-4 bg-[#0070CD] text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-black shadow-md"
              >
                {gettingLocation ? <FaSpinner className="animate-spin" /> : <FaMapMarkerAlt />}
                موقعي الحالي
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[11px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">المحافظة</label>
                  <input
                    type="text"
                    value={
                      addressValues.governorate
                        ? EGYPTIAN_GOVERNORATES.find(g => g.id === parseInt(addressValues.governorate))?.label || 'تلقائي'
                        : 'تلقائي من الخريطة'
                    }
                    disabled
                    className="w-full px-5 py-4 rounded-xl border border-transparent bg-[#F8FAFC] text-slate-500 font-bold shadow-inner cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">المدينة</label>
                  <input
                    type="text"
                    name="city"
                    value={addressValues.city}
                    disabled
                    placeholder="تلقائي من الخريطة"
                    className="w-full px-5 py-4 rounded-xl border border-transparent bg-[#F8FAFC] text-slate-500 font-bold shadow-inner cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">الشارع</label>
                  <input
                    type="text"
                    name="street"
                    value={addressValues.street}
                    disabled
                    placeholder="تلقائي من الخريطة"
                    className="w-full px-5 py-4 rounded-xl border border-transparent bg-[#F8FAFC] text-slate-500 font-bold shadow-inner cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">رقم المبنى</label>
                  <input
                    type="text"
                    name="buildingNumber"
                    value={addressValues.buildingNumber}
                    onChange={handleAddressChange}
                    placeholder="..."
                    className="w-full px-5 py-4 border border-slate-200 bg-slate-50/50 rounded-xl font-bold transition-all hover:border-[#0070CD]/40 focus:bg-white focus:outline-none focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 hidden">
                <input type="hidden" name="latitude" value={addressValues.latitude} />
                <input type="hidden" name="longitude" value={addressValues.longitude} />
              </div>
            </div>

            {/* Map block expands automatically inside flex container */}
            <div className="flex-1 min-h-[350px] border-t border-slate-100 p-3 pt-0 relative bg-white">
              <div className="absolute top-6 right-6 z-[400] bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-[#0070CD] animate-pulse"></span>
                <span className="font-black text-xs text-[#0F172A]">تحديد مباشر عبر الخريطة</span>
              </div>
              <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
                <MapPicker
                  latitude={parseFloat(addressValues.latitude) || 30.0444}
                  longitude={parseFloat(addressValues.longitude) || 31.2357}
                  onLocationChange={handleMapLocationChange}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Manual Errors */}
      {(error.personalInfo || error.address || error.profileImage) && (
        <div className="mt-8 flex items-center gap-4 bg-rose-50 border border-rose-200 px-8 py-6 rounded-[2rem]">
          <div className="w-14 h-14 bg-white rounded-[1rem] shadow-sm text-rose-500 flex items-center justify-center font-black text-2xl flex-shrink-0">!</div>
          <div>
            <h4 className="font-black text-rose-800 text-lg mb-1">تنبيه</h4>
            <p className="font-bold text-rose-600 leading-relaxed">
              {error.personalInfo || error.address || error.profileImage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;

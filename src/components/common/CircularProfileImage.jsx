// src/components/common/CircularProfileImage.jsx
import React, { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaUserMd, FaTimes } from 'react-icons/fa';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';

const CircularProfileImage = ({
  name,
  onImageChange,
  initialImage = null,
  initialFileName = null,
  disabled = false,
  size = 'large', // 'small', 'medium', 'large'
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(initialImage);
  const [fileName, setFileName] = useState(initialFileName);

  // Cropper State
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [loadingCrop, setLoadingCrop] = useState(false);

  React.useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
    }
  }, [initialImage]);

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-40 h-40',
  };

  const handleImageClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('الرجاء اختيار صورة فقط');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      setFileName(file.name);

      // Create preview for Cropper
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      setLoadingCrop(true);
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      // Create a File from Blob to match standard file input behavior
      const croppedFile = new File([croppedImageBlob], fileName || 'profile.jpg', { type: 'image/jpeg' });
      
      // Update local preview
      const previewUrl = URL.createObjectURL(croppedImageBlob);
      setPreview(previewUrl);
      setShowCropper(false);
      setLoadingCrop(false);

      // Call parent onChange with mocked event
      if (onImageChange) {
        const fakeEvent = {
          target: {
            name: name,
            files: [croppedFile],
            type: 'file'
          }
        };
        onImageChange(fakeEvent);
      }
    } catch (e) {
      console.error(e);
      alert('فشل في تعديل الصورة');
      setLoadingCrop(false);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Image Container */}
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-[#0070CD]/10 cursor-pointer transition-all duration-300 hover:ring-[#0070CD]/20 ${disabled ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        onClick={handleImageClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#0070CD] flex items-center justify-center">
            <FaUserMd className="w-1/2 h-1/2 text-white opacity-90" />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {/* File Name Display */}
      {fileName && !showCropper && (
        <p className="text-xs text-slate-600 mt-2 text-center max-w-[200px] truncate">
          {fileName}
        </p>
      )}

      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-base font-black text-slate-800">تعديل الصورة الشخصية</h3>
              <button 
                onClick={() => setShowCropper(false)} 
                className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
            
            <div className="relative w-full h-[350px] bg-slate-900/5">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-5 bg-slate-50 flex gap-3">
              <button 
                onClick={handleCropSave}
                disabled={loadingCrop}
                className="flex-1 py-3 bg-[#0070CD] text-white rounded-xl font-black hover:bg-[#005a99] transition-all shadow-lg shadow-[#0070CD]/20 flex justify-center items-center"
              >
                {loadingCrop ? 'جاري المعالجة...' : 'تأكيد وحفظ الصورة'}
              </button>
              <button 
                onClick={() => setShowCropper(false)}
                disabled={loadingCrop}
                className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-sm"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CircularProfileImage.propTypes = {
  name: PropTypes.string.isRequired,
  onImageChange: PropTypes.func.isRequired,
  initialImage: PropTypes.string,
  initialFileName: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default CircularProfileImage;

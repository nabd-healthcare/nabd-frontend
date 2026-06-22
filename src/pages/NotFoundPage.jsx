import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    // Get current path segments, removing empty strings
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // If we are deep in a route (e.g., /doctor/dashboard/invalid), go up one level
    if (pathSegments.length > 1) {
      pathSegments.pop();
      navigate('/' + pathSegments.join('/'), { replace: true });
    } 
    // Otherwise try normal browser back
    else if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } 
    // Fallback to home
    else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-[150px] sm:text-[180px] font-black text-gray-200 leading-none select-none drop-shadow-sm">404</div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
          الصفحة غير موجودة
        </h1>
        <p className="text-gray-500 mb-10 text-lg max-w-sm mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>

        {/* Actions */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleGoBack}
            className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-[#0070cd] to-[#1a8cff] hover:from-[#005099] hover:to-[#0070cd] text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center justify-center transform hover:-translate-y-1"
          >
            العودة للخلف
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

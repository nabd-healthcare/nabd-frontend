import React from 'react';
import { FaExclamationCircle, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ErrorAlert = ({ error, onClear }) => {
  const navigate = useNavigate();
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
          <FaExclamationCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-black text-rose-900 leading-none mb-1">تنبيه</h4>
          <p className="text-xs font-bold text-rose-700">{error}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => navigate('/doctor/dashboard')} 
          className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
        >
          <FaArrowRight className="w-3 h-3" />
          العودة للرئيسية
        </button>
        <button 
          onClick={onClear} 
          className="px-4 py-2 bg-white text-rose-600 hover:bg-rose-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-rose-100"
        >
          إخفاء
        </button>
      </div>
    </div>
  );
};

export default ErrorAlert;

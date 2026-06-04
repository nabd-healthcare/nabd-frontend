import React from 'react';
import PropTypes from 'prop-types';
import { FaMoneyBillWave, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

/**
 * ServiceCard - High-Density Clinical Tile
 * Optimized for rapid data entry and clear service visualization.
 */
const ServiceCard = ({
  title,
  description,
  icon: Icon,
  price,
  duration,
  onPriceChange,
  isEditing,
  loading,
  hideDuration,
}) => {
  return (
    <div className={`
      relative overflow-hidden bg-white border rounded-[2rem] p-6 transition-all duration-500
      ${isEditing ? 'border-[#0070CD] shadow-xl shadow-[#0070CD]/5' : 'border-slate-100 shadow-sm'}
    `}>
      {/* Visual Identity Strip */}
      <div className="absolute top-0 right-0 w-1.5 h-full bg-[#0070CD]/10"></div>
      
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 bg-[#0070CD]/5 rounded-2xl flex items-center justify-center text-[#0070CD] flex-shrink-0">
          <Icon className="text-xl" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">{title}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{description}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Price Input Block */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
            <FaMoneyBillWave className="text-[9px]" />
            <span>سعر الكشف</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="relative group">
            <input
              type="number"
              min="0"
              step="1"
              value={price || ''}
              onChange={(e) => onPriceChange(parseFloat(e.target.value) || null)}
              disabled={!isEditing || loading}
              placeholder="300"
              className={`
                w-full pl-6 pr-14 py-4 bg-slate-50 border rounded-2xl text-sm font-black text-slate-900 transition-all
                ${isEditing 
                  ? 'border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#0070CD]/10 focus:border-[#0070CD]' 
                  : 'border-transparent bg-slate-50/50 cursor-default'
                }
                ${!price && isEditing ? 'border-rose-200 ring-rose-50' : ''}
              `}
              dir="ltr"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <span className="text-[10px] font-black text-slate-400">ج.م</span>
            </div>
            
            {!price && isEditing && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <FaExclamationCircle className="text-rose-500 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Shared Duration Logic Display */}
        {hideDuration && (
          <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0070CD]">
                <FaClock className="text-xs" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest block">مدة الجلسة</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase leading-none">موحدة للتخصص</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#0070CD]">{duration || '--'}</span>
              <span className="text-[9px] font-black text-slate-400 uppercase">دقيقة</span>
            </div>
          </div>
        )}
      </div>

      {/* Saving State Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-[#0070CD] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[8px] font-black text-[#0070CD] uppercase tracking-widest">جاري المزامنة</span>
          </div>
        </div>
      )}
    </div>
  );
};

ServiceCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  price: PropTypes.number,
  duration: PropTypes.number,
  onPriceChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  loading: PropTypes.bool,
  hideDuration: PropTypes.bool,
};

export default ServiceCard;

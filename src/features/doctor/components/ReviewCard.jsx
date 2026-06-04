import React from 'react';
import {
  FaStar, FaStarHalfAlt, FaRegStar, FaQuoteRight,
  FaEdit, FaEye, FaInfoCircle, FaCalendarDay
} from 'react-icons/fa';

/**
 * ReviewCard Component - Clinical Command Center Edition
 * High-density, premium card for medical peer/patient feedback
 */
const ReviewCard = ({ review, onViewDetails }) => {

  // Get patient initials
  const getInitials = () => {
    if (!review.patientName) return '؟';
    const names = review.patientName.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return names[0].charAt(0);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-amber-400 text-[10px]" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-amber-400 text-[10px]" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-slate-200 text-[10px]" />);
    }
    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const patientName = review.patientName || (review.patient?.fullName) || 'مريض';
  const rating = review.averageRating || review.rating || 0;

  return (
    <article className="group relative bg-white rounded-3xl border border-slate-100 hover:border-[#0070CD]/30 hover:shadow-[0_20px_50px_rgba(0,112,205,0.1)] transition-all duration-500 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header - Patient Branding */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white ${
              review.patientProfileImage ? '' : 'bg-slate-900 group-hover:bg-[#0070CD] transition-colors duration-500'
            }`}>
              {review.patientProfileImage ? (
                <img src={review.patientProfileImage} alt={patientName} className="w-full h-full rounded-2xl object-cover" />
              ) : getInitials()}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-[#0070CD] transition-colors">
                {patientName}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <FaCalendarDay className="text-[9px]" />
                {formatDate(review.createdAt)}
              </div>
            </div>
          </div>

          <div className="bg-[#0070CD]/5 px-3 py-1.5 rounded-xl border border-[#0070CD]/10 flex flex-col items-center">
            <span className="text-lg font-black text-[#0070CD] leading-none">{rating.toFixed(1)}</span>
            <div className="flex gap-0.5 mt-1">
              {renderStars(rating)}
            </div>
          </div>
        </div>

        {/* Clinical Comment */}
        <div className="relative mb-6 flex-1">
          <FaQuoteRight className="absolute -top-1 -right-1 text-slate-50 text-4xl -z-0" />
          <p className="relative text-sm text-slate-600 font-medium leading-relaxed line-clamp-4 italic">
            "{review.comment || 'لا يوجد تعليق نصي متاح لهذا التقييم.'}"
          </p>
        </div>

        {/* Minimal Action */}
        <button
          onClick={onViewDetails}
          className="w-full py-4 rounded-2xl bg-slate-50 border border-slate-100 text-[#0070CD] text-xs font-black uppercase tracking-widest hover:bg-[#0070CD] hover:text-white hover:border-[#0070CD] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <FaInfoCircle className="group-hover/btn:rotate-12 transition-transform" />
          عرض التفاصيل الكاملة
        </button>
      </div>
    </article>
  );
};

export default ReviewCard;

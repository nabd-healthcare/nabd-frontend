/**
 * DoctorReviewsModal Component
 * Shows all patient reviews for a specific doctor
 */

import { useEffect, useState } from 'react';
import { FaTimes, FaStar, FaUserCircle, FaCheckCircle, FaCalendar, FaComments } from 'react-icons/fa';
import patientService from '@/api/services/patient.service';

const DoctorReviewsModal = ({ doctorId, doctorName, isOpen, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1

  useEffect(() => {
    if (isOpen && doctorId) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, doctorId, filter]);

  // Close on Escape key and Cleanup
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      setReviews([]);
      setFilter('all');
      setStats(null);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        pageNumber: 1,
        pageSize: 50,
        sortBy: 'date',
        sortOrder: 'desc',
      };

      if (filter !== 'all') {
        params.minRating = parseInt(filter);
      }

      const data = await patientService.getDoctorReviews(doctorId, params);

      if (data) {
        setReviews(data.items || []);
        setStats({
          totalCount: data.totalCount || 0,
          averageRating: data.averageRating || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Star rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      const rating = Math.round(review.overallSatisfaction || 0);
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const totalReviews = reviews.length;

  // Render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < rating ? 'text-amber-400' : 'text-slate-300'}
      />
    ));
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0070CD] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all hover:scale-110"
          >
            <FaTimes className="text-lg" />
          </button>

          <h2 className="text-2xl font-black mb-2">آراء المرضى</h2>
          <p className="text-white/90 text-lg">د. {doctorName}</p>

          {stats && (
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <FaStar className="text-amber-300" />
                <span className="font-bold text-xl">{stats.averageRating?.toFixed(1) || '0.0'}</span>
              </div>
              <span className="text-white/90">({stats.totalCount} تقييم)</span>
            </div>
          )}
        </div>

        {/* Filter & Stats */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'all'
                ? 'bg-[#0070CD] text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              الكل ({totalReviews})
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilter(String(rating))}
                className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${filter === String(rating)
                  ? 'bg-[#0070CD] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                <FaStar className="text-amber-400 text-sm" />
                <span>{rating}</span>
                <span className="text-xs opacity-75">({distribution[rating]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-slate-200 border-t-[#0070CD] rounded-full animate-spin"></div>
              <p className="mt-3 text-slate-600 font-semibold">جاري تحميل التقييمات...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <FaStar className="mx-auto text-5xl text-slate-300 mb-3" />
              <p className="text-slate-600 text-lg">
                {filter === 'all' ? 'لا توجد تقييمات حتى الآن' : `لا توجد تقييمات بـ ${filter} نجوم`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl p-5 border border-slate-200 hover:border-[#0070CD]/30 shadow-sm transition-all"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0070CD]/5 flex items-center justify-center">
                        {review.isAnonymous ? (
                          <FaUserCircle className="text-2xl text-[#0070CD]" />
                        ) : (
                          <span className="text-lg font-black text-[#0070CD]">
                            {review.patientName?.charAt(0) || 'م'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {review.isAnonymous ? 'مريض مجهول' : review.patientName}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FaCalendar className="text-xs" />
                          <span>{formatDate(review.createdAt)}</span>
                          {review.isVerified && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1 text-[#0070CD] bg-[#0070CD]/5 px-2 py-0.5 rounded-md">
                                <FaCheckCircle className="text-xs" />
                                <span className="font-semibold text-xs">تقييم موثق</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(review.overallSatisfaction || 0))}
                    </div>
                  </div>

                  {/* Review Comment */}
                  {review.patientComment && (
                    <p className="text-slate-700 leading-relaxed mb-3 text-right">
                      {review.patientComment}
                    </p>
                  )}

                  {/* Rating Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {review.waitingTimeRating > 0 && (
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-center">
                        <p className="text-slate-500 font-semibold text-xs mb-1">وقت الانتظار</p>
                        <div className="flex items-center justify-center gap-1">
                          {renderStars(review.waitingTimeRating)}
                        </div>
                      </div>
                    )}
                    {review.staffBehaviorRating > 0 && (
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-center">
                        <p className="text-slate-500 font-semibold text-xs mb-1">تعامل الموظفين</p>
                        <div className="flex items-center justify-center gap-1">
                          {renderStars(review.staffBehaviorRating)}
                        </div>
                      </div>
                    )}
                    {review.clinicEnvironmentRating > 0 && (
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-center">
                        <p className="text-slate-500 font-semibold text-xs mb-1">نظافة العيادة</p>
                        <div className="flex items-center justify-center gap-1">
                          {renderStars(review.clinicEnvironmentRating)}
                        </div>
                      </div>
                    )}
                    {review.valueForMoneyRating > 0 && (
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-center">
                        <p className="text-slate-500 font-semibold text-xs mb-1">القيمة مقابل السعر</p>
                        <div className="flex items-center justify-center gap-1">
                          {renderStars(review.valueForMoneyRating)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Doctor Reply */}
                  {review.doctorReply && (
                    <div className="mt-4 bg-[#0070CD]/5 rounded-xl p-4 border-r-4 border-[#0070CD]">
                      <p className="text-sm font-black text-[#0070CD] mb-2 flex items-center gap-1.5"><FaComments className="text-sm" /> رد الطبيب:</p>
                      <p className="text-slate-700 text-sm font-medium leading-relaxed">
                        {review.doctorReply}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorReviewsModal;

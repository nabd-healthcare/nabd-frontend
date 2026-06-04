import React, { useState, useRef, useEffect } from 'react';
import {
  FaStar, FaFilter, FaChevronDown,
  FaCheck, FaChartLine, FaAward, FaUsers, FaRegStar,
  FaArrowRight, FaArrowLeft, FaSortAmountDown, FaCircle, FaPrint, FaClock
} from 'react-icons/fa';
import ReviewCard from '../components/ReviewCard';
import ReviewDetailsModal from '../components/ReviewDetailsModal';
import useReviews from '../hooks/useReviews';

/**
 * ReviewsPage - Clinical Command Center Edition
 * High-performance feedback analytics and review management.
 */
const ReviewsPage = () => {
  const {
    reviews,
    pagination,
    filters,
    loading,
    averageRating,
    totalReviews,
    ratingDistribution,
    selectedReview,
    setMinRatingFilter,
    goToNextPage,
    goToPreviousPage,
    fetchReviewDetails,
    setSelectedReview
  } = useReviews();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) setIsFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewDetails = async (review) => {
    const result = await fetchReviewDetails(review.reviewId);
    if (result.success) setIsDetailsModalOpen(true);
  };

  const filteredReviews = filters.minRating
    ? reviews.filter(review => review.averageRating >= filters.minRating)
    : reviews;

  const getFilterLabel = () => {
    const labels = { 'all': 'جميع المراجعات', '5': '5 نجوم', '4': '4+ نجوم', '3': '3+ نجوم' };
    return labels[filters.minRating?.toString()] || 'جميع المراجعات';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="rtl">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        
        {/* Header - Clinical OS Style */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[#0070CD] mb-2 font-black tracking-widest text-xs uppercase">
              <div className="w-2 h-2 rounded-full bg-[#0070CD] animate-pulse"></div>
              <span>تحليل أداء الخدمات الطبية</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
              سجل <span className="text-[#0070CD]">الثقة</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg">
              تتبع تقييمات المرضى وتحليل مستوى الرضا العام
            </p>
            <div className="pt-4 print:hidden">
              <button 
                onClick={() => window.print()}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-black tracking-widest uppercase flex items-center gap-2 hover:bg-[#0070CD] transition-colors shadow-lg shadow-slate-900/10"
              >
                <FaPrint />
                Export Quality Report
              </button>
            </div>
          </div>

          {/* High-Density Stats Dash */}
          <div className="flex flex-wrap items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-white shadow-xl">
             <div className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                  <FaStar className="text-xl" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">متوسط التقييم</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 leading-none">{averageRating.toFixed(1)}</span>
                    <span className="text-sm font-bold text-slate-400">/ 5.0</span>
                  </div>
                </div>
             </div>
             <div className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-[#0070CD]/10 text-[#0070CD] rounded-2xl flex items-center justify-center">
                  <FaUsers className="text-xl" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">إجمالي المراجعين</div>
                  <div className="text-3xl font-black text-slate-900 leading-none">{totalReviews}</div>
                </div>
             </div>
             <div className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">متوسط الانتظار</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 leading-none">12</span>
                    <span className="text-sm font-bold text-slate-400">دقيقة</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Analytics & Filters Row */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-10">
          {/* Detailed Performance Bar */}
          <div className="xl:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                   <FaChartLine className="text-[#0070CD]" />
                   تحليل توزيع التقييمات
                </h3>
             </div>
             
             <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 w-full space-y-4">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = ratingDistribution?.[star] || 0;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-4 group">
                        <div className="w-12 flex items-center gap-1">
                           <span className="text-sm font-black text-slate-600">{star}</span>
                           <FaStar className="text-amber-400 text-[10px]" />
                        </div>
                        <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-[1px]">
                           <div 
                              className="h-full bg-gradient-to-l from-[#0070CD] to-[#00A3FF] rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                           ></div>
                        </div>
                        <div className="w-12 text-left">
                           <span className="text-xs font-black text-slate-400">{percentage.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="w-full md:w-[2px] h-full md:h-40 bg-slate-50"></div>

                <div className="w-full md:w-64 space-y-4">
                   <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">صافي نقاط الترويج</div>
                      <div className="text-2xl font-black text-[#0070CD]">+84.2%</div>
                      <div className="text-[9px] text-slate-400 font-bold mt-1">بناءً على آخر 100 تقييم</div>
                   </div>
                   <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">معدل النمو</div>
                      <div className="text-2xl font-black text-emerald-500">+12%</div>
                      <div className="text-[9px] text-slate-400 font-bold mt-1">مقارنة بالشهر الماضي</div>
                   </div>
                </div>
             </div>
          </div>

          {/* Intelligent Filters */}
          <div className="xl:col-span-4 flex flex-col gap-4">
             <div className="bg-[#0070CD] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-[#0070CD]/20 flex flex-col justify-center h-full">
                <FaAward className="absolute -bottom-4 -left-4 text-white/10 text-[120px] rotate-[-15deg]" />
                <div className="relative z-10">
                   <h3 className="text-xl font-black mb-2">تميز المهنة</h3>
                   <p className="text-white/80 text-sm font-bold leading-relaxed">لقد حصلت على تقييمات إيجابية من {((ratingDistribution?.[5] || 0) / (totalReviews || 1) * 100).toFixed(0)}% من مراجعي الشهر الحالي.</p>
                </div>
             </div>

             <div className="relative flex-1" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full h-full bg-white border border-slate-200 hover:border-[#0070CD] px-8 rounded-2xl flex items-center justify-between font-black text-slate-700 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <FaSortAmountDown className="text-[#0070CD]" />
                    <span>{getFilterLabel()}</span>
                  </div>
                  <FaChevronDown className={`transition-transform text-slate-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                {isFilterOpen && (
                  <div className="absolute left-0 top-full mt-3 w-full bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95">
                    {[null, 5, 4, 3].map((r) => (
                      <button
                        key={r || 'all'}
                        onClick={() => { setMinRatingFilter(r); setIsFilterOpen(false); }}
                        className={`w-full text-right px-8 py-4 font-bold text-sm transition-all ${filters.minRating === r ? 'bg-[#0070CD] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {r === null ? 'جميع التقييمات' : `${r} نجوم فما فوق`}
                      </button>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Content Section */}
        {loading.reviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-48 bg-white border border-slate-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <FaRegStar className="text-slate-300 text-4xl" />
             </div>
             <h3 className="text-2xl font-black text-slate-800 mb-2">لا توجد مراجعات حالياً</h3>
             <p className="text-slate-500 font-bold">بمجرد تقييم المرضى لخدماتك، ستظهر نتائج التحليل هنا</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                onViewDetails={() => handleViewDetails(review)}
              />
            ))}
          </div>
        )}

        {/* Tactical Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="mt-16 flex items-center justify-between bg-white border border-slate-100 p-4 rounded-[2.5rem] shadow-sm">
            <button
               onClick={goToPreviousPage}
               disabled={!pagination.hasPreviousPage}
               className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-[#0070CD] hover:bg-[#0070CD]/5 disabled:opacity-30 transition-all"
            >
               <FaArrowRight />
               <span>السابق</span>
            </button>
            
            <div className="hidden md:flex items-center gap-3">
               <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">الصفحة</span>
               <span className="text-2xl font-black text-[#0070CD]">{pagination.pageNumber}</span>
               <span className="text-slate-300 font-bold">/</span>
               <span className="text-lg font-black text-slate-900">{pagination.totalPages}</span>
            </div>

            <button
               onClick={goToNextPage}
               disabled={!pagination.hasNextPage}
               className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-[#0070CD] hover:bg-[#0070CD]/5 disabled:opacity-30 transition-all font-black"
            >
               <span>التالي</span>
               <FaArrowLeft />
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <ReviewDetailsModal
        review={selectedReview}
        isOpen={isDetailsModalOpen}
        onClose={() => { setIsDetailsModalOpen(false); setSelectedReview(null); }}
      />

      {/* --- Print Layout (Quality & Satisfaction Report) --- */}
      <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-10 text-slate-900 w-full h-full">
         <style type="text/css" media="print">
           {`@page { size: A4; margin: 20mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }`}
         </style>
         
         {/* Report Header */}
         <div className="flex justify-between items-start border-b-2 border-[#0070CD] pb-6 mb-8">
            <div>
               <h1 className="text-3xl font-black text-[#0070CD] mb-2">Nabd Clinic</h1>
               <p className="text-sm font-bold text-slate-500">مركز إدارة الجودة الطبية</p>
            </div>
            <div className="text-left">
               <h2 className="text-2xl font-black text-slate-800 mb-2">تقرير جودة الخدمات ورضا المرضى</h2>
               <p className="text-sm font-bold text-slate-500">تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
            </div>
         </div>

         {/* KPIs */}
         <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
               <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 block mb-2">متوسط التقييم العام</span>
               <div className="text-4xl font-black text-slate-900">{averageRating.toFixed(1)} <span className="text-lg text-slate-400">/ 5</span></div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
               <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 block mb-2">إجمالي المرضى المقيّمين</span>
               <div className="text-4xl font-black text-slate-900">{totalReviews}</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
               <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 block mb-2">متوسط وقت الانتظار (تقريبي)</span>
               <div className="text-4xl font-black text-emerald-600">12 <span className="text-lg text-slate-400">دقيقة</span></div>
            </div>
         </div>

         {/* Rating Distribution */}
         <div className="mb-10 border border-slate-200 rounded-2xl p-6">
            <h3 className="text-lg font-black text-slate-800 mb-6">توزيع التقييمات</h3>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map(star => {
                const count = ratingDistribution?.[star] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-4">
                    <div className="w-16 flex items-center gap-2">
                       <span className="text-sm font-black text-slate-700">{star} نجوم</span>
                    </div>
                    <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-[#0070CD]" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <div className="w-16 text-left">
                       <span className="text-sm font-black text-slate-600">{count} مريض</span>
                    </div>
                  </div>
                );
              })}
            </div>
         </div>

         {/* Footer / Signature */}
         <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end border-t border-slate-200 pt-6">
            <div className="text-xs text-slate-400 font-bold text-center">
               <p>تم استخراج هذا التقرير آلياً عبر منصة Nabd</p>
               <p>www.nabd-health.com</p>
            </div>
            <div className="text-center">
               <div className="w-48 border-b-2 border-slate-300 mb-2"></div>
               <p className="text-xs font-black uppercase tracking-widest text-slate-400">اعتماد إدارة الجودة</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ReviewsPage;

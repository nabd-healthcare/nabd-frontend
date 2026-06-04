import React, { useState, useEffect } from 'react';
import {
  FaSearch, FaTimes, FaChevronLeft, FaChevronRight, FaHeart, FaBaby, FaBone, FaUserMd, FaStar, FaMapMarkerAlt
} from 'react-icons/fa';
import FilterChips from '../components/FilterChips';
import DashboardFooter from '@/features/doctor/components/DashboardFooter';
import DoctorCard from '../components/DoctorCard';
import DoctorDetailsModal from '../components/DoctorDetailsModal';
import BookingModal from '../components/booking/BookingModal';
import { useDoctors } from '../hooks/useDoctors';

/**
 * SearchDoctorsPage Component - Main Patient Dashboard & Landing Page
 * Highly polished premium landing experience focusing on Doctor discovery.
 */
const SearchDoctorsPage = () => {
  // UI-only state (not filters)
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Use doctors hook - all filters from store
  const {
    filteredDoctors,
    loading,
    error,
    pageNumber,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    // Filters from store
    searchTerm,
    selectedSpecialties,
    selectedCities,
    priceRange,
    minRating,
    availableToday,
    // Actions
    goToNextPage,
    goToPreviousPage,
    setSearchTerm,
    setSelectedSpecialties,
    setSelectedCities,
    setPriceRange,
    setMinRating,
    setAvailableToday,
    resetFilters,
    setPageSize,
    fillIncompleteRow,
  } = useDoctors();

  const handleViewProfile = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctorId(null);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctorForBooking(doctor);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedDoctorForBooking(null);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNextPage = () => {
    goToNextPage();
    scrollToTop();
  };

  const handlePreviousPage = () => {
    goToPreviousPage();
    scrollToTop();
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  // -------------------------------------------------------------
  // GRID-AWARE PAGINATION LOGIC
  // -------------------------------------------------------------
  const [gridCols, setGridCols] = useState(3); // Default desktop

  useEffect(() => {
    const handleResize = () => {
      let cols = 1;
      if (window.innerWidth >= 1024) cols = 3; // lg
      else if (window.innerWidth >= 768) cols = 2; // md
      setGridCols(cols);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Advanced Option: Fill incomplete rows on current page
  useEffect(() => {
    if (!loading && !error && filteredDoctors.length > 0 && hasNextPage) {
      const remainder = filteredDoctors.length % gridCols;
      if (remainder !== 0) {
        const missingCount = gridCols - remainder;
        console.log(`Grid alignment: Missing ${missingCount} items for a full row of ${gridCols}. Padding...`);
        fillIncompleteRow(missingCount);
      }
    }
  }, [loading, error, filteredDoctors.length, gridCols, hasNextPage, fillIncompleteRow]);
  // -------------------------------------------------------------

  // Quick action specialties mapping
  const popularSpecialties = [
    { id: 1, name: 'الباطنة العامة', icon: FaUserMd, color: 'text-[#0070CD]', bg: 'bg-[#0070CD]/10' },
    { id: 2, name: 'طب الأطفال', icon: FaBaby, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 4, name: 'القلب والأوعية', icon: FaHeart, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 5, name: 'العظام', icon: FaBone, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const handleQuickSpecialty = (id) => {
    setSelectedSpecialties([id]);
    scrollToTop();
  };

  // Determine if user is currently applying any filters/search to conditionally render "Value sections" vs "Search Results"
  const isFiltering = searchTerm || selectedSpecialties.length > 0 || selectedCities.length > 0 || minRating > 0 || availableToday;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative" dir="rtl">

      {/* Absolute Ambient Background Layer */}
      <div className="absolute top-0 w-full h-[600px] bg-gradient-to-b from-white to-[#F8FAFC] -z-10 pointer-events-none"></div>

      <div className="flex-1">

        {/* ================= HERO SECTION ================= */}
        <div className="w-full bg-white relative overflow-hidden border-b border-slate-100">
          {/* Decorative Backgrounds */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#0070CD]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-[#0F172A] tracking-tight leading-[1.1] mb-6">
                احجز <span className="text-[#0070CD] relative inline-block">
                  أفضل دكتور
                  <svg className="absolute -bottom-2 right-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,5 Q50,10 100,5" stroke="#0070CD" strokeWidth="4" fill="transparent" opacity="0.3" />
                  </svg>
                </span> بسهولة
              </h1>
              <p className="text-[#64748B] font-bold text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                استكشف نخبة من الأطباء المتخصصين، قارن التقييمات، واحجز موعدك في ثوانٍ معدودة لتجربة رعاية صحية استثنائية.
              </p>
            </div>

            {/* Main Hero Search Bar */}
            <div className="max-w-4xl mx-auto relative group/search z-20">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0070CD]/20 to-[#0070CD]/5 rounded-[2.5rem] blur-lg opacity-50 group-focus-within/search:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 group-focus-within/search:border-[#0070CD]/30 transition-all duration-300 flex items-center p-3 h-24 overflow-hidden">

                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 text-[#94A3B8] group-focus-within/search:text-[#0070CD] transition-colors duration-300 bg-slate-50 group-focus-within/search:bg-[#0070CD]/5 rounded-2xl mr-2">
                  <FaSearch className="text-2xl" />
                </div>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث باسم الطبيب..."
                  className="w-full h-full bg-transparent border-none focus:ring-0 px-6 text-2xl font-black text-[#0F172A] placeholder:text-[#94A3B8] placeholder:font-bold outline-none"
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="w-14 h-14 flex items-center justify-center text-[#94A3B8] hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors ml-2 flex-shrink-0"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                )}

                <button className="md:w-40 px-6 h-full bg-[#0070CD] hover:bg-[#005ba3] text-white rounded-[1.5rem] font-black text-xl transition-all duration-300 shadow-md flex-shrink-0 ml-1 active:scale-95 hidden md:block">
                  بحث الآن
                </button>
              </div>
            </div>

            {/* QUICK SHORTCUTS */}
            {!isFiltering && (
              <div className="max-w-4xl mx-auto mt-12 animate-fadeIn">
                <p className="text-center text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">تخصصات شائعة البحث</p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {popularSpecialties.map(spec => (
                    <button
                      key={spec.id}
                      onClick={() => handleQuickSpecialty(spec.id)}
                      className={`flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 hover:border-[#0070CD]/40 hover:shadow-lg rounded-[1.5rem] transition-all duration-300 group hover:-translate-y-1`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${spec.bg} ${spec.color} transition-transform group-hover:scale-110`}>
                        <spec.icon className="text-lg" />
                      </div>
                      <span className="font-black text-[#0F172A]">{spec.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 relative z-20">

          <div className="flex flex-col gap-10 w-full relative">

            {/* FLOATING FILTERS */}
            <div className={`w-full bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-sm z-40 relative transition-all duration-500 ${isFiltering ? '-mt-24 shadow-[0_12px_40px_rgb(0,0,0,0.06)]' : ''}`}>
              <FilterChips
                selectedSpecialties={selectedSpecialties}
                setSelectedSpecialties={setSelectedSpecialties}
                selectedCities={selectedCities}
                setSelectedCities={setSelectedCities}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                availableToday={availableToday}
                setAvailableToday={setAvailableToday}
                onReset={handleResetFilters}
                resultsCount={filteredDoctors.length}
              />
            </div>

            {/* DOCTORS GRID WRAPPER */}
            <div className="w-full space-y-8 mt-4">

              {/* Dynamic Header */}
              {!loading && !error && (
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-5">
                  <h2 className="text-3xl font-black text-[#0F172A] flex items-center gap-3">
                    {isFiltering ? (
                      <>نتائج البحث المطابقة</>
                    ) : (
                      <><FaStar className="text-amber-400" /> أطباء نوصي بهم</>
                    )}

                    <span className="text-sm text-[#0070CD] bg-[#0070CD]/10 px-3 py-1 rounded-xl shadow-sm border border-[#0070CD]/10 font-bold ml-2">
                      {filteredDoctors.length} {filteredDoctors.length === 1 ? 'طبيب' : 'أطباء'}
                    </span>
                  </h2>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-8 animate-pulse shadow-sm h-[400px]"></div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-white rounded-[3rem] p-16 text-center border border-red-100 shadow-sm flex flex-col items-center justify-center max-w-3xl mx-auto mt-10">
                  <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner transform rotate-3">
                    <FaTimes className="text-5xl text-red-500" />
                  </div>
                  <h3 className="text-3xl font-black text-[#0F172A] mb-3">عذراً، حدث خطأ</h3>
                  <p className="text-red-500 font-bold mb-8 text-lg">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-10 py-4 bg-[#0070CD] text-white rounded-2xl font-black hover:bg-[#005ba3] transition-all shadow-[0_8px_20px_rgba(0,112,205,0.3)] active:scale-95"
                  >
                    تحديث الصفحة
                  </button>
                </div>
              )}

              {/* DOCTOR CARDS GRID */}
              {!loading && !error && filteredDoctors.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredDoctors.map(doctor => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      onViewProfile={handleViewProfile}
                      onBook={handleBookAppointment}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredDoctors.length === 0 && (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center max-w-4xl mx-auto my-10">
                  <div className="w-32 h-32 bg-[#0070CD]/5 rounded-full flex items-center justify-center mx-auto mb-8 border-[6px] border-white shadow-[0_0_0_1px_rgba(0,112,205,0.1)] relative">
                    <FaSearch className="text-[#0070CD]/40 text-5xl absolute" />
                  </div>
                  <h3 className="text-4xl font-black text-[#0F172A] mb-4 tracking-tight">لا توجد نتائج مطابقة</h3>
                  <p className="text-[#64748B] font-bold text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                    نعتذر، لم نتمكن من العثور على أطباء يطابقون معايير البحث الحالية. جرب تغيير فلاتر البحث أو التخصص للوصول إلى أفضل النتائج.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-10 py-4 bg-[#0070CD] text-white font-black rounded-2xl hover:bg-[#005ba3] shadow-[0_8px_20px_rgba(0,112,205,0.25)] transition-all active:scale-95 text-lg"
                  >
                    مسح الفلاتر والعودة
                  </button>
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && totalPages > 1 && (
                <div className="mt-16 flex items-center justify-between bg-white border border-slate-200 p-4 md:px-6 rounded-[2rem] shadow-sm max-w-4xl mx-auto">
                  <button
                    onClick={handlePreviousPage}
                    disabled={!hasPreviousPage}
                    className="flex items-center gap-3 px-6 py-3.5 rounded-xl font-black text-sm text-[#0070CD] border border-transparent hover:border-[#0070CD]/20 hover:bg-[#0070CD]/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all"
                  >
                    <FaChevronRight className="text-xs" />
                    <span className="hidden sm:inline">السابق</span>
                  </button>

                  <div className="flex items-center gap-4 px-8 py-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[#64748B] font-bold text-xs uppercase tracking-widest">صفحة</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-[#0070CD]">{pageNumber}</span>
                      <span className="text-sm font-bold text-slate-300">/</span>
                      <span className="text-xl font-black text-[#0F172A]">{totalPages}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className="flex items-center gap-3 px-6 py-3.5 rounded-xl font-black text-sm text-[#0070CD] border border-transparent hover:border-[#0070CD]/20 hover:bg-[#0070CD]/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all"
                  >
                    <span className="hidden sm:inline">التالي</span>
                    <FaChevronLeft className="text-xs" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <DashboardFooter />

      <DoctorDetailsModal
        doctorId={selectedDoctorId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBook={handleBookAppointment}
      />

      {selectedDoctorForBooking && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          doctor={selectedDoctorForBooking}
        />
      )}
    </div>
  );
};

export default SearchDoctorsPage;

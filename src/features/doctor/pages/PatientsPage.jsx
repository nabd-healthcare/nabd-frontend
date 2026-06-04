import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FaUsers, FaSearch, FaTimes, FaFilter, FaSort, 
  FaChevronDown, FaCheck, FaUserPlus, FaAddressCard, 
  FaChartBar, FaEllipsisH
} from 'react-icons/fa';
import { usePatients } from '../hooks/usePatients';
import PatientCard from '../components/PatientCard';
import PrescriptionsListModal from '../components/PrescriptionsListModal';
import MedicalRecordModal from '../components/MedicalRecordModal';

/**
 * PatientsPage Component - Clinical Command Center Edition
 * High-performance, high-density patient management board.
 */
const PatientsPage = () => {
  const {
    filteredPatients,
    loading,
    error,
    searchTerm,
    filterStatus,
    sortBy,
    setSearchTerm,
    setFilterStatus,
    setSortBy,
    clearError,
    fetchPatients,
    totalPatients,
  } = usePatients();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isMedicalRecordModalOpen, setIsMedicalRecordModalOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) setIsFilterOpen(false);
      if (sortRef.current && !sortRef.current.contains(event.target)) setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMedicalRecordClick = useCallback((patient) => {
    setSelectedPatient(patient);
    setIsMedicalRecordModalOpen(true);
  }, []);

  const handlePrescriptionClick = useCallback((patient) => {
    setSelectedPatient(patient);
    setIsPrescriptionModalOpen(true);
  }, []);

  const getFilterLabel = () => {
    const labels = { 'all': 'جميع السجلات', 'recent': 'آخر 30 يوم', 'archived': 'أرشيف' };
    return labels[filterStatus] || 'جميع السجلات';
  };

  const getSortLabel = () => {
    const labels = { 'lastVisit': 'الأحدث زيارة', 'name': 'ترتيب هجائي', 'sessions': 'الأكثر جلسات' };
    return labels[sortBy] || 'الأحدث زيارة';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="rtl">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        
        {/* Header - Clinical Command style */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[#0070CD] mb-2 font-black tracking-widest text-xs uppercase">
              <div className="w-2 h-2 rounded-full bg-[#0070CD]"></div>
              <span>نظام إدارة بيانات المرضى</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
              مجتمع <span className="text-[#0070CD]">المرضى</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg">
              عرض وإدارة السجلات الطبية والروشتات لجميع الحالات
            </p>
          </div>

          {/* High-Density Insights */}
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-white shadow-xl">
             <div className="flex items-center gap-4 px-10 py-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-[#0070CD]/10 text-[#0070CD] rounded-2xl flex items-center justify-center">
                  <FaUsers className="text-xl" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">إجمالي المرضى المسجلين</div>
                  <div className="text-3xl font-black text-slate-900 leading-none">{totalPatients}</div>
                </div>
             </div>
          </div>
        </div>

        {/* Search & Intelligence Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
          <div className="lg:col-span-7 relative group">
            <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0070CD] transition-colors" />
            <input
              type="text"
              placeholder="البحث الذكي عن مريض (بالاسم، الهاتف، أو الكود)..."
              className="w-full bg-white border border-slate-200 focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/10 rounded-2xl pr-14 pl-6 py-5 text-lg font-bold text-slate-800 transition-all outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="lg:col-span-5 flex gap-3">
            <div className="relative flex-1" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full h-full bg-white border border-slate-200 hover:border-[#0070CD] px-6 rounded-2xl flex items-center justify-between font-black text-slate-700 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <FaFilter className="text-[#0070CD]" />
                  <span>{getFilterLabel()}</span>
                </div>
                <FaChevronDown className={`transition-transform text-slate-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFilterOpen && (
                <div className="absolute left-0 top-full mt-3 w-full bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95">
                  {['all', 'recent', 'archived'].map((f) => (
                    <button
                      key={f}
                      onClick={() => { setFilterStatus(f); setIsFilterOpen(false); }}
                      className={`w-full text-right px-6 py-4 font-bold text-sm transition-all ${filterStatus === f ? 'bg-[#0070CD] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {f === 'all' ? 'جميع المرضى' : f === 'recent' ? 'آخر 30 يوم' : 'الأرشيف'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full h-full bg-white border border-slate-200 hover:border-[#0070CD] px-6 rounded-2xl flex items-center justify-between font-black text-slate-700 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <FaSort className="text-[#0070CD]" />
                  <span>{getSortLabel()}</span>
                </div>
                <FaChevronDown className={`transition-transform text-slate-300 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSortOpen && (
                <div className="absolute left-0 top-full mt-3 w-full bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95">
                  {['lastVisit', 'name', 'sessions'].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSortBy(s); setIsSortOpen(false); }}
                      className={`w-full text-right px-6 py-4 font-bold text-sm transition-all ${sortBy === s ? 'bg-[#0070CD] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {s === 'lastVisit' ? 'الأحدث تاريخاً' : s === 'name' ? 'حسب الاسم' : 'حسب عدد الجلسات'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Board Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-[280px] bg-white border border-slate-100 rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <FaUsers className="text-slate-300 text-4xl" />
             </div>
             <h3 className="text-2xl font-black text-slate-800 mb-2">لا يوجد قائمة مرضى حالياً</h3>
             <p className="text-slate-500 font-bold mb-8">ابدأ باستقبال المرضى لإنشاء سجلاتهم الطبية هنا</p>
             <button onClick={() => setSearchTerm('')} className="bg-[#0070CD]/5 text-[#0070CD] px-10 py-4 rounded-2xl font-black">إعادة تحميل القائمة</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onMedicalRecordClick={handleMedicalRecordClick}
                onPrescriptionClick={handlePrescriptionClick}
              />
            ))}
          </div>
        )}

        {/* Pagination/Scroll Insights */}
        {filteredPatients.length > 0 && (
          <div className="mt-16 flex items-center justify-center">
            <div className="inline-flex items-center gap-6 bg-white px-10 py-5 rounded-[2.5rem] shadow-xl border border-slate-100">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-[#0070CD]"></div>
                 <span className="text-slate-500 font-bold">يتم عرض</span>
                 <span className="text-2xl font-black text-slate-900">{filteredPatients.length}</span>
                 <span className="text-slate-500 font-bold">من أصل</span>
                 <span className="text-2xl font-black text-[#0070CD]">{totalPatients}</span>
                 <span className="text-slate-500 font-bold text-sm">مريض مسجل</span>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <PrescriptionsListModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => { setIsPrescriptionModalOpen(false); setSelectedPatient(null); }}
        patient={selectedPatient}
      />
      <MedicalRecordModal
        isOpen={isMedicalRecordModalOpen}
        onClose={() => { setIsMedicalRecordModalOpen(false); setSelectedPatient(null); }}
        patient={selectedPatient}
      />
    </div>
  );
};

export default PatientsPage;

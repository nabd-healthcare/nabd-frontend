import { useState, useEffect, memo } from 'react';
import { FaInbox, FaUserMd } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // 1. Import Framer Motion
import useVerifier from '../hooks/useVerifier';
import {
  VerifierNavbar,
  StatsCards,
  StatusFilter,
  ApplicationCard,
  ApplicationDetailsModal,
} from '../components';
import { APPLICATION_TYPE } from '../constants/verifierConstants';

// 2. Memoize Static/Stable Components
const MemoizedNavbar = memo(VerifierNavbar);
const MemoizedStatusFilter = memo(StatusFilter);

/**
 * Doctors Page
 * 
 * Page for reviewing doctor applications only
 */
const DoctorsPage = () => {
  const {
    applications,
    stats,
    loading,
    filters,
    filteredApplications,
    setActiveTab,
    setActiveStatus,
  } = useVerifier();

  const [selectedApplication, setSelectedApplication] = useState(null);

  // Set active tab to doctors on mount
  useEffect(() => {
    setActiveTab(APPLICATION_TYPE.DOCTOR);
  }, [setActiveTab]);

  const filteredDoctors = filteredApplications || [];

  console.log('🔍 [DoctorsPage] Debug:', {
    activeStatus: filters.activeStatus,
    loading: loading.applications,
    doctorsCount: filteredDoctors.length,
    doctors: filteredDoctors
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-y-scroll">
      {/* Navbar */}
      <MemoizedNavbar
        activeTab={APPLICATION_TYPE.DOCTOR}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-80px)]">
        {/* Header - Centered */}
        <div className="text-center mb-12 space-y-2 pt-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 leading-tight"
          >
            طلبات <span className="text-[#0070CD]">الأطباء</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 font-medium text-sm sm:text-base max-w-2xl mx-auto"
          >
            مراجعة وتوثيق طلبات الأطباء للانضمام إلى المنصة
          </motion.p>
        </div>

        {/* Status Filter - Full Width */}
        <div className="mb-8">
          <MemoizedStatusFilter
            activeStatus={filters.activeStatus}
            onStatusChange={setActiveStatus}
            stats={stats}
          />
        </div>

        {/* Applications Grid Area - Fixed Minimum Height to prevent layout jumping */}
        <div className="min-h-[500px]">
          {loading.applications ? (
            // Loading State
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-20 bg-slate-200 rounded mb-4"></div>
                  <div className="h-10 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredDoctors.length > 0 ? (
            // Applications Grid
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDoctors.map((application) => (
                <motion.div
                  key={application.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ApplicationCard
                    application={application}
                    onViewDetails={setSelectedApplication}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center"
            >
              <div className="w-24 h-24 bg-[#0070CD]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaInbox className="text-5xl text-[#0070CD]" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">
                لا توجد طلبات
              </h3>
              <p className="text-slate-600 font-medium">
                لا توجد طلبات أطباء في هذه الحالة حالياً
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Application Details Modal - Outside AnimatePresence to prevent layout issues */}
      <AnimatePresence>
        {selectedApplication && (
          <ApplicationDetailsModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorsPage;

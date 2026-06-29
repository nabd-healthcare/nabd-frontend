import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaArrowRight, FaUsers } from 'react-icons/fa';
import DoctorDashboardBody from '../components/DoctorDashboardBody';
import TodayAppointments from '../components/TodayAppointments';
import DashboardFooter from '../components/DashboardFooter';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useTodayAppointments } from '../hooks/useTodayAppointments';
import { useSessionManager } from '../hooks/useSessionManager';
import { isAppointmentCompleted } from '@/utils/appointmentStatus';
import sessionService from '@/api/services/session.service';
import signalRService from '@/services/signalr.service';
import useAuth from '@/features/auth/hooks/useAuth';

/**
 * Doctor Dashboard Page
 * Main dashboard for doctors with clean architecture - Matching Patient Dashboard Visual Identity
 * @component
 */
const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { stats, loading, error, refreshStats } = useDashboardStats();
  const {
    appointments,
    loading: appointmentsLoading,
    error: appointmentsError,
    refreshAppointments
  } = useTodayAppointments();
  const { startOrResumeSession, sessionLoading, sessionError, clearSessionError } = useSessionManager();

  // Filter state
  const [filterType, setFilterType] = useState('all');

  // Active session from API
  const [activeSessionFromAPI, setActiveSessionFromAPI] = useState(null);

  /**
   * Format time from 24-hour to 12-hour with AM/PM in Arabic
   * @param {string} time24 - Time in 24-hour format (HH:mm or HH:mm:ss)
   * @returns {string} Time in 12-hour format with Arabic AM/PM
   */
  const formatTime = (time24) => {
    if (!time24) return '--:--';
    const parts = time24.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parts[1];
    const period = hours >= 12 ? 'م' : 'ص';
    const hour12 = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${period}`;
  };

  // SignalR: Connect and setup listener for new appointments
  useEffect(() => {
    if (!accessToken) {
      console.warn('[DoctorDashboard] No access token, skipping SignalR connection');
      return;
    }

    let isSubscribed = true;

    const initializeSignalR = async () => {
      try {
        console.log('[DoctorDashboard] 🔌 Initializing SignalR connection...');
        console.log('[DoctorDashboard] Connection state before:', signalRService.getConnectionState());

        // Connect to SignalR if not already connected
        if (!signalRService.isConnected) {
          await signalRService.connect(accessToken);
          console.log('[DoctorDashboard] ✅ SignalR connected successfully');
        } else {
          console.log('[DoctorDashboard] ℹ️ SignalR already connected');
        }

        console.log('[DoctorDashboard] Connection state after:', signalRService.getConnectionState());
        console.log('[DoctorDashboard] 📡 Registering listener for NewAppointmentToday');

        // Setup listener for new appointments
        const handleNewAppointment = (appointmentData) => {
          if (!isSubscribed) {
            console.log('[DoctorDashboard] ⚠️ Component unmounted, ignoring event');
            return;
          }

          console.log('═══════════════════════════════════════');
          console.log('📡 [SignalR] NewAppointmentToday EVENT RECEIVED!');
          console.log('📡 [SignalR] Raw data:', JSON.stringify(appointmentData, null, 2));
          console.log('═══════════════════════════════════════');

          try {
            // Map the appointment data to frontend format
            const formattedTime = formatTime(appointmentData.appointmentTime);

            const newAppointment = {
              id: appointmentData.id,
              patientId: appointmentData.patientId,
              patientName: appointmentData.patientName,
              patientInitial: appointmentData.patientName?.charAt(0) || '؟',
              phoneNumber: appointmentData.patientPhoneNumber,
              time: formattedTime,
              appointmentDate: appointmentData.appointmentDate,
              duration: appointmentData.duration,
              status: appointmentData.appointmentType === 'regular' ? 'كشف عام' : 'متابعة',
              appointmentType: appointmentData.appointmentType,
              apiStatus: appointmentData.status || 'Confirmed',
              notes: appointmentData.notes,
              price: appointmentData.price,
            };

            console.log('✅ [SignalR] Formatted appointment:', newAppointment);
            console.log('🔄 [SignalR] Calling refreshAppointments()...');

            // Refresh appointments to get the new one
            refreshAppointments();

            console.log('🔄 [SignalR] Calling refreshStats()...');
            // Refresh stats to update counters
            refreshStats();

            // Show notification to doctor
            const notificationMessage = `موعد جديد: ${appointmentData.patientName} - ${formattedTime}`;

            console.log('🔔 [SignalR] Showing notification:', notificationMessage);

            // Browser notification if supported and permitted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('موعد جديد اليوم', {
                body: notificationMessage,
                icon: '/logo.png',
                badge: '/logo.png',
              });
            }


            console.log('✅ [SignalR] Dashboard updated with new appointment');
            console.log('═══════════════════════════════════════');
          } catch (error) {
            console.error('❌ [SignalR] Error handling new appointment:', error);
            console.error('❌ [SignalR] Error stack:', error.stack);
          }
        };

        // Register the primary listener
        signalRService.on('NewAppointmentToday', handleNewAppointment);
        console.log('[DoctorDashboard] ✅ Listener registered for: NewAppointmentToday');

        // ⚠️ DEBUGGING: Try alternative event names (case variations)
        signalRService.on('newAppointmentToday', (data) => {
          console.log('⚠️ [DEBUG] Received event: newAppointmentToday (lowercase)', data);
          handleNewAppointment(data);
        });

        signalRService.on('ReceiveNotification', (notification) => {
          console.log('⚠️ [DEBUG] Received event: ReceiveNotification');
          console.log('⚠️ [DEBUG] Full notification object:', JSON.stringify(notification, null, 2));
          console.log('⚠️ [DEBUG] notification.title:', notification.title);
          console.log('⚠️ [DEBUG] notification.data:', notification.data);

          // Check if it's a new appointment notification
          if (notification.title === 'NewAppointmentToday') {
            console.log('📌 This is a NewAppointmentToday notification, processing...');

            // الـ appointment data موجود في notification.data
            const appointmentData = notification.data;

            if (appointmentData) {
              handleNewAppointment(appointmentData);
            } else {
              console.error('❌ [DEBUG] notification.data is empty or null!');
            }
          } else {
            console.log('ℹ️ [DEBUG] Different notification type:', notification.title);
          }
        });

        // Generic catch-all for debugging
        signalRService.on('receiveNotification', (data) => {
          console.log('⚠️ [DEBUG] Received event: receiveNotification (lowercase)', data);
        });

        console.log('[DoctorDashboard] ✅ All listeners registered successfully');

      } catch (error) {
        console.error('[DoctorDashboard] ❌ SignalR initialization failed:', error);
        console.error('[DoctorDashboard] ❌ Error details:', error.message);
        console.error('[DoctorDashboard] ❌ Error stack:', error.stack);
      }
    };

    initializeSignalR();

    // Cleanup
    return () => {
      console.log('[DoctorDashboard] 🧹 Cleaning up SignalR listeners');
      isSubscribed = false;
      signalRService.off('NewAppointmentToday');
      signalRService.off('newAppointmentToday');
      signalRService.off('ReceiveNotification');
      signalRService.off('receiveNotification');
    };
  }, [accessToken, refreshAppointments, refreshStats]);

  // Check for active session on mount and after refresh
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const result = await sessionService.getDoctorActiveSession();
        if (result.success && result.isActive && result.data) {
          console.log('🟢 Found active session:', result.data.appointmentId);
          setActiveSessionFromAPI(result.data);
        } else {
          setActiveSessionFromAPI(null);
        }
      } catch (error) {
        console.error('❌ Error checking active session:', error);
      }
    };

    checkActiveSession();
  }, [appointments]); // Re-check when appointments change


  /**
   * Handle stat card click
   * Navigate to relevant section or show details
   */
  const handleStatClick = (stat) => {
    console.log('Stat clicked:', stat);
  };

  /**
   * Handle enter session (start, resume, or view completed)
   */
  const handleStartAppointment = async (appointment) => {
    console.log('🔵 handleStartAppointment called');
    console.log('🔵 Appointment ID:', appointment.id);

    // Navigate to the session page directly
    navigate(`/doctor/session/${appointment.id}`);
  };

  /**
   * Separate appointments by status
   * Now includes InProgress appointments in the list
   */
  const { displayedAppointments, activeSession, nextAppointment } = useMemo(() => {
    console.log('🔄 useMemo: Processing appointments', appointments.length);
    console.log('🔄 Active session from API:', activeSessionFromAPI?.appointmentId);

    // Update appointments with active session status
    const updatedAppointments = appointments.map(apt => {
      // If this appointment has an active session, update its status
      if (activeSessionFromAPI && apt.id === activeSessionFromAPI.appointmentId) {
        console.log('🟢 Updating appointment status to InProgress:', apt.id);
        return {
          ...apt,
          apiStatus: 'InProgress' // Force InProgress status
        };
      }
      return apt;
    });

    // Display appointments that are: Pending, Confirmed, InProgress, or Completed (optional, usually kept if doctor wants to see today's full list)
    const displayed = updatedAppointments.filter(apt => {
      const statusStr = String(apt.apiStatus).toLowerCase();
      const isDisplayed = 
        statusStr === 'pending' || statusStr === '1' ||
        statusStr === 'confirmed' || statusStr === '2' ||
        statusStr === 'inprogress' || statusStr === '3' ||
        statusStr === 'completed' || statusStr === '4';

      console.log(`📋 Appointment ${apt.id}:`, {
        patientName: apt.patientName,
        apiStatus: apt.apiStatus,
        isDisplayed
      });

      return isDisplayed;
    });

    const active = updatedAppointments.find(apt => {
      // InProgress (active session)
      return apt.apiStatus === 'InProgress' || apt.apiStatus === 3;
    });

    const next = displayed.find(apt => 
      apt.apiStatus !== 'InProgress' && apt.apiStatus !== 3 && 
      apt.apiStatus !== 'Completed' && apt.apiStatus !== 4 &&
      apt.apiStatus !== 'completed' &&
      (String(apt.apiStatus).toLowerCase() === 'pending' || String(apt.apiStatus) === '1' || 
       String(apt.apiStatus).toLowerCase() === 'confirmed' || String(apt.apiStatus) === '2')
    );

    console.log('✅ Displayed appointments:', displayed.length);
    console.log('✅ Active session:', active ? active.patientName : 'None');
    console.log('✅ Next appointment:', next ? next.patientName : 'None');

    return { displayedAppointments: displayed, activeSession: active, nextAppointment: next };
  }, [appointments, activeSessionFromAPI]);

  /**
   * Filter displayed appointments based on selected type
   */
  const filteredAppointments = useMemo(() => {
    if (filterType === 'all') return displayedAppointments;
    return displayedAppointments.filter(apt => apt.status === filterType);
  }, [displayedAppointments, filterType]);

  /**
   * Handle filter change - Set specific filter type
   */
  const handleFilterChange = (newFilterType) => {
    setFilterType(newFilterType);
  };


  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="min-h-screen bg-[#F8FAFC] flex flex-col"
    >
      {/* Main Content - Scrollable */}
      <div className="flex-1">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 pt-10 pb-16">
          {/* Header Section - Professional & Clean */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/60">
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-black text-[#1F2E3C] tracking-tight leading-none">
                  لوحة <span className="text-[#0070CD]">التحكم</span>
                </h1>
                <p className="text-[#64748B] font-bold text-lg sm:text-xl">
                  مرحباً بك دكتور، إليك ملخص لأداء عيادتك اليوم.
                </p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-left md:text-right">
                    <p className="text-[#94A3B8] text-xs font-black uppercase tracking-widest mb-1">التاريخ اليوم</p>
                    <p className="text-[#1F2E3C] font-black text-lg">
                      {new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                 </div>
                 <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
                 <button 
                  onClick={() => refreshStats()}
                  className="p-3 bg-white border border-slate-200 rounded-2xl text-[#0070CD] hover:bg-[#0070CD] hover:text-white transition-all shadow-sm group">
                   <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                 </button>
              </div>
            </div>
          </motion.div>

          {/* Bento Grid Layout - High Density */}
          <div className="grid grid-cols-12 gap-8 items-start">
            
            {/* Left/Main Column: Appointments & Focus (Span 8) */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              
              {/* Active Session Hero - PREMIUM TACTICAL THEME */}
              <AnimatePresence mode="wait">
                {activeSession ? (
                  <motion.section 
                    key="active-session"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="relative"
                  >
                    <div className="relative bg-[#0070CD] rounded-[3rem] shadow-[0_40px_80px_rgba(0,112,205,0.25)] border border-[#0070CD]/20 p-10 overflow-hidden group">
                      {/* Tactical Glass Overlays */}
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
                      
                      <div className="flex flex-col xl:flex-row items-center justify-between gap-10 relative z-10">
                        <div className="flex flex-col sm:flex-row items-center gap-8">
                          <div className="w-24 h-24 bg-white/15 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                             <span className="text-3xl font-black text-white">{activeSession.patientInitial}</span>
                          </div>
                          <div className="text-center sm:text-right">
                            <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                              <span className="bg-white text-[#0070CD] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">جلسة نشطة</span>
                              <span className="text-emerald-300 text-[11px] font-black flex items-center gap-2 uppercase tracking-widest">
                                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34D399]"></span>
                                جارية الآن
                              </span>
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tight mb-2">{activeSession.patientName}</h2>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-white/70 font-bold text-sm">
                               <span className="flex items-center gap-2 bg-black/10 px-3 py-1 rounded-lg"><FaClock className="text-white/50" /> {activeSession.time}</span>
                               <span className="flex items-center gap-2 bg-black/10 px-3 py-1 rounded-lg">المدة: {activeSession.duration} دقيقة</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleStartAppointment(activeSession)}
                          className="w-full xl:w-auto bg-white text-[#0070CD] hover:bg-slate-50 px-12 py-6 rounded-[2rem] text-lg font-black shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all active:scale-95 flex items-center justify-center gap-4 group/btn"
                        >
                          <span className="tracking-tight text-[100%] leading-none h-auto">متابعة الجلسة</span>
                          <FaArrowRight className="text-xl transition-transform group-hover/btn:-translate-x-2" />
                        </button>
                      </div>
                    </div>
                  </motion.section>
                ) : nextAppointment ? (
                  /* Next Patient Focus */
                  <motion.section 
                    key="next-session"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-[3rem] border border-slate-100 p-10 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-[#0070CD]/20 transition-all duration-500 shadow-sm"
                  >
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-[#0070CD]/5 rounded-3xl flex items-center justify-center border border-[#0070CD]/10 text-[#0070CD]">
                          <span className="text-3xl font-black">{nextAppointment.patientInitial}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#0070CD]/10 text-[#0070CD] text-[10px] font-black uppercase px-3 py-1 rounded-full">الكشف التالي</span>
                          </div>
                          <h3 className="text-[#1F2E3C] font-black text-2xl mb-1">{nextAppointment.patientName}</h3>
                          <p className="text-slate-500 font-bold flex items-center gap-2">
                             <FaClock className="text-slate-400" /> {nextAppointment.time}
                             <span className="text-slate-300 mx-1">|</span>
                             المدة: {nextAppointment.duration} دقيقة
                          </p>
                        </div>
                     </div>
                     <button
                       onClick={() => handleStartAppointment(nextAppointment)}
                       className="w-full sm:w-auto bg-[#0070CD] text-white hover:bg-[#005ba3] px-8 py-4 rounded-2xl font-bold shadow-[0_10px_20px_rgba(0,112,205,0.2)] transition-all active:scale-95 flex items-center justify-center gap-3 group/btn"
                     >
                       <span>بدء الجلسة</span>
                       <FaArrowRight className="transition-transform group-hover/btn:-translate-x-1" />
                     </button>
                  </motion.section>
                ) : (
                  /* Waiting for patients */
                  <motion.section 
                    key="no-session"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-[3rem] border border-slate-100 p-10 flex items-center justify-between group hover:border-[#0070CD]/20 transition-all duration-500 shadow-sm"
                  >
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:bg-[#0070CD]/5 group-hover:text-[#0070CD] transition-all">
                          <FaUsers className="text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-[#1F2E3C] font-black text-xl">وضع الاستعداد</h3>
                          <p className="text-slate-400 text-sm font-bold tracking-tight">لا توجد كشوفات قادمة في الوقت الحالي. يمكنك أخذ استراحة حتى موعد الكشف التالي.</p>
                        </div>
                     </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Today's Timeline Module */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <TodayAppointments
                  appointments={filteredAppointments}
                  filterType={filterType}
                  onStartAppointment={handleStartAppointment}
                  onFilterChange={handleFilterChange}
                  loading={appointmentsLoading}
                  sessionLoading={sessionLoading}
                />
              </motion.div>
            </div>

            {/* Right Column: Statistics & Performance (Span 4) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="col-span-12 lg:col-span-4 space-y-8"
            >
               {/* Stats Widget Stack */}
               <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                     <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">الأداء اليومي</h3>
                     <span className="w-2 h-2 bg-[#0070CD] rounded-full"></span>
                  </div>
                  
                  {!loading && !error && (
                    <DoctorDashboardBody stats={stats} onStatClick={handleStatClick} condensed={true} />
                  )}

                  {/* Quick Action/Tip Widget */}
                  <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden group">
                     <div className="relative z-10 text-right">
                        <p className="text-[#1F2E3C] font-black text-base mb-2">تلميح اليوم 💡</p>
                        <p className="text-slate-500 text-sm font-bold leading-relaxed">
                          يمكنك استخدام الذكاء الاصطناعي لتشخيص الحالات المعقدة بسرعة أكبر. قم بتجربة أداة التشخيص الآن.
                        </p>
                     </div>
                  </div>
               </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Footer - Full width */}
      <div className="w-full">
        <DashboardFooter />
      </div>
    </motion.div>
  );
};

export default DoctorDashboard;

import { useState, useRef, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaTrash, FaTimes, FaCircle, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';
import useNotificationsStore from '@/stores/notificationsStore';
import notificationsService from '@/api/services/notifications.service';
import { getRelativeTime } from '@/utils/dateFormatter';

/**
 * Notification Center
 * Clean and premium Notification System matching Doctor Page quality
 */
const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    showNotificationModal,
    loadAllNotifications,
  } = useNotificationsStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fetch all notifications when dropdown opens
  const fetchAllNotifications = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const paginatedData = await notificationsService.getAllNotifications(1, 20);
      loadAllNotifications(paginatedData);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle bell icon click
  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Fetch notifications when opening
      fetchAllNotifications();
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.isRead && notification.data?.notificationId) {
      try {
        await notificationsService.markAsRead(notification.data.notificationId);
        markAsRead(notification.data.notificationId);
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }

    // Show modal if AppointmentCompleted
    if (
      notification.data?.type === 'AppointmentCompleted' || 
      notification.data?.type === 6 || 
      notification.data?.type === '6'
    ) {
      showNotificationModal(notification);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await notificationsService.deleteNotification(notificationId);
      removeNotification(notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={handleBellClick}
        className={`relative p-2.5 rounded-xl transition-all duration-300 ${
          isOpen 
            ? 'bg-[#0070CD]/20 text-[#0070CD]' 
            : 'text-slate-500 hover:text-[#0070CD] hover:bg-[#0070CD]/10'
        }`}
      >
        <FaBell className="w-5 h-5 md:w-6 md:h-6" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-[#E11D48] text-white text-[10px] md:text-xs font-black rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center animate-pulse shadow-sm min-w-min px-1 transform translate-x-1/4 -translate-y-1/4 ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[60] animate-fadeIn origin-top-left">
          {/* Header */}
          <div className="bg-[#0070CD] p-5 text-white shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                 <FaBell className="w-4 h-4 opacity-80" />
                 <h3 className="font-black text-lg tracking-tight">الإشعارات</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
            
            {unreadCount > 0 ? (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-2 px-3 py-1.5 mt-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-lg transition-all duration-200 active:scale-95"
              >
                <FaCheckCircle className="w-3 h-3" />
                تحديد الكل كمقروء ({unreadCount})
              </button>
            ) : (
              <p className="text-blue-100 text-xs font-medium mt-2">لا توجد رسائل غير مقروءة</p>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-slate-50/30">
            {loading ? (
              <div className="p-10 flex flex-col items-center justify-center text-slate-500">
                <div className="animate-spin w-10 h-10 border-[3px] border-[#0070CD]/20 border-t-[#0070CD] rounded-full mx-auto mb-4"></div>
                <p className="font-bold text-sm tracking-tight text-[#0070CD]/80">جاري تحميل الإشعارات...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-[#0070CD]/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#0070CD]/10">
                   <FaBell className="w-6 h-6 text-[#0070CD]/40" />
                </div>
                <p className="font-black text-slate-800 text-lg mb-1">0 إشعارات</p>
                <p className="font-medium text-slate-500 text-sm">ليس لديك أي إشعارات جديدة حالياً.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.data?.notificationId || index}
                    onClick={() => handleNotificationClick(notification)}
                    className={`group p-4 transition-all duration-200 cursor-pointer ${
                      !notification.isRead 
                        ? 'bg-[#0070CD]/5 hover:bg-[#0070CD]/10' 
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        !notification.isRead 
                          ? 'bg-blue-100 border border-[#0070CD]/20 shadow-sm' 
                          : 'bg-slate-100 border border-slate-200'
                      }`}>
                        {!notification.isRead ? (
                          <FaEnvelope className="text-[#0070CD] text-lg" />
                        ) : (
                          <FaEnvelopeOpen className="text-slate-400 text-lg" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className={`font-black text-sm truncate ${
                            !notification.isRead ? 'text-[#0F172A]' : 'text-slate-600'
                          }`}>
                            {notification.title}
                          </h4>
                          
                          {/* Delete Button */}
                          <button
                            onClick={(e) => handleDelete(e, notification.data?.notificationId)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-[#E11D48] hover:bg-[#E11D48]/10 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-100 shadow-sm">
                            {notification.timestamp
                              ? getRelativeTime(notification.timestamp)
                              : '-'}
                          </span>
                          
                          {!notification.isRead && (
                            <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 border border-[#0070CD]/10 rounded-md">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0070CD] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0070CD]"></span>
                              </span>
                              <span className="text-[10px] font-black text-[#0070CD] uppercase tracking-wide">جديد</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

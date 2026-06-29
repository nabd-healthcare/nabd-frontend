import apiClient from '../client';

/**
 * Notifications API Service
 * التعامل مع الإشعارات من الباك اند
 */
class NotificationsService {
  /**
   * جلب الإشعارات الغير مقروءة
   * GET /api/notifications/unread
   */
  async getUnreadNotifications() {
    try {
      const response = await apiClient.get('/notifications/unread');
      return response.data?.data || [];
    } catch (error) {
      console.error('[Notifications API] Failed to fetch unread notifications:', error.message);
      throw error;
    }
  }

  async getUnreadCount() {
    try {
      const response = await apiClient.get('/Notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error('[Notifications API] Failed to fetch unread count:', error.message);
      return 0; // Return 0 on error
    }
  }

  async sendTestNotification() {
    const response = await apiClient.post('/Notifications/debug/test-send');
    return response.data;
  }

  /**
   * جلب جميع الإشعارات مع pagination
   * GET /api/notifications?pageNumber=1&pageSize=20
   */
  async getAllNotifications(pageNumber = 1, pageSize = 20) {
    try {
      const response = await apiClient.get('/notifications', {
        params: { pageNumber, pageSize },
      });
      return response.data?.data || {
        pageNumber: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
        data: []
      };
    } catch (error) {
      console.error('[Notifications API] Failed to fetch all notifications:', error.message);
      throw error;
    }
  }

  /**
   * تحديد إشعار كمقروء
   * PUT /api/notifications/{id}/mark-as-read
   */
  async markAsRead(notificationId) {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/mark-as-read`);
      console.log(' [Notifications API] Marked as read:', notificationId);
      return response.data;
    } catch (error) {
      console.error(' [Notifications API] Failed to mark as read:', error);
      throw error;
    }
  }

  /**
   * تحديد جميع الإشعارات كمقروءة
   * PUT /api/notifications/mark-all-as-read
   */
  async markAllAsRead() {
    try {
      const response = await apiClient.put('/notifications/mark-all-as-read');
      console.log(' [Notifications API] All marked as read');
      return response.data;
    } catch (error) {
      console.error(' [Notifications API] Failed to mark all as read:', error);
      throw error;
    }
  }

  /**
   * حذف إشعار
   * DELETE /api/notifications/{id}
   */
  async deleteNotification(notificationId) {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`);
      console.log(' [Notifications API] Deleted:', notificationId);
      return response.data;
    } catch (error) {
      console.error(' [Notifications API] Failed to delete:', error);
      throw error;
    }
  }

  /**
   * جلب تفاصيل موعد (للاستخدام في الـ Modal)
   * GET /api/appointments/{appointmentId}
   */
  async getAppointmentDetails(appointmentId) {
    try {
      const response = await apiClient.get(`/Appointments/${appointmentId}`);
      console.log(' [Notifications API] Appointment details:', response.data);
      return response.data?.data || null;
    } catch (error) {
      console.error(' [Notifications API] Failed to fetch appointment details:', error);
      throw error;
    }
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;

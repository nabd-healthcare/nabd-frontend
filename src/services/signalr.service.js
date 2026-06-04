import * as signalR from '@microsoft/signalr';

/**
 * SignalR Service للاتصال بـ Notifications Hub
 * يتم الاتصال تلقائياً عند تسجيل الدخول
 */
class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  /**
   * إنشاء الاتصال بالـ Hub
   * @param {string} token - JWT Token للمصادقة
   */
  async connect(token) {
    if (this.isConnected) {
      console.log('[SignalR] Already connected');
      return;
    }

    console.log('[SignalR] Connecting to notifications hub...');

    try {
      // Get base URL from config (default: http://localhost:5117/api)
      // We need to remove '/api' because Hubs are mapped at root (e.g. http://localhost:5117/hubs/notifications)
      let baseUrl = import.meta.env.VITE_API_BASE_URL;

      // If VITE_API_BASE_URL is not set, try to derive from API_CONFIG or use relative path for proxy
      if (!baseUrl) {
        // ALWAYS use direct backend URL to avoid Vite Proxy WebSocket issues
        // The backend CORS takes care of allowing localhost:5173
        baseUrl = 'http://localhost:5117';
      }

      // Ensure no trailing slash
      baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      // Remove /api if present at the end
      baseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;

      const hubUrl = `${baseUrl}/hubs/notifications`;

      console.log('[SignalR] Connecting to:', hubUrl);

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token,
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Exponential backoff: 0s, 2s, 10s, 30s, 60s
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount === 1) return 2000;
            if (retryContext.previousRetryCount === 2) return 10000;
            if (retryContext.previousRetryCount === 3) return 30000;
            return 60000;
          },
        })
        .configureLogging(signalR.LogLevel.Warning) // Warning level for production
        .build();

      // Event handlers
      newConnection.onclose((error) => {
        this.isConnected = false;
        if (error) console.error('[SignalR] Connection closed:', error.message);
      });

      newConnection.onreconnecting(() => {
        this.isConnected = false;
        console.log('[SignalR] Reconnecting...');
      });

      newConnection.onreconnected(() => {
        this.isConnected = true;
        console.log('[SignalR] Reconnected successfully');
      });

      // Start connection
      await newConnection.start();

      // Set this.connection only AFTER successful connection
      this.connection = newConnection;
      this.isConnected = true;

      console.log('[SignalR] Connected successfully');

      // Register all saved listeners
      this.listeners.forEach((callback, eventName) => {
        newConnection.on(eventName, callback);
      });

    } catch (error) {
      console.error('[SignalR] Connection failed:', error.message);
      throw error;
    }
  }

  /**
   * قطع الاتصال
   */
  async disconnect() {
    if (!this.connection) return;

    try {
      await this.connection.stop();
      this.isConnected = false;
      this.connection = null;
      console.log('[SignalR] Disconnected');
    } catch (error) {
      console.error('[SignalR] Disconnect failed:', error.message);
    }
  }

  /**
   * الاستماع لحدث معين
   * @param {string} eventName - اسم الحدث (مثل: 'ReceiveNotification')
   * @param {Function} callback - الدالة التي تُنفذ عند استقبال الحدث
   */
  on(eventName, callback) {
    // Save listener
    this.listeners.set(eventName, callback);

    // If already connected, register immediately
    if (this.connection && this.isConnected) {
      this.connection.on(eventName, callback);
    }
  }

  /**
   * إلغاء الاستماع لحدث
   * @param {string} eventName - اسم الحدث
   */
  off(eventName) {
    this.listeners.delete(eventName);

    if (this.connection) {
      this.connection.off(eventName);
    }
  }

  /**
   * إرسال رسالة للـ Hub (إذا لزم الأمر)
   * @param {string} methodName - اسم الـ method في الـ Hub
   * @param  {...any} args - المعاملات
   */
  async invoke(methodName, ...args) {
    if (!this.connection || !this.isConnected) {
      throw new Error('SignalR not connected');
    }

    try {
      return await this.connection.invoke(methodName, ...args);
    } catch (error) {
      console.error(`❌ [SignalR] Invoke failed: ${methodName}`, error);
      throw error;
    }
  }

  /**
   * التحقق من حالة الاتصال
   */
  getConnectionState() {
    if (!this.connection) return 'Disconnected';
    return this.connection.state;
  }
}

// Singleton instance
const signalRService = new SignalRService();

export default signalRService;

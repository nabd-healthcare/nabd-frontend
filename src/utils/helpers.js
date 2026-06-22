import { handleApiError } from './errorHandler.js';
import { VALIDATION, API_CONFIG } from './constants.js';

export const resolveImageUrl = (url) => {
  if (!url) return '';
  
  // 1. Normalize backslashes (Windows paths from backend)
  let normalizedUrl = url.replace(/\\/g, '/');

  // 2. Fix Mixed Content Issue (HTTP to HTTPS)
  // If the backend returns an absolute URL pointing to the backend IP over HTTP, 
  // and we are on an HTTPS site, rewrite it to use the current origin.
  if (normalizedUrl.startsWith('http://167.71.45.248') && typeof window !== 'undefined' && window.location.protocol === 'https:') {
    normalizedUrl = normalizedUrl.replace('http://167.71.45.248', window.location.origin);
  } else if (normalizedUrl.startsWith('http://167.71.45.248:5000') && typeof window !== 'undefined' && window.location.protocol === 'https:') {
    normalizedUrl = normalizedUrl.replace('http://167.71.45.248:5000', window.location.origin);
  }

  // 3. Intercept ui-avatars.com
  if (normalizedUrl.startsWith('http') || normalizedUrl.startsWith('data:')) {
    if (normalizedUrl.includes('ui-avatars.com')) {
      return normalizedUrl.replace(/background=[a-zA-Z0-9]+/, 'background=0070CD');
    }
    return normalizedUrl;
  }
  
  // 4. Handle relative URLs
  let baseUrl = API_CONFIG.BASE_URL || '';
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 4);
  }
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1);
  }

  // If baseUrl is empty, provide the backend URL so it works in local dev without proxying /Uploads
  if (!baseUrl) {
    if (import.meta.env.DEV) {
      baseUrl = 'http://167.71.45.248';
    } else if (typeof window !== 'undefined') {
      baseUrl = window.location.origin;
    }
  }
  
  const path = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
  return `${baseUrl}${path}`;
};

// Use formatDateArabic from timeFormatter.js for Arabic dates
// Keep this for custom format patterns
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('HH', hours)
    .replace('mm', minutes);
};

// I'll use it when user update his profile to make delay before sending the request
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// I'll use it to limit button clicks and prevent multiple API calls in short time
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};


export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
};

// I'll use it to check if object is empty
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (typeof obj === 'string') return obj.trim().length === 0;
  return false;
};

export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

export const getErrorMessage = (error, defaultMessage = 'حدث خطأ غير متوقع') => {
  return handleApiError(error) || defaultMessage;
};

export const isValidEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const isValidPhone = (phone) => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};

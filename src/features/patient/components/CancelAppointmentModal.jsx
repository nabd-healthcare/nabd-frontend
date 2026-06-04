import { useState, useEffect } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Cancel Appointment Modal
 * Modal for cancelling an appointment with reason
 */
const CancelAppointmentModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Optional validation: if user enters reason, it must be at least 10 chars
    if (cancellationReason.trim() && cancellationReason.trim().length < 10) {
      setError('إذا أردت إدخال سبب، يرجى إدخال سبب أكثر تفصيلاً (10 أحرف على الأقل)');
      return;
    }

    onConfirm(cancellationReason.trim() || null);
  };

  const handleClose = () => {
    if (!loading) {
      setCancellationReason('');
      setError('');
      onClose();
    }
  };

  // Reset state when strictly closed
  useEffect(() => {
    if (!isOpen) {
      setCancellationReason('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-[#E11D48] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-2xl">
                <FaExclamationTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black">إلغاء الموعد</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-white/20 rounded-2xl transition-colors disabled:opacity-50"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning Message */}
          <div className="bg-[#E11D48]/5 border border-[#E11D48]/20 rounded-2xl p-4">
            <p className="text-sm text-[#E11D48] font-bold">
              هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ لن تتمكن من التراجع عن هذا الإجراء.
            </p>
          </div>

          {/* Cancellation Reason */}
          <div>
            <label className="block text-sm font-black text-[#0F172A] mb-2">
              سبب الإلغاء <span className="text-[#94A3B8] text-xs font-bold">(اختياري)</span>
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => {
                setCancellationReason(e.target.value);
                setError('');
              }}
              placeholder="يرجى توضيح سبب إلغاء الموعد..."
              rows={4}
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48] resize-none disabled:bg-[#F8FAFC] disabled:cursor-not-allowed font-bold text-[#0F172A] outline-none transition-all"
            />
            {error && (
              <p className="mt-2 text-sm text-[#E11D48] font-bold">{error}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F8FAFC] px-6 py-4 flex gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-[#64748B] font-black rounded-lg hover:bg-white hover:border-[#0070CD] hover:text-[#0070CD] hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            تراجع
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#E11D48] text-white font-black rounded-lg hover:bg-[#be0a3a] hover:scale-105 active:scale-95 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;

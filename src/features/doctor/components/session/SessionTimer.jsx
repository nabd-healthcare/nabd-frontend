import { FaClock, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Session Timer Component
 * Displays countdown timer for active session
 */
const SessionTimer = ({ timeRemaining, isExpiring, compact = false }) => {
  // Format time safely handles null, undefined, or NaN
  const formatTime = () => {
    if (timeRemaining === null || timeRemaining === undefined || isNaN(timeRemaining)) {
      return '--:--';
    }

    // Ensure we're working with an integer
    const totalSeconds = Math.floor(Number(timeRemaining));

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 md:gap-3 px-3 md:px-4 py-2 rounded-xl transition-all border ${
        isExpiring 
          ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' 
          : 'bg-[#0070CD]/5 border-[#0070CD]/20 text-[#0070CD]'
      }`}>
        {isExpiring ? (
          <FaExclamationTriangle className="text-rose-500 text-xs md:text-sm" />
        ) : (
          <FaClock className="text-[#0070CD] text-xs md:text-sm" />
        )}
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-80 hidden md:inline">المتبقي من الجلسة:</span>
        <span className="text-[10px] md:hidden font-black uppercase tracking-widest opacity-80">الوقت:</span>
        <span className={`text-sm md:text-lg font-black font-mono tracking-wider pt-0.5 ${
          isExpiring ? 'text-rose-600' : 'text-[#0070CD]'
        }`}>
          {formatTime()}
        </span>
      </div>
    );
  }

  // Default Large Display (not currently used in header but kept for fallback)
  return (
    <div
      className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${
        isExpiring
          ? 'bg-rose-50 border-rose-300 animate-pulse'
          : 'bg-[#0070CD]/5 border-[#0070CD]/20'
      }`}
    >
      {isExpiring ? (
        <FaExclamationTriangle className="text-2xl text-rose-500" />
      ) : (
        <FaClock className="text-2xl text-[#0070CD]" />
      )}

      <div className="flex-1">
        <p className="text-xs text-slate-600 font-semibold mb-1">
          {isExpiring ? '️ الوقت المتبقي' : 'الوقت المتبقي'}
        </p>
        <p
          className={`text-3xl font-black ${
            isExpiring ? 'text-rose-600' : 'text-[#0070CD]'
          }`}
          dir="ltr"
        >
          {formatTime()}
        </p>
      </div>
    </div>
  );
};

export default SessionTimer;

import React from 'react';
import { FaUser, FaPhone, FaBirthdayCake, FaVenusMars, FaInfoCircle, FaWeight, FaTint } from 'react-icons/fa';

/**
 * SessionPatientInfo - Tactical Vertical Identity
 * Optimized for sticky clinical sidebars.
 */
const SessionPatientInfo = ({ patientInfo }) => {
  if (!patientInfo) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 flex flex-col items-center justify-center opacity-40">
        <FaInfoCircle className="text-3xl mb-2 text-slate-300" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">تحميل البيانات...</p>
      </div>
    );
  }

  const { patientFullName, phoneNumber, dateOfBirth, gender, patientProfileImageUrl } = patientInfo;

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const age = calculateAge(dateOfBirth);

  const StatItem = ({ icon: Icon, label, value, color = "text-[#0070CD]" }) => (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:bg-white hover:border-[#0070CD]/20 transition-all">
       <div className={`w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center ${color}`}>
          <Icon className="text-xs" />
       </div>
       <div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{label}</span>
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{value}</span>
       </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
           <div className="w-24 h-24 rounded-[2rem] bg-slate-100 overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
              {patientProfileImageUrl ? (
                <img src={patientProfileImageUrl} className="w-full h-full object-cover" alt="Patient" />
              ) : (
                <FaUser className="text-3xl text-slate-300" />
              )}
           </div>
           <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
        </div>
        <h3 className="text-sm font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{patientFullName}</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مريض العيادة الخارجية</span>
      </div>

      <div className="space-y-2">
         <StatItem icon={FaBirthdayCake} label="العمــر" value={age ? `${age} سنة` : '--'} />
         <StatItem icon={FaVenusMars} label="النــوع" value={gender === 'Male' ? 'ذكر' : 'أنثى'} />
         <StatItem icon={FaPhone} label="الهاتــف" value={phoneNumber || 'N/A'} />
         <StatItem icon={FaTint} label="الفصيلة" value="O+" color="text-rose-500" />
         <StatItem icon={FaWeight} label="الــوزن" value="78 KG" color="text-emerald-500" />
      </div>

      <div className="pt-4 border-t border-slate-50">
         <div className="p-4 bg-[#0070CD]/5 rounded-2xl border border-[#0070CD]/10">
            <span className="text-[8px] font-black text-[#0070CD] uppercase tracking-[0.2em] block mb-2">ملاحظة الحجز</span>
            <p className="text-[10px] text-slate-600 font-bold leading-relaxed tracking-tight">
               المريض يعاني من آلام مستمرة في الصدر منذ يومين مع ارتفاع طفيف في ضغط الدم.
            </p>
         </div>
      </div>
    </div>
  );
};

export default SessionPatientInfo;

import React from 'react';
import {
  FaStethoscope,
  FaRedoAlt,
  FaClock,
  FaMoneyBillWave,
  FaCheckCircle,
} from 'react-icons/fa';

/**
 * ServiceSelection - Step 1: Choose consultation type
 * Nabd Premium Design System mapping
 */
const ServiceSelection = ({ services, selectedService, onSelectService }) => {
  if (!services) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-[5px] border-[#0070CD]/20 border-t-[#0070CD] rounded-full animate-spin mx-auto mb-6 shadow-sm"></div>
        <p className="text-[#64748B] font-bold text-lg animate-pulse">جاري تحميل الخدمات...</p>
      </div>
    );
  }

  const serviceCards = [
    {
      id: 'regular',
      name: 'كشف جديد',
      icon: FaStethoscope,
      price: services.regularCheckup?.price || 0,
      duration: services.regularCheckup?.duration || 0,
      description: 'كشف طبي كامل مع الفحص والتشخيص الشامل',
      features: ['فحص طبي شامل', 'تشخيص دقيق', 'خطة علاجية'],
    },
    {
      id: 'reExam',
      name: 'كشف متابعة',
      icon: FaRedoAlt,
      price: services.reExamination?.price || 0,
      duration: services.reExamination?.duration || 0,
      description: 'متابعة حالة سابقة للتقييم والتعديل على العلاج',
      features: ['متابعة الحالة', 'تقييم التحسن', 'تعديل العلاج'],
    },
  ];

  return (
    <div className="space-y-6 pt-2 pb-6 animate-fadeIn" dir="rtl">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-[#0F172A] tracking-tight mb-2">
          اختر نوع الكشف
        </h2>
        <p className="text-[#64748B] font-bold text-base">حدد نوع الاستشارة الطبية المناسبة لحالتك</p>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {serviceCards.map((service) => {
          const isSelected = selectedService === service.id;
          
          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className={`
                relative overflow-hidden rounded-[2rem] border-2 transition-all duration-300 cursor-pointer group
                ${isSelected 
                  ? 'border-[#0070CD] bg-white ring-4 ring-[#0070CD]/10 shadow-[0_8px_30px_rgb(0,112,205,0.15)] scale-[1.02] transform' 
                  : 'border-slate-100 bg-slate-50 hover:border-[#0070CD]/30 hover:bg-white hover:shadow-lg hover:-translate-y-1'
                }
              `}
            >
              {/* Selected Top/Left Flare */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0070CD]/10 to-transparent pointer-events-none rounded-bl-full"></div>
              )}

              {/* Selected Check Badge */}
              <div className={`absolute top-6 left-6 transition-all duration-300 transform ${isSelected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                <div className="flex items-center gap-1.5 bg-[#0070CD]/10 rounded-xl px-3 py-1.5 border border-[#0070CD]/20 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[#0070CD] rounded-full animate-pulse"></span>
                  <span className="text-xs font-black text-[#0070CD]">محدد</span>
                </div>
              </div>

              {/* Card Padding Wrapper */}
              <div className="p-8">
                
                {/* Header Profile Block */}
                <div className="flex items-start gap-5 mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-inner flex-shrink-0 ${isSelected ? 'bg-[#0070CD] text-white' : 'bg-white text-[#0070CD] border border-slate-200 group-hover:border-[#0070CD]/40'}`}>
                    <service.icon className="text-2xl" />
                  </div>
                  <div className="pt-1">
                    <h3 className={`text-2xl font-black mb-1 transition-colors ${isSelected ? 'text-[#0F172A]' : 'text-slate-700'}`}>{service.name}</h3>
                    <p className="text-sm font-bold text-[#64748B] leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`flex items-center gap-3 rounded-xl p-4 transition-colors ${isSelected ? 'bg-slate-50 border border-slate-100' : 'bg-white border border-slate-100/50'}`}>
                    <div className="rounded-lg p-2.5 bg-white border border-slate-100 text-[#0070CD] shadow-sm">
                      <FaMoneyBillWave className="text-lg" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-black text-[#94A3B8] mb-0.5">تكلفة الكشف</p>
                      <p className={`text-lg font-black ${isSelected ? 'text-[#0070CD]' : 'text-[#0F172A]'}`}>
                        {service.price} <span className="text-xs font-bold text-slate-500">ج.م</span>
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-3 rounded-xl p-4 transition-colors ${isSelected ? 'bg-slate-50 border border-slate-100' : 'bg-white border border-slate-100/50'}`}>
                    <div className="rounded-lg p-2.5 bg-white border border-slate-100 text-[#0070CD] shadow-sm">
                      <FaClock className="text-lg" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-black text-[#94A3B8] mb-0.5">المدة المتوقعة</p>
                      <p className={`text-lg font-black ${isSelected ? 'text-[#0070CD]' : 'text-[#0F172A]'}`}>
                        {service.duration} <span className="text-xs font-bold text-slate-500">دقيقة</span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelection;

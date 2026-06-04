import React from 'react';
import { FaArrowUp, FaArrowDown, FaTerminal, FaChevronRight } from 'react-icons/fa';

/**
 * DoctorDashboardBody - Clinical Performance Matrix
 * Modernized stats and metrics for the high-density command center.
 */
const DoctorDashboardBody = ({ stats, onStatClick, condensed = false }) => {
  if (condensed) {
    return (
      <div className="space-y-6">
        {stats?.map((stat) => (
          <article
            key={stat.id}
            className="flex items-center justify-between group cursor-pointer p-4 rounded-2xl hover:bg-[#0070CD]/5 transition-all"
            onClick={() => onStatClick?.(stat)}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-white shadow-sm group-hover:bg-[#0070CD] group-hover:text-white"
              >
                {stat.icon && <stat.icon className={`w-5 h-5 ${!stat.color ? 'text-[#0070CD]' : ''}`} style={stat.color ? { color: stat.color } : {}} />}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</h4>
                <p className="text-slate-900 font-black text-lg">{stat.value} <span className="text-xs text-slate-400 uppercase tracking-tighter">{stat.unit}</span></p>
              </div>
            </div>
            
            {stat.trend && (
              <div className={`text-[10px] font-black px-2.5 py-1 rounded-md ${stat.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} uppercase tracking-widest`}>
                {stat.trend}
              </div>
            )}
          </article>
        ))}
      </div>
    );
  }

  return (
    <section className="mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700" aria-labelledby="stats-heading">
      <div className="flex items-center gap-3 mb-8 px-2">
         <div className="w-8 h-8 rounded-lg bg-[#0070CD]/5 flex items-center justify-center text-[#0070CD]">
            <FaTerminal className="text-xs" />
         </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">إحصائيات الأداء العام</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats?.map((stat) => (
          <article
            key={stat.id}
            className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-[#0070CD]/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
            onClick={() => onStatClick?.(stat)}
            role="button"
            tabIndex={0}
          >
            {/* Tactical Identity Bar */}
            <div className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-[#0070CD] rounded-l-full opacity-60 group-hover:opacity-100 transition-all"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div
                  className="w-14 h-14 rounded-2xl bg-white border border-slate-50 flex items-center justify-center shadow-sm group-hover:bg-[#0070CD] group-hover:text-white transition-all duration-500"
                >
                  {stat.icon && <stat.icon className={`w-6 h-6 ${!stat.color ? 'text-[#0070CD] group-hover:text-white' : ''}`} style={stat.color ? { color: stat.color } : {}} />}
                </div>

                {stat.trend && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black ${stat.trendUp
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                    } uppercase tracking-tight`}>
                    {stat.trendUp ? <FaArrowUp className="w-2 h-2" /> : <FaArrowDown className="w-2 h-2" />}
                    <span>{stat.trend}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-[#0070CD] transition-colors">
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
                      {stat.unit}
                    </span>
                  )}
                </div>
                <h3 className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] pt-1">
                  {stat.label}
                </h3>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                 <span className="text-[9px] font-black text-[#0070CD] uppercase tracking-widest">عرض التفاصيل</span>
                 <FaChevronRight className="text-[10px] text-[#0070CD]" />
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#0070CD]/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DoctorDashboardBody;

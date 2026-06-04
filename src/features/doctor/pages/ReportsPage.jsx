import React, { useState } from 'react';
import { FaChartLine, FaUsers, FaMoneyBillWave, FaStethoscope, FaPrint, FaArrowUp, FaArrowDown, FaCalendarCheck } from 'react-icons/fa';

/**
 * ReportsPage - Clinic Command Center Analytics
 * Comprehensive dashboard for financial, clinical, and operational metrics.
 */
const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('month');

  // Mock Data for the Dashboard
  const financialData = {
    revenue: 45000,
    growth: 12.5,
    pending: 2500,
    appointments: 150,
  };

  const topDiagnoses = [
    { name: 'التهاب رئوي (Pneumonia)', count: 45, percentage: 30 },
    { name: 'إنفلونزا موسمية', count: 35, percentage: 23 },
    { name: 'التهاب الشعب الهوائية', count: 25, percentage: 17 },
    { name: 'ارتفاع ضغط الدم', count: 20, percentage: 13 },
    { name: 'أخرى', count: 25, percentage: 17 },
  ];

  const demographics = {
    male: 60,
    female: 40,
    ageGroups: [
      { range: '0-18', percentage: 15 },
      { range: '19-35', percentage: 35 },
      { range: '36-50', percentage: 30 },
      { range: '50+', percentage: 20 },
    ]
  };

  return (
    <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0070CD]/10 rounded-xl flex items-center justify-center text-[#0070CD]">
              <FaChartLine />
            </div>
            مركز الإحصائيات والتقارير
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-2">نظرة شاملة على أداء العيادة المالي والطبي</p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:border-[#0070CD] transition-all cursor-pointer"
          >
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="year">هذا العام</option>
          </select>
          <button 
            onClick={() => window.print()}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-black tracking-widest uppercase flex items-center gap-2 hover:bg-[#0070CD] transition-colors shadow-lg shadow-slate-900/10"
          >
            <FaPrint />
            Export PDF
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI Cards (Financial & Operational) */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'إجمالي الإيرادات', value: `${financialData.revenue.toLocaleString()} ج.م`, icon: FaMoneyBillWave, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+12.5%' },
            { label: 'المرضى الجدد', value: '45 مريض', icon: FaUsers, color: 'text-[#0070CD]', bg: 'bg-[#0070CD]/10', trend: '+5.2%' },
            { label: 'الجلسات المكتملة', value: financialData.appointments, icon: FaCalendarCheck, color: 'text-purple-500', bg: 'bg-purple-50', trend: '+8.1%' },
            { label: 'مستحقات متأخرة', value: `${financialData.pending.toLocaleString()} ج.م`, icon: FaChartLine, color: 'text-amber-500', bg: 'bg-amber-50', trend: '-2.4%', trendDown: true },
          ].map((kpi, index) => (
            <div key={index} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-[#0070CD]/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="text-xl" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md ${kpi.trendDown ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {kpi.trendDown ? <FaArrowDown /> : <FaArrowUp />}
                  {kpi.trend}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-1">{kpi.value}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Analytics: Top Diagnoses */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FaStethoscope />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">التشخيصات الأكثر شيوعاً</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nabd AI Analytics</p>
            </div>
          </div>

          <div className="space-y-6">
            {topDiagnoses.map((diag, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">{diag.name}</span>
                  <span className="text-xs font-black text-slate-500">{diag.count} حالة ({diag.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#0070CD] transition-all duration-1000" 
                    style={{ width: `${diag.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics Overview */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col">
          <div className="mb-8">
            <h2 className="text-lg font-black text-slate-800">ديموغرافيا المرضى</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Demographics</p>
          </div>

          {/* Gender Split */}
          <div className="mb-8">
            <div className="flex justify-between text-xs font-black text-slate-500 mb-3">
              <span>الذكور {demographics.male}%</span>
              <span>الإناث {demographics.female}%</span>
            </div>
            <div className="w-full h-4 flex rounded-full overflow-hidden">
              <div className="bg-[#0070CD]" style={{ width: `${demographics.male}%` }} />
              <div className="bg-pink-400" style={{ width: `${demographics.female}%` }} />
            </div>
          </div>

          {/* Age Distribution */}
          <div className="flex-1">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">التوزيع العمري</h3>
            <div className="space-y-4">
              {demographics.ageGroups.map((group, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 text-xs font-black text-slate-600">{group.range}</div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full" style={{ width: `${group.percentage}%` }} />
                  </div>
                  <div className="w-8 text-right text-[10px] font-black text-slate-400">{group.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Print Styles */}
      <style type="text/css" media="print">
        {`
          @page { size: A4 landscape; margin: 15mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          .print\\:hidden { display: none !important; }
          .bg-white { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
        `}
      </style>
    </div>
  );
};

export default ReportsPage;

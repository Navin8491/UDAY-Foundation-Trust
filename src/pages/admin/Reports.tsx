import { useState } from "react";
import { FileDown, DollarSign, Users, TrendingUp } from "lucide-react";

const ANNUAL_DONATIONS = [
  { year: "2021", online: 240000, offline: 480000 },
  { year: "2022", online: 380000, offline: 620000 },
  { year: "2023", online: 510000, offline: 590000 },
  { year: "2024", online: 720000, offline: 810000 },
  { year: "2025", online: 980000, offline: 740000 },
  { year: "2026", online: 1200000, offline: 640000 },
];

const BENEFICIARIES_REACHED = [
  { year: "2021", count: 8500 },
  { year: "2022", count: 12000 },
  { year: "2023", count: 18000 },
  { year: "2024", count: 24000 },
  { year: "2025", count: 32000 },
  { year: "2026", count: 40000 },
];

export function Reports() {
  const [hoveredYearIndex, setHoveredYearIndex] = useState<number | null>(null);

  const handleDownloadPDF = () => {
    // Request annual audit report via email — PDF generation to be implemented
    window.open(
      "mailto:udayfts1024@gmail.com?subject=Request%3A%20Annual%20Audit%20Report&body=Dear%20Uday%20Foundation%20Trust%2C%0A%0APlease%20share%20the%20annual%20audit%20report%20PDF.%0A%0AThank%20you.",
      "_blank"
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Reports</h1>
          <p className="text-sm text-slate-500 font-medium font-gujarati">નાણાકીય આવક-જાવક અને સામાજિક સેવાની સત્તાવાર રીપોર્ટ</p>
          <p className="text-xs text-amber-600 font-semibold mt-1">⚠ Charts show projected / estimated data for illustration purposes.</p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="btn-primary text-xs py-2.5 px-4 cursor-pointer self-start sm:self-center"
          title="Request annual audit report via email"
        >
          <FileDown className="h-4 w-4" /> Request Audit Report
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Annual Audit Summary</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-xl font-bold mt-2">₹30,000</h3>
          <span className="text-[10px] text-slate-400 block mt-1">Total revenue tracked (temporary cap)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total People Served</span>
            <Users className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold mt-2">40,000+</h3>
          <span className="text-[10px] text-slate-400 block mt-1">Cumulative reach across Gujarat villages</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Efficiency</span>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold mt-2">94.8%</h3>
          <span className="text-[10px] text-slate-400 block mt-1">Resource allocation index to direct programs</span>
        </div>
      </div>

      {/* Main Analysis Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Donations Streams (Bar chart) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base">Online vs Offline Donations</h3>
            <p className="text-xs text-slate-400 font-medium">Comparison of digital gateway vs banking cheques/CSR funds</p>
          </div>
          
          <div className="h-64 mt-4 flex items-end justify-between gap-4 pt-6 border-b border-slate-100 pb-2">
            {ANNUAL_DONATIONS.map((d) => {
              const maxAmt = 2000000;
              const onlineHeight = `${(d.online / maxAmt) * 100}%`;
              const offlineHeight = `${(d.offline / maxAmt) * 100}%`;
              return (
                <div key={d.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end gap-1.5 h-full justify-center">
                    {/* Online Bar */}
                    <div 
                      className="w-4 bg-[#4040A1] hover:bg-[#4040A1]/90 rounded-t-xs transition-all relative group cursor-pointer"
                      style={{ height: onlineHeight }}
                    >
                      <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold py-1 px-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow pointer-events-none z-10">
                        Online: ₹{(d.online/100000).toFixed(1)}L
                      </span>
                    </div>
                    {/* Offline Bar */}
                    <div 
                      className="w-4 bg-[#7A9D1C] hover:bg-[#7A9D1C]/90 rounded-t-xs transition-all relative group cursor-pointer"
                      style={{ height: offlineHeight }}
                    >
                      <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold py-1 px-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow pointer-events-none z-10">
                        Cheque: ₹{(d.offline/100000).toFixed(1)}L
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{d.year}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reach Growth (Area chart) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base">Beneficiary Growth Rate</h3>
            <p className="text-xs text-slate-400 font-medium">Cumulative count of families and individuals supported</p>
          </div>
          
          <div className="h-64 mt-4 flex flex-col justify-between relative">
            <div className="flex-1 relative flex items-end">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
                <div className="border-b border-slate-100 w-full" />
                <div className="border-b border-slate-100 w-full" />
                <div className="border-b border-slate-100 w-full" />
              </div>
              
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="colorReachRep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4040A1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#4040A1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 170 Q 100 140 200 115 T 400 60 T 500 30 L 500 200 L 0 200 Z"
                  fill="url(#colorReachRep)"
                />
                <path
                  d="M 0 170 Q 100 140 200 115 T 400 60 T 500 30"
                  fill="none"
                  stroke="#4040A1"
                  strokeWidth="3.5"
                />
                
                {/* Hover Hotspots */}
                {BENEFICIARIES_REACHED.map((_, idx) => {
                  const cx = (idx / 5) * 500;
                  const pts = [170, 145, 115, 88, 60, 30];
                  const cy = pts[idx];
                  return (
                    <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredYearIndex(idx)} onMouseLeave={() => setHoveredYearIndex(null)}>
                      <circle cx={cx} cy={cy} r="6" fill="#4040A1" stroke="#fff" strokeWidth="2" className={`transition-all ${hoveredYearIndex === idx ? "r-8 opacity-100" : "opacity-0 hover:opacity-100"}`} />
                    </g>
                  );
                })}
              </svg>

              {hoveredYearIndex !== null && (
                <div 
                  className="absolute bg-slate-800 text-white rounded-xl p-2.5 shadow-md text-[10px] pointer-events-none z-10 transition-all border border-slate-700"
                  style={{ 
                    left: `${(hoveredYearIndex / 5) * 85}%`,
                    bottom: "60px"
                  }}
                >
                  <p className="font-bold">{BENEFICIARIES_REACHED[hoveredYearIndex].year}</p>
                  <p className="text-primary font-bold mt-0.5">{BENEFICIARIES_REACHED[hoveredYearIndex].count.toLocaleString()} beneficiaries</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
              {BENEFICIARIES_REACHED.map((b) => (
                <span key={b.year}>{b.year}</span>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
export default Reports;

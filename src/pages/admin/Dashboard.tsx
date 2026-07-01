import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchEvents, fetchVolunteers, fetchDonations, fetchPartnerships, subscribeDonations } from "@/services/db";
import {
  Heart,
  Users,
  DollarSign,
  Plus,
  Building2,
  ArrowUpRight
} from "lucide-react";

// Mock Data for charts
const DONATIONS_DATA = [
  { month: "Jan", amount: 120000, display: "₹1,20,000" },
  { month: "Feb", amount: 180000, display: "₹1,80,000" },
  { month: "Mar", amount: 150000, display: "₹1,50,000" },
  { month: "Apr", amount: 220000, display: "₹2,20,000" },
  { month: "May", amount: 340000, display: "₹3,40,000" },
  { month: "Jun", amount: 290000, display: "₹2,90,000" },
  { month: "Jul", amount: 410000, display: "₹4,10,000" },
];

const VOLUNTEER_GROWTH = [
  { month: "Jan", count: 420 },
  { month: "Feb", count: 460 },
  { month: "Mar", count: 510 },
  { month: "Apr", count: 530 },
  { month: "May", count: 580 },
  { month: "Jun", count: 620 },
  { month: "Jul", count: 650 },
];

const VISITORS_DATA = [
  { day: "Mon", visitors: 1200 },
  { day: "Tue", visitors: 1400 },
  { day: "Wed", visitors: 1100 },
  { day: "Thu", visitors: 1800 },
  { day: "Fri", visitors: 1900 },
  { day: "Sat", visitors: 2400 },
  { day: "Sun", visitors: 2100 },
];

const EVENTS_CAT_DATA = [
  { name: "Education", value: 15, color: "#4040A1", percent: 37.5 },
  { name: "Healthcare", value: 12, color: "#7A9D1C", percent: 30 },
  { name: "Environment", value: 8, color: "#22C55E", percent: 20 },
  { name: "Relief", value: 5, color: "#E25C5C", percent: 12.5 },
];

export function Dashboard() {
  const [selectedChart, setSelectedChart] = useState<"donations" | "volunteers">("donations");
  const [hoveredDonIndex, setHoveredDonIndex] = useState<number | null>(null);

  const [donorsCount, setDonorsCount] = useState(0);
  const [totalDonationsAmount, setTotalDonationsAmount] = useState(166500);
  const [volunteersCount, setVolunteersCount] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);

  const [recentVolunteers, setRecentVolunteers] = useState<any[]>([]);
  const [recentPartners, setRecentPartners] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const events = await fetchEvents();
        setEventsCount(events.length);

        const volunteers = await fetchVolunteers();
        setVolunteersCount(volunteers.length);
        // Take latest 4 for list
        setRecentVolunteers([...volunteers].reverse().slice(0, 4));

        const partnerships = await fetchPartnerships();
        setPartnersCount(partnerships.length);
        // Take latest 4 for list
        setRecentPartners([...partnerships].reverse().slice(0, 4));
      } catch (e) {
        console.error("Dashboard stats query failed:", e);
      }
    }
    loadStats();

    // Subscribe to donations changes in real-time
    const unsubscribeDonations = subscribeDonations((donations) => {
      setDonorsCount(donations.length);
      const sum = donations.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      setTotalDonationsAmount(166500 + sum);
    }, (err) => {
      console.error("Realtime donations subscription failed:", err);
    });

    return () => {
      unsubscribeDonations();
    };
  }, []);

  const cards = [
    { title: "Total Donations", value: `₹${totalDonationsAmount.toLocaleString()}`, change: "Estimated total value", icon: DollarSign, color: "text-[#7A9D1C] bg-[#7A9D1C]/10" },
    { title: "Total Donors", value: donorsCount.toLocaleString(), change: "+8% from last month", icon: Heart, color: "text-rose-500 bg-rose-50/80" },
    { title: "Volunteers App", value: volunteersCount.toLocaleString(), change: "Total applications filed", icon: Users, color: "text-[#4040A1] bg-[#4040A1]/10" },
    { title: "Partnerships", value: partnersCount.toLocaleString(), change: "CSR & Institutional links", icon: Building2, color: "text-amber-500 bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Uday Foundation Trust operational performance overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/events" className="btn-primary text-xs py-2.5 px-4 cursor-pointer">
            <Plus className="h-4 w-4" /> Create Event
          </Link>
          <Link to="/admin/gallery" className="btn-ghost text-xs py-2.5 px-4 cursor-pointer bg-white">
            Upload Images
          </Link>
        </div>
      </div>

      {/* 2. KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-none ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.title}</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">{c.value}</h2>
              <span className="text-[10px] font-bold text-slate-400 block mt-1">{c.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Chart & Pie breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Main Graph */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base">Analytical Overview</h3>
              <p className="text-xs text-slate-400">Monthly donation and volunteer trends</p>
            </div>
            <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs font-bold">
              <button 
                onClick={() => setSelectedChart("donations")}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${selectedChart === "donations" ? "bg-white text-primary shadow-xs" : "text-slate-400"}`}
              >
                Donations
              </button>
              <button 
                onClick={() => setSelectedChart("volunteers")}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${selectedChart === "volunteers" ? "bg-white text-primary shadow-xs" : "text-slate-400"}`}
              >
                Volunteers
              </button>
            </div>
          </div>

          <div className="h-72 mt-4 flex flex-col justify-between relative">
            {selectedChart === "donations" ? (
              <div className="flex-1 flex flex-col justify-between pt-4">
                <div className="flex-1 relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="donGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7A9D1C" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#7A9D1C" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M0,150 Q100,110 200,130 T400,80 T600,40" 
                      fill="none" 
                      stroke="#7A9D1C" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />
                    <path 
                      d="M0,150 Q100,110 200,130 T400,80 T600,40 L600,200 L0,200 Z" 
                      fill="url(#donGrad)"
                    />
                    {DONATIONS_DATA.map((d, i) => {
                      const x = (i / 6) * 600;
                      const y = i === 0 ? 150 : i === 1 ? 120 : i === 2 ? 135 : i === 3 ? 90 : i === 4 ? 60 : i === 5 ? 75 : 40;
                      return (
                        <circle 
                          key={d.month}
                          cx={x} 
                          cy={y} 
                          r="5.5" 
                          fill="#white" 
                          stroke="#7A9D1C" 
                          strokeWidth="3"
                          className="cursor-pointer hover:r-[7.5] transition-all"
                          onMouseEnter={() => setHoveredDonIndex(i)}
                          onMouseLeave={() => setHoveredDonIndex(null)}
                        />
                      );
                    })}
                  </svg>
                  {hoveredDonIndex !== null && (
                    <div 
                      className="absolute bg-slate-800 text-white rounded-xl p-2.5 shadow-md text-[10px] pointer-events-none z-10 transition-all border border-slate-700"
                      style={{ 
                        left: `${(hoveredDonIndex / 6) * 90}%`,
                        bottom: "60px"
                      }}
                    >
                      <p className="font-bold">{DONATIONS_DATA[hoveredDonIndex].month}</p>
                      <p className="text-secondary font-bold mt-0.5">{DONATIONS_DATA[hoveredDonIndex].display}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
                  {DONATIONS_DATA.map((d) => (
                    <span key={d.month}>{d.month}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between pt-4">
                <div className="flex-1 relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4040A1" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#4040A1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M0,160 Q100,140 200,110 T400,100 T600,60" 
                      fill="none" 
                      stroke="#4040A1" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />
                    <path 
                      d="M0,160 Q100,140 200,110 T400,100 T600,60 L600,200 L0,200 Z" 
                      fill="url(#volGrad)"
                    />
                    {VOLUNTEER_GROWTH.map((v, i) => {
                      const x = (i / 6) * 600;
                      const y = i === 0 ? 160 : i === 1 ? 145 : i === 2 ? 115 : i === 3 ? 120 : i === 4 ? 100 : i === 5 ? 80 : 60;
                      return (
                        <circle 
                          key={v.month}
                          cx={x} 
                          cy={y} 
                          r="5.5" 
                          fill="#white" 
                          stroke="#4040A1" 
                          strokeWidth="3"
                          className="cursor-pointer hover:r-[7.5] transition-all"
                          onMouseEnter={() => setHoveredDonIndex(i)}
                          onMouseLeave={() => setHoveredDonIndex(null)}
                        />
                      );
                    })}
                  </svg>
                  {hoveredDonIndex !== null && (
                    <div 
                      className="absolute bg-slate-800 text-white rounded-xl p-2.5 shadow-md text-[10px] pointer-events-none z-10 transition-all border border-slate-700"
                      style={{ 
                        left: `${(hoveredDonIndex / 6) * 90}%`,
                        bottom: "60px"
                      }}
                    >
                      <p className="font-bold">{VOLUNTEER_GROWTH[hoveredDonIndex].month}</p>
                      <p className="text-secondary font-bold mt-0.5">{VOLUNTEER_GROWTH[hoveredDonIndex].count} Volunteers</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
                  {VOLUNTEER_GROWTH.map((v) => (
                    <span key={v.month}>{v.month}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base">Events by Sector</h3>
            <p className="text-xs text-slate-400">Total activities divided by intervention categories</p>
          </div>
          
          <div className="h-44 relative flex items-center justify-center mt-2">
            <svg className="w-36 h-36 transform -rotate-90 overflow-visible" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#4040A1" strokeWidth="3.5" strokeDasharray="37.5 62.5" strokeDashoffset="100" />
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#7A9D1C" strokeWidth="3.5" strokeDasharray="30 70" strokeDashoffset="62.5" />
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#22C55E" strokeWidth="3.5" strokeDasharray="20 80" strokeDashoffset="32.5" />
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#E25C5C" strokeWidth="3.5" strokeDasharray="12.5 87.5" strokeDashoffset="12.5" />
            </svg>
            <div className="absolute flex flex-col text-center">
              <span className="text-2xl font-bold text-slate-900">{eventsCount || 40}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Events</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold mt-4">
            {EVENTS_CAT_DATA.map((c) => (
              <div key={c.name} className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2 rounded-xl">
                <span className="h-2.5 w-2.5 rounded-full flex-none" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 truncate">{c.name} ({Math.round((eventsCount || 40) * (c.percent / 100))})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Traffic & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Website Traffic */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base">Visitor Statistics</h3>
            <p className="text-xs text-slate-400">Daily unique views on NGO portal</p>
          </div>
          <div className="h-48 mt-4 flex items-end justify-between gap-3.5">
            {VISITORS_DATA.map((v) => {
              const heightPercent = `${(v.visitors / 2500) * 100}%`;
              return (
                <div key={v.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    className="w-full bg-[#4040A1] hover:bg-[#4040A1]/95 rounded-t-md transition-all duration-300 relative group"
                    style={{ height: heightPercent }}
                  >
                    <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold py-1 px-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow pointer-events-none z-10">
                      {v.visitors} views
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{v.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Approvals / Recent submissions */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base">Inquiries & Application Queue</h3>
              <p className="text-xs text-slate-400">Review recent requests for partnership and volunteer roles</p>
            </div>
            <span className="text-[10px] font-bold bg-[#4040A1]/10 text-primary py-1 px-2.5 rounded-full uppercase tracking-wider">
              Pending Actions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Volunteer Side */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                <span>Recent Volunteer Applicants</span>
                <Link to="/admin/volunteers" className="text-primary hover:underline flex items-center gap-0.5">
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="space-y-2">
                {recentVolunteers.length === 0 ? (
                  <div className="text-xs text-slate-400 italic py-4">No recent volunteer applications.</div>
                ) : (
                  recentVolunteers.map((v) => (
                    <div key={v.id} className="bg-slate-50/75 border border-slate-100 p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold">
                      <div className="min-w-0">
                        <div className="text-slate-800 font-bold truncate">{v.name}</div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{v.role || "General"}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                        v.status === "approved" 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : v.status === "rejected"
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {v.status || "pending"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Partnership Side */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                <span>Recent Partnership Inquiries</span>
                <Link to="/admin/partnerships" className="text-primary hover:underline flex items-center gap-0.5">
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="space-y-2">
                {recentPartners.length === 0 ? (
                  <div className="text-xs text-slate-400 italic py-4">No recent partnership inquiries.</div>
                ) : (
                  recentPartners.map((c) => (
                    <div key={c.id} className="bg-slate-50/75 border border-slate-100 p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold">
                      <div className="min-w-0">
                        <div className="text-slate-800 font-bold truncate">{c.orgName}</div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{c.contactName}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                        c.status === "approved" 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : c.status === "rejected"
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {c.status || "pending"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
export default Dashboard;

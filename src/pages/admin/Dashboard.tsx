import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchEvents, fetchVolunteers, fetchDonations } from "@/services/db";
import {
  Heart,
  Users,
  Calendar,
  Image as ImageIcon,
  DollarSign,
  Plus,
  CheckCircle2,
} from "lucide-react";

// Mock Data
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

  const [donorsCount, setDonorsCount] = useState(1240);
  const [volunteersCount, setVolunteersCount] = useState(650);
  const [eventsCount, setEventsCount] = useState(40);

  useEffect(() => {
    async function loadStats() {
      try {
        const events = await fetchEvents();
        setEventsCount(events.length);

        const volunteers = await fetchVolunteers();
        setVolunteersCount(volunteers.length);

        const donations = await fetchDonations();
        setDonorsCount(donations.length);
      } catch (e) {
        console.error("Dashboard stats query failed:", e);
      }
    }
    loadStats();
  }, []);

  const cards = [
    { title: "Total Donations", value: "₹30,000", change: "Temporary static cap", icon: DollarSign, color: "text-[#7A9D1C] bg-[#7A9D1C]/10" },
    { title: "Total Donors", value: donorsCount.toLocaleString(), change: "+8% from last month", icon: Heart, color: "text-rose-500 bg-rose-50/80" },
    { title: "Active Volunteers", value: volunteersCount.toLocaleString(), change: "+45 this month", icon: Users, color: "text-[#4040A1] bg-[#4040A1]/10" },
    { title: "Completed Events", value: eventsCount.toLocaleString(), change: "+2 this month", icon: Calendar, color: "text-amber-500 bg-amber-50" },
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
                {/* Custom Interactive SVG Line/Area chart */}
                <div className="flex-1 relative flex items-end">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
                    <div className="border-b border-slate-100 w-full" />
                    <div className="border-b border-slate-100 w-full" />
                    <div className="border-b border-slate-100 w-full" />
                  </div>
                  
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradDon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4040A1" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#4040A1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 160 Q 80 120 160 145 T 320 90 T 500 45 L 500 200 L 0 200 Z"
                      fill="url(#gradDon)"
                    />
                    <path
                      d="M 0 160 Q 80 120 160 145 T 320 90 T 500 45"
                      fill="none"
                      stroke="#4040A1"
                      strokeWidth="3.5"
                    />
                    
                    {/* Hover Hotspots for Tooltip */}
                    {DONATIONS_DATA.map((_, idx) => {
                      const cx = (idx / 6) * 500;
                      // approximate points
                      const pts = [160, 130, 145, 115, 90, 68, 45];
                      const cy = pts[idx];
                      return (
                        <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredDonIndex(idx)} onMouseLeave={() => setHoveredDonIndex(null)}>
                          <circle cx={cx} cy={cy} r="6" fill="#4040A1" stroke="#fff" strokeWidth="2" className={`transition-all ${hoveredDonIndex === idx ? "r-8 opacity-100" : "opacity-0 hover:opacity-100"}`} />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Interactive Tooltip representation */}
                  {hoveredDonIndex !== null && (
                    <div 
                      className="absolute bg-slate-800 text-white rounded-xl p-2.5 shadow-md text-[10px] pointer-events-none z-10 transition-all border border-slate-700"
                      style={{ 
                        left: `${(hoveredDonIndex / 6) * 90}%`,
                        bottom: "60px"
                      }}
                    >
                      <p className="font-bold">{DONATIONS_DATA[hoveredDonIndex].month}</p>
                      <p className="text-primary font-bold mt-0.5">{DONATIONS_DATA[hoveredDonIndex].display}</p>
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
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
                    <div className="border-b border-slate-100 w-full" />
                    <div className="border-b border-slate-100 w-full" />
                    <div className="border-b border-slate-100 w-full" />
                  </div>
                  
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7A9D1C" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#7A9D1C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 150 Q 80 135 160 110 T 320 85 T 500 40 L 500 200 L 0 200 Z"
                      fill="url(#gradVol)"
                    />
                    <path
                      d="M 0 150 Q 80 135 160 110 T 320 85 T 500 40"
                      fill="none"
                      stroke="#7A9D1C"
                      strokeWidth="3.5"
                    />
                    
                    {/* Hover Hotspots */}
                    {VOLUNTEER_GROWTH.map((_, idx) => {
                      const cx = (idx / 6) * 500;
                      const pts = [150, 140, 110, 100, 85, 60, 40];
                      const cy = pts[idx];
                      return (
                        <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredDonIndex(idx)} onMouseLeave={() => setHoveredDonIndex(null)}>
                          <circle cx={cx} cy={cy} r="6" fill="#7A9D1C" stroke="#fff" strokeWidth="2" className={`transition-all ${hoveredDonIndex === idx ? "r-8 opacity-100" : "opacity-0 hover:opacity-100"}`} />
                        </g>
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

        {/* Category Breakdown (Pie Chart Mockup using pure SVG circles) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base">Events by Sector</h3>
            <p className="text-xs text-slate-400">Total activities divided by intervention categories</p>
          </div>
          
          <div className="h-44 relative flex items-center justify-center mt-2">
            {/* Native SVG donut / pie representation */}
            <svg className="w-36 h-36 transform -rotate-90 overflow-visible" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              {/* Education sector: 37.5% */}
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#4040A1" strokeWidth="3.5" strokeDasharray="37.5 62.5" strokeDashoffset="100" />
              {/* Healthcare sector: 30% */}
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#7A9D1C" strokeWidth="3.5" strokeDasharray="30 70" strokeDashoffset="62.5" />
              {/* Environment sector: 20% */}
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#22C55E" strokeWidth="3.5" strokeDasharray="20 80" strokeDashoffset="32.5" />
              {/* Relief sector: 12.5% */}
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#E25C5C" strokeWidth="3.5" strokeDasharray="12.5 87.5" strokeDashoffset="12.5" />
            </svg>
            <div className="absolute flex flex-col text-center">
              <span className="text-2xl font-bold text-slate-900">40</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Events</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold mt-4">
            {EVENTS_CAT_DATA.map((c) => (
              <div key={c.name} className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2 rounded-xl">
                <span className="h-2.5 w-2.5 rounded-full flex-none" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 truncate">{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Traffic & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Website Traffic (Interactive CSS Bar Chart) */}
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

        {/* Recent Activity Timeline */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-base mb-4">Recent System Logs</h3>
          <div className="space-y-4">
            {[
              { text: "Gulabbhai Khodabhai Bauddh approved volunteer registration", time: "10 mins ago", icon: CheckCircle2, iconColor: "text-emerald-600 bg-emerald-50" },
              { text: "Gallery updated with 27 new images from 'Sports Day 2026'", time: "1 hour ago", icon: ImageIcon, iconColor: "text-blue-500 bg-blue-50" },
              { text: "New donation record of ₹50,000 inserted manually", time: "3 hours ago", icon: Heart, iconColor: "text-rose-500 bg-rose-50" },
              { text: "SEO Tags for 'Transparency' page updated in settings", time: "1 day ago", icon: ImageIcon, iconColor: "text-slate-500 bg-slate-50" },
            ].map((log, idx) => (
              <div key={idx} className="flex gap-3 text-xs font-semibold">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-none ${log.iconColor}`}>
                  <log.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 leading-snug">{log.text}</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
export default Dashboard;

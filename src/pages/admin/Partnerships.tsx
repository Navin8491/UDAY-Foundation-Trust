import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { fetchPartnerships, updatePartnershipStatus } from "@/services/db";

const INITIAL_COLLABS = [
  { id: "COL-501", org: "Larsen & Toubro CSR", contact: "csr@larsentoubro.com", type: "CSR Sponsorship", date: "2026-06-25", status: "Reviewing", desc: "Funding request for rural drinking water plants in Ahmedabad peripheral villages." },
  { id: "COL-502", org: "Ahmedabad High School Association", contact: "info@ahsa.org", type: "School Partnership", date: "2026-06-24", status: "Approved", desc: "Sponsoring and setting up stationery and notebook booths in 15 public schools." },
  { id: "COL-503", org: "TATA Foundation", contact: "tata_trust@tata.com", type: "CSR Sponsorship", date: "2026-06-18", status: "Approved", desc: "Tree plantation drive sponsoring for 25,000 saplings near Sanand highway." },
  { id: "COL-504", org: "Green Earth Alliance NGO", contact: "hello@greenearth.org", type: "NGO Collaboration", date: "2026-06-12", status: "Rejected", desc: "Joint campaign proposal for city waste management system." },
];

export function Partnerships() {
  const [collabs, setCollabs] = useState(INITIAL_COLLABS);
  const [activeTab, setActiveTab] = useState<"Requests" | "Partners">("Requests");

  useEffect(() => {
    async function loadPartnerships() {
      try {
        const items = await fetchPartnerships();
        if (items && items.length > 0) {
          const mapped = items.map((p) => ({
            id: p.id || "",
            org: p.organization,
            contact: p.contactPerson + " <" + p.email + "> - " + p.phone,
            type: p.type === "csr" ? "CSR Sponsorship" : p.type === "sponsor" ? "Sponsorship" : "NGO Collaboration",
            date: p.createdAt ? p.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
            status: p.status === "approved" ? "Approved" : p.status === "rejected" ? "Rejected" : "Reviewing",
            desc: p.message,
          }));
          setCollabs(mapped);
        }
      } catch (e) {
        console.error("fetchPartnerships in component failed:", e);
      }
    }
    loadPartnerships();
  }, []);

  const partnersList = [
    { name: "TATA Foundation", type: "CSR Partner", logo: "T" },
    { name: "Reliance Industries CSR", type: "Corporate Partner", logo: "R" },
    { name: "Adani Foundation", type: "Sponsor", logo: "A" },
    { name: "Ahmedabad High School", type: "School Partner", logo: "S" },
  ];

  const handleStatus = async (id: string, stat: string) => {
    setCollabs(collabs.map((c) => (c.id === id ? { ...c, status: stat } : c)));
    try {
      const dbStatus = stat === "Approved" ? "approved" : stat === "Rejected" ? "rejected" : "pending";
      await updatePartnershipStatus(id, dbStatus);
    } catch (e) {
      console.error("updatePartnershipStatus failed:", e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Partnership Management</h1>
          <p className="text-sm text-slate-500 font-medium font-gujarati">કોર્પોરેટ CSR ફંડ અને શૈક્ષણિક સંસ્થાઓનું જોડાણ</p>
        </div>
        <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-bold self-start sm:self-center">
          <button
            onClick={() => setActiveTab("Requests")}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
              activeTab === "Requests" ? "bg-white text-primary shadow-xs" : "text-slate-500"
            }`}
          >
            Inquiries ({collabs.length})
          </button>
          <button
            onClick={() => setActiveTab("Partners")}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
              activeTab === "Partners" ? "bg-white text-primary shadow-xs" : "text-slate-500"
            }`}
          >
            Sponsors ({partnersList.length})
          </button>
        </div>
      </div>

      {activeTab === "Requests" ? (
        <div className="space-y-4">
          {collabs.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">{c.id}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    c.status === "Approved"
                      ? "bg-emerald-50 text-emerald-600"
                      : c.status === "Reviewing"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-rose-50 text-rose-600"
                  }`}>
                    {c.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{c.org}</h3>
                <p className="text-xs text-primary font-bold">{c.type} • {c.contact}</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">{c.desc}</p>
              </div>

              <div className="flex gap-2 self-start">
                <button
                  onClick={() => handleStatus(c.id, "Approved")}
                  className="h-9 px-3 rounded-xl border border-emerald-200 hover:bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleStatus(c.id, "Rejected")}
                  className="h-9 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnersList.map((p, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4"
            >
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                {p.logo}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">{p.name}</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">{p.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
export default Partnerships;

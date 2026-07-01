import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { fetchSettings, updateSettings } from "@/services/db";
import { toast } from "sonner";

export function Transparency() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState({
    pan: "",
    darpan: "",
    regNo: "",
    fcr: "",
    twelveA: "",
    eightyG: "",
  });

  const [form, setForm] = useState({ ...data });

  async function loadSettingsData() {
    try {
      setFetching(true);
      const siteSettings = await fetchSettings();
      if (siteSettings) {
        const newData = {
          pan: siteSettings.pan || "",
          darpan: siteSettings.darpan || "",
          regNo: siteSettings.regNo || "",
          fcr: siteSettings.fcr || "",
          twelveA: siteSettings.twelveA || "",
          eightyG: siteSettings.eightyG || "",
        };
        setData(newData);
        setForm(newData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    loadSettingsData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving registry compliance codes...");
    try {
      await updateSettings(form);
      setData({ ...form });
      setEditing(false);
      toast.success("Compliance registry saved successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save data.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "PAN Card Number", val: data.pan, desc: "Permanent Account Number for Uday Trust" },
    { title: "NGO DARPAN ID", val: data.darpan, desc: "NITI Aayog national registration ID" },
    { title: "Trust Registration Number", val: data.regNo, desc: "Gujarat Charity Commissioner Office Certificate" },
    { title: "12A Registration Number", val: data.twelveA, desc: "Income tax exemption status code" },
    { title: "80G Certificate Code", val: data.eightyG, desc: "Tax exemption eligibility code for donors" },
  ];

  if (fetching) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-100 rounded w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-28 bg-slate-100 rounded-2xl" />
            ))}
          </div>
          <div className="h-64 bg-slate-100 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Transparency Management</h1>
          <p className="text-sm text-slate-500 font-medium font-gujarati">સરકારી રજીસ્ટ્રેશન અને નાણાકીય પારદર્શકતા માહિતી</p>
        </div>
        <button
          onClick={() => { setForm({ ...data }); setEditing(!editing); }}
          className="btn-primary text-xs py-2.5 px-4 cursor-pointer self-start sm:self-center"
        >
          {editing ? "Cancel Edit" : "Edit Registry Data"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Registration Cards (Left side, takes 2 cols) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((c) => (
            <div
              key={c.title}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{c.title}</span>
                <span className="text-base font-mono font-bold text-slate-900 mt-2 block select-all">{c.val}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold block mt-4 border-t border-slate-50 pt-2">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Editing Dialog panel (Right side, takes 1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-800">Compliance Registry Form</h3>
            <p className="text-[10px] text-slate-400 font-bold block mt-0.5">UPDATE government verification records</p>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wider">PAN Number</label>
              <input
                type="text"
                disabled={!editing}
                value={form.pan}
                onChange={(e) => setForm({ ...form, pan: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-60 text-sm font-mono font-medium focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wider">NGO DARPAN ID</label>
              <input
                type="text"
                disabled={!editing}
                value={form.darpan}
                onChange={(e) => setForm({ ...form, darpan: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-60 text-sm font-mono font-medium focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wider">Trust Reg Code</label>
              <input
                type="text"
                disabled={!editing}
                value={form.regNo}
                onChange={(e) => setForm({ ...form, regNo: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-60 text-sm font-mono font-medium focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wider">12A Exemption</label>
              <input
                type="text"
                disabled={!editing}
                value={form.twelveA}
                onChange={(e) => setForm({ ...form, twelveA: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-60 text-sm font-mono font-medium focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wider">80G Exemption</label>
              <input
                type="text"
                disabled={!editing}
                value={form.eightyG}
                onChange={(e) => setForm({ ...form, eightyG: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-60 text-sm font-mono font-medium focus:outline-none"
              />
            </div>

            {editing && (
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-xs py-2.5 px-4 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Compliance Data"}
              </button>
            )}
          </form>
        </div>

      </div>

    </div>
  );
}
export default Transparency;

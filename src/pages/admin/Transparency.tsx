import { useState } from "react";
import { ShieldCheck, Edit, Save, Award, Info, FileText, CheckCircle } from "lucide-react";

export function Transparency() {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({
    pan: "AAATU0124K",
    darpan: "GJ/2022/0315481",
    regNo: "E/22754/AHMEDABAD",
    fcr: "Not Applicable",
    twelveA: "AABTU4985NE20214",
    eightyG: "AABTU4985NF20221",
  });

  const [form, setForm] = useState({ ...data });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setData({ ...form });
    setEditing(false);
    alert("Transparency settings saved successfully in the UI.");
  };

  const cards = [
    { title: "PAN Card Number", val: data.pan, desc: "Permanent Account Number for Uday Trust" },
    { title: "NGO DARPAN ID", val: data.darpan, desc: "NITI Aayog national registration ID" },
    { title: "Trust Registration Number", val: data.regNo, desc: "Gujarat Charity Commissioner Office Certificate" },
    { title: "12A Registration Number", val: data.twelveA, desc: "Income tax exemption status code" },
    { title: "80G Certificate Code", val: data.eightyG, desc: "Tax exemption eligibility code for donors" },
  ];

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
                className="w-full btn-primary text-xs py-2.5 px-4 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="h-4 w-4" /> Save Compliance Data
              </button>
            )}
          </form>
        </div>

      </div>

    </div>
  );
}
export default Transparency;

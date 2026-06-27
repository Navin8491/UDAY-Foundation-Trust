import { useState } from "react";
import { Edit, Image as ImageIcon, Sparkles, Heart, GraduationCap, Scale, ShieldCheck, Flame, BookOpen, HeartHandshake, Eye, X } from "lucide-react";

const INITIAL_PROGRAMS = [
  { id: 1, titleEn: "Vidya Sahay", titleGu: "વિદ્યા સહાય", label: "Education Assistance", desc: "School bags, stationary, notebooks and dress distributions to government school kids.", beneficiaries: 4500, camps: 120, cover: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600", color: "bg-blue-50 text-blue-500", icon: GraduationCap },
  { id: 2, titleEn: "Arogya Seva", titleGu: "આરોગ્ય સેવા", label: "Healthcare Camps", desc: "Diagnostic check-ups, eye surgeries, medicines and specialist camps in rural zones.", beneficiaries: 8000, camps: 38, cover: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600", color: "bg-emerald-50 text-emerald-500", icon: Heart },
  { id: 3, titleEn: "Paryavaran", titleGu: "પર્યાવરણ સંરક્ષણ", label: "Environment & Tree Plantation", desc: "Tree plantation drives, seed sowing, and community sensitization on global warming.", beneficiaries: 25000, camps: 45, cover: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600", color: "bg-green-50 text-green-500", icon: Sparkles },
  { id: 4, titleEn: "Yuva Vikas", titleGu: "યુવા વિકાસ", label: "Youth Development", desc: "Sports kits, computer courses, and library spaces for high school and college youth.", beneficiaries: 1200, camps: 15, cover: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600", color: "bg-amber-50 text-amber-500", icon: BookOpen },
  { id: 5, titleEn: "Gram Vikas", titleGu: "ગ્રામ વિકાસ", label: "Rural Development", desc: "Drinking water initiatives, sanitation systems, and rural road guidance schemes.", beneficiaries: 6500, camps: 22, cover: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=600", color: "bg-slate-50 text-slate-500", icon: ShieldCheck },
  { id: 6, titleEn: "Lok Kalyan", titleGu: "લોક કલ્યાણ", label: "Human Welfare", desc: "Winter blankets, dry ration kits, clothing drives for street dwellers and laborers.", beneficiaries: 18000, camps: 85, cover: "https://images.unsplash.com/photo-1469571486040-7a9785ad667d?q=80&w=600", color: "bg-teal-50 text-teal-500", icon: HeartHandshake },
  { id: 8, titleEn: "Aapatkalin Sahay", titleGu: "આપત્કાલીન સહાય", label: "Emergency Relief", desc: "Floods, earthquakes, COVID relief packages, and food supply kitchens during crises.", beneficiaries: 14000, camps: 18, cover: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=600", color: "bg-rose-50 text-rose-500", icon: Flame },
];

export function Programs() {
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [selectedProg, setSelectedProg] = useState<any>(null);
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formTitleGu, setFormTitleGu] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const handleEditOpen = (prog: any) => {
    setSelectedProg(prog);
    setFormTitleEn(prog.titleEn);
    setFormTitleGu(prog.titleGu);
    setFormDesc(prog.desc);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPrograms(
      programs.map((p) =>
        p.id === selectedProg.id
          ? {
              ...p,
              titleEn: formTitleEn,
              titleGu: formTitleGu,
              desc: formDesc,
            }
          : p
      )
    );
    setSelectedProg(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Programs Management</h1>
        <p className="text-sm text-slate-500 font-medium font-gujarati">ટ્રસ્ટ હેઠળ ચાલતી ૮ મુખ્ય સામાજિક કલ્યાણ પ્રવૃત્તિઓ</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {programs.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Cover */}
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img src={p.cover} alt={p.titleEn} className="w-full h-full object-cover" />
                <button
                  onClick={() => alert("Simulated Cover Image Upload triggered.")}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer shadow"
                  title="Replace Cover Image"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${p.color}`}>
                    <p.icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    {p.label}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {p.titleEn}
                </h3>
                <h4 className="font-gujarati text-xs font-semibold text-slate-500">
                  {p.titleGu}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {p.desc}
                </p>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[9px] text-slate-400 font-bold uppercase tracking-wider text-center">
                  <div>
                    <span>Impacted</span>
                    <div className="text-slate-800 font-bold text-xs mt-0.5">{p.beneficiaries.toLocaleString()}+</div>
                  </div>
                  <div>
                    <span>Activities</span>
                    <div className="text-slate-800 font-bold text-xs mt-0.5">{p.camps}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
              <button
                onClick={() => handleEditOpen(p)}
                className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Edit className="h-3.5 w-3.5" /> Edit Description
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {selectedProg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">Edit Program Details</h3>
              <button
                onClick={() => setSelectedProg(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider">Program Title (English)</label>
                <input
                  type="text"
                  required
                  value={formTitleEn}
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider">Program Title (Gujarati)</label>
                <input
                  type="text"
                  required
                  value={formTitleGu}
                  onChange={(e) => setFormTitleGu(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium font-gujarati"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider">Summary Description</label>
                <textarea
                  required
                  rows={4}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProg(null)}
                  className="flex-1 btn-ghost text-xs py-2.5 px-4 cursor-pointer bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs py-2.5 px-4 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
export default Programs;

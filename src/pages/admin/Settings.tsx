import { useState, useEffect } from "react";
import { Save, Globe, Heart, Info, Sliders } from "lucide-react";
import { fetchSettings, updateSettings } from "@/services/db";
import { toast } from "sonner";

export function Settings() {
  const [activeTab, setActiveTab] = useState<"org" | "seo" | "social" | "stats">("org");

  // Form states
  const [orgName, setOrgName] = useState("Uday Foundation Trust");
  const [orgPhone, setOrgPhone] = useState("+91 96246 68484");
  const [orgEmail, setOrgEmail] = useState("info@udaytrust.org");
  const [orgAddress, setOrgAddress] = useState("Sanand, Ahmedabad, Gujarat, India");

  const [seoTitle, setSeoTitle] = useState("Uday Foundation Trust | NGO for Rural Welfare");
  const [seoDesc, setSeoDesc] = useState("Official portal of Uday Foundation Trust, working on education, health, and rural empowerment.");
  const [seoKeywords, setSeoKeywords] = useState("ngo, uday trust, rural development, tree plantation");

  const [socialFb, setSocialFb] = useState("https://facebook.com/udaytrust");
  const [socialTw, setSocialTw] = useState("https://twitter.com/udaytrust");
  const [socialIn, setSocialIn] = useState("https://instagram.com/udaytrust");

  const [statsFamilies, setStatsFamilies] = useState(12000);
  const [statsStudents, setStatsStudents] = useState(4500);
  const [statsCamps, setStatsCamps] = useState(38);
  const [statsTrees, setStatsTrees] = useState(25000);
  const [statsVolunteers, setStatsVolunteers] = useState(650);
  const [statsVillages, setStatsVillages] = useState(120);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const siteSettings = await fetchSettings();
        if (siteSettings) {
          if (siteSettings.name) setOrgName(siteSettings.name);
          if (siteSettings.phone) setOrgPhone(siteSettings.phone);
          if (siteSettings.email) setOrgEmail(siteSettings.email);
          if (siteSettings.address) setOrgAddress(siteSettings.address);
          if (siteSettings.seoTitle) setSeoTitle(siteSettings.seoTitle);
          if (siteSettings.seoDesc) setSeoDesc(siteSettings.seoDesc);
          if (siteSettings.seoKeywords) setSeoKeywords(siteSettings.seoKeywords);
          if (siteSettings.socialFb) setSocialFb(siteSettings.socialFb);
          if (siteSettings.socialTw) setSocialTw(siteSettings.socialTw);
          if (siteSettings.socialIn) setSocialIn(siteSettings.socialIn);
          if (siteSettings.stats) {
            setStatsFamilies(siteSettings.stats.families || 12000);
            setStatsStudents(siteSettings.stats.students || 4500);
            setStatsCamps(siteSettings.stats.camps || 38);
            setStatsTrees(siteSettings.stats.trees || 25000);
            setStatsVolunteers(siteSettings.stats.volunteers || 650);
            setStatsVillages(siteSettings.stats.villages || 120);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving system configurations...");
    try {
      const payload = {
        name: orgName,
        phone: orgPhone,
        email: orgEmail,
        address: orgAddress,
        seoTitle,
        seoDesc,
        seoKeywords,
        socialFb,
        socialTw,
        socialIn,
        stats: {
          families: Number(statsFamilies),
          students: Number(statsStudents),
          camps: Number(statsCamps),
          trees: Number(statsTrees),
          volunteers: Number(statsVolunteers),
          villages: Number(statsVillages),
        }
      };
      await updateSettings(payload);
      toast.success("Configurations saved successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save settings.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Settings</h1>
        <p className="text-sm text-slate-500 font-medium font-gujarati">વેબસાઇટની ગ્લોબલ સેટિંગ્સ અને એસ.ઈ.ઓ મેનેજમેન્ટ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Sidebar Nav (Left side, takes 1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden py-2">
          {[
            { id: "org", label: "Organization Info", icon: Info },
            { id: "seo", label: "SEO Configurations", icon: Globe },
            { id: "social", label: "Social Channels", icon: Sliders },
            { id: "stats", label: "Homepage Stats", icon: Heart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#4040A1]/5 text-primary border-l-4 border-primary pl-3"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Configuration Forms Viewport (Right side, takes 3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
          <form onSubmit={handleSave} className="space-y-5 text-xs font-semibold">
            
            {activeTab === "org" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">NGO Organization Metadata</h3>
                
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Trust Corporate Name *</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Office Hotline *</label>
                    <input
                      type="text"
                      required
                      value={orgPhone}
                      onChange={(e) => setOrgPhone(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Public Support Email *</label>
                    <input
                      type="email"
                      required
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Office Headquarters *</label>
                  <input
                    type="text"
                    required
                    value={orgAddress}
                    onChange={(e) => setOrgAddress(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">Global Website SEO Settings</h3>
                
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Meta Page Title *</label>
                  <input
                    type="text"
                    required
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Meta Keywords *</label>
                  <input
                    type="text"
                    required
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Meta SEO Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">Social Networking Links</h3>
                
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Facebook Page Link</label>
                  <input
                    type="url"
                    value={socialFb}
                    onChange={(e) => setSocialFb(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Twitter URL</label>
                  <input
                    type="url"
                    value={socialTw}
                    onChange={(e) => setSocialTw(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Instagram Handle URL</label>
                  <input
                    type="url"
                    value={socialIn}
                    onChange={(e) => setSocialIn(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>
              </div>
            )}

             {activeTab === "stats" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">Homepage Impact Statistics</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Families Served *</label>
                    <input
                      type="number"
                      required
                      value={statsFamilies}
                      onChange={(e) => setStatsFamilies(Number(e.target.value))}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Students Impacted *</label>
                    <input
                      type="number"
                      required
                      value={statsStudents}
                      onChange={(e) => setStatsStudents(Number(e.target.value))}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Camps Conducted *</label>
                    <input
                      type="number"
                      required
                      value={statsCamps}
                      onChange={(e) => setStatsCamps(Number(e.target.value))}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Trees Planted *</label>
                    <input
                      type="number"
                      required
                      value={statsTrees}
                      onChange={(e) => setStatsTrees(Number(e.target.value))}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Active Volunteers *</label>
                    <input
                      type="number"
                      required
                      value={statsVolunteers}
                      onChange={(e) => setStatsVolunteers(Number(e.target.value))}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Villages Impacted *</label>
                    <input
                      type="number"
                      required
                      value={statsVillages}
                      onChange={(e) => setStatsVillages(Number(e.target.value))}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Actions panel */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-xs py-2.5 px-6 cursor-pointer flex items-center gap-1.5 shadow disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save System Settings"}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
export default Settings;

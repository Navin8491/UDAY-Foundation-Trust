import { useState } from "react";
import { Save, Shield, Globe, Heart, Info, Sliders, Settings as SettingsIcon } from "lucide-react";

export function Settings() {
  const [activeTab, setActiveTab] = useState<"org" | "seo" | "social">("org");

  // Mock Form states
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("System settings saved successfully!");
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

            {/* Actions panel */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="btn-primary text-xs py-2.5 px-6 cursor-pointer flex items-center gap-1.5 shadow"
              >
                <Save className="h-4 w-4" /> Save System Settings
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
export default Settings;

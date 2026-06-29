import { useState, useEffect } from "react";
import { Search, Check, X, FileText, Phone, Mail, MapPin, GraduationCap } from "lucide-react";
import { fetchVolunteers, updateVolunteerStatus } from "@/services/db";

const INITIAL_VOLUNTEERS = [
  { id: "VOL-101", name: "Amit Patel", email: "amit@example.com", phone: "+91 98250 12345", location: "Sanand, Ahmedabad", education: "B.Ed. Graduate", role: "Teaching assistance", date: "2026-06-26", status: "Pending", photoUrl: "", idProofUrl: "" },
  { id: "VOL-102", name: "Sneha Vyas", email: "sneha@example.com", phone: "+91 99799 54321", location: "Ahmedabad", education: "MSW (Master of Social Work)", role: "Healthcare Coordinator", date: "2026-06-25", status: "Approved", photoUrl: "", idProofUrl: "" },
  { id: "VOL-103", name: "Rahul Parmar", email: "rahul@example.com", phone: "+91 97243 98765", location: "Bavla, Ahmedabad", education: "B.Sc. Agriculture", role: "Tree Plantation volunteer", date: "2026-06-22", status: "Pending", photoUrl: "", idProofUrl: "" },
  { id: "VOL-104", name: "Pooja Vaghela", email: "pooja@example.com", phone: "+91 96240 11223", location: "Sanand, Ahmedabad", education: "12th Pass", role: "General welfare support", date: "2026-06-18", status: "Rejected", photoUrl: "", idProofUrl: "" },
];

export function Volunteers() {
  const [volunteers, setVolunteers] = useState(INITIAL_VOLUNTEERS);
  const [search, setSearch] = useState("");
  const [selectedVol, setSelectedVol] = useState<typeof INITIAL_VOLUNTEERS[0] | null>(null);

  useEffect(() => {
    async function loadVolunteers() {
      try {
        const items = await fetchVolunteers();
        if (items && items.length > 0) {
          const mapped = items.map((v) => ({
            id: v.id || "",
            name: v.name,
            email: v.email,
            phone: v.phone,
            location: v.address || "Gujarat",
            education: v.education || "Graduate",
            role: v.role || "General Volunteer",
            date: v.createdAt ? v.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
            status: v.status === "approved" ? "Approved" : v.status === "rejected" ? "Rejected" : "Pending",
            photoUrl: v.photoUrl || "",
            idProofUrl: v.idProofUrl || "",
          }));
          setVolunteers(mapped);
        }
      } catch (e) {
        console.error("fetchVolunteers in component failed:", e);
      }
    }
    loadVolunteers();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setVolunteers(volunteers.map((v) => (v.id === id ? { ...v, status: newStatus } : v)));
    if (selectedVol && selectedVol.id === id) {
      setSelectedVol({ ...selectedVol, status: newStatus });
    }
    try {
      const dbStatus = newStatus === "Approved" ? "approved" : newStatus === "Rejected" ? "rejected" : "pending";
      await updateVolunteerStatus(id, dbStatus);
    } catch (e) {
      console.error("updateVolunteerStatus failed:", e);
    }
  };

  const filtered = volunteers.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) || v.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Volunteer Management</h1>
        <p className="text-sm text-slate-500 font-medium font-gujarati">સ્વયંસેવકોની અરજી અને સેવાની વિગતોનું મોનિટરિંગ</p>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Table List (Left side, takes 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs justify-between">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full">
              <Search className="h-4 w-4 text-slate-400 flex-none" />
              <input
                type="text"
                placeholder="Search applicant name or volunteer role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs font-semibold focus:outline-hidden bg-transparent"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-5">Applicant</th>
                    <th className="py-4 px-5">Role Interest</th>
                    <th className="py-4 px-5">Applied Date</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 font-bold">
                        No volunteer records found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((v) => (
                      <tr 
                        key={v.id} 
                        onClick={() => setSelectedVol(v)}
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                          selectedVol?.id === v.id ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="py-4 px-5">
                          <div>
                            <div className="text-slate-900 font-bold">{v.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{v.location}</div>
                          </div>
                        </td>
                        <td className="py-4 px-5">{v.role}</td>
                        <td className="py-4 px-5">{v.date}</td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            v.status === "Approved"
                              ? "bg-emerald-50 text-emerald-600"
                              : v.status === "Pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-rose-50 text-rose-600"
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleStatusChange(v.id, "Approved")}
                              className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center cursor-pointer"
                              title="Approve Applicant"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(v.id, "Rejected")}
                              className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center cursor-pointer"
                              title="Reject Applicant"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Inspector Sidebar (Right side, takes 1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          {selectedVol ? (
            <>
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Application File</h3>
                  <span className="text-[10px] text-slate-400 font-mono font-bold block mt-0.5">{selectedVol.id}</span>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  selectedVol.status === "Approved"
                    ? "bg-emerald-50 text-emerald-600"
                    : selectedVol.status === "Pending"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-rose-50 text-rose-600"
                }`}>
                  {selectedVol.status}
                </span>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Full Name</span>
                  <span className="text-slate-900 text-sm">{selectedVol.name}</span>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" /> <span>{selectedVol.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" /> <span>{selectedVol.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" /> <span>{selectedVol.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-50 space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Education Background</span>
                    <span className="text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <GraduationCap className="h-4 w-4 text-primary" /> {selectedVol.education}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Volunteer Preference</span>
                    <span className="text-slate-900 block mt-0.5">{selectedVol.role}</span>
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="pt-3 border-t border-slate-50 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Uploaded Documents</span>
                  {selectedVol.photoUrl ? (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-[11px] font-bold">
                      <div className="flex items-center gap-2 text-slate-700 min-w-0">
                        <FileText className="h-4.5 w-4.5 text-[#4040A1]" />
                        <span className="truncate">Selfie Photo</span>
                      </div>
                      <a 
                        href={selectedVol.photoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary hover:underline cursor-pointer flex-none ml-2"
                      >
                        View Photo
                      </a>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">No selfie photo uploaded</div>
                  )}
                  {selectedVol.idProofUrl ? (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-[11px] font-bold">
                      <div className="flex items-center gap-2 text-slate-700 min-w-0">
                        <FileText className="h-4.5 w-4.5 text-[#4040A1]" />
                        <span className="truncate">ID Document</span>
                      </div>
                      <a 
                        href={selectedVol.idProofUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary hover:underline cursor-pointer flex-none ml-2"
                      >
                        View ID Document
                      </a>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">No ID proof document uploaded</div>
                  )}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => handleStatusChange(selectedVol.id, "Approved")}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="h-4 w-4" /> Approve
                </button>
                <button
                  onClick={() => handleStatusChange(selectedVol.id, "Rejected")}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <X className="h-4 w-4" /> Reject
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 font-bold text-xs">
              Select a volunteer application row to inspect document records, contact details, and certifications.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
export default Volunteers;

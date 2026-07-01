import { useState, useEffect } from "react";
import { 
  Search, Check, X, FileText, Phone, Mail, MapPin, 
  User, Clock, Trash2, Printer, Download, MessageSquare, 
  Building2, Globe, Plus 
} from "lucide-react";
import { fetchPartnerships, updatePartnershipStatus, addPartnershipNote, deletePartnership } from "@/services/db";
import { toast } from "sonner";

export function Partnerships() {
  const [collabs, setCollabs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedCollab, setSelectedCollab] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals / Actions state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  // Load partnerships
  const loadPartnerships = async () => {
    try {
      setLoading(true);
      const items = await fetchPartnerships();
      if (items) {
        setCollabs(items);
        if (selectedCollab) {
          const updated = items.find(c => c.id === selectedCollab.id);
          if (updated) setSelectedCollab(updated);
        }
      } else {
        setCollabs([]);
      }
    } catch (e: any) {
      console.error("fetchPartnerships failed:", e);
      toast.error("Failed to load partnership inquiries.");
      setCollabs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartnerships();
  }, []);

  // Parse extended fields
  const getExtendedData = (c: any) => {
    if (!c || !c.message) return {};
    try {
      const parsed = JSON.parse(c.message);
      if (parsed && typeof parsed === "object" && parsed.isExtended) {
        return parsed;
      }
    } catch (e) {}
    return { proposal: c.message || "" };
  };

  // Action Handlers
  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this partnership request?")) return;
    try {
      await updatePartnershipStatus(id, "approved");
      toast.success("Partnership request approved successfully.");
      loadPartnerships();
    } catch (e: any) {
      toast.error(e.message || "Failed to approve request.");
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedCollab) return;
    try {
      await updatePartnershipStatus(selectedCollab.id, "rejected", rejectReason);
      toast.success("Partnership request rejected. Notification sent.");
      setShowRejectModal(false);
      setRejectReason("");
      loadPartnerships();
    } catch (e: any) {
      toast.error(e.message || "Failed to reject request.");
    }
  };

  const handleMarkPending = async (id: string) => {
    try {
      await updatePartnershipStatus(id, "pending");
      toast.success("Inquiry marked back as Pending.");
      loadPartnerships();
    } catch (e: any) {
      toast.error(e.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("CRITICAL WARNING: Are you sure you want to permanently delete this partnership record? This cannot be undone.")) return;
    try {
      await deletePartnership(id);
      toast.success("Partnership record deleted.");
      setSelectedCollab(null);
      loadPartnerships();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete record.");
    }
  };

  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollab || !newNoteText.trim()) return;
    setSubmittingNote(true);
    try {
      await addPartnershipNote(selectedCollab.id, newNoteText);
      toast.success("Internal note added.");
      setNewNoteText("");
      loadPartnerships();
    } catch (e: any) {
      toast.error(e.message || "Failed to add note.");
    } finally {
      setSubmittingNote(false);
    }
  };

  const handlePrint = () => {
    if (!selectedCollab) return;
    window.print();
  };

  // Stats computation
  const stats = {
    total: collabs.length,
    pending: collabs.filter(c => c.status === "pending" || !c.status).length,
    approved: collabs.filter(c => c.status === "approved").length,
    rejected: collabs.filter(c => c.status === "rejected").length
  };

  // Filters logic
  const filtered = collabs.filter((c) => {
    const searchLower = search.toLowerCase();
    
    const matchesSearch = 
      (c.orgName || "").toLowerCase().includes(searchLower) ||
      (c.contactName || "").toLowerCase().includes(searchLower) ||
      (c.email || "").toLowerCase().includes(searchLower) ||
      (c.phone || "").toLowerCase().includes(searchLower);

    const matchesStatus = 
      statusFilter === "all" || 
      (c.status || "pending") === statusFilter;

    const matchesType = 
      typeFilter === "all" || 
      (c.type || "").toLowerCase() === typeFilter.toLowerCase();

    const matchesDate = 
      !dateFilter || 
      (c.created_at && c.created_at.split("T")[0] === dateFilter);

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Partnership Management</h1>
        <p className="text-sm text-slate-500 font-medium font-gujarati">કોર્પોરેટ CSR ફંડ અને શૈક્ષણિક સંસ્થાઓનું જોડાણ</p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 font-gujarati">
        <div className="bg-white p-4 md:p-5 border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">Total Inquiries</div>
          <div className="text-2xl font-bold mt-1.5 text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-amber-50/50 p-4 md:p-5 border border-amber-200/60 rounded-2xl shadow-xs">
          <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider font-sans">Pending Review</div>
          <div className="text-2xl font-bold mt-1.5 text-amber-700">{stats.pending}</div>
        </div>
        <div className="bg-emerald-50/50 p-4 md:p-5 border border-emerald-200/60 rounded-2xl shadow-xs">
          <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-sans">Approved Partnerships</div>
          <div className="text-2xl font-bold mt-1.5 text-emerald-700">{stats.approved}</div>
        </div>
        <div className="bg-rose-50/50 p-4 md:p-5 border border-rose-200/60 rounded-2xl shadow-xs">
          <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider font-sans">Declined Requests</div>
          <div className="text-2xl font-bold mt-1.5 text-rose-700">{stats.rejected}</div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start print:block">
        
        {/* Table List (Left side, takes 2 cols) */}
        <div className="lg:col-span-2 space-y-4 print:hidden">
          
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full">
              <Search className="h-4 w-4 text-slate-400 flex-none" />
              <input
                type="text"
                placeholder="Search by organization name or contact person..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs font-semibold focus:outline-hidden bg-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Org Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="NGO">NGO</option>
                  <option value="School">School</option>
                  <option value="College">College</option>
                  <option value="CSR">CSR Sponsorship</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Government">Government</option>
                  <option value="Trust">Trust</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Inquired</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-5">Organization</th>
                    <th className="py-4 px-5">Contact Person</th>
                    <th className="py-4 px-5">Org Type</th>
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="py-5 px-5">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-slate-100 rounded shrink-0" />
                            <div className="space-y-2">
                              <div className="h-4 w-28 bg-slate-100 rounded" />
                              <div className="h-3 w-36 bg-slate-100 rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-5"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                        <td className="py-5 px-5"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                        <td className="py-5 px-5"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                        <td className="py-5 px-5"><div className="h-5 w-16 bg-slate-100 rounded-full" /></td>
                        <td className="py-5 px-5 text-right"><div className="h-8 w-8 bg-slate-100 rounded-lg ml-auto" /></td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400 font-bold">
                        No partnership requests found matching the filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => (
                      <tr 
                        key={c.id} 
                        onClick={() => setSelectedCollab(c)}
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                          selectedCollab?.id === c.id ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                            <div>
                              <div className="text-slate-900 font-bold">{c.orgName}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">{c.contactName}</td>
                        <td className="py-4 px-5">{c.type || "Other"}</td>
                        <td className="py-4 px-5">
                          {c.created_at ? c.created_at.split("T")[0] : "N/A"}
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            (c.status || "pending") === "approved"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : (c.status || "pending") === "pending"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "bg-rose-50 text-rose-600 border border-rose-100"
                          }`}>
                            {c.status || "pending"}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleApprove(c.id)}
                              className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center cursor-pointer"
                              title="Approve Partnership"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCollab(c);
                                setShowRejectModal(true);
                              }}
                              className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center cursor-pointer"
                              title="Decline Partnership"
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

        {/* Sidebar Inspector Panel */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5 print:border-none print:shadow-none print:p-0 print:w-full lg:col-span-1">
          {selectedCollab ? (
            <>
              {/* Header */}
              <div className="pb-4 border-b border-slate-100 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-none">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 leading-snug">{selectedCollab.orgName}</h3>
                    <span className="text-[9px] text-slate-400 font-mono block mt-0.5">ID: {selectedCollab.id}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  (selectedCollab.status || "pending") === "approved"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : (selectedCollab.status || "pending") === "pending"
                    ? "bg-amber-50 text-amber-600 border border-amber-100"
                    : "bg-rose-50 text-rose-600 border border-rose-100"
                }`}>
                  {selectedCollab.status || "pending"}
                </span>
              </div>

              {/* PDF & Print actions */}
              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Inquiry
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Export PDF
                </button>
              </div>

              {/* Data Rows */}
              <div className="space-y-4 text-xs font-semibold">
                
                {/* Organization details */}
                <div>
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">Organization info</h4>
                  <div className="bg-slate-50/75 border border-slate-100 rounded-xl p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Type</span>
                        <span className="text-slate-800">{selectedCollab.type || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Website</span>
                        {getExtendedData(selectedCollab).website ? (
                          <a 
                            href={getExtendedData(selectedCollab).website} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <Globe className="h-3 w-3" /> Visit Site
                          </a>
                        ) : (
                          <span className="text-slate-400">No Web Link</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact person */}
                <div>
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">Contact Representative</h4>
                  <div className="bg-slate-50/75 border border-slate-100 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{selectedCollab.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{selectedCollab.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{selectedCollab.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-700">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{getExtendedData(selectedCollab).address || selectedCollab.address || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Proposal statement */}
                <div>
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">Proposal Statement</h4>
                  <div className="bg-slate-50/75 border border-slate-100 rounded-xl p-3">
                    <p className="text-slate-700 leading-relaxed font-light italic bg-white p-2 border border-slate-100 rounded-lg">
                      "{getExtendedData(selectedCollab).proposal || "No description provided."}"
                    </p>
                  </div>
                </div>

                {/* Attachment */}
                {selectedCollab.documentUrl && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold">Uploaded Proposal Documents</h4>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-[11px] font-bold">
                      <div className="flex items-center gap-2 text-slate-700 min-w-0">
                        <FileText className="h-4 w-4 text-[#4040A1]" />
                        <span className="truncate">Proposal PDF / File</span>
                      </div>
                      <a 
                        href={selectedCollab.documentUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-primary hover:underline cursor-pointer flex-none ml-2"
                      >
                        View File
                      </a>
                    </div>
                  </div>
                )}

                {/* Internal Notes */}
                <div className="pt-3 border-t border-slate-100 space-y-2 print:hidden">
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" /> Internal Notes
                  </h4>
                  
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {(!getExtendedData(selectedCollab).notes || getExtendedData(selectedCollab).notes.length === 0) ? (
                      <div className="text-[10px] text-slate-400 italic">No notes added.</div>
                    ) : (
                      getExtendedData(selectedCollab).notes.map((n: any, i: number) => (
                        <div key={i} className="bg-slate-50 border border-slate-100 p-2 rounded-lg text-[10px] space-y-1">
                          <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                            <span>{n.admin}</span>
                            <span>{n.date ? n.date.split("T")[0] : ""}</span>
                          </div>
                          <p className="text-slate-700 leading-snug font-normal">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleAddNoteSubmit} className="flex gap-1.5 mt-2">
                    <input
                      type="text"
                      placeholder="Add review notes..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={submittingNote}
                      className="h-8 w-8 bg-primary hover:bg-primary/95 text-white rounded-lg flex items-center justify-center flex-none disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </form>
                </div>

                {/* Timeline */}
                <div className="pt-3 border-t border-slate-100 space-y-2 print:hidden">
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Action Timeline
                  </h4>
                  <div className="space-y-3 pl-2 border-l border-slate-200 mt-2">
                    {getExtendedData(selectedCollab).timeline?.map((t: any, i: number) => (
                      <div key={i} className="relative text-[10px]">
                        <div className="absolute -left-[12px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                        <div className="font-bold text-slate-800 flex justify-between">
                          <span>{t.action}</span>
                          <span className="text-[8px] text-slate-400 font-normal">{t.date ? t.date.split("T")[0] : ""}</span>
                        </div>
                        <p className="text-slate-500 font-normal mt-0.5">{t.notes}</p>
                        {t.admin && <span className="text-[8px] text-slate-400 italic">By: {t.admin}</span>}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Status Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 print:hidden">
                {(selectedCollab.status || "pending") !== "approved" && (
                  <button
                    onClick={() => handleApprove(selectedCollab.id)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                )}
                {(selectedCollab.status || "pending") !== "rejected" && (
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                )}
                {(selectedCollab.status || "pending") !== "pending" && (
                  <button
                    onClick={() => handleMarkPending(selectedCollab.id)}
                    className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    Mark Pending
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedCollab.id)}
                  className="w-full py-1.5 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Request
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 font-bold text-xs">
              Select a partnership inquiry row to inspect organization profile, brochure attachments, and notes.
            </div>
          )}
        </div>

      </div>

      {/* Reject Modal Dialog (Reason Prompt) */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Specify Decline Reason</h3>
            <p className="text-xs text-slate-500 font-light">
              Enter the reason why this partnership inquiry is declined. This text will be automatically included in the client's status update email.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none resize-none"
              placeholder="e.g., We cannot accommodate this request due to current capacity constraints..."
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg"
              >
                Decline proposal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default Partnerships;

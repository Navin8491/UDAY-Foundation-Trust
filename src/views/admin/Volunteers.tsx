"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Check,
  X,
  FileText,
  Phone,
  Mail,
  MapPin,
  User,
  Clock,
  Trash2,
  Printer,
  Download,
  MessageSquare,
  Briefcase,
  Plus,
  Edit3,
  CheckSquare,
} from "lucide-react";
import {
  fetchVolunteers,
  updateVolunteerStatus,
  addVolunteerNote,
  deleteVolunteer,
  updateVolunteerDetails,
  fetchEmailStats,
  retryEmailLog,
} from "@/services/db";
import { toast } from "sonner";

export function Volunteers() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedVol, setSelectedVol] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals for actions
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  // New States
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState<any>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Load volunteers
  const loadVolunteers = async () => {
    try {
      setLoading(true);
      const items = await fetchVolunteers();
      if (items) {
        setVolunteers(items);
        if (selectedVol) {
          const updated = items.find((v) => v.id === selectedVol.id);
          if (updated) setSelectedVol(updated);
        }
      } else {
        setVolunteers([]);
      }
    } catch (e: any) {
      console.error("fetchVolunteers failed:", e);
      toast.error("Failed to load volunteer applications.");
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load email stats/logs
  const loadEmailLogs = async () => {
    try {
      const stats = await fetchEmailStats();
      if (stats && stats.logs) {
        setEmailLogs(stats.logs);
      }
    } catch (e) {
      console.error("Failed to load email stats:", e);
    }
  };

  useEffect(() => {
    loadVolunteers();
    loadEmailLogs();
  }, []);

  const handleRetryEmail = async (logId: string) => {
    try {
      await retryEmailLog(logId);
      toast.success("Retry request queued successfully!");
      loadEmailLogs();
    } catch (err: any) {
      toast.error(err.message || "Failed to retry sending email.");
    }
  };

  // Parse extended fields (supports both database columns and fallback serialized JSON message)
  const getExtendedData = (vol: any) => {
    if (!vol) return {};

    const fromColumns = {
      dob: vol.dob || "",
      gender: vol.gender || "",
      city: vol.city || "",
      state: vol.state || "",
      country: vol.country || "India",
      pincode: vol.pincode || "",
      occupation: vol.occupation || "",
      skills: vol.skills || "",
      languages: vol.languages || "",
      experience: vol.experience || "",
      availability: vol.availability || "",
      emergencyName: vol.emergencyName || "",
      emergencyPhone: vol.emergencyPhone || "",
      resumeUrl: vol.resumeUrl || "",
      whyJoin: vol.whyJoin || vol.message || "",
      notes: [],
      timeline: [],
    };

    if (!vol.message) return fromColumns;
    try {
      const parsed = JSON.parse(vol.message);
      if (parsed && typeof parsed === "object" && parsed.isExtended) {
        return {
          ...fromColumns,
          ...parsed,
          whyJoin: parsed.whyJoin || parsed.message || vol.message || "",
          notes: parsed.notes || [],
          timeline: parsed.timeline || [],
        };
      }
    } catch (e) {}
    return fromColumns;
  };

  // Status handlers
  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this volunteer application?")) return;
    try {
      await updateVolunteerStatus(id, "approved");
      toast.success("Application approved successfully.");
      loadVolunteers();
      loadEmailLogs();
    } catch (e: any) {
      toast.error(e.message || "Failed to approve application.");
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedVol) return;
    try {
      await updateVolunteerStatus(selectedVol.id, "rejected", rejectReason);
      toast.success("Application rejected. Notification sent.");
      setShowRejectModal(false);
      setRejectReason("");
      loadVolunteers();
      loadEmailLogs();
    } catch (e: any) {
      toast.error(e.message || "Failed to reject application.");
    }
  };

  const handleMarkPending = async (id: string) => {
    try {
      await updateVolunteerStatus(id, "pending");
      toast.success("Application set back to Pending status.");
      loadVolunteers();
      loadEmailLogs();
    } catch (e: any) {
      toast.error(e.message || "Failed to change status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "CRITICAL WARNING: Are you sure you want to permanently delete this volunteer record? This action cannot be undone.",
      )
    )
      return;
    try {
      await deleteVolunteer(id);
      toast.success("Record deleted successfully.");
      setSelectedVol(null);
      loadVolunteers();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete record.");
    }
  };

  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVol || !newNoteText.trim()) return;
    setSubmittingNote(true);
    try {
      await addVolunteerNote(selectedVol.id, newNoteText);
      toast.success("Internal note added successfully.");
      setNewNoteText("");
      loadVolunteers();
    } catch (e: any) {
      toast.error(e.message || "Failed to add internal note.");
    } finally {
      setSubmittingNote(false);
    }
  };

  // Profile Edit Save
  const handleSaveProfileEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVol) return;
    try {
      await updateVolunteerDetails(selectedVol.id, editFields);
      toast.success("Volunteer details updated successfully.");
      setIsEditing(false);
      loadVolunteers();
    } catch (err: any) {
      toast.error(err.message || "Failed to update volunteer details.");
    }
  };

  const startEditing = (vol: any) => {
    const ext = getExtendedData(vol);
    setEditFields({
      name: vol.name || "",
      email: vol.email || "",
      phone: vol.phone || "",
      city: ext.city || "",
      state: ext.state || "",
      pincode: ext.pincode || "",
      skills: ext.skills || "",
      availability: ext.availability || "",
      education: vol.education || "",
      languages: ext.languages || "",
      role: vol.role || "",
      experience: ext.experience || "",
      status: vol.status || "pending",
    });
    setIsEditing(true);
  };

  // Bulk Actions
  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to approve all ${selectedIds.length} selected volunteers?`)) return;
    setIsBulkLoading(true);
    let successCount = 0;
    for (const id of selectedIds) {
      try {
        await updateVolunteerStatus(id, "approved");
        successCount++;
      } catch (err) {
        console.error(`Failed to approve volunteer ID ${id}:`, err);
      }
    }
    toast.success(`Successfully approved ${successCount} volunteers.`);
    setSelectedIds([]);
    setIsBulkLoading(false);
    loadVolunteers();
    loadEmailLogs();
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    const reason = prompt(`Enter rejection reason for ${selectedIds.length} selected volunteers:`);
    if (reason === null) return;
    setIsBulkLoading(true);
    let successCount = 0;
    for (const id of selectedIds) {
      try {
        await updateVolunteerStatus(id, "rejected", reason);
        successCount++;
      } catch (err) {
        console.error(`Failed to reject volunteer ID ${id}:`, err);
      }
    }
    toast.success(`Successfully rejected ${successCount} volunteers.`);
    setSelectedIds([]);
    setIsBulkLoading(false);
    loadVolunteers();
    loadEmailLogs();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`CRITICAL WARNING: Are you sure you want to permanently delete all ${selectedIds.length} selected volunteers? This cannot be undone.`)) return;
    setIsBulkLoading(true);
    let successCount = 0;
    for (const id of selectedIds) {
      try {
        await deleteVolunteer(id);
        successCount++;
      } catch (err) {
        console.error(`Failed to delete volunteer ID ${id}:`, err);
      }
    }
    toast.success(`Successfully deleted ${successCount} volunteers.`);
    setSelectedIds([]);
    setIsBulkLoading(false);
    loadVolunteers();
  };

  // Exports
  const handleExportCSV = (records: any[]) => {
    const headers = ["ID", "Name", "Email", "Phone", "City", "Role Preference", "Status", "Applied At"];
    const rows = records.map(r => {
      const ext = getExtendedData(r);
      return [
        r.id,
        r.name,
        r.email,
        r.phone,
        ext.city || r.address || "",
        r.role || "",
        r.status || "pending",
        r.created_at ? r.created_at.split("T")[0] : ""
      ];
    });
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `volunteers_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully");
  };

  const handleExportExcel = (records: any[]) => {
    const rows = records.map(r => {
      const ext = getExtendedData(r);
      return `
        <tr>
          <td>${r.id}</td>
          <td>${r.name}</td>
          <td>${r.email}</td>
          <td>${r.phone}</td>
          <td>${ext.city || r.address || ""}</td>
          <td>${r.role || ""}</td>
          <td>${r.status || "pending"}</td>
          <td>${r.created_at ? r.created_at.split("T")[0] : ""}</td>
        </tr>
      `;
    }).join("");

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Volunteers</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
      <body>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Role Preference</th>
              <th>Status</th>
              <th>Applied At</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `volunteers_export_${new Date().toISOString().split("T")[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel exported successfully");
  };

  // Print Profile
  const handlePrint = () => {
    if (!selectedVol) return;
    window.print();
  };

  // Stats
  const stats = {
    total: volunteers.length,
    pending: volunteers.filter((v) => v.status === "pending" || !v.status).length,
    approved: volunteers.filter((v) => v.status === "approved").length,
    rejected: volunteers.filter((v) => v.status === "rejected").length,
  };

  // Unique list of cities for filter
  const cities = Array.from(
    new Set(
      volunteers
        .map((v) => {
          const ext = getExtendedData(v);
          return ext.city || "";
        })
        .filter((c) => c !== ""),
    ),
  );

  // Filters logic
  const filtered = volunteers.filter((v) => {
    const ext = getExtendedData(v);
    const searchLower = search.toLowerCase();

    const matchesSearch =
      (v.name || "").toLowerCase().includes(searchLower) ||
      (v.email || "").toLowerCase().includes(searchLower) ||
      (v.phone || "").toLowerCase().includes(searchLower) ||
      (v.role || "").toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "all" || (v.status || "pending") === statusFilter;

    const matchesCity = cityFilter === "all" || ext.city === cityFilter;

    let matchesDate = true;
    if (dateFilter) {
      if (dateFilter === "today") {
        const todayStr = new Date().toISOString().split("T")[0];
        matchesDate = !!v.created_at && v.created_at.split("T")[0] === todayStr;
      } else if (dateFilter === "week") {
        const createdDate = new Date(v.created_at).getTime();
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        matchesDate = createdDate >= oneWeekAgo;
      } else if (dateFilter === "month") {
        const createdDate = new Date(v.created_at).getTime();
        const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        matchesDate = createdDate >= oneMonthAgo;
      } else {
        matchesDate = !!v.created_at && v.created_at.split("T")[0] === dateFilter;
      }
    }

    return matchesSearch && matchesStatus && matchesCity && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Volunteer Management</h1>
        <p className="text-sm text-slate-500 font-medium font-gujarati">
          સ્વયંસેવકોની અરજી અને સેવાની વિગતોનું મોનિટરિંગ
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 font-gujarati">
        <div className="bg-white p-4 md:p-5 border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
            Total Applications
          </div>
          <div className="text-2xl font-bold mt-1.5 text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-amber-50/50 p-4 md:p-5 border border-amber-200/60 rounded-2xl shadow-xs">
          <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider font-sans">
            Pending Approval
          </div>
          <div className="text-2xl font-bold mt-1.5 text-amber-700">{stats.pending}</div>
        </div>
        <div className="bg-emerald-50/50 p-4 md:p-5 border border-emerald-200/60 rounded-2xl shadow-xs">
          <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-sans">
            Approved Volunteers
          </div>
          <div className="text-2xl font-bold mt-1.5 text-emerald-700">{stats.approved}</div>
        </div>
        <div className="bg-rose-50/50 p-4 md:p-5 border border-rose-200/60 rounded-2xl shadow-xs">
          <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider font-sans">
            Rejected Applications
          </div>
          <div className="text-2xl font-bold mt-1.5 text-rose-700">{stats.rejected}</div>
        </div>
      </div>

      {/* Print/PDF Page layout wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start print:block">
        {/* Table List (Left side, takes 2 cols) */}
        <div className="lg:col-span-2 space-y-4 print:hidden">
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full">
              <Search className="h-4 w-4 text-slate-400 flex-none" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs font-semibold focus:outline-hidden bg-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Status Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Location Filter
                </label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Cities</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Quick Date Filter
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none cursor-pointer"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions Panel */}
          {selectedIds.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3 animate-in slide-in-from-top duration-150">
              <span className="text-xs font-bold text-slate-700">
                {selectedIds.length} volunteers selected
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleBulkApprove}
                  disabled={isBulkLoading}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 border-0"
                >
                  Approve
                </button>
                <button
                  onClick={handleBulkReject}
                  disabled={isBulkLoading}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 border-0"
                >
                  Reject
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={isBulkLoading}
                  className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 bg-white"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleExportCSV(volunteers.filter(v => selectedIds.includes(v.id)))}
                  className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-white"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => handleExportExcel(volunteers.filter(v => selectedIds.includes(v.id)))}
                  className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-white"
                >
                  Excel
                </button>
              </div>
            </div>
          )}

          {/* List Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-4 w-10">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds(filtered.map(x => x.id));
                          else setSelectedIds([]);
                        }}
                        checked={filtered.length > 0 && selectedIds.length === filtered.length}
                      />
                    </th>
                    <th className="py-4 px-3 w-28">Application ID</th>
                    <th className="py-4 px-4">Applicant</th>
                    <th className="py-4 px-3">Applied</th>
                    <th className="py-4 px-3">Updated</th>
                    <th className="py-4 px-3 text-center">Email</th>
                    <th className="py-4 px-3 text-center">Phone</th>
                    <th className="py-4 px-3">Status</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="py-5 px-4"><div className="h-4 w-4 bg-slate-100 rounded" /></td>
                        <td className="py-5 px-3"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                        <td className="py-5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex-none" />
                            <div className="space-y-2">
                              <div className="h-4 w-28 bg-slate-100 rounded" />
                              <div className="h-3 w-36 bg-slate-100 rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-3"><div className="h-4 w-12 bg-slate-100 rounded" /></td>
                        <td className="py-5 px-3"><div className="h-4 w-12 bg-slate-100 rounded" /></td>
                        <td className="py-5 px-3 text-center"><div className="h-4 w-6 bg-slate-100 rounded mx-auto" /></td>
                        <td className="py-5 px-3 text-center"><div className="h-4 w-6 bg-slate-100 rounded mx-auto" /></td>
                        <td className="py-5 px-3"><div className="h-5 w-16 bg-slate-100 rounded-full" /></td>
                        <td className="py-5 px-4 text-right"><div className="h-8 w-8 bg-slate-100 rounded-lg ml-auto" /></td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-slate-400 font-bold">
                        No volunteer records match the filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((v) => {
                      const isSelected = selectedIds.includes(v.id);
                      return (
                        <tr
                          key={v.id}
                          onClick={() => setSelectedVol(v)}
                          className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                            selectedVol?.id === v.id ? "bg-primary/5" : ""
                          }`}
                        >
                          <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIds(prev => [...prev, v.id]);
                                } else {
                                  setSelectedIds(prev => prev.filter(x => x !== v.id));
                                }
                              }}
                            />
                          </td>
                          <td className="py-4 px-3 font-mono text-[10px] text-slate-400 font-bold select-all truncate max-w-[100px]">
                            {v.id.substring(0, 8).toUpperCase()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden flex-none">
                                {v.photoUrl ? (
                                  <img
                                    src={v.photoUrl}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <User className="h-4 w-4 text-slate-400" />
                                )}
                              </div>
                              <div>
                                <div className="text-slate-900 font-bold">{v.name}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{v.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-3 text-[10px] text-slate-500">
                            {v.created_at ? v.created_at.split("T")[0] : "N/A"}
                          </td>
                          <td className="py-4 px-3 text-[10px] text-slate-500">
                            {v.updated_at ? v.updated_at.split("T")[0] : "N/A"}
                          </td>
                          <td className="py-4 px-3 text-center">
                            {v.email ? (
                              <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px] font-bold">Verified</span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-4 px-3 text-center">
                            {v.phone ? (
                              <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px] font-bold">Verified</span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-4 px-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                (v.status || "pending") === "approved"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : (v.status || "pending") === "pending"
                                    ? "bg-amber-50 text-amber-600 border border-amber-100"
                                    : "bg-rose-50 text-rose-600 border border-rose-100"
                              }`}
                            >
                              {v.status || "pending"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setSelectedVol(v)}
                                className="h-7 w-16 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] font-bold cursor-pointer border-0"
                                title="View Details"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Inspector Sidebar / Profile Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5 print:border-none print:shadow-none print:p-0 print:w-full lg:col-span-1">
          {selectedVol ? (
            <>
              {/* Profile Card Header */}
              <div className="pb-4 border-b border-slate-100 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-none">
                    {selectedVol.photoUrl ? (
                      <img
                        src={selectedVol.photoUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-7 w-7 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-tight">
                      {selectedVol.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono font-bold mt-1 block">
                      ID: {selectedVol.id}
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    (selectedVol.status || "pending") === "approved"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : (selectedVol.status || "pending") === "pending"
                        ? "bg-amber-50 text-amber-600 border border-amber-100"
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                  }`}
                >
                  {selectedVol.status || "pending"}
                </span>
              </div>

              {/* Action Buttons based on status */}
              <div className="pt-2 flex flex-wrap gap-2 print:hidden">
                {(selectedVol.status || "pending") === "pending" ? (
                  <>
                    <button
                      onClick={() => handleApprove(selectedVol.id)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 border-0"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 border-0"
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      {(selectedVol.status || "pending") === "approved" ? (
                        <span className="text-emerald-600">✔ Approved</span>
                      ) : (
                        <span className="text-rose-600">✘ Rejected</span>
                      )}
                    </span>
                    <button
                      onClick={() => startEditing(selectedVol)}
                      className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 flex items-center gap-1 cursor-pointer border-0"
                    >
                      <Edit3 className="h-3 w-3" /> Edit
                    </button>
                  </div>
                )}
              </div>

              {/* PDF & Print actions */}
              <div className="flex items-center gap-2 print:hidden pt-1">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 border-0"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Profile
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 border-0"
                >
                  <Download className="h-3.5 w-3.5" /> Export PDF
                </button>
              </div>

              {/* Expanded Application Data Display */}
              <div className="space-y-4 text-xs font-semibold">
                {/* Section: Personal Info */}
                <div>
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">
                    Personal Information
                  </h4>
                  <div className="bg-slate-50/75 border border-slate-100 rounded-xl p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-1.5">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">DOB</span>
                        <span className="text-slate-800">
                          {getExtendedData(selectedVol).dob || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Gender</span>
                        <span className="text-slate-800">
                          {getExtendedData(selectedVol).gender || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-1.5">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">
                          Occupation
                        </span>
                        <span className="text-slate-800">
                          {getExtendedData(selectedVol).occupation || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">
                          Qualification
                        </span>
                        <span className="text-slate-800">
                          {selectedVol.education || "Graduate"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Skills</span>
                      <span className="text-slate-800">
                        {getExtendedData(selectedVol).skills || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Languages</span>
                      <span className="text-slate-800">
                        {getExtendedData(selectedVol).languages || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section: Contact & Location */}
                <div>
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">
                    Contact Details
                  </h4>
                  <div className="bg-slate-50/75 border border-slate-100 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{selectedVol.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{selectedVol.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-700">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <div>{selectedVol.address}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {getExtendedData(selectedVol).city}, {getExtendedData(selectedVol).state}{" "}
                          - {getExtendedData(selectedVol).pincode}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Preference & Motivation */}
                <div>
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">
                    Preference & Service Interest
                  </h4>
                  <div className="bg-slate-50/75 border border-slate-100 rounded-xl p-3 space-y-2">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">
                        Selected Role Interest
                      </span>
                      <span className="text-slate-900 flex items-center gap-1.5 mt-0.5 font-bold">
                        <Briefcase className="h-4 w-4 text-primary" /> {selectedVol.role}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-100/60">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">
                          Availability
                        </span>
                        <span className="text-slate-800">
                          {getExtendedData(selectedVol).availability || "Flexible"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">
                          Past Experience
                        </span>
                        <span className="text-slate-800">
                          {getExtendedData(selectedVol).experience || "None"}
                        </span>
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-slate-100/60">
                      <span className="text-[9px] text-slate-400 block uppercase">
                        Why do you want to join?
                      </span>
                      <p className="text-slate-700 mt-1 font-light italic leading-relaxed bg-white p-2 border border-slate-100 rounded-lg">
                        "{getExtendedData(selectedVol).whyJoin || "No statement added."}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section: Emergency Contact */}
                <div className="bg-rose-50/20 border border-rose-100/60 rounded-xl p-3">
                  <span className="text-[9px] text-rose-600 block uppercase tracking-wider font-bold">
                    Emergency Contact Detail
                  </span>
                  <div className="mt-1 text-slate-800 flex justify-between text-[11px] font-bold">
                    <span>{getExtendedData(selectedVol).emergencyName || "N/A"}</span>
                    <span className="text-slate-500 font-normal">
                      {getExtendedData(selectedVol).emergencyPhone || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Email Delivery Status */}
                <div>
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">
                    Notification Emails
                  </h4>
                  <div className="space-y-1.5">
                    {emailLogs.filter(l => l.recipient === selectedVol.email).length === 0 ? (
                      <div className="text-[10px] text-slate-400 italic bg-slate-50 rounded-xl p-3 border border-slate-100">
                        No notification emails dispatched yet.
                      </div>
                    ) : (
                      emailLogs.filter(l => l.recipient === selectedVol.email).map((log) => (
                        <div key={log.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-[11px]">
                          <div className="min-w-0">
                            <span className="font-bold text-slate-800 block truncate">{log.subject}</span>
                            <span className="text-[9px] text-slate-400 font-semibold block">{new Date(log.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5 ml-2">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                              log.status === "sent" ? "bg-emerald-50 text-emerald-700" :
                              log.status === "failed" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                            }`}>
                              {log.status === "sent" ? "Delivered" : log.status === "failed" ? "Failed" : log.status}
                            </span>
                            {(log.status === "failed" || log.status === "pending") && (
                              <button
                                onClick={() => handleRetryEmail(log.id)}
                                className="px-2 py-0.5 bg-primary text-white text-[8px] font-bold rounded hover:bg-primary/95 cursor-pointer border-0"
                              >
                                Retry
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Section: Activity Timeline */}
                <div>
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">
                    Activity Timeline
                  </h4>
                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-4">
                    {/* Step 1: Submission */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                        <div className="w-0.5 h-8 bg-slate-200" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-800 block">Application Submitted</span>
                        <span className="text-[9px] text-slate-400 font-semibold">{selectedVol.created_at ? new Date(selectedVol.created_at).toLocaleString() : ""}</span>
                      </div>
                    </div>

                    {/* Step 2: Review (Admin Viewed) */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">2</div>
                        <div className="w-0.5 h-8 bg-slate-200" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-800 block">Admin Reviewed</span>
                        <span className="text-[9px] text-slate-400 font-semibold">Checked Profile Details</span>
                      </div>
                    </div>

                    {/* Step 3: Approval / Rejection */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                          selectedVol.status === "approved" ? "bg-emerald-500" :
                          selectedVol.status === "rejected" ? "bg-rose-500" : "bg-slate-300"
                        }`}>
                          {selectedVol.status === "approved" ? "✓" : selectedVol.status === "rejected" ? "✗" : "3"}
                        </div>
                        <div className="w-0.5 h-8 bg-slate-200" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-800 block">
                          {selectedVol.status === "approved" ? "Approved Status" :
                           selectedVol.status === "rejected" ? "Rejected Status" : "Pending Status Decision"}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">Decision Completed</span>
                      </div>
                    </div>

                    {/* Step 4: Email Sent */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                          emailLogs.some(l => l.recipient === selectedVol.email && l.status === "sent") ? "bg-emerald-500" : "bg-slate-300"
                        }`}>
                          {emailLogs.some(l => l.recipient === selectedVol.email && l.status === "sent") ? "✓" : "4"}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-800 block">Status Email Sent</span>
                        <span className="text-[9px] text-slate-400 font-semibold">Auto Confirmation Dispatch</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Documents downloads */}
                <div className="space-y-2">
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold">
                    Uploaded Attachments
                  </h4>
                  {selectedVol.idProofUrl && (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-[11px] font-bold">
                      <div className="flex items-center gap-2 text-slate-700 min-w-0">
                        <FileText className="h-4 w-4 text-[#4040A1]" />
                        <span className="truncate">Identity Document</span>
                      </div>
                      <a
                        href={selectedVol.idProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline cursor-pointer"
                      >
                        View ID
                      </a>
                    </div>
                  )}
                  {getExtendedData(selectedVol).resumeUrl && (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-[11px] font-bold">
                      <div className="flex items-center gap-2 text-slate-700 min-w-0">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="truncate">Resume CV</span>
                      </div>
                      <a
                        href={getExtendedData(selectedVol).resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline cursor-pointer"
                      >
                        Download CV
                      </a>
                    </div>
                  )}
                </div>

                {/* Section: Internal Notes (Admin only) */}
                <div className="pt-3 border-t border-slate-100 space-y-2 print:hidden">
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" /> Reviewer Notes (Private)
                  </h4>

                  {/* Note List */}
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {!getExtendedData(selectedVol).notes ||
                    getExtendedData(selectedVol).notes.length === 0 ? (
                      <div className="text-[10px] text-slate-400 italic">
                        No reviewer notes added yet.
                      </div>
                    ) : (
                      getExtendedData(selectedVol).notes.map((n: any, i: number) => (
                        <div
                          key={i}
                          className="bg-slate-50 border border-slate-100 p-2 rounded-lg text-[10px] space-y-1"
                        >
                          <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                            <span>{n.admin}</span>
                            <span>{n.date ? n.date.split("T")[0] : ""}</span>
                          </div>
                          <p className="text-slate-700 leading-snug font-normal">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddNoteSubmit} className="flex gap-1.5 mt-2">
                    <input
                      type="text"
                      placeholder="Add private note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={submittingNote}
                      className="h-8 w-8 bg-primary hover:bg-primary/95 text-white rounded-lg flex items-center justify-center flex-none disabled:opacity-50 cursor-pointer border-0"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </form>
                </div>

                {/* Section: Timeline History */}
                <div className="pt-3 border-t border-slate-100 space-y-2 print:hidden">
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Action Timeline History
                  </h4>
                  <div className="space-y-3 pl-2 border-l border-slate-200 mt-2">
                    {getExtendedData(selectedVol).timeline?.map((t: any, i: number) => (
                      <div key={i} className="relative text-[10px]">
                        <div className="absolute -left-[12px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                        <div className="font-bold text-slate-800 flex justify-between">
                          <span>{t.action}</span>
                          <span className="text-[8px] text-slate-400 font-normal">
                            {t.date ? t.date.split("T")[0] : ""}
                          </span>
                        </div>
                        <p className="text-slate-500 font-normal mt-0.5">{t.notes}</p>
                        {t.admin && (
                          <span className="text-[8px] text-slate-400 italic">By: {t.admin}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2 print:hidden">
                <button
                  onClick={() => handleDelete(selectedVol.id)}
                  className="w-full py-2 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-white"
                >
                  <Trash2 className="h-4 w-4" /> Delete Application
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

      {/* EDIT MODAL DIALOG */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsEditing(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Edit Volunteer Details</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="h-8 w-8 rounded-lg hover:bg-slate-50 flex items-center justify-center border-0 cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileEdit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editFields.name}
                    onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editFields.email}
                    onChange={(e) => setEditFields({ ...editFields, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={editFields.phone}
                    onChange={(e) => setEditFields({ ...editFields, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">City</label>
                  <input
                    type="text"
                    value={editFields.city}
                    onChange={(e) => setEditFields({ ...editFields, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Qualification</label>
                  <input
                    type="text"
                    value={editFields.education}
                    onChange={(e) => setEditFields({ ...editFields, education: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Languages</label>
                  <input
                    type="text"
                    value={editFields.languages}
                    onChange={(e) => setEditFields({ ...editFields, languages: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Role Preference</label>
                  <input
                    type="text"
                    value={editFields.role}
                    onChange={(e) => setEditFields({ ...editFields, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Availability</label>
                  <input
                    type="text"
                    value={editFields.availability}
                    onChange={(e) => setEditFields({ ...editFields, availability: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Skills</label>
                  <input
                    type="text"
                    value={editFields.skills}
                    onChange={(e) => setEditFields({ ...editFields, skills: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Experience</label>
                  <input
                    type="text"
                    value={editFields.experience}
                    onChange={(e) => setEditFields({ ...editFields, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</label>
                <select
                  value={editFields.status}
                  onChange={(e) => setEditFields({ ...editFields, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none cursor-pointer text-xs"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/95 cursor-pointer border-0 shadow-sm shadow-primary/10"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal Dialog (Reason Prompt) */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Specify Rejection Reason</h3>
            <p className="text-xs text-slate-500 font-light">
              Enter the reason why this application is not accepted. This text will be automatically
              included in the applicant's status update email.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none resize-none"
              placeholder="e.g., We currently do not have vacancies in Teaching assistance roles..."
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border-0"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg border-0"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Volunteers;

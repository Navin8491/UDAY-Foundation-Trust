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
  Building2,
  Globe,
  Plus,
  Edit3,
  CheckSquare,
} from "lucide-react";
import {
  fetchPartnerships,
  updatePartnershipStatus,
  addPartnershipNote,
  deletePartnership,
  updatePartnershipDetails,
  fetchEmailStats,
  retryEmailLog,
} from "@/services/db";
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

  // New States
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState<any>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Load partnerships
  const loadPartnerships = async () => {
    try {
      setLoading(true);
      const items = await fetchPartnerships();
      if (items) {
        setCollabs(items);
        if (selectedCollab) {
          const updated = items.find((c) => c.id === selectedCollab.id);
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
    loadPartnerships();
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

  // Parse extended fields
  const getExtendedData = (c: any) => {
    if (!c) return {};
    const fromColumns = {
      website: c.website || "",
      address: c.address || "",
      proposal: c.proposal || c.message || "",
      notes: [],
      timeline: [],
    };
    if (!c.message) return fromColumns;
    try {
      const parsed = JSON.parse(c.message);
      if (parsed && typeof parsed === "object" && parsed.isExtended) {
        return {
          ...fromColumns,
          ...parsed,
          notes: parsed.notes || [],
          timeline: parsed.timeline || [],
        };
      }
    } catch (e) {}
    return fromColumns;
  };

  // Action Handlers
  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this partnership request?")) return;
    try {
      await updatePartnershipStatus(id, "approved");
      toast.success("Partnership request approved successfully.");
      loadPartnerships();
      loadEmailLogs();
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
      loadEmailLogs();
    } catch (e: any) {
      toast.error(e.message || "Failed to reject request.");
    }
  };

  const handleMarkPending = async (id: string) => {
    try {
      await updatePartnershipStatus(id, "pending");
      toast.success("Inquiry marked back as Pending.");
      loadPartnerships();
      loadEmailLogs();
    } catch (e: any) {
      toast.error(e.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "CRITICAL WARNING: Are you sure you want to permanently delete this partnership record? This cannot be undone.",
      )
    )
      return;
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

  // Profile Edit Save
  const handleSaveProfileEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollab) return;
    try {
      await updatePartnershipDetails(selectedCollab.id, editFields);
      toast.success("Partnership details updated successfully.");
      setIsEditing(false);
      loadPartnerships();
    } catch (err: any) {
      toast.error(err.message || "Failed to update details.");
    }
  };

  const startEditing = (collab: any) => {
    const ext = getExtendedData(collab);
    setEditFields({
      orgName: collab.orgName || "",
      contactName: collab.contactName || "",
      email: collab.email || "",
      phone: collab.phone || "",
      website: ext.website || "",
      type: collab.type || "Corporate",
      proposal: ext.proposal || "",
      address: ext.address || "",
      status: collab.status || "pending",
    });
    setIsEditing(true);
  };

  // Bulk Actions
  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to approve all ${selectedIds.length} selected partnership inquiries?`)) return;
    setIsBulkLoading(true);
    let successCount = 0;
    for (const id of selectedIds) {
      try {
        await updatePartnershipStatus(id, "approved");
        successCount++;
      } catch (err) {
        console.error(`Failed to approve partnership ID ${id}:`, err);
      }
    }
    toast.success(`Successfully approved ${successCount} partnerships.`);
    setSelectedIds([]);
    setIsBulkLoading(false);
    loadPartnerships();
    loadEmailLogs();
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    const reason = prompt(`Enter rejection reason for ${selectedIds.length} selected partnership inquiries:`);
    if (reason === null) return;
    setIsBulkLoading(true);
    let successCount = 0;
    for (const id of selectedIds) {
      try {
        await updatePartnershipStatus(id, "rejected", reason);
        successCount++;
      } catch (err) {
        console.error(`Failed to reject partnership ID ${id}:`, err);
      }
    }
    toast.success(`Successfully rejected ${successCount} partnerships.`);
    setSelectedIds([]);
    setIsBulkLoading(false);
    loadPartnerships();
    loadEmailLogs();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`CRITICAL WARNING: Are you sure you want to permanently delete all ${selectedIds.length} selected partnership inquiries? This cannot be undone.`)) return;
    setIsBulkLoading(true);
    let successCount = 0;
    for (const id of selectedIds) {
      try {
        await deletePartnership(id);
        successCount++;
      } catch (err) {
        console.error(`Failed to delete partnership ID ${id}:`, err);
      }
    }
    toast.success(`Successfully deleted ${successCount} partnerships.`);
    setSelectedIds([]);
    setIsBulkLoading(false);
    loadPartnerships();
  };

  // Exports
  const handleExportCSV = (records: any[]) => {
    const headers = ["ID", "Organization", "Contact Name", "Email", "Phone", "Partnership Type", "Status", "Applied At"];
    const rows = records.map(r => {
      return [
        r.id,
        r.orgName,
        r.contactName,
        r.email,
        r.phone,
        r.type || "Corporate",
        r.status || "pending",
        r.created_at ? r.created_at.split("T")[0] : ""
      ];
    });
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `partnerships_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully");
  };

  const handleExportExcel = (records: any[]) => {
    const rows = records.map(r => {
      return `
        <tr>
          <td>${r.id}</td>
          <td>${r.orgName}</td>
          <td>${r.contactName}</td>
          <td>${r.email}</td>
          <td>${r.phone}</td>
          <td>${r.type || "Corporate"}</td>
          <td>${r.status || "pending"}</td>
          <td>${r.created_at ? r.created_at.split("T")[0] : ""}</td>
        </tr>
      `;
    }).join("");

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Partnerships</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
      <body>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Organization</th>
              <th>Contact Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Partnership Type</th>
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
    link.setAttribute("download", `partnerships_export_${new Date().toISOString().split("T")[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel exported successfully");
  };

  const handlePrint = () => {
    if (!selectedCollab) return;
    window.print();
  };

  // Stats computation
  const stats = {
    total: collabs.length,
    pending: collabs.filter((c) => c.status === "pending" || !c.status).length,
    approved: collabs.filter((c) => c.status === "approved").length,
    rejected: collabs.filter((c) => c.status === "rejected").length,
  };

  // Filters logic
  const filtered = collabs.filter((c) => {
    const searchLower = search.toLowerCase();

    const matchesSearch =
      (c.orgName || "").toLowerCase().includes(searchLower) ||
      (c.contactName || "").toLowerCase().includes(searchLower) ||
      (c.email || "").toLowerCase().includes(searchLower) ||
      (c.phone || "").toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "all" || (c.status || "pending") === statusFilter;

    const matchesType =
      typeFilter === "all" || (c.type || "").toLowerCase() === typeFilter.toLowerCase();

    let matchesDate = true;
    if (dateFilter) {
      if (dateFilter === "today") {
        const todayStr = new Date().toISOString().split("T")[0];
        matchesDate = !!c.created_at && c.created_at.split("T")[0] === todayStr;
      } else if (dateFilter === "week") {
        const createdDate = new Date(c.created_at).getTime();
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        matchesDate = createdDate >= oneWeekAgo;
      } else if (dateFilter === "month") {
        const createdDate = new Date(c.created_at).getTime();
        const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        matchesDate = createdDate >= oneMonthAgo;
      } else {
        matchesDate = !!c.created_at && c.created_at.split("T")[0] === dateFilter;
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Partnership Management</h1>
        <p className="text-sm text-slate-500 font-medium font-gujarati">
          કોર્પોરેટ CSR ફંડ અને શૈક્ષણિક સંસ્થાઓનું જોડાણ
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 font-gujarati">
        <div className="bg-white p-4 md:p-5 border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
            Total Inquiries
          </div>
          <div className="text-2xl font-bold mt-1.5 text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-amber-50/50 p-4 md:p-5 border border-amber-200/60 rounded-2xl shadow-xs">
          <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider font-sans">
            Pending Review
          </div>
          <div className="text-2xl font-bold mt-1.5 text-amber-700">{stats.pending}</div>
        </div>
        <div className="bg-emerald-50/50 p-4 md:p-5 border border-emerald-200/60 rounded-2xl shadow-xs">
          <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-sans">
            Approved Partnerships
          </div>
          <div className="text-2xl font-bold mt-1.5 text-emerald-700">{stats.approved}</div>
        </div>
        <div className="bg-rose-50/50 p-4 md:p-5 border border-rose-200/60 rounded-2xl shadow-xs">
          <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider font-sans">
            Declined Requests
          </div>
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
                  Org Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none cursor-pointer"
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
                {selectedIds.length} partners selected
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
                  onClick={() => handleExportCSV(collabs.filter(c => selectedIds.includes(c.id)))}
                  className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-white"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => handleExportExcel(collabs.filter(c => selectedIds.includes(c.id)))}
                  className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-white"
                >
                  Excel
                </button>
              </div>
            </div>
          )}

          {/* Table */}
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
                    <th className="py-4 px-4">Organization</th>
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
                        No partnership requests found matching the filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => {
                      const isSelected = selectedIds.includes(c.id);
                      return (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedCollab(c)}
                          className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                            selectedCollab?.id === c.id ? "bg-primary/5" : ""
                          }`}
                        >
                          <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIds(prev => [...prev, c.id]);
                                } else {
                                  setSelectedIds(prev => prev.filter(x => x !== c.id));
                                }
                              }}
                            />
                          </td>
                          <td className="py-4 px-3 font-mono text-[10px] text-slate-400 font-bold select-all truncate max-w-[100px]">
                            {c.id.substring(0, 8).toUpperCase()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-none">
                                <Building2 className="h-4 w-4 text-slate-400" />
                              </div>
                              <div>
                                <div className="text-slate-900 font-bold">{c.orgName}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{c.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-3 text-[10px] text-slate-500">
                            {c.created_at ? c.created_at.split("T")[0] : "N/A"}
                          </td>
                          <td className="py-4 px-3 text-[10px] text-slate-500">
                            {c.updated_at ? c.updated_at.split("T")[0] : "N/A"}
                          </td>
                          <td className="py-4 px-3 text-center">
                            {c.email ? (
                              <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px] font-bold">Verified</span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-4 px-3 text-center">
                            {c.phone ? (
                              <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px] font-bold">Verified</span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-4 px-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                (c.status || "pending") === "approved"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : (c.status || "pending") === "pending"
                                    ? "bg-amber-50 text-amber-600 border border-amber-100"
                                    : "bg-rose-50 text-rose-600 border border-rose-100"
                              }`}
                            >
                              {c.status || "pending"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setSelectedCollab(c)}
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
                    <h3 className="font-bold text-sm text-slate-800 leading-snug">
                      {selectedCollab.orgName}
                    </h3>
                    <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                      ID: {selectedCollab.id}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    (selectedCollab.status || "pending") === "approved"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : (selectedCollab.status || "pending") === "pending"
                        ? "bg-amber-50 text-amber-600 border border-amber-100"
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                  }`}
                >
                  {selectedCollab.status || "pending"}
                </span>
              </div>

              {/* Action Buttons based on status */}
              <div className="pt-2 flex flex-wrap gap-2 print:hidden">
                {(selectedCollab.status || "pending") === "pending" ? (
                  <>
                    <button
                      onClick={() => handleApprove(selectedCollab.id)}
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
                      {(selectedCollab.status || "pending") === "approved" ? (
                        <span className="text-emerald-600">✔ Approved</span>
                      ) : (
                        <span className="text-rose-600">✘ Rejected</span>
                      )}
                    </span>
                    <button
                      onClick={() => startEditing(selectedCollab)}
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
                  <Printer className="h-3.5 w-3.5" /> Print Inquiry
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 border-0"
                >
                  <Download className="h-3.5 w-3.5" /> Export PDF
                </button>
              </div>

              {/* Data Rows */}
              <div className="space-y-4 text-xs font-semibold">
                {/* Organization details */}
                <div>
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">
                    Organization info
                  </h4>
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
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">
                    Contact Representative
                  </h4>
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
                      <span>
                        {getExtendedData(selectedCollab).address || selectedCollab.address || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proposal statement */}
                <div>
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">
                    Proposal Statement
                  </h4>
                  <div className="bg-slate-50/75 border border-slate-100 rounded-xl p-3">
                    <p className="text-slate-700 leading-relaxed font-light italic bg-white p-2 border border-slate-100 rounded-lg">
                      "{getExtendedData(selectedCollab).proposal || "No description provided."}"
                    </p>
                  </div>
                </div>

                {/* Attachment */}
                {selectedCollab.documentUrl && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold">
                      Uploaded Proposal Documents
                    </h4>
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

                {/* Email Delivery Status */}
                <div>
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">
                    Notification Emails
                  </h4>
                  <div className="space-y-1.5">
                    {emailLogs.filter(l => l.recipient === selectedCollab.email).length === 0 ? (
                      <div className="text-[10px] text-slate-400 italic bg-slate-50 rounded-xl p-3 border border-slate-100">
                        No notification emails dispatched yet.
                      </div>
                    ) : (
                      emailLogs.filter(l => l.recipient === selectedCollab.email).map((log) => (
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
                        <span className="text-[10px] font-bold text-slate-800 block">Proposal Submitted</span>
                        <span className="text-[9px] text-slate-400 font-semibold">{selectedCollab.created_at ? new Date(selectedCollab.created_at).toLocaleString() : ""}</span>
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
                        <span className="text-[9px] text-slate-400 font-semibold">Proposal Pitch Audited</span>
                      </div>
                    </div>

                    {/* Step 3: Approval / Rejection */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                          selectedCollab.status === "approved" ? "bg-emerald-500" :
                          selectedCollab.status === "rejected" ? "bg-rose-500" : "bg-slate-300"
                        }`}>
                          {selectedCollab.status === "approved" ? "✓" : selectedCollab.status === "rejected" ? "✗" : "3"}
                        </div>
                        <div className="w-0.5 h-8 bg-slate-200" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-800 block">
                          {selectedCollab.status === "approved" ? "Approved Partnership" :
                           selectedCollab.status === "rejected" ? "Declined Partnership" : "Pending Status Decision"}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">Decision Completed</span>
                      </div>
                    </div>

                    {/* Step 4: Email Sent */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                          emailLogs.some(l => l.recipient === selectedCollab.email && l.status === "sent") ? "bg-emerald-500" : "bg-slate-300"
                        }`}>
                          {emailLogs.some(l => l.recipient === selectedCollab.email && l.status === "sent") ? "✓" : "4"}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-800 block">Status Email Sent</span>
                        <span className="text-[9px] text-slate-400 font-semibold">Auto Confirmation Dispatch</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="pt-3 border-t border-slate-100 space-y-2 print:hidden">
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" /> Private Review Notes
                  </h4>

                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {!getExtendedData(selectedCollab).notes ||
                    getExtendedData(selectedCollab).notes.length === 0 ? (
                      <div className="text-[10px] text-slate-400 italic">No notes added.</div>
                    ) : (
                      getExtendedData(selectedCollab).notes.map((n: any, i: number) => (
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

                {/* Timeline */}
                <div className="pt-3 border-t border-slate-100 space-y-2 print:hidden">
                  <h4 className="text-[10px] text-primary uppercase tracking-widest font-bold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Action Timeline History
                  </h4>
                  <div className="space-y-3 pl-2 border-l border-slate-200 mt-2">
                    {getExtendedData(selectedCollab).timeline?.map((t: any, i: number) => (
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
                  onClick={() => handleDelete(selectedCollab.id)}
                  className="w-full py-2 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-white"
                >
                  <Trash2 className="h-4 w-4" /> Delete Request
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

      {/* EDIT MODAL DIALOG */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsEditing(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Edit Partnership Details</h3>
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
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={editFields.orgName}
                    onChange={(e) => setEditFields({ ...editFields, orgName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={editFields.contactName}
                    onChange={(e) => setEditFields({ ...editFields, contactName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Website</label>
                  <input
                    type="text"
                    value={editFields.website}
                    onChange={(e) => setEditFields({ ...editFields, website: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Org Type</label>
                  <select
                    value={editFields.type}
                    onChange={(e) => setEditFields({ ...editFields, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none cursor-pointer text-xs"
                  >
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
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Address</label>
                <input
                  type="text"
                  value={editFields.address}
                  onChange={(e) => setEditFields({ ...editFields, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Proposal Statement</label>
                <textarea
                  rows={3}
                  value={editFields.proposal}
                  onChange={(e) => setEditFields({ ...editFields, proposal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none resize-none"
                />
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
            <h3 className="text-sm font-bold text-slate-900">Specify Decline Reason</h3>
            <p className="text-xs text-slate-500 font-light">
              Enter the reason why this partnership inquiry is declined. This text will be
              automatically included in the client's status update email.
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
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border-0"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg border-0"
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

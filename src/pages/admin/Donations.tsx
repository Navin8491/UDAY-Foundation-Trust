import { useState, useEffect } from "react";
import { Search, Download, Eye, FileSpreadsheet, X, Check, Clock, ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";
import { subscribePaymentEvents, refundPaymentEvent } from "@/services/db";
import { toast } from "sonner";

export function Donations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [donationsList, setDonationsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundLoading, setRefundLoading] = useState(false);

  const getStatusLabel = (status: string) => {
    if (["COMPLETED", "DONATION_SAVED", "EMAIL_SENT", "ADMIN_NOTIFIED"].includes(status)) return "Success";
    if (status === "FAILED") return "Failed";
    if (status === "REFUNDED" || status === "REFUND_INITIATED" || status === "REFUND_FAILED") return "Refunded";
    return "Pending";
  };

  useEffect(() => {
    const unsubscribe = subscribePaymentEvents((items) => {
      setLoading(true);
      if (items) {
        const mapped = items.map((item: any) => ({
          id: item.id,
          idempotencyKey: item.idempotency_key,
          paymentId: item.payment_id,
          donor: item.donor_name,
          email: item.email,
          phone: item.phone,
          pan: item.pan_number,
          amount: Number(item.amount),
          date: item.created_at ? item.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          type: item.payment_id ? (item.payment_id.startsWith("mock_") ? "Mock Gateway" : "Online Gateway") : "Direct UPI",
          status: getStatusLabel(item.current_state),
          rawStatus: item.current_state,
          project: item.purpose || "General Donation",
          lastError: item.last_error,
          retryCount: item.retry_count,
        }));
        setDonationsList(mapped);
      } else {
        setDonationsList([]);
      }
      setLoading(false);
    }, (err) => {
      console.error("subscribePaymentEvents in admin Donations.tsx failed:", err);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedDonation) {
      document.body.classList.add("body-scroll-lock");
    } else {
      document.body.classList.remove("body-scroll-lock");
    }
    return () => {
      document.body.classList.remove("body-scroll-lock");
    };
  }, [selectedDonation]);

  const filtered = donationsList.filter((d) => {
    const matchesSearch = d.donor.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics computations
  const totalDonations = donationsList
    .filter((d) => d.status === "Success")
    .reduce((sum, d) => sum + d.amount, 0);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayDonations = donationsList
    .filter((d) => d.status === "Success" && d.date === todayStr)
    .reduce((sum, d) => sum + d.amount, 0);

  const currentMonthStr = new Date().toISOString().substring(0, 7); // YYYY-MM
  const monthlyDonations = donationsList
    .filter((d) => d.status === "Success" && d.date.startsWith(currentMonthStr))
    .reduce((sum, d) => sum + d.amount, 0);

  const pendingPayments = donationsList.filter((d) => d.status === "Pending").length;
  const failedPayments = donationsList.filter((d) => d.status === "Failed").length;
  const refundCount = donationsList.filter((d) => d.status === "Refunded").length;

  const handleExportCSV = () => {
    // Generate CSV content from donationsList
    const headers = ["Donation ID", "Donor Name", "Email", "Phone", "PAN", "Amount", "Date", "Payment Type", "Status", "Project"];
    const rows = donationsList.map(d => [
      d.id,
      `"${d.donor.replace(/"/g, '""')}"`,
      d.email,
      d.phone,
      d.pan,
      d.amount,
      d.date,
      d.type,
      d.status,
      `"${d.project.replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `uday_donations_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully!");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Donations</h1>
          <p className="text-sm text-slate-500 font-medium font-gujarati">ટ્રસ્ટના મળેલા નાણાકીય દાન અને ફંડનું મેનેજમેન્ટ</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn-primary text-xs py-2.5 px-4 cursor-pointer self-start sm:self-center"
        >
          <FileSpreadsheet className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: "Today's Donations", value: `₹${todayDonations.toLocaleString("en-IN")}`, desc: "Today's success", color: "text-[#7A9D1C] bg-[#7A9D1C]/10" },
          { title: "Monthly Donations", value: `₹${monthlyDonations.toLocaleString("en-IN")}`, desc: "This Month", color: "text-blue-600 bg-blue-50" },
          { title: "Total Donations", value: `₹${totalDonations.toLocaleString("en-IN")}`, desc: "Cumulative", color: "text-emerald-600 bg-emerald-50" },
          { title: "Pending Sessions", value: pendingPayments.toString(), desc: "In progress", color: "text-amber-600 bg-amber-50" },
          { title: "Failed Attempts", value: failedPayments.toString(), desc: "Unpaid / Error", color: "text-rose-600 bg-rose-50" },
          { title: "Refunded Trans.", value: refundCount.toString(), desc: "Compensated", color: "text-purple-600 bg-purple-50" },
        ].map((c, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block leading-tight">{c.title}</span>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-sm md:text-base font-bold text-slate-900 leading-tight">{c.value}</span>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${c.color} self-start sm:self-auto`}>{c.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs justify-between">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-80">
          <Search className="h-4 w-4 text-slate-400 flex-none" />
          <input
            type="text"
            placeholder="Search donor or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-semibold focus:outline-hidden bg-transparent"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start overflow-x-auto max-w-full no-scrollbar pb-1 md:pb-0">
          {["All", "Success", "Pending", "Failed", "Refunded"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Donor</th>
                <th className="py-4 px-6">Project Area</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-6 px-6"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                    <td className="py-6 px-6">
                      <div className="space-y-2">
                        <div className="h-4 w-28 bg-slate-100 rounded" />
                        <div className="h-3 w-36 bg-slate-100 rounded" />
                      </div>
                    </td>
                    <td className="py-6 px-6"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                    <td className="py-6 px-6"><div className="h-4 w-12 bg-slate-100 rounded" /></td>
                    <td className="py-6 px-6"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                    <td className="py-6 px-6"><div className="h-4 w-12 bg-slate-100 rounded" /></td>
                    <td className="py-6 px-6"><div className="h-5 w-16 bg-slate-100 rounded-full" /></td>
                    <td className="py-6 px-6 text-right"><div className="h-8 w-8 bg-slate-100 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-bold">
                    No donation records found matching search query.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-900 select-all">{d.id.substring(0, 8)}...</td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="text-slate-900 font-bold">{d.donor}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{d.email}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{d.phone} • PAN: <span className="uppercase text-primary font-bold">{d.pan}</span></div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{d.project}</td>
                    <td className="py-4 px-6 text-slate-900 font-bold">₹{d.amount.toLocaleString("en-IN")}</td>
                    <td className="py-4 px-6">{d.date}</td>
                    <td className="py-4 px-6">{d.type}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        d.status === "Success"
                          ? "bg-emerald-50 text-emerald-600"
                          : d.status === "Pending"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-rose-50 text-rose-600"
                      }`}>
                        {d.status === "Success" && <Check className="h-3 w-3" />}
                        {d.status === "Pending" && <Clock className="h-3 w-3" />}
                        {d.status === "Failed" && <X className="h-3 w-3" />}
                        {d.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDonation(d)}
                          className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (d.status === "Success") {
                              window.open(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/payments/receipt/${d.id}`, "_blank");
                            } else {
                              toast.error("Receipts can only be generated for successful payments.");
                            }
                          }}
                          className={`h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                            d.status === "Success" 
                              ? "hover:bg-slate-100 text-slate-400 hover:text-slate-600" 
                              : "text-slate-200 cursor-not-allowed"
                          }`}
                          disabled={d.status !== "Success"}
                          title="Download Receipt"
                        >
                          <Download className="h-4 w-4" />
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

      {/* Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="h-5 w-5 text-primary" /> Transaction Details
              </h3>
              <button
                onClick={() => setSelectedDonation(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body (scrollable) */}
            <div className="p-6 space-y-4 text-xs font-semibold overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Transaction ID</span>
                  <span className="font-mono text-slate-900 text-sm select-all">{selectedDonation.id.substring(0, 18)}...</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Current State</span>
                  <span className="font-mono text-primary text-sm uppercase">{selectedDonation.rawStatus}</span>
                </div>
              </div>

              {selectedDonation.lastError && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2 text-rose-600">
                  <AlertTriangle className="h-4.5 w-4.5 flex-none mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-[10px] uppercase">Last Registered Error</span>
                    <p className="text-[10px] font-medium leading-relaxed font-mono">{selectedDonation.lastError}</p>
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Idempotency Key</span>
                <span className="font-mono text-slate-600 text-xs block truncate select-all">{selectedDonation.idempotencyKey}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Donor Name</span>
                <span className="text-slate-900 text-sm">{selectedDonation.donor}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Email Address</span>
                  <span className="text-slate-900 text-xs select-all truncate block">{selectedDonation.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Phone Number</span>
                  <span className="text-slate-900 text-xs select-all block">{selectedDonation.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">PAN Card Number</span>
                  <span className="text-slate-900 font-mono text-sm uppercase tracking-wider font-bold text-[#7A9D1C] select-all">{selectedDonation.pan || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Donated To</span>
                  <span className="text-slate-900 text-sm">{selectedDonation.project}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Amount</span>
                  <span className="text-emerald-600 text-base font-bold">₹{selectedDonation.amount.toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Payment Mode</span>
                  <span className="text-slate-900 text-sm">{selectedDonation.type}</span>
                </div>
              </div>

              {/* State Transition Timeline */}
              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">Saga Transition Timeline</span>
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500 overflow-x-auto pb-1">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100">Initiated</span>
                  <ArrowRight className="h-3 w-3 text-slate-300" />
                  <span className={`px-2 py-0.5 rounded-md ${selectedDonation.rawStatus !== 'INITIATED' ? 'bg-slate-100' : 'bg-primary/10 text-primary font-bold'}`}>Checkout</span>
                  <ArrowRight className="h-3 w-3 text-slate-300" />
                  <span className={`px-2 py-0.5 rounded-md ${['CHARGED', 'PAYMENT_VERIFIED', 'DONATION_SAVED', 'EMAIL_SENT', 'ADMIN_NOTIFIED', 'COMPLETED'].includes(selectedDonation.rawStatus) ? 'bg-slate-100' : 'bg-primary/10 text-primary font-bold'}`}>Charged</span>
                  <ArrowRight className="h-3 w-3 text-slate-300" />
                  <span className={`px-2 py-0.5 rounded-md ${selectedDonation.status === 'Success' ? 'bg-emerald-50 text-emerald-600 font-bold' : selectedDonation.status === 'Refunded' ? 'bg-purple-50 text-purple-600 font-bold' : selectedDonation.status === 'Failed' ? 'bg-rose-50 text-rose-600 font-bold' : 'bg-slate-100'}`}>
                    {selectedDonation.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Modal Footer (fixed) */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-2">
              {selectedDonation.status === "Success" && (
                <>
                  <button
                    onClick={() => {
                      window.open(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/payments/receipt/${selectedDonation.id}`, "_blank");
                    }}
                    className="flex-1 btn-primary text-xs py-2.5 px-4 cursor-pointer"
                  >
                    Download PDF Receipt
                  </button>
                  <button
                    onClick={async () => {
                      if (refundLoading) return;
                      if (window.confirm(`Are you sure you want to issue a refund of ₹${selectedDonation.amount.toLocaleString("en-IN")} for ${selectedDonation.donor}?`)) {
                        setRefundLoading(true);
                        try {
                          await refundPaymentEvent(selectedDonation.id);
                          toast.success("Refund process initiated!");
                          setSelectedDonation(null);
                        } catch (err: any) {
                          toast.error(err.message || "Failed to trigger refund.");
                        } finally {
                          setRefundLoading(false);
                        }
                      }
                    }}
                    disabled={refundLoading}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-xs py-2.5 px-4 rounded-xl cursor-pointer font-bold transition-colors disabled:opacity-50"
                  >
                    {refundLoading ? "Refunding..." : "Issue Refund"}
                  </button>
                </>
              )}
              {selectedDonation.status !== "Success" && (
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="w-full btn-ghost border border-slate-200 text-xs py-2.5 px-4 cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default Donations;

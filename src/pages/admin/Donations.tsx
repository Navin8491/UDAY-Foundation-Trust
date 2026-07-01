import { useState, useEffect } from "react";
import { Search, Download, Eye, FileSpreadsheet, X, Check, Clock } from "lucide-react";
import { subscribeDonations } from "@/services/db";

// Mock Donations
const MOCK_DONATIONS = [
  { id: "DON-001", donor: "Aarav Sharma", email: "aarav@example.com", phone: "+91 98765 01234", pan: "AWKPB8274Q", amount: 15000, date: "2026-06-25", type: "Online", status: "Success", project: "Healthcare Services" },
  { id: "DON-002", donor: "Niyati Patel", email: "niyati@example.com", phone: "+91 96112 34567", pan: "BZHPP4829A", amount: 2500, date: "2026-06-24", type: "Online", status: "Success", project: "Education Support" },
  { id: "DON-003", donor: "Reliance CSR", email: "csr@reliance.com", phone: "+91 22 2278 5000", pan: "AAACR1084N", amount: 500000, date: "2026-06-20", type: "Bank Transfer", status: "Success", project: "Tree Plantation Drive" },
  { id: "DON-004", donor: "Devendra Bauddh", email: "devendra@example.com", phone: "+91 96246 68484", pan: "CTDPD9281Z", amount: 10000, date: "2026-06-18", type: "Cheque", status: "Pending", project: "General Welfare" },
  { id: "DON-005", donor: "Vikram Rathod", email: "vikram@example.com", phone: "+91 98980 12345", pan: "DMKPB0283J", amount: 500, date: "2026-06-15", type: "Online", status: "Success", project: "Education Support" },
  { id: "DON-006", donor: "Meena Mehta", email: "meena@example.com", phone: "+91 99099 54321", pan: "EKKPA9021Y", amount: 12000, date: "2026-06-10", type: "Online", status: "Success", project: "Healthcare Services" },
  { id: "DON-007", donor: "Adani CSR Team", email: "csr@adani.com", phone: "+91 79 2656 5555", pan: "AAACA7208K", amount: 250000, date: "2026-06-05", type: "Bank Transfer", status: "Success", project: "Rural Infrastructure" },
  { id: "DON-008", donor: "Rohan Vaghela", email: "rohan@example.com", phone: "+91 97123 98765", pan: "FMLPA2810C", amount: 1500, date: "2026-06-02", type: "Online", status: "Failed", project: "General Welfare" },
];

export function Donations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDonation, setSelectedDonation] = useState<typeof MOCK_DONATIONS[0] | null>(null);
  const [donationsList, setDonationsList] = useState(MOCK_DONATIONS);

  useEffect(() => {
    const unsubscribe = subscribeDonations((items) => {
      if (items && items.length > 0) {
        const mapped = items.map((item: any) => ({
          id: item.id || item.receiptNumber,
          donor: item.donorName,
          email: item.email,
          phone: item.phone,
          pan: item.panNumber,
          amount: item.amount,
          date: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          type: "Online",
          status: "Success",
          project: item.purpose || "General Donation",
        }));
        setDonationsList(mapped);
      } else {
        setDonationsList(MOCK_DONATIONS);
      }
    }, (err) => {
      console.error("subscribeDonations in admin Donations.tsx failed:", err);
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

  const handleExportCSV = () => {
    alert("CSV Export Simulated!\nMock data file 'uday_donations_export.csv' successfully downloaded to your local device.");
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

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs justify-between">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-80">
          <Search className="h-4 w-4 text-slate-400 flex-none" />
          <input
            type="text"
            placeholder="Search donor or donation ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-semibold focus:outline-hidden bg-transparent"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start overflow-x-auto max-w-full no-scrollbar pb-1 md:pb-0">
          {["All", "Success", "Pending", "Failed"].map((status) => (
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-bold">
                    No donation records found matching search query.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-900">{d.id}</td>
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
                          onClick={() => alert(`Receipt downloaded for ${d.id}`)}
                          className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
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
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">Donation Details</h3>
              <button
                onClick={() => setSelectedDonation(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body (scrollable) */}
            <div className="p-6 space-y-4 text-xs font-semibold overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Receipt ID</span>
                  <span className="font-mono text-slate-900 text-sm">{selectedDonation.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Status</span>
                  <span className="text-slate-900 text-sm">{selectedDonation.status}</span>
                </div>
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
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">PAN Card Number</span>
                <span className="text-slate-900 font-mono text-sm uppercase tracking-wider font-bold text-primary select-all">{selectedDonation.pan}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Donated To</span>
                <span className="text-slate-900 text-sm">{selectedDonation.project}</span>
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
            </div>
            
            {/* Modal Footer (fixed) */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-2">
              <button
                onClick={() => alert(`Receipt downloaded for ${selectedDonation.id}`)}
                className="flex-1 btn-primary text-xs py-2.5 px-4 cursor-pointer"
              >
                Download PDF Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default Donations;

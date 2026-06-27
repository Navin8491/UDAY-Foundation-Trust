import { useState } from "react";
import { Search, Mail, MailOpen, Trash2, Eye, X, Phone, User, Send, Check } from "lucide-react";

const INITIAL_MESSAGES = [
  { id: "MSG-201", name: "Ramesh Patel", email: "ramesh@example.com", phone: "+91 96245 12345", subject: "Sponsoring School Kits", date: "2026-06-27", status: "Unread", text: "We want to sponsor school bags and stationery kits for 100 students in the upcoming academic drive in Sanand." },
  { id: "MSG-202", name: "Jaya Shah", email: "jaya@example.com", phone: "+91 98250 54321", subject: "Medical Camp Location Inquiry", date: "2026-06-25", status: "Read", text: "Could you please share the upcoming dental check-up camp details? My family wants to join as helper volunteers." },
  { id: "MSG-203", name: "Ketan Vora", email: "ketan@example.com", phone: "+91 99799 98765", subject: "80G Receipt Delay", date: "2026-06-22", status: "Read", text: "I made a donation of ₹5,000 on June 15th but have not received the tax exemption certificate yet. Please check." },
  { id: "MSG-204", name: "Nila Bauddh", email: "nila@example.com", phone: "+91 97243 11223", subject: "Women self-help groups", date: "2026-06-18", status: "Read", text: "I want to donate two sewing machines to the Uday trust training facility in Ahmedabad. Please contact." },
];

export function ContactMessages() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [search, setSearch] = useState("");
  const [selectedMsg, setSelectedMsg] = useState<typeof INITIAL_MESSAGES[0] | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleOpenMessage = (msg: typeof INITIAL_MESSAGES[0]) => {
    setSelectedMsg(msg);
    setMessages(messages.map((m) => (m.id === msg.id ? { ...m, status: "Read" } : m)));
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mock email reply successfully sent to ${selectedMsg?.email}!\nMessage: "${replyText}"`);
    setReplyText("");
    setSelectedMsg(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this message record?")) {
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg(null);
      }
    }
  };

  const filtered = messages.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Contact Messages</h1>
        <p className="text-sm text-slate-500 font-medium font-gujarati">વેબસાઇટ પરથી મળેલા પૂછપરછ પત્રો અને પ્રતિભાવો</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Table List (Left side, takes 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs justify-between">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full">
              <Search className="h-4 w-4 text-slate-400 flex-none" />
              <input
                type="text"
                placeholder="Search sender name or subject tag..."
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
                    <th className="py-4 px-5">Sender</th>
                    <th className="py-4 px-5">Subject</th>
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 font-bold">
                        No contact messages found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((m) => (
                      <tr
                        key={m.id}
                        onClick={() => handleOpenMessage(m)}
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                          m.status === "Unread" ? "bg-[#4040A1]/5 font-bold" : ""
                        } ${selectedMsg?.id === m.id ? "bg-[#4040A1]/8" : ""}`}
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2.5">
                            {m.status === "Unread" ? (
                              <Mail className="h-4 w-4 text-primary flex-none" />
                            ) : (
                              <MailOpen className="h-4 w-4 text-slate-400 flex-none" />
                            )}
                            <div className="min-w-0">
                              <div className="text-slate-900 truncate">{m.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{m.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 truncate max-w-[200px]">{m.subject}</td>
                        <td className="py-4 px-5 whitespace-nowrap">{m.date}</td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            m.status === "Unread" ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600 flex items-center justify-center cursor-pointer"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Inspector Panel (Right side, takes 1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          {selectedMsg ? (
            <>
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Message Box</h3>
                  <span className="text-[10px] text-slate-400 font-mono font-bold block mt-0.5">{selectedMsg.id}</span>
                </div>
                <button
                  onClick={() => handleDelete(selectedMsg.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs font-semibold">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Sender Info</span>
                  <span className="text-slate-900 text-sm font-bold flex items-center gap-1.5 mt-1">
                    <User className="h-4 w-4 text-slate-400" /> {selectedMsg.name}
                  </span>
                  <span className="text-slate-500 block mt-1.5 flex items-center gap-1.5 select-all">
                    <Mail className="h-4 w-4 text-slate-400" /> {selectedMsg.email}
                  </span>
                  <span className="text-slate-500 block mt-1 flex items-center gap-1.5 select-all">
                    <Phone className="h-4 w-4 text-slate-400" /> {selectedMsg.phone}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Subject</span>
                  <span className="text-slate-900 block mt-1 text-sm">{selectedMsg.subject}</span>
                </div>

                <div className="pt-3 border-t border-slate-50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Message Description</span>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-slate-700 leading-relaxed font-medium mt-1">
                    "{selectedMsg.text}"
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-50 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Quick Email Reply</span>
                  <textarea
                    required
                    rows={3}
                    placeholder="Type email reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-xs font-medium"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Send className="h-4 w-4" /> Send Email
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 font-bold text-xs">
              Select a message row to view contents and trigger email replies.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
export default ContactMessages;

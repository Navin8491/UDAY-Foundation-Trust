import { useState } from "react";
import { Plus, Edit, Trash2, Mail, Phone, X, Upload } from "lucide-react";
import presidentImg from "@/assets/president.jpg";
import vicePresidentImg from "@/assets/vice-president.jpg";
import prakashImg from "@/assets/prakash.jpg";
import kartikeyaImg from "@/assets/kartikeya.jpg";
import treasurerImg from "@/assets/treasurer.jpg";
import mehulbhaiImg from "@/assets/mehulbhai.jpg";
import kuldeepImg from "@/assets/kuldeep.jpg";

const INITIAL_TEAM = [
  {
    id: "TM-01",
    name: "Gulabbhai Khodabhai Bauddh",
    role: "President",
    bio: "Founding trustee leading the vision of inclusive rural development.",
    email: "udayfts1024@gmail.com",
    phone: "+91 96246 68484",
    img: presidentImg,
  },
  {
    id: "TM-02",
    name: "Sanjaykumar Maganbhai Vaghela",
    role: "Vice President",
    bio: "Drives program strategy and community outreach campaigns.",
    email: "udayfts1024@gmail.com",
    phone: "+91 98250 12345",
    img: vicePresidentImg,
  },
  {
    id: "TM-03",
    name: "Prakash Aljibhai Parmar",
    role: "Secretary",
    bio: "Oversees operations, compliance, and field coordination.",
    email: "udayfts1024@gmail.com",
    phone: "+91 99799 54321",
    img: prakashImg,
  },
  {
    id: "TM-04",
    name: "Kartikeya Babubhai Jadav",
    role: "Joint Secretary",
    bio: "Coordinates volunteer programs, youth engagement, and partnerships.",
    email: "udayfts1024@gmail.com",
    phone: "+91 97243 98765",
    img: kartikeyaImg,
  },
  {
    id: "TM-05",
    name: "Rahulkumar Natubhai Rathod",
    role: "Treasurer",
    bio: "Manages finance, transparency, and donor reporting.",
    email: "udayfts1024@gmail.com",
    phone: "+91 98980 11223",
    img: treasurerImg,
  },
  {
    id: "TM-06",
    name: "Mehulbhai Gunvantbhai Bauddh",
    role: "Permanent Member",
    bio: "Strategic advisor and field guide for healthcare initiatives.",
    email: "udayfts1024@gmail.com",
    phone: "+91 97123 45678",
    img: mehulbhaiImg,
  },
  {
    id: "TM-07",
    name: "Kuldeep Bhogilal Meheriya",
    role: "Permanent Member",
    bio: "Drives education support programs and environmental initiatives.",
    email: "udayfts1024@gmail.com",
    phone: "+91 96112 23344",
    img: kuldeepImg,
  },
];

export function Team() {
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");

  const handleEditOpen = (member: any) => {
    setSelectedMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormBio(member.bio);
    setFormEmail(member.email);
    setFormPhone(member.phone);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setTeam(
      team.map((m) =>
        m.id === selectedMember.id
          ? {
              ...m,
              name: formName,
              role: formRole,
              bio: formBio,
              email: formEmail,
              phone: formPhone,
            }
          : m
      )
    );
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      setTeam(team.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Team Members</h1>
          <p className="text-sm text-slate-500 font-medium font-gujarati">ટ્રસ્ટી મંડળ અને મુખ્ય વ્યવસ્થાપક સમિતિ</p>
        </div>
        <button
          onClick={() => alert("Add team member simulated.")}
          className="btn-primary text-xs py-2.5 px-4 cursor-pointer self-start sm:self-center"
        >
          <Plus className="h-4 w-4" /> Add Team Member
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Picture */}
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => alert("Triggered Profile Photo upload.")}
                  className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer shadow"
                  title="Upload New Photo"
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>

              {/* Details */}
              <div className="p-5 space-y-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{m.name}</h3>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mt-0.5">{m.role}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{m.bio}</p>
                
                <div className="pt-3 space-y-1.5 text-[10px] text-slate-400 font-bold border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400 flex-none" />
                    <span className="truncate">{m.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-slate-400 flex-none" />
                    <span>{m.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
              <button
                onClick={() => handleEditOpen(m)}
                className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="py-2 px-2 hover:bg-rose-50 border border-rose-100 rounded-xl text-rose-500 cursor-pointer"
                title="Remove Member"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">Edit Team Member</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider">Role / Designation *</label>
                <input
                  type="text"
                  required
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider">Biography Profile</label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
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
export default Team;

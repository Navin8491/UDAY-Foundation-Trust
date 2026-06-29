import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Mail, Phone, X, ArrowLeft, ArrowRight } from "lucide-react";
import presidentImg from "@/assets/president.jpg";
import vicePresidentImg from "@/assets/vice-president.jpg";
import prakashImg from "@/assets/prakash.jpg";
import kartikeyaImg from "@/assets/kartikeya.jpg";
import treasurerImg from "@/assets/treasurer.jpg";
import mehulbhaiImg from "@/assets/mehulbhai.jpg";
import kuldeepImg from "@/assets/kuldeep.jpg";
import { fetchTeam, addTeamMember, updateTeamMember, deleteTeamMember } from "@/services/db";
import { ImageManager } from "@/components/admin/ImageManager";
import { toast } from "sonner";

const INITIAL_TEAM = [
  {
    id: "TM-01",
    name: "Gulabbhai Khodabhai Bauddh",
    role: "President",
    bio: "Founding trustee leading the vision of inclusive rural development.",
    email: "udayfts1024@gmail.com",
    phone: "+91 96246 68484",
    img: presidentImg,
    displayOrder: 0,
  },
  {
    id: "TM-02",
    name: "Sanjaykumar Maganbhai Vaghela",
    role: "Vice President",
    bio: "Drives program strategy and community outreach campaigns.",
    email: "udayfts1024@gmail.com",
    phone: "+91 98250 12345",
    img: vicePresidentImg,
    displayOrder: 1,
  },
  {
    id: "TM-03",
    name: "Prakash Aljibhai Parmar",
    role: "Secretary",
    bio: "Oversees operations, compliance, and field coordination.",
    email: "udayfts1024@gmail.com",
    phone: "+91 99799 54321",
    img: prakashImg,
    displayOrder: 2,
  },
  {
    id: "TM-04",
    name: "Kartikeya Babubhai Jadav",
    role: "Joint Secretary",
    bio: "Coordinates volunteer programs, youth engagement, and partnerships.",
    email: "udayfts1024@gmail.com",
    phone: "+91 97243 98765",
    img: kartikeyaImg,
    displayOrder: 3,
  },
  {
    id: "TM-05",
    name: "Rahulkumar Natubhai Rathod",
    role: "Treasurer",
    bio: "Manages finance, transparency, and donor reporting.",
    email: "udayfts1024@gmail.com",
    phone: "+91 98980 11223",
    img: treasurerImg,
    displayOrder: 4,
  },
  {
    id: "TM-06",
    name: "Mehulbhai Gunvantbhai Bauddh",
    role: "Permanent Member",
    bio: "Strategic advisor and field guide for healthcare initiatives.",
    email: "udayfts1024@gmail.com",
    phone: "+91 97123 45678",
    img: mehulbhaiImg,
    displayOrder: 5,
  },
  {
    id: "TM-07",
    name: "Kuldeep Bhogilal Meheriya",
    role: "Permanent Member",
    bio: "Drives education support programs and environmental initiatives.",
    email: "udayfts1024@gmail.com",
    phone: "+91 96112 23344",
    img: kuldeepImg,
    displayOrder: 6,
  },
];

export function Team() {
  const [team, setTeam] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);

  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadTeam() {
    try {
      const items = await fetchTeam();
      if (items && items.length > 0) {
        const mapped = items.map((m: any, idx: number) => ({
          id: m.id || m._id || m.memberId || "",
          _id: m.id || m._id || "",
          memberId: m.memberId || "",
          name: m.name?.en || m.name || "",
          role: m.role?.en || m.role || "",
          bio: m.bio?.en || m.bio || "",
          email: m.email || "",
          phone: m.phone || "",
          img: m.img || "",
          displayOrder: m.displayOrder !== undefined ? m.displayOrder : idx,
        }));
        setTeam(mapped.sort((a, b) => a.displayOrder - b.displayOrder));
      } else {
        // Fallback
        setTeam(INITIAL_TEAM);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadTeam();
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add("body-scroll-lock");
    } else {
      document.body.classList.remove("body-scroll-lock");
    }
    return () => {
      document.body.classList.remove("body-scroll-lock");
    };
  }, [modalOpen]);

  const handleOpenAddModal = () => {
    setSelectedMember(null);
    setFormName("");
    setFormRole("");
    setFormBio("");
    setFormEmail("");
    setFormPhone("");
    setFormDisplayOrder(team.length);
    setCoverImages([]);
    setModalOpen(true);
  };

  const handleEditOpen = (member: any) => {
    setSelectedMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormBio(member.bio);
    setFormEmail(member.email);
    setFormPhone(member.phone);
    setFormDisplayOrder(member.displayOrder || 0);
    setCoverImages(member.img ? [member.img] : []);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (coverImages.length === 0) {
      toast.error("A profile photo is required.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Saving team member details...");
    try {
      const memberData = {
        memberId: selectedMember?.memberId || `TM-${Date.now()}`,
        name: {
          en: formName,
          gu: formName,
          hi: formName,
        },
        role: {
          en: formRole,
          gu: formRole,
          hi: formRole,
        },
        bio: {
          en: formBio,
          gu: formBio,
          hi: formBio,
        },
        email: formEmail,
        phone: formPhone,
        img: coverImages[0],
        socials: selectedMember?.socials || {},
        displayOrder: Number(formDisplayOrder),
      };

      if (selectedMember) {
        await updateTeamMember(selectedMember.id || selectedMember._id, memberData);
        toast.success("Team member updated successfully!", { id: toastId });
      } else {
        await addTeamMember(memberData);
        toast.success("Team member added successfully!", { id: toastId });
      }
      setModalOpen(false);
      await loadTeam();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save team member.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === team.length - 1) return;

    const targetIndex = direction === "left" ? index - 1 : index + 1;
    const itemA = team[index];
    const itemB = team[targetIndex];

    const tempOrder = itemA.displayOrder;
    itemA.displayOrder = itemB.displayOrder;
    itemB.displayOrder = tempOrder;

    const toastId = toast.loading("Saving team member order...");
    try {
      await Promise.all([
        updateTeamMember(itemA.id || itemA._id, { displayOrder: itemA.displayOrder }),
        updateTeamMember(itemB.id || itemB._id, { displayOrder: itemB.displayOrder }),
      ]);
      toast.success("Order saved!", { id: toastId });
      await loadTeam();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to swap order.", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this team member? This action is permanent.")) {
      const toastId = toast.loading("Removing team member...");
      try {
        await deleteTeamMember(id);
        toast.success("Team member removed successfully!", { id: toastId });
        await loadTeam();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to remove team member.", { id: toastId });
      }
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
          onClick={handleOpenAddModal}
          className="btn-primary text-xs py-2.5 px-4 cursor-pointer self-start sm:self-center"
        >
          <Plus className="h-4 w-4" /> Add Team Member
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((m, index) => (
          <div
            key={m.id || m._id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Picture */}
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
              </div>

              {/* Details */}
              <div className="p-5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">
                    {m.role}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Order: {m.displayOrder}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{m.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">{m.bio}</p>
                
                <div className="pt-3 space-y-1.5 text-[10px] text-slate-400 font-bold border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400 flex-none" />
                    <span className="truncate">{m.email}</span>
                  </div>
                  {m.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-3.5 w-3.5 text-slate-400 flex-none" />
                      <span>{m.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2 items-center justify-between">
              <div className="flex gap-1.5 flex-1">
                <button
                  onClick={() => handleEditOpen(m)}
                  className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id || m._id)}
                  className="py-2 px-3 hover:bg-rose-50 border border-rose-100 rounded-xl text-rose-500 cursor-pointer"
                  title="Remove Member"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Move Left / Right buttons */}
              <div className="flex gap-1">
                <button
                  disabled={index === 0}
                  onClick={() => handleMove(index, "left")}
                  className="h-7 w-7 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
                  title="Move Left"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
                </button>
                <button
                  disabled={index === team.length - 1}
                  onClick={() => handleMove(index, "right")}
                  className="h-7 w-7 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
                  title="Move Right"
                >
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">{selectedMember ? "Edit Team Member" : "Add Team Member"}</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Outer Form */}
            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-semibold">
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

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Display Order *</label>
                  <input
                    type="number"
                    required
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
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

              {/* Profile Photo Upload */}
              <div className="space-y-2">
                <label className="text-slate-500 uppercase tracking-wider">Profile Photo *</label>
                <ImageManager
                  images={coverImages}
                  coverImage={coverImages[0] || ""}
                  onChange={(images) => setCoverImages(images)}
                  folder="team"
                  singleOnly={true}
                />
              </div>

              </div>

              {/* Fixed Footer Submit Buttons */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setModalOpen(false)}
                  className="flex-1 btn-ghost text-xs py-2.5 px-4 cursor-pointer bg-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary text-xs py-2.5 px-4 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Saving..." : (selectedMember ? "Save Changes" : "Add Member")}
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

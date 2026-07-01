import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { fetchPrograms, addProgram, updateProgram, deleteProgram } from "@/services/db";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageManager } from "@/components/admin/ImageManager";
import { toast } from "sonner";

const ICONS_LIST = [
  "GraduationCap",
  "Stethoscope",
  "HandHeart",
  "Sprout",
  "ShieldCheck",
  "HomeIcon",
  "Baby",
  "Users",
  "Heart",
  "Sparkles",
  "BookOpen",
  "HeartHandshake",
  "Flame",
];

const COLORS_PRESETS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Emerald", value: "#10B981" },
  { name: "Green", value: "#22C55E" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Indigo", value: "#4F46E5" },
  { name: "Purple", value: "#A855F7" },
];

export function Programs() {
  const [programsList, setProgramsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<any>(null);

  // Form States (Multilingual)
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formTitleGu, setFormTitleGu] = useState("");
  const [formTitleHi, setFormTitleHi] = useState("");

  const [formDescEn, setFormDescEn] = useState("");
  const [formDescGu, setFormDescGu] = useState("");
  const [formDescHi, setFormDescHi] = useState("");

  const [formObjectivesEn, setFormObjectivesEn] = useState("");
  const [formObjectivesGu, setFormObjectivesGu] = useState("");
  const [formObjectivesHi, setFormObjectivesHi] = useState("");

  const [formActivitiesEn, setFormActivitiesEn] = useState("");
  const [formActivitiesGu, setFormActivitiesGu] = useState("");
  const [formActivitiesHi, setFormActivitiesHi] = useState("");

  const [formImpactEn, setFormImpactEn] = useState("");
  const [formImpactGu, setFormImpactGu] = useState("");
  const [formImpactHi, setFormImpactHi] = useState("");

  // Success Story
  const [formSuccessTitleEn, setFormSuccessTitleEn] = useState("");
  const [formSuccessTitleGu, setFormSuccessTitleGu] = useState("");
  const [formSuccessTitleHi, setFormSuccessTitleHi] = useState("");

  const [formSuccessStoryEn, setFormSuccessStoryEn] = useState("");
  const [formSuccessStoryGu, setFormSuccessStoryGu] = useState("");
  const [formSuccessStoryHi, setFormSuccessStoryHi] = useState("");

  const [formSuccessQuoteEn, setFormSuccessQuoteEn] = useState("");
  const [formSuccessQuoteGu, setFormSuccessQuoteGu] = useState("");
  const [formSuccessQuoteHi, setFormSuccessQuoteHi] = useState("");

  // Metadata
  const [formCategory, setFormCategory] = useState("General");
  const [formIcon, setFormIcon] = useState("GraduationCap");
  const [formColor, setFormColor] = useState("#3B82F6");
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");

  // Media
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  async function loadPrograms() {
    try {
      setFetching(true);
      const items = await fetchPrograms();
      setProgramsList(items || []);
    } catch (e) {
      console.error(e);
      setProgramsList([]);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    loadPrograms();
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
    setEditingProg(null);
    setFormTitleEn("");
    setFormTitleGu("");
    setFormTitleHi("");
    setFormDescEn("");
    setFormDescGu("");
    setFormDescHi("");
    setFormObjectivesEn("");
    setFormObjectivesGu("");
    setFormObjectivesHi("");
    setFormActivitiesEn("");
    setFormActivitiesGu("");
    setFormActivitiesHi("");
    setFormImpactEn("");
    setFormImpactGu("");
    setFormImpactHi("");
    setFormSuccessTitleEn("");
    setFormSuccessTitleGu("");
    setFormSuccessTitleHi("");
    setFormSuccessStoryEn("");
    setFormSuccessStoryGu("");
    setFormSuccessStoryHi("");
    setFormSuccessQuoteEn("");
    setFormSuccessQuoteGu("");
    setFormSuccessQuoteHi("");
    setFormCategory("General");
    setFormIcon("GraduationCap");
    setFormColor("#3B82F6");
    setFormDisplayOrder(programsList.length);
    setFormStatus("published");
    setCoverImages([]);
    setGalleryImages([]);
    setModalOpen(true);
  };

  const handleOpenEditModal = (prog: any) => {
    setEditingProg(prog);
    setFormTitleEn(prog.title?.en || "");
    setFormTitleGu(prog.title?.gu || "");
    setFormTitleHi(prog.title?.hi || "");
    setFormDescEn(prog.desc?.en || "");
    setFormDescGu(prog.desc?.gu || "");
    setFormDescHi(prog.desc?.hi || "");

    // Objectives list map to lines
    const objectivesEn = (prog.objectivesEn || prog.objectives?.map((o: any) => o.en || o) || []).join("\n");
    const objectivesGu = (prog.objectivesGu || prog.objectives?.map((o: any) => o.gu || o) || []).join("\n");
    const objectivesHi = (prog.objectivesHi || prog.objectives?.map((o: any) => o.hi || o) || []).join("\n");
    setFormObjectivesEn(objectivesEn);
    setFormObjectivesGu(objectivesGu);
    setFormObjectivesHi(objectivesHi);

    // Activities list map to lines
    const activitiesEn = (prog.activitiesEn || prog.activities?.map((a: any) => a.en || a) || []).join("\n");
    const activitiesGu = (prog.activitiesGu || prog.activities?.map((a: any) => a.gu || a) || []).join("\n");
    const activitiesHi = (prog.activitiesHi || prog.activities?.map((a: any) => a.hi || a) || []).join("\n");
    setFormActivitiesEn(activitiesEn);
    setFormActivitiesGu(activitiesGu);
    setFormActivitiesHi(activitiesHi);

    setFormImpactEn(prog.impactVal?.en || "");
    setFormImpactGu(prog.impactVal?.gu || "");
    setFormImpactHi(prog.impactVal?.hi || "");

    setFormSuccessTitleEn(prog.successTitle?.en || "");
    setFormSuccessTitleGu(prog.successTitle?.gu || "");
    setFormSuccessTitleHi(prog.successTitle?.hi || "");
    setFormSuccessStoryEn(prog.successStory?.en || "");
    setFormSuccessStoryGu(prog.successStory?.gu || "");
    setFormSuccessStoryHi(prog.successStory?.hi || "");
    setFormSuccessQuoteEn(prog.successQuote?.en || "");
    setFormSuccessQuoteGu(prog.successQuote?.gu || "");
    setFormSuccessQuoteHi(prog.successQuote?.hi || "");

    setFormCategory(prog.category || "General");
    setFormIcon(prog.iconName || "GraduationCap");
    setFormColor(prog.color || "#3B82F6");
    setFormDisplayOrder(prog.displayOrder || 0);
    setFormStatus(prog.status || "published");
    setCoverImages(prog.image ? [prog.image] : []);
    setGalleryImages(prog.thumbnails || []);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formTitleEn.trim() || !formTitleGu.trim()) {
      toast.error("Program titles in English and Gujarati are required.");
      return;
    }
    if (!formDescEn.trim() || !formDescGu.trim()) {
      toast.error("Description summaries in English and Gujarati are required.");
      return;
    }
    if (coverImages.length === 0) {
      toast.error("A program cover image is required.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Saving program details...");

    try {
      // Map multi-line textareas to multilingual array structures
      const parseList = (text: string, fallback: string) => {
        const lines = text.split("\n").map(s => s.trim()).filter(Boolean);
        return lines.length > 0 ? lines : [fallback];
      };

      const enObjs = parseList(formObjectivesEn, formTitleEn);
      const guObjs = parseList(formObjectivesGu, formTitleGu);
      const hiObjs = parseList(formObjectivesHi, formTitleHi || formTitleEn);
      const objectives = enObjs.map((val, idx) => ({
        en: val,
        gu: guObjs[idx] || guObjs[0] || val,
        hi: hiObjs[idx] || hiObjs[0] || val,
      }));

      const enActs = parseList(formActivitiesEn, formTitleEn);
      const guActs = parseList(formActivitiesGu, formTitleGu);
      const hiActs = parseList(formActivitiesHi, formTitleHi || formTitleEn);
      const activities = enActs.map((val, idx) => ({
        en: val,
        gu: guActs[idx] || guActs[0] || val,
        hi: hiActs[idx] || hiActs[0] || val,
      }));

      const programData = {
        // keyId: required NOT NULL in Supabase — slug derived from English title
        keyId: editingProg?.keyId ||
          formTitleEn
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") ||
          `program-${Date.now()}`,
        title: {
          en: formTitleEn,
          gu: formTitleGu,
          hi: formTitleHi || formTitleEn,
        },
        desc: {
          en: formDescEn,
          gu: formDescGu,
          hi: formDescHi || formDescEn,
        },
        image: coverImages[0],
        thumbnails: galleryImages,
        iconName: formIcon,
        color: formColor,
        displayOrder: Number(formDisplayOrder),
        status: formStatus,
        category: formCategory,
        objectives,
        activities,
        impactVal: {
          en: formImpactEn || `${formTitleEn} Impact`,
          gu: formImpactGu || `${formTitleGu} પ્રભાવ`,
          hi: formImpactHi || formImpactEn || `${formTitleEn} प्रभाव`,
        },
        successTitle: {
          en: formSuccessTitleEn,
          gu: formSuccessTitleGu,
          hi: formSuccessTitleHi || formSuccessTitleEn,
        },
        successStory: {
          en: formSuccessStoryEn,
          gu: formSuccessStoryGu,
          hi: formSuccessStoryHi || formSuccessStoryEn,
        },
        successQuote: {
          en: formSuccessQuoteEn,
          gu: formSuccessQuoteGu,
          hi: formSuccessQuoteHi || formSuccessQuoteEn,
        },
      };

      if (editingProg) {
        await updateProgram(editingProg.id || editingProg._id, programData);
        toast.success("Program updated successfully!", { id: toastId });
      } else {
        await addProgram(programData);
        toast.success("Program added successfully!", { id: toastId });
      }

      setModalOpen(false);
      await loadPrograms();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save program.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this program and all associated images? This action cannot be undone.")) {
      const toastId = toast.loading("Deleting program...");
      try {
        await deleteProgram(id);
        toast.success("Program deleted successfully!", { id: toastId });
        await loadPrograms();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to delete program.", { id: toastId });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Programs Management</h1>
          <p className="text-sm text-slate-500 font-medium font-gujarati">ટ્રસ્ટ હેઠળ ચાલતી સામાજિક કલ્યાણ પ્રવૃત્તિઓનું વ્યવસ્થાપન</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn-primary text-xs py-2.5 px-4 cursor-pointer self-start sm:self-center"
        >
          <Plus className="h-4 w-4" /> Add New Program
        </button>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fetching ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 animate-pulse">
              <div className="aspect-[16/10] bg-slate-100 rounded-2xl w-full" />
              <div className="space-y-2">
                <div className="h-4 w-1/4 bg-slate-100 rounded" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
                <div className="h-3 w-1/2 bg-slate-100 rounded" />
              </div>
            </div>
          ))
        ) : programsList.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 font-bold">
            No programs found.
          </div>
        ) : programsList.map((p) => (
          <div
            key={p.id || p._id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Cover Image */}
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img src={p.image} alt={p.title?.en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>

              {/* Body details */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {p.category || "General"}
                    </span>
                    {p.status === "draft" && (
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-rose-50 text-rose-500 px-2 py-0.5 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Order: {p.displayOrder}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {p.title?.en}
                </h3>
                <h4 className="font-gujarati text-xs font-semibold text-slate-500">
                  {p.title?.gu}
                </h4>
                <div 
                  className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3 prose prose-slate"
                  dangerouslySetInnerHTML={{ __html: p.desc?.en || "" }}
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
              <button
                onClick={() => handleOpenEditModal(p)}
                className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Edit className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(p.id || p._id)}
                className="py-2 px-3 hover:bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-500 flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">{editingProg ? "Edit Program Details" : "Add New Program"}</h3>
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
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs font-semibold">
              
              {/* Program Titles */}
              <div className="space-y-4 border-b border-slate-100 pb-4">
                <h4 className="text-sm font-bold text-slate-800">Program Title</h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">English Title *</label>
                    <input
                      type="text"
                      required
                      value={formTitleEn}
                      onChange={(e) => setFormTitleEn(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="e.g. Vidya Sahay"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Gujarati Title *</label>
                    <input
                      type="text"
                      required
                      value={formTitleGu}
                      onChange={(e) => setFormTitleGu(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium font-gujarati"
                      placeholder="વિદ્યા સહાય"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Hindi Title</label>
                    <input
                      type="text"
                      value={formTitleHi}
                      onChange={(e) => setFormTitleHi(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="विद्या सहाय"
                    />
                  </div>
                </div>
              </div>

              {/* Design configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Lucide Icon *</label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium cursor-pointer"
                  >
                    {ICONS_LIST.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Brand Color *</label>
                  <div className="flex gap-2 items-center">
                    <select
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium cursor-pointer"
                    >
                      {COLORS_PRESETS.map((col) => (
                        <option key={col.value} value={col.value}>{col.name}</option>
                      ))}
                    </select>
                    <input
                      type="color"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="h-10 w-10 border-0 rounded-lg cursor-pointer flex-shrink-0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Display Order *</label>
                  <input
                    type="number"
                    required
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>
              </div>

              {/* Status and Category config */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Category / Label *</label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Publish Status *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium cursor-pointer"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <h4 className="text-sm font-bold text-slate-800">Cover Image *</h4>
                <ImageManager
                  images={coverImages}
                  coverImage={coverImages[0] || ""}
                  onChange={(images) => setCoverImages(images)}
                  folder="programs"
                  singleOnly={true}
                />
              </div>

              {/* Gallery Images */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <h4 className="text-sm font-bold text-slate-800">Additional Gallery Images</h4>
                <ImageManager
                  images={galleryImages}
                  coverImage={galleryImages[0] || ""}
                  onChange={(images) => setGalleryImages(images)}
                  folder="programs"
                />
              </div>

              {/* Description (Rich Text) */}
              <div className="space-y-4 border-b border-slate-100 pb-4">
                <h4 className="text-sm font-bold text-slate-800">Program Description</h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">English Description *</label>
                    <RichTextEditor
                      value={formDescEn}
                      onChange={setFormDescEn}
                      placeholder="Write description summary..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Gujarati Description *</label>
                    <RichTextEditor
                      value={formDescGu}
                      onChange={setFormDescGu}
                      placeholder="ગુજરાતીમાં વિગત લખો..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Hindi Description</label>
                    <RichTextEditor
                      value={formDescHi}
                      onChange={setFormDescHi}
                      placeholder="हिंदी में विवरण लिखें..."
                    />
                  </div>
                </div>
              </div>

              {/* Objectives lists (Line-by-line inputs) */}
              <div className="space-y-4 border-b border-slate-100 pb-4">
                <h4 className="text-sm font-bold text-slate-800">Program Objectives (one per line)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider font-bold">English</label>
                    <textarea
                      rows={4}
                      value={formObjectivesEn}
                      onChange={(e) => setFormObjectivesEn(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-xs font-medium"
                      placeholder="E.g.&#10;Notebook distribution&#10;Primary coaching"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider font-bold">Gujarati</label>
                    <textarea
                      rows={4}
                      value={formObjectivesGu}
                      onChange={(e) => setFormObjectivesGu(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-xs font-medium font-gujarati"
                      placeholder="દા.ત.&#10;નોટબુક વિતરણ&#10;શાળા શિક્ષણ સહાય"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider font-bold">Hindi</label>
                    <textarea
                      rows={4}
                      value={formObjectivesHi}
                      onChange={(e) => setFormObjectivesHi(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-xs font-medium"
                      placeholder="उदा.&#10;नोटबुक वितरण&#10;स्कूल शिक्षा सहायता"
                    />
                  </div>
                </div>
              </div>

              {/* Activities list (Line-by-line inputs) */}
              <div className="space-y-4 border-b border-slate-100 pb-4">
                <h4 className="text-sm font-bold text-slate-800">Key Activities (one per line)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider font-bold">English</label>
                    <textarea
                      rows={4}
                      value={formActivitiesEn}
                      onChange={(e) => setFormActivitiesEn(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-xs font-medium"
                      placeholder="E.g.&#10;Annual bag distributions&#10;Sanand field camps"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider font-bold">Gujarati</label>
                    <textarea
                      rows={4}
                      value={formActivitiesGu}
                      onChange={(e) => setFormActivitiesGu(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-xs font-medium font-gujarati"
                      placeholder="દા.ત.&#10;વર્ષિક બેગ વિતરણ કાર્યક્રમ&#10;સાણંદ સેવા કેમ્પ"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider font-bold">Hindi</label>
                    <textarea
                      rows={4}
                      value={formActivitiesHi}
                      onChange={(e) => setFormActivitiesHi(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-xs font-medium"
                      placeholder="उदा.&#10;वार्षिक बैग वितरण कार्यक्रम&#10;सानंद सेवा शिविर"
                    />
                  </div>
                </div>
              </div>

              {/* Impact stats value */}
              <div className="space-y-4 border-b border-slate-100 pb-4">
                <h4 className="text-sm font-bold text-slate-800">Impact Metric Text</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">English *</label>
                    <input
                      type="text"
                      required
                      value={formImpactEn}
                      onChange={(e) => setFormImpactEn(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="e.g. 4,500+ Students served"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Gujarati *</label>
                    <input
                      type="text"
                      required
                      value={formImpactGu}
                      onChange={(e) => setFormImpactGu(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium font-gujarati"
                      placeholder="૪,૫૦૦+ વિદ્યાર્થીઓ"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Hindi</label>
                    <input
                      type="text"
                      value={formImpactHi}
                      onChange={(e) => setFormImpactHi(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="४,५००+ छात्र"
                    />
                  </div>
                </div>
              </div>

              {/* Success Story details */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Success Story / Feedback Details</h4>
                
                {/* Title */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">English Story Title</label>
                    <input
                      type="text"
                      value={formSuccessTitleEn}
                      onChange={(e) => setFormSuccessTitleEn(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Gujarati Story Title</label>
                    <input
                      type="text"
                      value={formSuccessTitleGu}
                      onChange={(e) => setFormSuccessTitleGu(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium font-gujarati"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Hindi Story Title</label>
                    <input
                      type="text"
                      value={formSuccessTitleHi}
                      onChange={(e) => setFormSuccessTitleHi(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Story Body */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">English Story Story</label>
                    <textarea
                      rows={3}
                      value={formSuccessStoryEn}
                      onChange={(e) => setFormSuccessStoryEn(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Gujarati Story Story</label>
                    <textarea
                      rows={3}
                      value={formSuccessStoryGu}
                      onChange={(e) => setFormSuccessStoryGu(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-xs font-medium font-gujarati"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Hindi Story Story</label>
                    <textarea
                      rows={3}
                      value={formSuccessStoryHi}
                      onChange={(e) => setFormSuccessStoryHi(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Quote author */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">English Story Quote / Author</label>
                    <input
                      type="text"
                      value={formSuccessQuoteEn}
                      onChange={(e) => setFormSuccessQuoteEn(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="e.g. Ramesh, Gov. School Teacher"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Gujarati Story Quote / Author</label>
                    <input
                      type="text"
                      value={formSuccessQuoteGu}
                      onChange={(e) => setFormSuccessQuoteGu(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium font-gujarati"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Hindi Story Quote / Author</label>
                    <input
                      type="text"
                      value={formSuccessQuoteHi}
                      onChange={(e) => setFormSuccessQuoteHi(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>
                </div>
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
                  {loading ? "Saving..." : (editingProg ? "Save Changes" : "Publish Program")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Programs;

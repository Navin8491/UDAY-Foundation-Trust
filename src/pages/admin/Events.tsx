import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Calendar, Users, Star, X } from "lucide-react";
import { SCHOOL_BAG_EVENTS } from "@/constants/schoolEvents";
import { fetchEvents, addEvent, updateEvent, deleteEvent } from "@/services/db";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageManager } from "@/components/admin/ImageManager";
import { toast } from "sonner";

export function Events() {
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // Form States (Multilingual)
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formTitleGu, setFormTitleGu] = useState("");
  const [formTitleHi, setFormTitleHi] = useState("");
  
  const [formSummaryEn, setFormSummaryEn] = useState("");
  const [formSummaryGu, setFormSummaryGu] = useState("");
  const [formSummaryHi, setFormSummaryHi] = useState("");

  const [formPlaceEn, setFormPlaceEn] = useState("Sanand, Ahmedabad, Gujarat");
  const [formPlaceGu, setFormPlaceGu] = useState("સાણંદ, અમદાવાદ, ગુજરાત");
  const [formPlaceHi, setFormPlaceHi] = useState("सानंद, अहमदाबाद, गुजरात");

  const [formCategory, setFormCategory] = useState("Education");
  const [formDate, setFormDate] = useState("Jun 2026");
  const [formParticipants, setFormParticipants] = useState(150);
  const [formVolunteers, setFormVolunteers] = useState(25);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");
  
  // Media State
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");

  // SEO State
  const [formSeoTitle, setFormSeoTitle] = useState("");
  const [formSeoDesc, setFormSeoDesc] = useState("");

  async function loadEvents() {
    try {
      const items = await fetchEvents();
      if (items && items.length > 0) {
        const mapped = items.map((evt: any) => ({
          id: evt.id || evt._id || "",
          titleEn: evt.title?.en || "",
          titleGu: evt.title?.gu || "",
          titleHi: evt.title?.hi || "",
          date: evt.date || "",
          placeEn: evt.place?.en || evt.place || "",
          placeGu: evt.place?.gu || evt.place || "",
          placeHi: evt.place?.hi || evt.place || "",
          participants: evt.participants || 0,
          volunteers: evt.volunteers || 0,
          category: evt.category || "Education",
          featured: evt.featured || false,
          status: evt.status || "published",
          img: evt.img || "",
          images: evt.images || [],
          summaryEn: evt.summary?.en || "",
          summaryGu: evt.summary?.gu || "",
          summaryHi: evt.summary?.hi || "",
          seoTitle: evt.seoTitle || "",
          seoDesc: evt.seoDesc || "",
          rawItem: evt,
        }));
        setEventsList(mapped);
      } else {
        // Fallback to static list
        setEventsList(SCHOOL_BAG_EVENTS.map((evt) => ({
          id: evt.id,
          titleEn: evt.title["en"],
          titleGu: evt.title["gu"],
          titleHi: evt.title["hi"] || evt.title["en"],
          date: evt.date,
          placeEn: evt.place["en"],
          placeGu: evt.place["gu"] || evt.place["en"],
          placeHi: evt.place["hi"] || evt.place["en"],
          participants: evt.participants,
          volunteers: evt.volunteers,
          category: evt.category,
          featured: false,
          status: "published",
          img: evt.img,
          images: evt.images || [],
          summaryEn: evt.summary?.en || "",
          summaryGu: evt.summary?.gu || "",
          summaryHi: evt.summary?.hi || "",
          seoTitle: "",
          seoDesc: "",
          rawItem: evt,
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadEvents();
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
    setEditingEvent(null);
    setFormTitleEn("");
    setFormTitleGu("");
    setFormTitleHi("");
    setFormSummaryEn("");
    setFormSummaryGu("");
    setFormSummaryHi("");
    setFormPlaceEn("Sanand, Ahmedabad, Gujarat");
    setFormPlaceGu("સાણંદ, અમદાવાદ, ગુજરાત");
    setFormPlaceHi("सानंद, अहमदाबाद, गुजरात");
    setFormCategory("Education");
    setFormDate("Jun 2026");
    setFormParticipants(150);
    setFormVolunteers(25);
    setFormFeatured(false);
    setFormStatus("published");
    setImagesList([]);
    setCoverImage("");
    setFormSeoTitle("");
    setFormSeoDesc("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (evt: any) => {
    setEditingEvent(evt);
    setFormTitleEn(evt.titleEn);
    setFormTitleGu(evt.titleGu);
    setFormTitleHi(evt.titleHi);
    setFormSummaryEn(evt.summaryEn);
    setFormSummaryGu(evt.summaryGu);
    setFormSummaryHi(evt.summaryHi);
    setFormPlaceEn(evt.placeEn);
    setFormPlaceGu(evt.placeGu);
    setFormPlaceHi(evt.placeHi);
    setFormCategory(evt.category);
    setFormDate(evt.date);
    setFormParticipants(evt.participants);
    setFormVolunteers(evt.volunteers);
    setFormFeatured(evt.featured);
    setFormStatus(evt.status);
    // Extract plain URL strings from either string[] or {img,...}[] format
    const rawImages: any[] = evt.images && evt.images.length > 0 ? evt.images : [evt.img];
    const urlImages = rawImages
      .map((item: any) => (typeof item === "string" ? item : item?.img || ""))
      .filter(Boolean) as string[];
    setImagesList(urlImages);
    const coverUrl = typeof evt.img === "string" ? evt.img : evt.img?.img || "";
    setCoverImage(coverUrl);
    setFormSeoTitle(evt.seoTitle || "");
    setFormSeoDesc(evt.seoDesc || "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formTitleEn.trim() || !formTitleGu.trim()) {
      toast.error("Event titles in English and Gujarati are required.");
      return;
    }
    if (!formSummaryEn.trim() || !formSummaryGu.trim()) {
      toast.error("Short descriptions in English and Gujarati are required.");
      return;
    }
    if (imagesList.length === 0) {
      toast.error("At least one event photo is required.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Saving event details...");

    try {
      const activeCover = coverImage || imagesList[0] || "";
      const eventData = {
        title: {
          en: formTitleEn,
          gu: formTitleGu,
          hi: formTitleHi || formTitleEn,
        },
        slug: editingEvent?.slug || formTitleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        category: formCategory,
        date: formDate,
        place: {
          en: formPlaceEn,
          gu: formPlaceGu,
          hi: formPlaceHi,
        },
        participants: Number(formParticipants),
        volunteers: Number(formVolunteers),
        status: formStatus,
        featured: formFeatured,
        img: activeCover,
        // Always save images as {img, caption, category}[] objects for consistent rendering
        images: imagesList.map((url: string) => ({
          img: url,
          category: formCategory,
          caption: {
            en: formTitleEn || "",
            gu: formTitleGu || "",
            hi: formTitleHi || formTitleEn || "",
          },
        })),
        summary: {
          en: formSummaryEn,
          gu: formSummaryGu,
          hi: formSummaryHi || formSummaryEn,
        },
        impact: {
          en: `${formParticipants} participants helped`,
          gu: `${formParticipants} સહભાગીઓ`,
          hi: `${formParticipants} लोग`,
        },
        seoTitle: formSeoTitle,
        seoDesc: formFormSeoDescClean(formSeoDesc),
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
        toast.success("Event updated successfully!", { id: toastId });
      } else {
        await addEvent(eventData);
        toast.success("Event added successfully!", { id: toastId });
      }

      setModalOpen(false);
      await loadEvents();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save event.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const formFormSeoDescClean = (val: string) => {
    return val.replace(/<[^>]*>/g, "").substring(0, 160);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event record and all associated images?")) {
      const toastId = toast.loading("Deleting event...");
      try {
        await deleteEvent(id);
        toast.success("Event deleted successfully!", { id: toastId });
        await loadEvents();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to delete event.", { id: toastId });
      }
    }
  };

  const toggleFeatured = async (id: string) => {
    const evt = eventsList.find((e) => e.id === id);
    if (!evt) return;
    const toastId = toast.loading("Updating event status...");
    try {
      const newFeatured = !evt.featured;
      await updateEvent(id, { featured: newFeatured });
      toast.success("Featured status updated!", { id: toastId });
      await loadEvents();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update status.", { id: toastId });
    }
  };

  const filtered = eventsList.filter((e) =>
    e.titleEn.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Events Management</h1>
          <p className="text-sm text-slate-500 font-medium font-gujarati">કાર્યક્રમો, કેમ્પ અને સેવા અભિયાનોનું વ્યવસ્થાપન</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn-primary text-xs py-2.5 px-4 cursor-pointer self-start sm:self-center"
        >
          <Plus className="h-4 w-4" /> Add Completed Event
        </button>
      </div>

      {/* Search Filter bar */}
      <div className="flex bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs justify-between">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-80">
          <Search className="h-4 w-4 text-slate-400 flex-none" />
          <input
            type="text"
            placeholder="Search events by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-semibold focus:outline-hidden bg-transparent"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((evt) => (
          <article
            key={evt.id}
            className="bg-white rounded-3xl border border-slate-200/85 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Cover Image */}
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img
                  src={evt.img}
                  alt={evt.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => toggleFeatured(evt.id)}
                  className={`absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer ${
                    evt.featured
                      ? "bg-[#F7E81D] text-[#121B34] shadow animate-pulse"
                      : "bg-black/40 text-white hover:bg-black/60"
                  }`}
                  title={evt.featured ? "Unmark Featured" : "Mark Featured"}
                >
                  <Star className="h-4.5 w-4.5 fill-current" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex gap-2 items-center mb-3">
                  <span className="chip bg-primary/10 text-primary text-[9px] font-bold py-0.5 px-2 rounded-md">
                    {evt.category}
                  </span>
                  {evt.status === "draft" && (
                    <span className="chip bg-slate-100 text-slate-600 text-[9px] font-bold py-0.5 px-2 rounded-md">
                      Draft
                    </span>
                  )}
                  {evt.featured && (
                    <span className="chip bg-amber-50 text-amber-600 border-amber-200 text-[9px] font-bold py-0.5 px-2 rounded-md">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">
                  {evt.titleEn}
                </h3>
                <h4 className="font-gujarati text-xs font-semibold text-slate-500 mt-1">
                  {evt.titleGu}
                </h4>

                <div className="mt-4 grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <div>
                    <span>Participants</span>
                    <div className="text-slate-700 text-xs font-bold mt-0.5 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-primary" /> {evt.participants.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span>Volunteers</span>
                    <div className="text-slate-700 text-xs font-bold mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#7A9D1C]" /> {evt.volunteers}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2 justify-end">
              <button
                onClick={() => handleOpenEditModal(evt)}
                className="h-9 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-500 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(evt.id)}
                className="h-9 px-3 rounded-xl border border-rose-100 hover:bg-rose-50 text-rose-500 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">{editingEvent ? "Edit Event Details" : "Add Completed Event"}</h3>
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
              
              {/* Event Title inputs */}
              <div className="space-y-4 border-b border-slate-100 pb-4">
                <h4 className="text-sm font-bold text-slate-800">Event Title</h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">English Title *</label>
                    <input
                      type="text"
                      required
                      value={formTitleEn}
                      onChange={(e) => setFormTitleEn(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="e.g. Tree Plantation Drive"
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
                      placeholder="વૃક્ષારોપણ અભિયાન"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Hindi Title</label>
                    <input
                      type="text"
                      value={formTitleHi}
                      onChange={(e) => setFormTitleHi(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="वृक्षारोपण अभियान"
                    />
                  </div>
                </div>
              </div>

              {/* Event Location inputs */}
              <div className="space-y-4 border-b border-slate-100 pb-4">
                <h4 className="text-sm font-bold text-slate-800">Location / Place</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider">English Location *</label>
                      <input
                        type="text"
                        required
                        value={formPlaceEn}
                        onChange={(e) => setFormPlaceEn(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider">Gujarati Location *</label>
                      <input
                        type="text"
                        required
                        value={formPlaceGu}
                        onChange={(e) => setFormPlaceGu(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium font-gujarati"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider">Hindi Location *</label>
                      <input
                        type="text"
                        required
                        value={formPlaceHi}
                        onChange={(e) => setFormPlaceHi(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata columns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium cursor-pointer"
                  >
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Sports">Sports</option>
                    <option value="Relief">Relief</option>
                    <option value="Community">Community</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Date *</label>
                  <input
                    type="text"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    placeholder="e.g. Jun 2026"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Participants *</label>
                  <input
                    type="number"
                    required
                    value={formParticipants}
                    onChange={(e) => setFormParticipants(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Volunteers *</label>
                  <input
                    type="number"
                    required
                    value={formVolunteers}
                    onChange={(e) => setFormVolunteers(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>
              </div>

              {/* Status and Banner Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-4">
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
                
                <div className="flex items-center gap-2 pt-5">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-slate-700 font-bold cursor-pointer text-xs uppercase tracking-wide">
                    Mark as featured on home banner
                  </label>
                </div>
              </div>

              {/* Image Manager Area */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <h4 className="text-sm font-bold text-slate-800">Event Images</h4>
                <ImageManager
                  images={imagesList}
                  coverImage={coverImage}
                  onChange={(newImages, newCover) => {
                    setImagesList(newImages);
                    setCoverImage(newCover);
                  }}
                  folder="events"
                />
              </div>

              {/* Full Description (Rich Text) */}
              <div className="space-y-4 border-b border-slate-100 pb-4">
                <h4 className="text-sm font-bold text-slate-800">Full Description / Summary Details</h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">English Description *</label>
                    <RichTextEditor
                      value={formSummaryEn}
                      onChange={setFormSummaryEn}
                      placeholder="Write comprehensive English details..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Gujarati Description *</label>
                    <RichTextEditor
                      value={formSummaryGu}
                      onChange={setFormSummaryGu}
                      placeholder="ગુજરાતીમાં વિગતો લખો..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">Hindi Description</label>
                    <RichTextEditor
                      value={formSummaryHi}
                      onChange={setFormSummaryHi}
                      placeholder="हिंदी में विवरण लिखें..."
                    />
                  </div>
                </div>
              </div>

              {/* SEO Tags */}
              <div className="space-y-4 pb-2">
                <h4 className="text-sm font-bold text-slate-800">SEO Meta Parameters</h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">SEO Title Tag</label>
                    <input
                      type="text"
                      value={formSeoTitle}
                      onChange={(e) => setFormSeoTitle(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="Title shown in browser tab and Google results"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider">SEO Meta Description</label>
                    <textarea
                      rows={2}
                      value={formSeoDesc}
                      onChange={(e) => setFormSeoDesc(e.target.value)}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                      placeholder="Short summary displayed under the search result link"
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
                  {loading ? "Saving..." : (editingEvent ? "Save Changes" : "Publish Event")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;

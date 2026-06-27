import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Calendar, Users, Star, Eye, X, Upload } from "lucide-react";
import { SCHOOL_BAG_EVENTS } from "@/constants/schoolEvents";

export function Events() {
  const [eventsList, setEventsList] = useState(
    SCHOOL_BAG_EVENTS.map((evt) => ({
      id: evt.id,
      titleEn: evt.title["en"],
      titleGu: evt.title["gu"],
      date: evt.date,
      place: evt.place["en"],
      participants: evt.participants,
      volunteers: evt.volunteers,
      category: evt.category,
      featured: false,
      img: evt.img,
    }))
  );

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  
  // Form State
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formTitleGu, setFormTitleGu] = useState("");
  const [formCategory, setFormCategory] = useState("Education");
  const [formDate, setFormDate] = useState("Jun 2026");
  const [formPlace, setFormPlace] = useState("Sanand, Ahmedabad, Gujarat");
  const [formParticipants, setFormParticipants] = useState(150);
  const [formVolunteers, setFormVolunteers] = useState(25);
  const [formFeatured, setFormFeatured] = useState(false);

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setFormTitleEn("");
    setFormTitleGu("");
    setFormCategory("Education");
    setFormDate("Jun 2026");
    setFormPlace("Sanand, Ahmedabad, Gujarat");
    setFormParticipants(150);
    setFormVolunteers(25);
    setFormFeatured(false);
    setModalOpen(true);
  };

  const handleOpenEditModal = (evt: any) => {
    setEditingEvent(evt);
    setFormTitleEn(evt.titleEn);
    setFormTitleGu(evt.titleGu);
    setFormCategory(evt.category);
    setFormDate(evt.date);
    setFormPlace(evt.place);
    setFormParticipants(evt.participants);
    setFormVolunteers(evt.volunteers);
    setFormFeatured(evt.featured);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      // Edit
      setEventsList(
        eventsList.map((e) =>
          e.id === editingEvent.id
            ? {
                ...e,
                titleEn: formTitleEn,
                titleGu: formTitleGu,
                category: formCategory,
                date: formDate,
                place: formPlace,
                participants: Number(formParticipants),
                volunteers: Number(formVolunteers),
                featured: formFeatured,
              }
            : e
        )
      );
    } else {
      // Add
      const newEvt = {
        id: `evt-${Date.now()}`,
        titleEn: formTitleEn,
        titleGu: formTitleGu,
        category: formCategory,
        date: formDate,
        place: formPlace,
        participants: Number(formParticipants),
        volunteers: Number(formVolunteers),
        featured: formFeatured,
        img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600",
      };
      setEventsList([newEvt, ...eventsList]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event record?")) {
      setEventsList(eventsList.filter((e) => e.id !== id));
    }
  };

  const toggleFeatured = (id: string) => {
    setEventsList(
      eventsList.map((e) => (e.id === id ? { ...e, featured: !e.featured } : e))
    );
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
                      ? "bg-[#F7E81D] text-[#121B34] shadow"
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
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            
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

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider">Event Title (English) *</label>
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
                <label className="text-slate-500 uppercase tracking-wider">Event Title (Gujarati) *</label>
                <input
                  type="text"
                  required
                  value={formTitleGu}
                  onChange={(e) => setFormTitleGu(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium font-gujarati"
                  placeholder="વૃક્ષારોપણ અભિયાન"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium cursor-pointer"
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
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                    placeholder="e.g. Jun 2023"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider">Location / Place *</label>
                <input
                  type="text"
                  required
                  value={formPlace}
                  onChange={(e) => setFormPlace(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  placeholder="Sanand, Ahmedabad, Gujarat"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Impacted Participants *</label>
                  <input
                    type="number"
                    required
                    value={formParticipants}
                    onChange={(e) => setFormParticipants(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider">Active Volunteers *</label>
                  <input
                    type="number"
                    required
                    value={formVolunteers}
                    onChange={(e) => setFormVolunteers(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>
              </div>

              {/* Multiple Upload UI Placeholder */}
              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider">Upload Event Photos (Multiple)</label>
                <div className="border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-slate-600 font-bold block">Drag & drop or browse photos</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5">JPG, PNG up to 10MB each</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  id="featured"
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label htmlFor="featured" className="text-slate-700 font-bold cursor-pointer">
                  Mark this event as featured on home banner
                </label>
              </div>

              {/* Submit Buttons */}
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
                  {editingEvent ? "Save Changes" : "Publish Event"}
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

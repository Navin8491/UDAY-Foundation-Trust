import { useState } from "react";
import { Search, Plus, Trash2, Eye, X, Upload, Grid } from "lucide-react";
import { SCHOOL_BAG_SIMPLE_GALLERY } from "@/constants/schoolEvents";

export function Gallery() {
  const [photos, setPhotos] = useState(
    SCHOOL_BAG_SIMPLE_GALLERY.map((p, idx) => ({
      id: `img-${idx}`,
      img: p.img,
      cat: p.cat,
      h: p.h,
    }))
  );

  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("Education");

  const handleUploadSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const newPhotos = [
      {
        id: `img-uploaded-${Date.now()}`,
        img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600",
        cat: uploadCategory,
        h: "regular",
      },
    ];
    setPhotos([...newPhotos, ...photos]);
    setUploadModal(false);
    alert("Simulated upload successful! Image added to the top of your gallery.");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      setPhotos(photos.filter((p) => p.id !== id));
    }
  };

  const categories = ["All", "Education", "Healthcare", "Environment", "Sports", "Relief", "Events", "Volunteers"];
  
  const filtered = photos.filter((p) => activeFilter === "All" || p.cat === activeFilter);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Gallery Management</h1>
          <p className="text-sm text-slate-500 font-medium font-gujarati font-sans">વેબસાઇટની ગેલરી ફોટોસ અને આલ્બમ્સ</p>
        </div>
        <button
          onClick={() => setUploadModal(true)}
          className="btn-primary text-xs py-2.5 px-4 cursor-pointer self-start sm:self-center"
        >
          <Upload className="h-4 w-4" /> Upload New Photos
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveFilter(c)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === c
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all relative aspect-square"
          >
            <img src={item.img} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => setLightbox(item.img)}
                className="h-9 w-9 rounded-full bg-white/95 text-slate-700 hover:bg-white flex items-center justify-center cursor-pointer shadow"
                title="Preview"
              >
                <Eye className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="h-9 w-9 rounded-full bg-rose-500 text-white hover:bg-rose-600 flex items-center justify-center cursor-pointer shadow"
                title="Delete"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
            <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-slate-600 uppercase tracking-wider">
              {item.cat}
            </span>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">Upload Gallery Images</h3>
              <button
                onClick={() => setUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUploadSimulate} className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider">Select Category *</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium cursor-pointer"
                >
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Environment">Environment</option>
                  <option value="Sports">Sports</option>
                  <option value="Relief">Relief</option>
                  <option value="Events">Events</option>
                  <option value="Volunteers">Volunteers</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider">Drag & drop files *</label>
                <div className="border border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-slate-600 font-bold block">Choose image files</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5">JPG, PNG allowed. Required.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModal(false)}
                  className="flex-1 btn-ghost text-xs py-2.5 px-4 cursor-pointer bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs py-2.5 px-4 cursor-pointer"
                >
                  Simulate Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-[95vw] rounded-2xl shadow-2xl" />
        </div>
      )}

    </div>
  );
}
export default Gallery;

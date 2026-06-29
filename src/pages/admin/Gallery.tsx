import { useState, useEffect, useRef } from "react";
import { Trash2, Eye, X, Upload, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { SCHOOL_BAG_SIMPLE_GALLERY } from "@/constants/schoolEvents";
import { fetchGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem, uploadFile } from "@/services/db";
import { toast } from "sonner";

export function Gallery() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  
  const [uploadCategory, setUploadCategory] = useState("Education");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  async function loadPhotos() {
    try {
      const items = await fetchGallery();
      if (items && items.length > 0) {
        // Ensure they have displayOrder
        const mapped = items.map((p: any, idx: number) => ({
          ...p,
          displayOrder: p.displayOrder !== undefined ? p.displayOrder : idx,
        }));
        setPhotos(mapped.sort((a, b) => a.displayOrder - b.displayOrder));
      } else {
        // Fallback
        setPhotos(SCHOOL_BAG_SIMPLE_GALLERY.map((p, idx) => ({
          id: `img-${idx}`,
          _id: `img-${idx}`,
          img: p.img,
          cat: p.cat,
          h: p.h,
          displayOrder: idx,
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    if (lightbox) {
      document.body.classList.add("body-scroll-lock");
    } else {
      document.body.classList.remove("body-scroll-lock");
    }
    return () => {
      document.body.classList.remove("body-scroll-lock");
    };
  }, [lightbox]);

  const handleBulkUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgress(0);
    const toastId = toast.loading("Uploading photos to gallery...");

    try {
      let currentMaxOrder = photos.length > 0 ? Math.max(...photos.map(p => p.displayOrder || 0)) : 0;
      
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i], "gallery", (p) => {
          setProgress(p);
          toast.loading(`Uploading photos (${i + 1}/${files.length}): ${p}%`, { id: toastId });
        });

        currentMaxOrder += 1;
        await addGalleryItem({
          img: url,
          cat: uploadCategory,
          h: "tall",
          displayOrder: currentMaxOrder,
        });
      }

      toast.success("Photos added to gallery successfully!", { id: toastId });
      await loadPhotos();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload photos.", { id: toastId });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleReplace = async (photoItem: any, file: File) => {
    setUploading(true);
    const toastId = toast.loading("Replacing gallery photo...");
    try {
      const url = await uploadFile(file, "gallery", (p) => {
        toast.loading(`Uploading replacement image: ${p}%`, { id: toastId });
      });

      // Update in MongoDB (this also deletes the old image in Cloudinary via controller)
      await updateGalleryItem(photoItem.id || photoItem._id, {
        ...photoItem,
        img: url,
      });

      toast.success("Photo replaced successfully!", { id: toastId });
      await loadPhotos();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to replace photo.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleMove = async (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === photos.length - 1) return;

    const targetIndex = direction === "left" ? index - 1 : index + 1;
    const itemA = photos[index];
    const itemB = photos[targetIndex];

    const tempOrder = itemA.displayOrder;
    itemA.displayOrder = itemB.displayOrder;
    itemB.displayOrder = tempOrder;

    const toastId = toast.loading("Saving new layout order...");
    try {
      await Promise.all([
        updateGalleryItem(itemA.id || itemA._id, { displayOrder: itemA.displayOrder }),
        updateGalleryItem(itemB.id || itemB._id, { displayOrder: itemB.displayOrder }),
      ]);
      toast.success("Order saved!", { id: toastId });
      await loadPhotos();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to swap order.", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this photo from the gallery? This action is permanent and deletes it from storage.")) {
      const toastId = toast.loading("Deleting photo...");
      try {
        await deleteGalleryItem(id);
        toast.success("Photo deleted successfully!", { id: toastId });
        await loadPhotos();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to delete photo.", { id: toastId });
      }
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
          <p className="text-sm text-slate-500 font-medium font-gujarati">વેબસાઇટની ગેલરી ફોટોસ અને આલ્બમ્સનું વ્યવસ્થાપન</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold cursor-pointer"
          >
            {categories.filter(c => c !== "All").map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary text-xs py-2.5 px-4 cursor-pointer"
          >
            <Upload className="h-4 w-4" /> Upload Photos
          </button>
        </div>
      </div>

      {/* Bulk Upload Drop Zone */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          if (!uploading) handleBulkUpload(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed border-slate-200 hover:border-primary rounded-3xl p-8 text-center cursor-pointer transition-all bg-white relative ${
          uploading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={(e) => handleBulkUpload(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Drag & drop multiple photos here, or <span className="text-primary font-bold">Browse</span>
          </p>
          <p className="text-xs text-slate-400">Photos will be assigned to category: <span className="font-bold text-slate-600 uppercase">{uploadCategory}</span></p>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-white/80 rounded-3xl flex flex-col items-center justify-center gap-2">
            <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
            <p className="text-xs font-bold text-slate-600">Uploading... {progress}%</p>
          </div>
        )}
      </div>

      {/* Stats and Filters Bar */}
      <div className="flex flex-col md:flex-row bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs items-center justify-between gap-4">
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
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
          Showing {filtered.length} of {photos.length} Total Photos
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((item, index) => (
          <div
            key={item.id || item._id}
            className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all relative aspect-square"
          >
            <img src={item.img} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            
            {/* Actions overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
              <div className="flex justify-end gap-1.5">
                <button
                  onClick={() => setLightbox(item.img)}
                  className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => replaceInputRefs.current[item.id || item._id]?.click()}
                  className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Replace"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id || item._id)}
                  className="h-8 w-8 rounded-lg bg-rose-500/90 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <input
                type="file"
                ref={(el) => { replaceInputRefs.current[item.id || item._id] = el; }}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleReplace(item, e.target.files[0]);
                  }
                }}
              />

              <div className="flex items-center justify-between">
                <span className="bg-white/95 text-slate-800 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                  {item.cat}
                </span>

                {/* Move Left / Right Buttons */}
                <div className="flex gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, "left")}
                    className="h-6 w-6 rounded bg-white/20 hover:bg-white/35 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
                    title="Move Left"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={index === filtered.length - 1}
                    onClick={() => handleMove(index, "right")}
                    className="h-6 w-6 rounded bg-white/20 hover:bg-white/35 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
                    title="Move Right"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl animate-scale-up" />
        </div>
      )}
    </div>
  );
}

export default Gallery;

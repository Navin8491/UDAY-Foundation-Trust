import { useState, useRef } from "react";
import { Upload, Trash2, ArrowLeft, ArrowRight, Star, RefreshCw, Eye, X } from "lucide-react";
import { uploadFile } from "@/services/db";
import { toast } from "sonner";

interface ImageManagerProps {
  images: string[];
  coverImage?: string;
  onChange: (images: string[], coverImage: string) => void;
  folder: string;
  singleOnly?: boolean;
}

export function ImageManager({ images = [], coverImage = "", onChange, folder, singleOnly = false }: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    const toastId = toast.loading("Uploading images...");
    
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i], folder, (p) => {
          setProgress(p);
          toast.loading(`Uploading images (${i + 1}/${files.length}): ${p}%`, { id: toastId });
        });
        uploadedUrls.push(url);
      }
      
      let newImages = [...images];
      if (singleOnly) {
        newImages = [uploadedUrls[0]];
      } else {
        newImages = [...newImages, ...uploadedUrls];
      }
      
      const newCover = coverImage && newImages.includes(coverImage) ? coverImage : (newImages[0] || "");
      
      onChange(newImages, newCover);
      toast.success("Images uploaded successfully!", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload images.", { id: toastId });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (uploading) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDelete = (index: number) => {
    const urlToDelete = images[index];
    const newImages = images.filter((_, i) => i !== index);
    let newCover = coverImage;
    if (coverImage === urlToDelete) {
      newCover = newImages[0] || "";
    }
    onChange(newImages, newCover);
  };

  const handleReplace = async (index: number, file: File) => {
    setUploading(true);
    const toastId = toast.loading("Replacing image...");
    try {
      const url = await uploadFile(file, folder, (p) => {
        toast.loading(`Uploading replacement image: ${p}%`, { id: toastId });
      });
      const newImages = [...images];
      const oldUrl = newImages[index];
      newImages[index] = url;
      
      let newCover = coverImage;
      if (coverImage === oldUrl) {
        newCover = url;
      }
      onChange(newImages, newCover);
      toast.success("Image replaced successfully!", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to replace image.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleMove = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === images.length - 1) return;
    
    const newImages = [...images];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    
    // Swap
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    
    onChange(newImages, coverImage);
  };

  const setAsCover = (url: string) => {
    onChange(images, url);
  };

  return (
    <div className="space-y-4">
      {/* Upload Drop Zone */}
      {(!singleOnly || images.length === 0) && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-slate-200 hover:border-primary rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50 hover:bg-slate-100/50 relative ${
            uploading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple={!singleOnly}
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-500">
              <Upload className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Drag & drop image(s) here, or <span className="text-primary font-bold">Browse</span>
            </p>
            <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP up to 5MB each</p>
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-white/80 rounded-2xl flex flex-col items-center justify-center gap-2">
              <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
              <p className="text-xs font-bold text-slate-600">Uploading... {progress}%</p>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Images List Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>UPLOADED IMAGES ({images.length})</span>
            {!singleOnly && <span>* First image is cover by default</span>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((url, index) => {
              const isCover = coverImage === url || (!coverImage && index === 0);
              return (
                <div
                  key={`${url}-${index}`}
                  className={`group bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs relative aspect-square transition-all ${
                    isCover ? "ring-2 ring-primary border-transparent" : ""
                  }`}
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  
                  {/* Badges */}
                  {isCover && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="h-2.5 w-2.5 fill-current" /> COVER
                    </span>
                  )}

                  {/* Actions Layer */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setZoomImage(url)}
                        className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                        title="Zoom Image"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => replaceInputRefs.current[index]?.click()}
                        className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                        title="Replace Image"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="h-7 w-7 rounded-lg bg-rose-500/90 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={(el) => { replaceInputRefs.current[index] = el; }}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleReplace(index, e.target.files[0]);
                        }
                      }}
                    />

                    {/* Footer Controls (Reordering & Cover Select) */}
                    <div className="flex items-center justify-between gap-1 mt-auto">
                      {!singleOnly && !isCover && (
                        <button
                          type="button"
                          onClick={() => setAsCover(url)}
                          className="text-[10px] font-bold bg-white/25 hover:bg-white/35 px-2 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          Make Cover
                        </button>
                      )}
                      
                      {!singleOnly && (
                        <div className="flex gap-1 ml-auto">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMove(index, "left")}
                            className="h-6 w-6 rounded bg-white/20 hover:bg-white/35 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
                          >
                            <ArrowLeft className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === images.length - 1}
                            onClick={() => handleMove(index, "right")}
                            className="h-6 w-6 rounded bg-white/20 hover:bg-white/35 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Portal */}
      {zoomImage && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setZoomImage(null)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
          <img src={zoomImage} alt="" className="max-h-full max-w-full object-contain rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
}

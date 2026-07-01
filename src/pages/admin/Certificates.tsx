import { useState, useEffect } from "react";
import { Upload, FileText, Trash2, Eye, X } from "lucide-react";
import { fetchCertificates, addCertificate, deleteCertificate, uploadFile } from "@/services/db";
import { toast } from "sonner";

const INITIAL_CERTIFICATES = [
  { id: "CERT-01", name: "80G Tax Exemption Certificate", file: "uday_trust_80g_2024.pdf", size: "1.4 MB", date: "2024-03-12" },
  { id: "CERT-02", name: "12A Registration Certificate", file: "uday_trust_12a_approved.pdf", size: "2.1 MB", date: "2024-03-12" },
  { id: "CERT-03", name: "Trust Deed Registration", file: "uday_foundation_deed_signed.pdf", size: "4.8 MB", date: "2019-11-05" },
  { id: "CERT-04", name: "NGO Darpan Registration ID", file: "darpan_id_card_uday.pdf", size: "850 KB", date: "2022-06-20" },
];

export function Certificates() {
  const [certs, setCerts] = useState<any[]>([]);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  
  const [formName, setFormName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  async function loadCerts() {
    try {
      setFetching(true);
      const items = await fetchCertificates();
      if (items && items.length > 0) {
        const mapped = items.map((c: any) => ({
          id: c.id || "",
          name: c.label,
          file: c.file,
          size: "PDF Document", // actual size not stored in DB
          date: c.uploadedAt ? c.uploadedAt.split("T")[0] : new Date().toISOString().split("T")[0],
        }));
        setCerts(mapped);
      } else {
        setCerts([]);
      }
    } catch (e) {
      console.error(e);
      setCerts([]);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    loadCerts();
  }, []);

  useEffect(() => {
    if (previewFile) {
      document.body.classList.add("body-scroll-lock");
    } else {
      document.body.classList.remove("body-scroll-lock");
    }
    return () => {
      document.body.classList.remove("body-scroll-lock");
    };
  }, [previewFile]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this statutory certificate file?")) {
      const toastId = toast.loading("Deleting document...");
      try {
        await deleteCertificate(id);
        toast.success("Document deleted successfully!", { id: toastId });
        await loadCerts();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to delete document.", { id: toastId });
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formName) {
      toast.error("Please provide a name and select a PDF file.");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Uploading statutory certificate... 0%");
    try {
      const url = await uploadFile(selectedFile, "transparency", (progress) => {
        toast.loading(`Uploading statutory certificate... ${progress}%`, { id: toastId });
      });
      await addCertificate({
        label: formName,
        value: "Statutory Registry Document",
        desc: "Statutory registry certificate",
        file: url,
        category: "certificate",
      });
      toast.success("Statutory document uploaded successfully!", { id: toastId });
      setFormName("");
      setSelectedFile(null);
      await loadCerts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload document.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Certificates</h1>
        <p className="text-sm text-slate-500 font-medium font-gujarati">૮૦જી, ૧૨એ અને ટ્રસ્ટ રજીસ્ટ્રેશન પ્રમાણપત્રોનું સંચાલન</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Upload Form (Left side, takes 1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-800">Upload New Certificate</h3>
            <p className="text-[10px] text-slate-400 font-bold block mt-0.5">MANAGE statutory trust credentials</p>
          </div>
          <form onSubmit={handleUpload} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase tracking-wider">Document Name *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary text-sm font-medium"
                placeholder="e.g. CSR-1 Registration Certificate"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase tracking-wider">Select PDF File *</label>
              <div className="relative border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  required
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="h-7 w-7 text-slate-400 mb-2" />
                <span className="text-slate-600 font-bold block text-[11px]">
                  {selectedFile ? selectedFile.name : "Select certificate file"}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold mt-0.5">PDF limit 5MB</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-xs py-2.5 px-4 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </form>
        </div>

        {/* List of Files (Right side, takes 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {fetching ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4 w-full">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex-none" />
                  <div className="space-y-2 w-1/2">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-slate-100 rounded-lg" />
                  <div className="h-8 w-8 bg-slate-100 rounded-lg" />
                </div>
              </div>
            ))
          ) : certs.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs text-center text-slate-400 font-bold">
              No statutory documents found.
            </div>
          ) : certs.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#4040A1]/10 text-primary flex items-center justify-center flex-none">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{c.name}</h3>
                  <div className="text-[10px] text-slate-400 font-bold block mt-1.5 uppercase tracking-wider">
                    {c.file} • {c.size} • Uploaded {c.date}
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5 self-start md:self-center">
                <button
                  onClick={() => window.open(c.file, "_blank")}
                  className="h-9 w-9 rounded-xl border border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-500 flex items-center justify-center cursor-pointer"
                  title="Preview PDF"
                >
                  <Eye className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="h-9 w-9 rounded-xl border border-rose-100 hover:bg-rose-50 text-rose-500 flex items-center justify-center cursor-pointer"
                  title="Delete Certificate"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Preview PDF Lightbox Overlay */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-up">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">Preview: {previewFile}</span>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Mock PDF Viewer Frame */}
            <div className="bg-slate-100 w-full flex-1 flex flex-col items-center justify-center text-center p-8 overflow-y-auto max-h-[70vh] sm:aspect-[16/11]">
              <FileText className="h-16 w-16 text-slate-400 mb-3 animate-pulse" />
              <h3 className="font-bold text-slate-700 text-sm">PDF Document Sandbox</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">This is a frontend mock document renderer representation. In production, this renders the actual PDF securely.</p>
              <button
                onClick={() => alert("Simulated PDF Download")}
                className="btn-primary text-xs py-2 px-4 mt-6 cursor-pointer"
              >
                Download Raw File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default Certificates;

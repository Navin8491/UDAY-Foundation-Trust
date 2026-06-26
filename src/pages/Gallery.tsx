import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { useLanguage } from "@/context/LanguageContext";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import imgHealth from "@/assets/program-health.jpg";
import imgEdu from "@/assets/program-education.jpg";
import imgTrees from "@/assets/program-trees.jpg";
import imgRation from "@/assets/activity-ration.jpg";
import imgChildren from "@/assets/hero-children.jpg";
import { SCHOOL_BAG_SIMPLE_GALLERY } from "@/constants/schoolEvents";

const ITEMS = [
  ...SCHOOL_BAG_SIMPLE_GALLERY,
  { img: imgChildren, cat: "Community", h: "tall" },
  { img: imgHealth, cat: "Healthcare", h: "tall" },
  { img: imgEdu, cat: "Education", h: "short" },
  { img: imgTrees, cat: "Environment", h: "tall" },
  { img: imgRation, cat: "Relief", h: "short" },
  { img: imgChildren, cat: "Events", h: "short" },
  { img: imgHealth, cat: "Healthcare", h: "short" },
  { img: imgTrees, cat: "Volunteers", h: "tall" },
  { img: imgEdu, cat: "Education", h: "tall" },
];

const CATS = [
  "All",
  "Community",
  "Healthcare",
  "Education",
  "Environment",
  "Relief",
  "Events",
  "Volunteers",
];

export function Gallery() {
  const { t } = useLanguage();
  useDocumentMetadata(
    "Gallery — Moments of Service | Uday Foundation Trust",
    "Photographs from medical camps, education drives, plantation campaigns and community service by Uday Foundation Trust.",
  );

  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const visible = ITEMS.filter((i) => filter === "All" || i.cat === filter);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments that move us forward."
        subtitle="Service captured — from the smallest smile to the largest plantation drive."
        bgImage={imgChildren}
        breadcrumbActive={t("nav.gallery")}
      />

      <section className="container-page py-10">
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                filter === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground/80 hover:border-primary/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {visible.map((it, i) => (
            <button
              key={i}
              onClick={() => setLightbox(it.img)}
              className="mb-4 block w-full break-inside-avoid rounded-2xl overflow-hidden bg-surface border border-border hover:border-primary/40 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className={`relative ${it.h === "tall" ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                <img
                  src={it.img}
                  alt={it.cat}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 bg-white border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{it.cat}</span>
                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  View
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img src={lightbox} alt="" className="max-h-[88vh] max-w-[92vw] rounded-2xl shadow-2xl" />
        </div>
      )}
    </>
  );
}

export default Gallery;

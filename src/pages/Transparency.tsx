import { PageHero } from "@/components/site/PageHero";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import { BadgeCheck, FileText, ShieldCheck, Download } from "lucide-react";
import { SITE } from "@/constants/site";
import { useState, useEffect } from "react";
import { subscribeTransparencyDocs } from "@/services/db";

import { DOCS } from "@/constants/transparency";

export function Transparency() {
  const [docsList, setDocsList] = useState(DOCS);

  useEffect(() => {
    const unsubscribe = subscribeTransparencyDocs((items) => {
      if (items && items.length > 0) {
        const mapped = items.map((item) => ({
          label: item.label,
          value: item.value,
          desc: item.desc,
          file: item.file,
        }));
        setDocsList(mapped);
      }
    });
    return () => unsubscribe();
  }, []);

  useDocumentMetadata(
    "Transparency & Registrations | Uday Foundation Trust",
    "All registrations, certifications and trust documents of Uday Foundation Trust — 12A, 80G, DARPAN, PAN and more.",
  );

  return (
    <>
      <PageHero
        eyebrow="Transparency"
        title="Verified, certified and accountable."
        subtitle="Every certificate, every registration, every document — open to view."
        bgImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1600&auto=format&fit=crop"
        breadcrumbActive="Transparency"
      />

      <section className="section-y">
        <div className="container-page grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {docsList.map((d) => (
            <article
              key={d.label}
              className="rounded-2xl p-6 bg-surface border border-border hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <a
                  href={d.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open ${d.label} Certificate`}
                  className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all shadow-xs hover:shadow border border-primary/15 cursor-pointer"
                >
                  <FileText className="h-5 w-5" />
                </a>
                <div className="h-11 w-11 rounded-xl bg-leaf/10 text-leaf flex items-center justify-center">
                  <BadgeCheck className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-5 text-lg font-display font-semibold">{d.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
              <div className="mt-4 font-mono text-sm break-all p-3 rounded-lg bg-surface-warm border border-border">
                {d.value}
              </div>
            </article>
          ))}
        </div>

        <div className="container-page mt-12">
          <div className="rounded-3xl p-8 md:p-10 bg-primary text-primary-foreground flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <ShieldCheck className="h-10 w-10 text-secondary" />
              <div>
                <div className="font-display text-xl md:text-2xl font-semibold">
                  Annual reports & financials
                </div>
                <div className="text-primary-foreground/80 text-sm">
                  Available on request. Email udayfts1024@gmail.com.
                </div>
              </div>
            </div>
            <a href={`mailto:${SITE.email}`} className="btn-saffron">
              <Download className="h-4 w-4" /> Request report
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Transparency;

import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import {
  Heart,
  ShieldCheck,
  FileCheck2,
  BadgeCheck,
  GraduationCap,
  Stethoscope,
  Sprout,
  Users,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Donate() {
  const [selected, setSelected] = useState(2500);
  const [custom, setCustom] = useState("");
  const { t } = useLanguage();

  const amount = custom ? Number(custom) : selected;

  useDocumentMetadata(
    "Donate — Support Rural Gujarat | Uday Foundation Trust",
    "Donate to Uday Foundation Trust and transform lives. 80G tax exempt. Choose from impact-based amounts or enter your own.",
  );

  const AMOUNTS = [
    { value: 500, impact: t("act.ration.desc") },
    { value: 1000, impact: t("act.edu.desc") },
    { value: 2500, impact: t("act.health.desc") },
    { value: 5000, impact: t("act.env.desc") },
    { value: 10000, impact: t("prog.health.desc") },
    { value: 25000, impact: t("prog.edu.desc") },
  ];

  const IMPACT = [
    { Icon: GraduationCap, label: t("prog.edu") },
    { Icon: Stethoscope, label: t("prog.health") },
    { Icon: Sprout, label: t("prog.env") },
    { Icon: Users, label: t("prog.human") },
  ];

  return (
    <>
      <PageHero eyebrow={t("nav.donate")} title={t("donate.title")} subtitle={t("donate.desc")} />

      <section className="section-y bg-surface">
        <div className="container-page grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-surface border border-border p-7 md:p-10 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-display font-semibold">
                {t("donate.card.title")}
              </h2>
              <p className="mt-2 text-muted-foreground">{t("donate.amount.label")}</p>

              <div className="mt-7 grid sm:grid-cols-2 gap-3">
                {AMOUNTS.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => {
                      setSelected(a.value);
                      setCustom("");
                    }}
                    className={`text-left rounded-2xl p-5 border-2 transition-all cursor-pointer ${
                      selected === a.value && !custom
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="font-display text-2xl font-semibold">
                      ₹{a.value.toLocaleString("en-IN")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {a.impact}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-muted-foreground">
                  {t("donate.custom.placeholder")}
                </label>
                <input
                  type="number"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="₹ Amount"
                  className="mt-2 w-full rounded-xl border border-border bg-surface-warm px-4 py-3 text-lg font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <button className="mt-7 w-full btn-saffron text-base py-4 cursor-pointer">
                <Heart className="h-5 w-5 animate-pulse" /> {t("donate.submit")} : ₹
                {amount ? amount.toLocaleString("en-IN") : 0}
              </button>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                {t("donate.benefit.desc")}
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl p-7 bg-surface-warm border border-border">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-leaf" /> {t("donate.benefit.title")}
              </h3>
              <ul className="mt-4 space-y-3 text-sm font-medium">
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 mt-0.5 text-primary flex-none" /> {t("cert.trust")}{" "}
                  ({t("cert.trust.desc")})
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 mt-0.5 text-primary flex-none" /> {t("cert.12a")} &{" "}
                  {t("cert.80g")} — {t("donate.benefit.point1")}
                </li>
                <li className="flex items-start gap-2">
                  <FileCheck2 className="h-4 w-4 mt-0.5 text-primary flex-none" />{" "}
                  {t("cert.darpan")} ({t("cert.darpan.desc")})
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 mt-0.5 text-primary flex-none" />{" "}
                  {t("donate.benefit.point2")} & {t("donate.benefit.point3")}
                </li>
              </ul>
            </div>

            <div className="rounded-3xl p-7 bg-[#121B34] text-white border border-[#29324A]">
              <h3 className="font-display text-xl font-semibold">{t("donate.benefit.title")}</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {IMPACT.map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-white/10 p-3 flex items-center gap-2 text-sm font-semibold"
                  >
                    <Icon className="h-4 w-4 text-[#F7E81D]" /> {label}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Donate;

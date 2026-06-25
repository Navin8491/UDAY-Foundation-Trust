import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Sparkles,
  GraduationCap,
  Stethoscope,
  Sprout,
  Users,
  ShieldCheck,
  HandHeart,
  Baby,
  HomeIcon,
  Quote,
  MapPin,
  Calendar,
  ChevronRight,
  BadgeCheck,
  FileCheck2,
} from "lucide-react";
import heroChildren from "@/assets/hero-children.jpg";
import imgHealth from "@/assets/program-health.jpg";
import imgEdu from "@/assets/program-education.jpg";
import imgTrees from "@/assets/program-trees.jpg";
import imgRation from "@/assets/activity-ration.jpg";
import president from "@/assets/president.jpg";
import { SITE } from "@/constants/site";
import { Counter } from "@/components/site/Counter";
import { useLanguage } from "@/context/LanguageContext";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";

const TRUST = [
  { label: "Trust Reg.", value: "Guj/23016/Ahmedabad" },
  { label: "F Registration", value: "F/22598/Ahmedabad" },
  { label: "DARPAN", value: "GJ/2026/0930211" },
  { label: "12A Certified", value: "AABTU5153HE20251" },
  { label: "80G Certified", value: "AABTU5153HF20261" },
  { label: "PAN", value: "AABTU5153H" },
];

export function Home() {
  const { t } = useLanguage();

  useDocumentMetadata(
    "Uday Foundation Trust, Sanand — Premium NGO for Education, Healthcare & Rural Uplift",
    "Uday Foundation Trust serves rural Gujarat through education, healthcare, women empowerment, environment and humanitarian relief — one family at a time.",
  );

  const STATS = [
    { value: 12000, suffix: "+", label: t("impact.stat.families") },
    { value: 4500, suffix: "+", label: t("impact.stat.students") },
    { value: 38, suffix: "", label: t("impact.stat.camps") },
    { value: 25000, suffix: "+", label: t("impact.stat.trees") },
    { value: 650, suffix: "+", label: t("impact.stat.volunteers") },
    { value: 120, suffix: "+", label: t("impact.stat.villages") },
  ];

  const PROGRAMS = [
    {
      Icon: GraduationCap,
      title: t("prog.edu"),
      desc: t("prog.edu.desc"),
      color: "var(--primary)",
    },
    {
      Icon: Stethoscope,
      title: t("prog.health"),
      desc: t("prog.health.desc"),
      color: "var(--leaf)",
    },
    { Icon: HandHeart, title: t("prog.women"), desc: t("prog.women.desc"), color: "var(--rose)" },
    { Icon: Baby, title: t("prog.child"), desc: t("prog.child.desc"), color: "var(--accent)" },
    { Icon: Sprout, title: t("prog.env"), desc: t("prog.env.desc"), color: "var(--leaf)" },
    { Icon: HomeIcon, title: t("prog.rural"), desc: t("prog.rural.desc"), color: "var(--saffron)" },
    {
      Icon: ShieldCheck,
      title: t("prog.disaster"),
      desc: t("prog.disaster.desc"),
      color: "var(--primary)",
    },
    { Icon: Users, title: t("prog.human"), desc: t("prog.human.desc"), color: "var(--accent)" },
  ];

  const ACTIVITIES = [
    {
      img: imgRation,
      tag: t("act.ration.tag"),
      title: t("act.ration.title"),
      desc: t("act.ration.desc"),
    },
    {
      img: imgHealth,
      tag: t("act.health.tag"),
      title: t("act.health.title"),
      desc: t("act.health.desc"),
    },
    { img: imgEdu, tag: t("act.edu.tag"), title: t("act.edu.title"), desc: t("act.edu.desc") },
    { img: imgTrees, tag: t("act.env.tag"), title: t("act.env.title"), desc: t("act.env.desc") },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden hero-gradient">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--primary) 18%, transparent) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container-page relative pt-10 md:pt-16 pb-20 md:pb-28 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="chip">
              <Sparkles className="h-3.5 w-3.5" /> {t("hero.chip")}
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl lg:text-7xl font-semibold text-balance leading-[1.05]">
              {t("hero.title1")} <span className="text-primary">{t("hero.title2")}</span>.
            </h1>
            <p className="font-gujarati text-xl md:text-2xl mt-5 text-foreground/85 leading-relaxed">
              {t("hero.tagline")}
            </p>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-xl">
              {t("hero.desc")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/donate" className="btn-saffron text-base">
                <Heart className="h-5 w-5" /> {t("hero.donate")}
              </Link>
              <Link to="/get-involved" className="btn-primary text-base">
                {t("hero.volunteer")} <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-leaf" /> {t("hero.badge1")}
              </span>
              <span className="inline-flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-primary" /> {t("hero.badge2")}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" /> {t("hero.badge3")}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <div className="relative aspect-[4/5] md:aspect-[5/6] max-w-[560px] mx-auto">
              <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-secondary/40 blur-2xl" />
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-accent/30 blur-3xl" />
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden ring-1 ring-primary/15 shadow-2xl">
                <img
                  src={heroChildren}
                  alt="Children of rural Gujarat"
                  className="h-full w-full object-cover"
                  width={1536}
                  height={1024}
                />
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/60 to-transparent text-white">
                  <div className="text-xs uppercase tracking-[0.2em] opacity-80">
                    Featured Story
                  </div>
                  <div className="font-display text-xl mt-1">Bringing dignity to 120+ villages</div>
                </div>
              </div>
              <div className="absolute -left-4 md:-left-10 top-1/3 glass-card p-4 w-44 hidden sm:block animate-float-soft">
                <div className="text-3xl font-display text-primary">
                  <Counter to={12} suffix="K+" />
                </div>
                <div className="text-xs text-muted-foreground">{t("hero.stats1")}</div>
              </div>
              <div
                className="absolute -right-3 md:-right-6 bottom-10 glass-card p-4 hidden sm:flex items-center gap-3 animate-float-soft"
                style={{ animationDelay: "1.5s" }}
              >
                <img src={SITE.logo} alt="" className="h-10 w-10 rounded-full" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t("hero.verified")}
                  </div>
                  <div className="text-sm font-semibold">12A · 80G · DARPAN</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="section-y bg-surface">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="chip">
                <Heart className="h-3.5 w-3.5" /> {t("impact.chip")}
              </div>
              <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-balance">
                {t("impact.title")}
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md">{t("impact.desc")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-surface-warm border border-border p-5 md:p-6 hover:border-primary/40 transition-colors"
              >
                <div className="text-3xl md:text-4xl font-display font-semibold text-primary">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESIDENT MESSAGE */}
      <section className="section-y bg-surface-warm">
        <div className="container-page grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] max-w-[440px] rounded-[2rem] overflow-hidden ring-1 ring-primary/15 shadow-xl">
              <img
                src={president}
                alt="President Gulabbhai Khodabhai Bauddh"
                className="h-full w-full object-cover"
                width={1024}
                height={1536}
                loading="lazy"
              />
            </div>
            <div className="glass-card p-4 md:p-5 mt-4 max-w-[440px]">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t("pres.role")}
              </div>
              <div className="font-display text-lg md:text-xl mt-1">Gulabbhai Khodabhai Bauddh</div>
              <div className="text-sm text-muted-foreground">Uday Foundation Trust</div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="chip">
              <Quote className="h-3.5 w-3.5" /> {t("pres.chip")}
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-semibold leading-tight text-balance">
              {t("pres.title")}
            </h2>
            <p className="font-gujarati text-xl md:text-2xl mt-6 text-primary leading-relaxed">
              {t("pres.quote")}
            </p>
            <p className="font-gujarati mt-5 text-foreground/80 leading-loose">{t("pres.body")}</p>
            <div className="mt-7">
              <Link to="/about" className="btn-ghost text-sm">
                {t("pres.readMore")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="section-y">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <div className="chip mx-auto">
              <Sparkles className="h-3.5 w-3.5" /> {t("prog.chip")}
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-balance">
              {t("prog.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">{t("prog.desc")}</p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROGRAMS.map(({ Icon, title, desc, color }) => (
              <div
                key={title}
                className="group relative rounded-2xl bg-surface border border-border p-6 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40 transition-all"
              >
                <div
                  className="h-12 w-12 rounded-xl inline-flex items-center justify-center mb-5"
                  style={{ background: `color-mix(in oklab, ${color} 12%, transparent)`, color }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-display font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <Link
                  to="/programs"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {t("prog.learnMore")} <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ACTIVITIES */}
      <section className="section-y bg-surface">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="chip">
                <Calendar className="h-3.5 w-3.5" /> {t("act.chip")}
              </div>
              <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-balance">
                {t("act.title")}
              </h2>
            </div>
            <Link to="/projects" className="btn-ghost text-sm self-start md:self-end">
              {t("act.viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ACTIVITIES.map((a, i) => (
              <article
                key={a.title}
                className={`group rounded-3xl overflow-hidden bg-surface-warm border border-border ${i === 0 ? "md:row-span-2" : ""}`}
              >
                <div
                  className={`relative overflow-hidden ${i === 0 ? "aspect-[4/5]" : "aspect-[16/10]"}`}
                >
                  <img
                    src={a.img}
                    alt={a.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <span className="chip text-primary bg-primary/10 border-primary/20">
                      {a.tag}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-semibold">{a.title}</h3>
                  <p className="mt-2 text-muted-foreground">{a.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section className="section-y">
        <div className="container-page grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="chip">
              <ShieldCheck className="h-3.5 w-3.5" /> {t("trans.chip")}
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-balance">
              {t("trans.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">{t("trans.desc")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/transparency" className="btn-primary text-sm">
                {t("trans.viewDocs")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/donate" className="btn-ghost text-sm">
                {t("trans.eligible")}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
            {TRUST.map((t) => (
              <div
                key={t.label}
                className="rounded-2xl p-5 border border-border bg-surface flex items-start gap-4 hover:border-primary/40 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t.label}
                  </div>
                  <div className="font-mono text-sm mt-1 break-all">{t.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground p-10 md:p-16">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, var(--secondary) 0, transparent 35%), radial-gradient(circle at 80% 80%, var(--accent) 0, transparent 40%)",
            }}
          />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-semibold text-balance">{t("cta.title")}</h2>
              <p className="font-gujarati mt-4 text-primary-foreground/85 text-lg">
                {t("cta.subtitle")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/donate" className="btn-saffron">
                {t("cta.donate")} <Heart className="h-4 w-4" />
              </Link>
              <Link
                to="/get-involved"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold border border-white/30 hover:bg-white/10 transition-colors"
              >
                {t("cta.volunteer")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;

import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
import {
  Target,
  Compass,
  Heart,
  ShieldCheck,
  Sparkles,
  Quote,
  Calendar,
  FileText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import heroChildren from "@/assets/hero-children.jpg";
import president from "@/assets/president.jpg";
import { SITE } from "@/constants/site";
import { useLanguage } from "@/context/LanguageContext";
import { Counter } from "@/components/site/Counter";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";

export function About() {
  const { t } = useLanguage();

  useDocumentMetadata(
    "About Uday Foundation Trust — Mission, Vision & Journey",
    "Born of a single vow — that no human be left behind. Learn the story, mission, vision and values of Uday Foundation Trust, Sanand.",
  );

  return (
    <div className="bg-[#F8FAFF] min-h-screen">
      {/* SECTION 1: HERO BANNER */}
      <PageHero
        eyebrow={t("about.hero.chip")}
        title={t("about.hero.title")}
        subtitle={t("about.hero.desc")}
        bgImage={heroChildren}
        breadcrumbActive={t("nav.about")}
      />

      {/* SECTION 2: ORGANIZATION STORY */}
      <section className="py-16 md:py-24 bg-white">
        <div className="about-section-container grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Side: Story Image */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-[#4040A1]/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-[#F7E81D]/20 blur-3xl pointer-events-none" />

            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-[2rem] overflow-hidden ring-1 ring-primary/10 shadow-2xl">
              <img
                src={heroChildren}
                alt="Children of rural Gujarat supported by Uday Foundation Trust"
                className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
            </div>
            <div className="mt-4 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="text-primary font-bold">Serving Gujarat</span>
              <span>Uday Foundation Trust Sanand</span>
            </div>
          </div>

          {/* Right Side: Story Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
              <Heart className="h-3 w-3 text-primary fill-primary" />
              <span>{t("about.story.chip")}</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight mb-6">
              {t("about.story.title")}
            </h2>

            <div className="space-y-5 text-slate-600 text-sm md:text-base leading-relaxed">
              <p className="font-gujarati">{t("about.story.body1")}</p>
              <p className="font-gujarati">{t("about.story.body2")}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/donate" className="btn-saffron text-sm">
                <Heart className="h-4 w-4" /> {t("hero.donate")}
              </Link>
              <Link to="/contact" className="btn-ghost text-sm">
                {t("nav.contact")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: VISION & MISSION */}
      <section className="py-16 md:py-24 bg-[#F8FAFF]">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary bg-primary/10 rounded-full mb-4">
              FOCUS & COMPASS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
              Our Vision & Mission
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Vision Card */}
            <div className="about-card-premium border-t-4 border-primary h-full">
              <div className="h-16 w-16 rounded-2xl bg-[#4040A1]/10 text-primary flex items-center justify-center mb-6">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">
                {t("about.vision.title")}
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-gujarati">
                {t("about.vision.desc")}
              </p>
            </div>

            {/* Mission Card */}
            <div className="about-card-premium border-t-4 border-[#7A9D1C] h-full">
              <div className="h-16 w-16 rounded-2xl bg-[#7A9D1C]/10 text-[#7A9D1C] flex items-center justify-center mb-6">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">
                {t("about.mission.title")}
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-gujarati">
                {t("about.mission.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CORE VALUES */}
      <section className="py-16 md:py-24 bg-white">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#7A9D1C] bg-[#7A9D1C]/10 rounded-full mb-4">
              GUIDING PRINCIPLES
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
              {t("about.values.title")}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                Icon: Heart,
                bgClass: "bg-amber-50 text-amber-500",
                title: t("about.values.service.title"),
                desc: t("about.values.service.desc"),
              },
              {
                Icon: ShieldCheck,
                bgClass: "bg-blue-50 text-blue-500",
                title: t("about.values.transparency.title"),
                desc: t("about.values.transparency.desc"),
              },
              {
                Icon: Sparkles,
                bgClass: "bg-emerald-50 text-emerald-500",
                title: t("about.values.focus.title"),
                desc: t("about.values.focus.desc"),
              },
            ].map(({ Icon, bgClass, title, desc }) => (
              <div
                key={title}
                className="about-card-premium h-full items-center text-center p-8 lg:p-10 border border-border"
              >
                <div
                  className={`h-16 w-16 rounded-full ${bgClass} flex items-center justify-center mb-6 shadow-sm`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: IMPACT / STATISTICS */}
      <section className="py-16 md:py-20 bg-[#4040A1] text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#F7E81D]/10 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="about-section-container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#F7E81D] bg-[#F7E81D]/15 rounded-full mb-4">
              MEASURING SUCCESS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
              {t("impact.title")}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { value: 12000, suffix: "+", label: t("impact.stat.families") },
              { value: 4500, suffix: "+", label: t("impact.stat.students") },
              { value: 38, suffix: "", label: t("impact.stat.camps") },
              { value: 25000, suffix: "+", label: t("impact.stat.trees") },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 text-center hover:bg-white/15 transition-all shadow-lg"
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-[#F7E81D]">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-3 text-xs md:text-sm font-semibold tracking-wider text-white/90 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: LEADERSHIP MESSAGE */}
      <section className="py-16 md:py-24 bg-white">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary bg-primary/10 rounded-full mb-4">
              FROM THE PRESIDENT
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
              Leadership Message
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="about-card-premium border-t-4 border-[#F7E81D] max-w-5xl mx-auto">
            <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Photo Column */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="relative aspect-[3/4] w-full max-w-[280px] rounded-[2rem] overflow-hidden ring-4 ring-[#4040A1]/10 shadow-xl">
                  <img
                    src={president}
                    alt="President Gulabbhai Khodabhai Bauddh"
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="text-center mt-5">
                  <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-2">
                    {t("pres.role")}
                  </span>
                  <h4 className="text-xl font-display font-bold text-slate-900">
                    Gulabbhai Khodabhai Bauddh
                  </h4>
                  <p className="text-sm text-slate-500 font-medium">Uday Foundation Trust</p>
                </div>
              </div>

              {/* Message Column */}
              <div className="md:col-span-8 relative">
                <Quote className="absolute -top-6 -left-6 h-16 w-16 text-slate-100 pointer-events-none z-0" />
                <div className="relative z-10 space-y-6">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-primary italic leading-tight">
                    {t("pres.title")}
                  </h3>
                  <div className="w-12 h-1 bg-primary/20 rounded" />
                  <p className="font-gujarati text-lg text-primary/90 font-medium leading-relaxed bg-[#F8FAFF] p-4 rounded-2xl border-l-4 border-primary">
                    {t("pres.quote")}
                  </p>
                  <p className="font-gujarati text-slate-600 text-sm md:text-base leading-loose whitespace-pre-line">
                    {t("pres.body")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: TIMELINE / JOURNEY */}
      <section className="py-16 md:py-24 bg-[#F8FAFF]">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#7A9D1C] bg-[#7A9D1C]/10 rounded-full mb-4">
              MILESTONES
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
              {t("about.timeline.title")}
            </h2>
            <p className="text-slate-500 mt-4 text-sm md:text-base leading-relaxed">
              {t("about.timeline.subtitle")}
            </p>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline center line */}
            <div className="timeline-line" />

            <div className="space-y-12">
              {[
                {
                  year: t("about.timeline.1.year"),
                  title: t("about.timeline.1.title"),
                  desc: t("about.timeline.1.desc"),
                },
                {
                  year: t("about.timeline.2.year"),
                  title: t("about.timeline.2.title"),
                  desc: t("about.timeline.2.desc"),
                },
                {
                  year: t("about.timeline.3.year"),
                  title: t("about.timeline.3.title"),
                  desc: t("about.timeline.3.desc"),
                },
              ].map((milestone, idx) => (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-start ${idx % 2 === 0 ? "md:justify-start" : "md:justify-end"
                    } w-full`}
                >
                  {/* Circle dot on line */}
                  <div className="timeline-dot timeline-dot-trigger" />

                  {/* Card wrapper */}
                  <div
                    className={`w-full md:w-[45%] pl-8 md:pl-0 ${idx % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}
                  >
                    <div className="about-card-premium border border-border bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="inline-block text-xs font-bold text-primary tracking-wider uppercase bg-primary/10 px-2.5 py-1 rounded-md">
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-display font-bold text-slate-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed font-gujarati">
                        {milestone.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST REGISTRATION & DOCUMENTS */}
      <section className="py-16 md:py-24 bg-white border-t border-border">
        <div className="about-section-container">
          <div className="about-card-premium max-w-4xl mx-auto border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                  {t("about.reg.title")}
                </h2>
                <p className="text-sm text-slate-500 mt-1">{t("about.reg.subtitle")}</p>
              </div>
            </div>

            {/* Document Details Table */}
            <div className="divide-y divide-slate-100 text-sm md:text-base mb-8 mt-6">
              {[
                { label: t("about.reg.trust.label"), value: SITE.registrations["Trust Reg."] },
                { label: t("about.reg.f.label"), value: SITE.registrations["F Reg."] },
                { label: t("about.reg.darpan.label"), value: SITE.registrations["DARPAN"] },
                { label: t("about.reg.date.label"), value: SITE.established },
                { label: t("about.reg.pan.label"), value: SITE.registrations["PAN"] },
                { label: t("about.reg.12a.label"), value: SITE.registrations["12A"] },
                { label: t("about.reg.80g.label"), value: SITE.registrations["80G"] },
              ].map(({ label, value }) => (
                <div key={label} className="py-4 flex justify-between gap-4">
                  <span className="text-slate-500 font-medium">{label}</span>
                  <span className="font-bold text-slate-900 text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Green verification alert box */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mt-0.5 flex-none" />
              <div>
                <h4 className="text-emerald-900 font-bold text-sm md:text-base">
                  Verified & Compliant Charitable Trust
                </h4>
                <p className="text-xs md:text-sm text-emerald-700 mt-1 leading-relaxed">
                  {t("about.reg.alert")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;

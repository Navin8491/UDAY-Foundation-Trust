import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Stethoscope,
  HandHeart,
  Sprout,
  ShieldCheck,
  HomeIcon,
  Baby,
  Users,
  CheckCircle2,
  ChevronRight,
  Play,
  Heart,
  Award,
  Quote,
  Sparkles,
  BookOpen,
  HeartHandshake,
  Flame,
} from "lucide-react";
import { subscribePrograms } from "@/services/db";

const ICON_MAP: Record<string, any> = {
  GraduationCap,
  Stethoscope,
  HandHeart,
  Sprout,
  ShieldCheck,
  HomeIcon,
  Baby,
  Users,
  Heart,
  Sparkles,
  BookOpen,
  HeartHandshake,
  Flame,
};
import { PROGRAMS_DETAIL_DATA } from "@/constants/programs";
import imgEdu from "@/assets/hebatpur_3.jpg";

import { useLanguage } from "@/context/LanguageContext";
import { Counter } from "@/components/site/Counter";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";

// Local Translations Dictionary to keep files modular and translation-ready
const TRANSLATIONS_LOCAL = {
  en: {
    heroChip: "OUR INTERVENTIONS",
    heroTitle: "Eight Programs. Countless Lives.",
    heroDesc:
      "Each program is designed with the community, executed with care, and measured by lasting impact.",
    viewDetails: "View Details",
    supportBtn: "Support Program",
    learnMore: "Learn More",
    objectives: "Objectives",
    keyActivities: "Key Activities",
    successStory: "Success Story",
    impactPill: "Impact",
    galleryTitle: "Gallery Preview",
    statsChip: "IMPACT METRICS",
    statsTitle: "A Movement Measured in Action",
    stat1: "Beneficiaries Served",
    stat2: "Programs Conducted",
    stat3: "Villages Reached",
    stat4: "Volunteers Engaged",
  },
  gu: {
    heroChip: "આપણા આયોજનો",
    heroTitle: "આઠ કાર્યક્રમો. અગણિત સ્મિત.",
    heroDesc:
      "દરેક આયોજન ગ્રામ્ય સમુદાયો સાથે ચર્ચા કરી, પૂર્ણ કાળજીપૂર્વક અમલમાં મુકવામાં આવ્યું છે.",
    viewDetails: "વિગત જુઓ",
    supportBtn: "કાર્યમાં જોડાઓ",
    learnMore: "વધુ જાણો",
    objectives: "હેતુઓ",
    keyActivities: "મુખ્ય પ્રવૃત્તિઓ",
    successStory: "સફળતાની કહાની",
    impactPill: "પ્રભાવ",
    galleryTitle: "ગેલેરી ઝલક",
    statsChip: "આંકડાકીય પ્રભાવ",
    statsTitle: "સેવા કાર્યોનો વાસ્તવિક પ્રભાવ",
    stat1: "લાભાર્થી પરિવારો",
    stat2: "સક્રિય આયોજનો",
    stat3: "પહોંચેલા ગ્રામ્ય વિસ્તારો",
    stat4: "સ્વયંસેવકોની સંખ્યા",
  },
  hi: {
    heroChip: "हमारे कार्यक्रम",
    heroTitle: "आठ कार्यक्रम। अनगिनत मुस्कानें।",
    heroDesc: "प्रत्येक कार्यक्रम ग्रामीण समुदायों के साथ मिलकर, पूरी निष्ठा से लागू किया गया है।",
    viewDetails: "विवरण देखें",
    supportBtn: "सहायता करें",
    learnMore: "और जानें",
    objectives: "मुख्य उद्देश्य",
    keyActivities: "प्रमुख गतिविधियां",
    successStory: "सफलता की कहानी",
    impactPill: "प्रभाव",
    galleryTitle: "गैलरी झलक",
    statsChip: "प्रभाव के आंकड़े",
    statsTitle: "सेवा कार्यों का वास्तविक प्रभाव",
    stat1: "लाभार्थी परिवार",
    stat2: "सक्रिय कार्यक्रम",
    stat3: "पहुंचे हुए गाँव",
    stat4: "सक्रिय स्वयंसेवक",
  },
};



const INITIAL_PROGRAMS = PROGRAMS_DETAIL_DATA.map((prog) => ({
  ...prog,
  Icon: ICON_MAP[prog.iconName || ""] || GraduationCap,
}));

export function Programs() {
  const { language, t } = useLanguage();
  const tLocal = TRANSLATIONS_LOCAL[language as "en" | "gu" | "hi"] || TRANSLATIONS_LOCAL["en"];

  const [programsList, setProgramsList] = useState<any[]>(INITIAL_PROGRAMS);

  useEffect(() => {
    const unsubscribe = subscribePrograms((items) => {
      if (items && items.length > 0) {
        const mapped = items.map((item) => ({
          id: item.id || item.keyId,
          Icon: ICON_MAP[item.iconName || ""] || GraduationCap,
          color: item.color || "#4040A1",
          image: item.image,
          thumbnails: item.thumbnails || [],
          title: item.title,
          desc: item.desc,
          objectives: item.objectives,
          activities: item.activities,
          impactVal: item.impactVal,
          successTitle: item.successTitle || { en: "", gu: "", hi: "" },
          successStory: item.successStory || { en: "", gu: "", hi: "" },
          successQuote: item.successQuote || { en: "", gu: "", hi: "" },
        }));
        setProgramsList(mapped as any);
      }
    });
    return () => unsubscribe();
  }, []);

  useDocumentMetadata(
    "Programs — Education, Healthcare, Environment & More | Uday Foundation Trust",
    "Explore Uday Foundation Trust's programs across education, healthcare, women empowerment, child welfare, environment, disaster relief and rural development.",
  );

  // Utility to scroll smoothly to detailed section
  const scrollToDetail = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#F8FAFF] min-h-screen">
      {/* SECTION 1: HERO BANNER */}
      <PageHero
        eyebrow={tLocal.heroChip}
        title={tLocal.heroTitle}
        subtitle={tLocal.heroDesc}
        bgImage={imgEdu}
        breadcrumbActive={t("nav.programs")}
      />

      {/* SECTION 2: PROGRAMS OVERVIEW GRID */}
      <section className="py-16 md:py-24 bg-white">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#7A9D1C] bg-[#7A9D1C]/10 rounded-full mb-4">
              {t("prog.chip")}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
              {t("prog.title")}
            </h2>
            <p className="text-slate-500 mt-4 text-sm md:text-base leading-relaxed">
              {t("prog.desc")}
            </p>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          {/* Desktop 4 columns, Tablet 2 columns, Mobile 1 column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {programsList.map((prog) => {
              const Icon = prog.Icon;
              const title = prog.title[language] || prog.title["en"];
              const desc = prog.desc[language] || prog.desc["en"];
              const impact = prog.impactVal[language] || prog.impactVal["en"];

              return (
                <div key={prog.id} className="about-card-premium h-full border border-border group">
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300"
                    style={{
                      backgroundColor: `color-mix(in oklab, ${prog.color} 10%, transparent)`,
                      color: prog.color,
                    }}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                    {title}
                  </h3>

                  <div 
                    className="text-slate-600 text-sm leading-relaxed mb-5 flex-grow line-clamp-3 prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: desc }}
                  />

                  {/* Quick Impact Stat */}
                  <div className="border-t border-slate-100 pt-4 mt-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {tLocal.impactPill}
                    </div>
                    <div className="text-sm font-semibold text-primary font-gujarati">{impact}</div>
                  </div>

                  <button
                    onClick={() => scrollToDetail(prog.id)}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2.5 transition-all text-left uppercase tracking-wider cursor-pointer"
                  >
                    <span>{tLocal.viewDetails}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: VISUAL STORYTELLING (Alternating Details Sections) */}
      {programsList.map((prog, idx) => {
        const title = prog.title[language] || prog.title["en"];
        const desc = prog.desc[language] || prog.desc["en"];
        const impact = prog.impactVal[language] || prog.impactVal["en"];
        const successTitle = prog.successTitle[language] || prog.successTitle["en"];
        const successBody = prog.successStory[language] || prog.successStory["en"];
        const successQuote = prog.successQuote[language] || prog.successQuote["en"];

        // Alternating background colors
        const bgClass = idx % 2 === 0 ? "bg-[#F8FAFF]" : "bg-white";

        return (
          <section
            id={prog.id}
            key={prog.id}
            className={`py-16 md:py-24 border-t border-border ${bgClass} scroll-mt-20`}
          >
            <div className="about-section-container grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* IMAGE COLUMN (Left on even indices, Right on odd indices on desktop) */}
              <div className={`lg:col-span-5 relative ${idx % 2 !== 0 ? "lg:order-last" : ""}`}>
                <div
                  className="absolute -top-6 -left-6 w-32 h-32 rounded-full blur-2xl pointer-events-none"
                  style={{ backgroundColor: `color-mix(in oklab, ${prog.color} 12%, transparent)` }}
                />

                <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[3/4] rounded-[2rem] overflow-hidden ring-4 ring-slate-100 shadow-2xl">
                  <img
                    src={prog.image}
                    alt={title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Thumbnails Gallery Preview */}
                <div className="mt-5 flex gap-3">
                  {prog.thumbnails.map((thumb: string, tIdx: number) => (
                    <div
                      key={tIdx}
                      className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:opacity-85 transition-opacity"
                    >
                      <img
                        src={thumb}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-200 transition-colors">
                    <Play className="h-4 w-4 fill-slate-400" />
                    <span className="text-[9px] font-bold uppercase tracking-wide mt-1">More</span>
                  </div>
                </div>
              </div>

              {/* CONTENT COLUMN */}
              <div className="lg:col-span-7">
                <span
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full mb-5"
                  style={{
                    backgroundColor: `color-mix(in oklab, ${prog.color} 10%, transparent)`,
                    color: prog.color,
                  }}
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>UFT Program Details</span>
                </span>

                <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-none mb-6">
                  {title}
                </h2>

                <div 
                  className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 font-gujarati prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: desc }}
                />

                {/* Impact Pill Banner */}
                <div className="bg-[#F8FAFF] rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs mb-8">
                  <div className="text-xs uppercase tracking-[0.20em] text-slate-400 font-bold mb-1">
                    {tLocal.impactPill}
                  </div>
                  <div className="font-display text-lg font-bold text-slate-900 font-gujarati">
                    {impact}
                  </div>
                </div>

                {/* Objectives & Key Activities */}
                <div className="grid sm:grid-cols-2 gap-8 mb-8">
                  {/* Objectives */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                      {tLocal.objectives}
                    </h4>
                    <ul className="space-y-3">
                      {prog.objectives.map((obj: any, oIdx: number) => (
                        <li
                          key={oIdx}
                          className="flex items-start gap-2.5 text-slate-700 text-sm leading-relaxed"
                        >
                          <CheckCircle2 className="h-4 w-4 text-[#7A9D1C] mt-0.5 flex-shrink-0" />
                          <span className="font-gujarati">{obj[language] || obj["en"]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Activities */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                      {tLocal.keyActivities}
                    </h4>
                    <ul className="space-y-3">
                      {prog.activities.map((act: any, aIdx: number) => (
                        <li
                          key={aIdx}
                          className="flex items-start gap-2 text-slate-700 text-sm leading-relaxed"
                        >
                          <span className="h-2 w-2 rounded-full bg-[#F7E81D] mt-1.5 flex-shrink-0" />
                          <span className="font-gujarati">{act[language] || act["en"]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Success Story Quote Box */}
                <div className="border-l-4 border-[#F7E81D] bg-slate-50 p-5 rounded-r-2xl mt-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    <Quote className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span>
                      {tLocal.successStory}: {successTitle}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic mb-3 font-gujarati">
                    {successBody}
                  </p>
                  <p className="text-xs font-bold text-slate-800 font-gujarati">{successQuote}</p>
                </div>

                <div className="mt-8">
                  <Link to="/donate" className="btn-saffron text-sm">
                    <Heart className="h-4 w-4" /> {tLocal.supportBtn}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* SECTION 4: IMPACT METRICS BANNER */}
      <section className="py-16 md:py-20 bg-[#4040A1] text-white relative overflow-hidden">
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
              {tLocal.statsChip}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
              {tLocal.statsTitle}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { value: 12000, suffix: "+", label: tLocal.stat1 },
              { value: 8, suffix: "", label: tLocal.stat2 },
              { value: 120, suffix: "+", label: tLocal.stat3 },
              { value: 650, suffix: "+", label: tLocal.stat4 },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 md:p-8 text-center hover:bg-white/15 transition-all shadow-lg"
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
    </div>
  );
}

export default Programs;

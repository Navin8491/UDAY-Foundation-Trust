import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
import { useLanguage } from "@/context/LanguageContext";
import { subscribeTeam } from "@/services/db";
import {
  Instagram,
  Linkedin,
  Mail,
  ShieldCheck,
  Heart,
  Sparkles,
  Target,
  Users,
  ChevronRight,
  Award,
  Quote,
} from "lucide-react";
import presidentImg from "@/assets/president.jpg";
import { MEMBERS_DATA } from "@/constants/team";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";

// Local Translations Dictionary
const TRANSLATIONS_LOCAL = {
  en: {
    heroChip: "OUR LEADERSHIP",
    heroTitle: "Meet Our Team",
    heroDesc:
      "A dedicated council of trustees, advisors, and volunteers committed to serving rural communities across Gujarat.",
    spotlightTitle: "President's Spotlight",
    spotlightSub: "LEADERSHIP & VISION",
    spotlightMessage:
      "Our vision is simple: to make sure no village is left behind. Service is not a task; it is our culture, our true dharma.",
    spotlightVision: "Leadership Vision",
    spotlightVisionText:
      "Building self-reliant villages by bridging the gap in quality education, standard healthcare, and livelihood training.",
    spotlightMission: "NGO Mission Statement",
    spotlightMissionText:
      "To initiate the upliftment of rural society with dignity, focusing on education, health, women, children, and relief programs.",
    boardTitle: "Board of Trustees",
    boardSub: "GOVERNING BODY",
    contactBtn: "Contact Trustee",
    valuesTitle: "Our Shared Values",
    valuesSub: "WHAT DRIVES US",
    value1Title: "Transparency",
    value1Desc:
      "Maintaining 100% financial and operational integrity in all project implementations.",
    value2Title: "Service",
    value2Desc: "Delivering selfless support to rural and underprivileged families with empathy.",
    value3Title: "Dedication",
    value3Desc: "Working round the clock on the ground to solve critical community challenges.",
    value4Title: "Community Impact",
    value4Desc: "Ensuring long-term sustainability and progress for families we support.",
    volTitle: "Our Volunteers",
    volSub: "FIELD IMPACT",
    volBody:
      "Our strength lies in our network of passionate youth, doctors, teachers, and professionals who donate their time and skills on the ground.",
    volHighlight1: "50+ Active Volunteers",
    volHighlight1Desc: "Young minds leading logistics, events, and education campaigns.",
    volHighlight2: "10+ Expert Doctors",
    volHighlight2Desc: "Medical professionals volunteering at diagnostic health camps.",
    volHighlight3: "Community Led",
    volHighlight3Desc: "Villagers taking ownership of water units and tree drives.",
    joinVolBtn: "Become a Volunteer",
  },
  gu: {
    heroChip: "અમારું નેતૃત્વ",
    heroTitle: "અમારી ટીમને મળો",
    heroDesc:
      "ગુજરાતના ગ્રામીણ પરિવારોની સેવામાં સમર્પિત ટ્રસ્ટીઓ, સલાહકારો અને સ્વયંસેવકોનું મંડળ.",
    spotlightTitle: "પ્રમુખ તરફથી ખાસ સંદેશ",
    spotlightSub: "નેતૃત્વ અને વિઝન",
    spotlightMessage:
      "અમારું વિઝન સરળ છે: કોઈ પણ ગામ પાછળ ન રહે. સેવા એ કાર્ય નથી; તે અમારો સંસ્કાર છે, અમારો સાચો ધર્મ છે.",
    spotlightVision: "નેતૃત્વ દ્રષ્ટિકોણ",
    spotlightVisionText:
      "ગુણવત્તાયુક્ત શિક્ષણ, ધોરણસરની આરોગ્ય સેવાઓ અને કૌશલ્ય તાલીમ દ્વારા સ્વનિર્ભર ગામડાઓનું નિર્માણ કરવું.",
    spotlightMission: "સંસ્થાનું લક્ષ્ય",
    spotlightMissionText:
      "ગ્રામીણ સમાજના ઉત્થાનની ગૌરવ સાથે શરૂઆત કરવી, જેમાં શિક્ષણ, આરોગ્ય, મહિલા સશક્તિકરણ અને રાહત કાર્યો સામેલ છે.",
    boardTitle: "ટ્રસ્ટી મંડળ",
    boardSub: "સંચાલક મંડળ",
    contactBtn: "સંપર્ક કરો",
    valuesTitle: "અમારા સહિયારા મૂલ્યો",
    valuesSub: "આપણું પ્રેરક બળ",
    value1Title: "પારદર્શકતા",
    value1Desc: "તમામ પ્રોજેક્ટના અમલીકરણમાં ૧૦૦% નાણાકીય અને ઓપરેશનલ પ્રામાણિકતા જાળવવી.",
    value2Title: "સેવા ભાવના",
    value2Desc:
      "ગ્રામીણ અને જરૂરિયાતમંદ પરિવારોને નિઃસ્વાર્થ ભાવે અને સહાનુભૂતિપૂર્વક મદદ પૂરી પાડવી.",
    value3Title: "સમર્પણ",
    value3Desc: "વંચિત સમુદાયોની સમસ્યાઓ ઉકેલવા માટે ધરાતલ પર સતત અને નિષ્ઠાપૂર્વક કાર્ય કરવું.",
    value4Title: "સામાજિક પ્રભાવ",
    value4Desc:
      "આપણે જે પરિવારોને ટેકો આપીએ છીએ તેમના માટે લાંબા ગાળાની પ્રગતિ અને સ્થિરતા સુનિશ્ચિત કરવી.",
    volTitle: "અમારા સ્વયંસેવકો",
    volSub: "વાસ્તવિક અસર",
    volBody:
      "અમારી તાકાત ઉત્સાહી યુવાનો, ડોકટરો, શિક્ષકો અને વ્યાવસાયિકોના નેટવર્કમાં રહેલી છે જેઓ તેમનો સમય અને કુશળતા સેવામાં અર્પણ કરે છે.",
    volHighlight1: "૫૦+ સક્રિય સ્વયંસેવકો",
    volHighlight1Desc: "લોજિસ્ટિક્સ, ઇવેન્ટ્સ અને શિક્ષણ અભિયાનનું નેતૃત્વ કરતા યુવાનો.",
    volHighlight2: "૧૦+ નિષ્ણાત તબીબો",
    volHighlight2Desc: "નિદાન અને સારવાર કેમ્પમાં સ્વેચ્છાએ સેવા આપતા તબીબો.",
    volHighlight3: "સમુદાય સંચાલિત",
    volHighlight3Desc: "પીવાના પાણીના પ્રોજેક્ટ્સ અને વૃક્ષારોપણની જવાબદારી સ્વીકારતા ગ્રામજનો.",
    joinVolBtn: "સ્વયંસેવક બનો",
  },
  hi: {
    heroChip: "हमारा नेतृत्व",
    heroTitle: "हमारी टीम से मिलें",
    heroDesc:
      "गुजरात के ग्रामीण परिवारों की सेवा में समर्पित ट्रस्टी, सलाहकार और स्वयंसेवकों की परिषद।",
    spotlightTitle: "अध्यक्ष का संदेश",
    spotlightSub: "नेतृत्व और दृष्टिकोण",
    spotlightMessage:
      "हमारा दृष्टिकोण सरल है: कोई भी गाँव पीछे न छूटे। सेवा कोई कार्य नहीं है; यह हमारा संस्कार है, हमारा सच्चा धर्म है।",
    spotlightVision: "नेतृत्व दृष्टिकोण",
    spotlightVisionText:
      "गुणवत्तापूर्ण शिक्षा, स्वास्थ्य सुविधाओं और कौशल प्रशिक्षण द्वारा आत्मनिर्भर गांवों का निर्माण करना।",
    spotlightMission: "एनजीओ मिशन वक्तव्य",
    spotlightMissionText:
      "ग्रामीण समाज के उत्थान की गरिमा के साथ शुरुआत करना, जिसमें शिक्षा, स्वास्थ्य, महिला कल्याण और राहत कार्यक्रम शामिल हैं।",
    boardTitle: "ट्रस्टी मंडल",
    boardSub: "शासी निकाय",
    contactBtn: "संपर्क करें",
    valuesTitle: "हमारे साझा मूल्य",
    valuesSub: "हमारा प्रेरक बल",
    value1Title: "पारदर्शिता",
    value1Desc:
      "सभी परियोजनाओं के कार्यान्वयन में शत-प्रतिशत वित्तीय और परिचालन सत्यनिष्ठा बनाए रखना।",
    value2Title: "निस्वार्थ सेवा",
    value2Desc: "ग्रामीण और वंचित परिवारों को सहानुभूति के साथ निःस्वार्थ सहायता प्रदान करना।",
    value3Title: "समर्पण",
    value3Desc:
      "वंचित समुदायों की समस्याओं को धरातल पर हल करने के लिए निरंतर और निष्ठापूर्वक कार्य करना।",
    value4Title: "सामाजिक प्रभाव",
    value4Desc:
      "हम जिन परिवारों का समर्थन करते हैं, उनकी दीर्घकालिक प्रगति और स्थिरता सुनिश्चित करना।",
    volTitle: "हमारे स्वयंसेवक",
    volSub: "धरातल पर प्रभाव",
    volBody:
      "हमारी असली ताकत जुनूनी युवाओं, डॉक्टरों, शिक्षकों और पेशेवरों का नेटवर्क है जो धरातल पर अपना समय और कौशल दान करते हैं।",
    volHighlight1: "50+ सक्रिय स्वयंसेवक",
    volHighlight1Desc: "रसद, कार्यक्रम और शिक्षा अभियानों का नेतृत्व करने वाले युवा दिमाग।",
    volHighlight2: "10+ विशेषज्ञ डॉक्टर",
    volHighlight2Desc:
      "निदान और स्वास्थ्य शिविरों में स्वेच्छा से सेवाएं देने वाले चिकित्सा पेशेवर।",
    volHighlight3: "सामुदायिक स्वामित्व",
    volHighlight3Desc: "जल इकाइयों और वृक्षारोपण अभियानों की जिम्मेदारी खुद उठाने वाले ग्रामीण।",
    joinVolBtn: "स्वयंसेवक बनें",
  },
};



const PALETTES = [
  "from-[#4040A1]/15 to-[#F7E81D]/10",
  "from-[#7A9D1C]/15 to-[#4040A1]/10",
  "from-[#F7E81D]/15 to-[#7A9D1C]/10",
  "from-[#4040A1]/15 to-[#7A9D1C]/10",
  "from-[#7A9D1C]/15 to-[#F7E81D]/10",
  "from-[#F7E81D]/15 to-[#4040A1]/10",
  "from-[#4040A1]/10 to-[#7A9D1C]/15",
];

function getInitials(name: string) {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Team() {
  const { language, t } = useLanguage();
  const tLocal = TRANSLATIONS_LOCAL[language as "en" | "gu" | "hi"] || TRANSLATIONS_LOCAL["en"];

  const [membersList, setMembersList] = useState(MEMBERS_DATA);

  useEffect(() => {
    const unsubscribe = subscribeTeam((items) => {
      if (items && items.length > 0) {
        const mapped = items.map((item) => ({
          id: item.id || item.memberId,
          name: item.name,
          role: item.role,
          bio: item.bio,
          email: item.email,
          img: item.img,
          socials: item.socials || {},
        }));
        setMembersList(mapped as any);
      }
    });
    return () => unsubscribe();
  }, []);

  useDocumentMetadata(
    "Leadership Team | Uday Foundation Trust",
    "Meet the trustees and leadership team of Uday Foundation Trust, Sanand.",
  );

  // Filter members for specific rows in Board of Trustees section
  const vicePresident = membersList.find((m) => m.id === "sanjaykumar");
  const secretaries = membersList.filter((m) => m.id === "prakash" || m.id === "kartikeya");
  const permanentMembers = membersList.filter(
    (m) => m.id === "rahulkumar" || m.id === "mehulbhai" || m.id === "kuldeep"
  );

  const renderMemberCard = (member: typeof MEMBERS_DATA[0], index: number) => {
    const name = member.name[language] || member.name["en"];
    const role = member.role[language] || member.role["en"];
    const bio = member.bio[language] || member.bio["en"];

    return (
      <article
        key={member.id}
        className="about-card-premium p-0! bg-white border border-border shadow-sm overflow-hidden group hover:scale-[1.02] transition-all flex flex-col justify-between h-full"
      >
        <div>
          {/* Header Image/Placeholder */}
          <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 flex items-center justify-center border-b border-slate-100">
            {member.img ? (
              <img
                src={member.img}
                alt={name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${PALETTES[index % PALETTES.length]} flex items-center justify-center relative`}
              >
                {/* Decorative overlay grids */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <span className="font-display text-4xl font-bold text-[#4040A1] tracking-wider select-none">
                  {getInitials(member.name["en"])}
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-5 flex-grow">
            <h3 className="text-base md:text-lg font-display font-bold text-slate-900 group-hover:text-primary transition-colors font-gujarati mb-2 leading-snug">
              {name}
            </h3>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
              {role}
            </p>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-gujarati">
              {bio}
            </p>
          </div>
        </div>

        {/* Actions / Social Footer */}
        <div className="p-5 border-t border-slate-100 bg-[#F8FAFF] flex items-center justify-between gap-3 mt-auto">
          <div className="flex gap-2">
            <a
              href={member.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-full bg-white border border-slate-200 inline-flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/40 transition-colors shadow-xs"
              aria-label="Instagram"
            >
              <Instagram className="h-3.5 w-3.5" />
            </a>
            <a
              href={member.socials.linkedin}
              className="h-8 w-8 rounded-full bg-white border border-slate-200 inline-flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/40 transition-colors shadow-xs"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          </div>

          <a
            href={`mailto:${member.email}?subject=Inquiry%20to%20Trustee%20-${encodeURIComponent(member.name["en"])}`}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:text-secondary-foreground uppercase tracking-widest transition-all"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>{tLocal.contactBtn}</span>
          </a>
        </div>
      </article>
    );
  };

  return (
    <div className="bg-[#F8FAFF] min-h-screen">
      {/* SECTION 1: HERO BANNER */}
      <PageHero
        eyebrow={tLocal.heroChip}
        title={tLocal.heroTitle}
        subtitle={tLocal.heroDesc}
        bgImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1600&auto=format&fit=crop"
        breadcrumbActive={t("nav.team")}
      />

      {/* SECTION 2: PRESIDENT SPOTLIGHT */}
      <section className="py-16 md:py-24 bg-white">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary bg-primary/10 rounded-full mb-4">
              {tLocal.spotlightSub}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
              {tLocal.spotlightTitle}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="about-card-premium p-0! bg-[#F8FAFF] overflow-hidden border border-border shadow-lg">
            <div className="grid grid-cols-1 min-[540px]:grid-cols-12">
              {/* Image side */}
              <div className="col-span-1 min-[540px]:col-span-5 relative w-full aspect-[4/5] min-[540px]:aspect-auto min-[540px]:min-h-full bg-slate-100 overflow-hidden rounded-t-[2rem] min-[540px]:rounded-t-none min-[540px]:rounded-l-[2rem]">
                <img
                  src={presidentImg}
                  alt="Gulabbhai Khodabhai Bauddh"
                  className="w-full h-full object-cover object-top min-[540px]:absolute min-[540px]:inset-0 min-[540px]:w-full min-[540px]:h-full"
                  loading="eager"
                />
              </div>

              {/* Content side */}
              <div className="col-span-1 min-[540px]:col-span-7 p-6 min-[540px]:p-8 md:p-12 flex flex-col justify-center bg-white">
                <div className="mb-4 min-[540px]:mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {tLocal.spotlightSub}
                  </span>
                </div>

                <h3 className="text-xl min-[540px]:text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">
                  Gulabbhai Khodabhai Bauddh
                </h3>
                <p className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 min-[540px]:mb-6">
                  {tLocal.heroChip} · {t("pres.role")}
                </p>

                <div className="relative mb-6 min-[540px]:mb-8">
                  <Quote className="absolute -top-4 -left-4 h-10 w-10 text-slate-100 pointer-events-none" />
                  <p className="text-slate-700 font-display italic text-sm min-[540px]:text-base md:text-lg lg:text-xl leading-relaxed relative z-10 pl-5 min-[540px]:pl-6 font-gujarati">
                    "{tLocal.spotlightMessage}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-[540px]:gap-6 pt-4 min-[540px]:pt-6 border-t border-slate-100">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-900 mb-2">
                      <Target className="h-4 w-4 text-[#7A9D1C]" />
                      <span>{tLocal.spotlightVision}</span>
                    </h4>
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-gujarati">
                      {tLocal.spotlightVisionText}
                    </p>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-900 mb-2">
                      <ShieldCheck className="h-4 w-4 text-[#4040A1]" />
                      <span>{tLocal.spotlightMission}</span>
                    </h4>
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-gujarati">
                      {tLocal.spotlightMissionText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: BOARD OF TRUSTEES */}
      <section className="py-16 md:py-24 bg-[#F8FAFF] border-t border-border">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary bg-primary/10 rounded-full mb-4">
              {tLocal.boardSub}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
              {tLocal.boardTitle}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          {/* Vice President Row (Centered) */}
          {vicePresident && (
            <div className="flex justify-center mb-12">
              <div className="w-full max-w-[280px] sm:max-w-[300px]">
                {renderMemberCard(vicePresident, 1)}
              </div>
            </div>
          )}

          {/* Secretaries Row (Side by side on tablet/desktop, stacked on mobile) */}
          <div className="flex justify-center mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 w-full max-w-[620px]">
              {secretaries.map((member, index) => (
                <div key={member.id} className="w-full">
                  {renderMemberCard(member, index + 2)}
                </div>
              ))}
            </div>
          </div>

          {/* Permanent Members Row (Grid layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-[960px] mx-auto">
            {permanentMembers.map((member, index) => (
              <div key={member.id} className="w-full">
                {renderMemberCard(member, index + 4)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: TEAM VALUES */}
      <section className="py-16 md:py-24 bg-white border-t border-border">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary bg-primary/10 rounded-full mb-4">
              {tLocal.valuesSub}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
              {tLocal.valuesTitle}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: ShieldCheck,
                color: "text-[#4040A1] bg-[#4040A1]/10",
                title: tLocal.value1Title,
                desc: tLocal.value1Desc,
              },
              {
                icon: Heart,
                color: "text-red-500 bg-red-500/10",
                title: tLocal.value2Title,
                desc: tLocal.value2Desc,
              },
              {
                icon: Sparkles,
                color: "text-[#F7E81D] bg-[#F7E81D]/10",
                title: tLocal.value3Title,
                desc: tLocal.value3Desc,
              },
              {
                icon: Target,
                color: "text-[#7A9D1C] bg-[#7A9D1C]/10",
                title: tLocal.value4Title,
                desc: tLocal.value4Desc,
              },
            ].map((val, idx) => (
              <div
                key={idx}
                className="about-card-premium text-center items-center p-8 bg-[#F8FAFF] border border-border shadow-xs hover:border-primary/20 hover:shadow-md transition-all"
              >
                <div
                  className={`h-16 w-16 rounded-full ${val.color} flex items-center justify-center mb-6`}
                >
                  <val.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg md:text-xl font-display font-bold text-slate-900 mb-3">
                  {val.title}
                </h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: VOLUNTEER CORNER */}
      <section className="py-16 md:py-24 bg-[#F8FAFF] border-t border-border">
        <div className="about-section-container">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left side info */}
            <div className="lg:col-span-5">
              <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#7A9D1C] bg-[#7A9D1C]/10 rounded-full mb-4">
                {tLocal.volSub}
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-none mb-6">
                {tLocal.volTitle}
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8">
                {tLocal.volBody}
              </p>

              <Link
                to="/get-involved"
                className="btn-primary flex items-center justify-center gap-2 max-w-xs cursor-pointer w-full text-center"
              >
                <span>{tLocal.joinVolBtn}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right side stats blocks */}
            <div className="lg:col-span-7 grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Users,
                  color: "text-[#4040A1] bg-white",
                  title: tLocal.volHighlight1,
                  desc: tLocal.volHighlight1Desc,
                },
                {
                  icon: Award,
                  color: "text-[#7A9D1C] bg-white",
                  title: tLocal.volHighlight2,
                  desc: tLocal.volHighlight2Desc,
                },
                {
                  icon: Heart,
                  color: "text-red-500 bg-white",
                  title: tLocal.volHighlight3,
                  desc: tLocal.volHighlight3Desc,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="about-card-premium p-6 border border-border shadow-xs hover:shadow-md transition-all flex flex-col items-start"
                >
                  <div
                    className={`h-12 w-12 rounded-xl ${item.color} border border-slate-100 flex items-center justify-center mb-5 shadow-xs`}
                  >
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Team;

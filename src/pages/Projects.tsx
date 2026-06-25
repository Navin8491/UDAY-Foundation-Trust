import { Link } from "react-router-dom";
import { useState } from "react";
import imgHealth from "@/assets/program-health.jpg";
import imgEdu from "@/assets/program-education.jpg";
import imgTrees from "@/assets/program-trees.jpg";
import imgRation from "@/assets/activity-ration.jpg";
import imgChildren from "@/assets/hero-children.jpg";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  BarChart3,
  ChevronRight,
  Quote,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Counter } from "@/components/site/Counter";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";

// Local Translations Dictionary to keep files modular and translation-ready
const TRANSLATIONS_LOCAL = {
  en: {
    heroChip: "OUR GROUND WORK",
    heroTitle: "Work That Speaks Louder Than Words",
    heroDesc: "A timeline of impact — from emergency relief to sustainable village transformation.",

    // Categories
    catAll: "All Projects",
    catOngoing: "Ongoing",
    catCompleted: "Completed",
    catCommunity: "Community",
    catEducation: "Education",
    catHealthcare: "Healthcare",
    catEnvironment: "Environment",

    // Dashboard
    dashTitle: "Impact Dashboard",
    dashTotalProj: "Total Projects",
    dashBen: "Beneficiaries",
    dashVillages: "Villages Covered",
    dashTrees: "Trees Planted",
    dashCamps: "Medical Camps",

    // Cards
    locationLabel: "Location",
    statusLabel: "Status",
    progressLabel: "Progress",
    viewProjBtn: "View Project Details",
    featuredBadge: "FEATURED WORK",
    achievements: "Key Achievements",
    supportBtn: "Support Project",

    // Timeline
    timelineTitle: "Milestones & Future Goals",
    timelineSubtitle: "The path of our service journey since establishment.",

    // Testimonials
    testTitle: "Voices of Impact",
    testSubtitle: "Hear from our local beneficiaries and dedicated volunteers.",
    volRole: "Volunteer",
    benRole: "Beneficiary",

    // Gallery
    galleryTitle: "On-Field Gallery",
    gallerySubtitle: "Moments of service captured live from Sanand villages.",
  },
  gu: {
    heroChip: "વાસ્તવિક કાર્યો",
    heroTitle: "શબ્દો કરતાં વધારે બોલે છે કામ",
    heroDesc: "કટોકટીની રાહત કામગીરીથી લઈને ગ્રામીણ ઉત્થાનના લાંબા ગાળાના આયોજનો.",

    // Categories
    catAll: "બધા પ્રોજેક્ટ્સ",
    catOngoing: "ચાલુ પ્રોજેક્ટ્સ",
    catCompleted: "પૂર્ણ થયેલા",
    catCommunity: "સામુદાયિક",
    catEducation: "શૈક્ષણિક",
    catHealthcare: "આરોગ્યલક્ષી",
    catEnvironment: "પર્યાવરણલક્ષી",

    // Dashboard
    dashTitle: "પ્રભાવ ડેશબોર્ડ",
    dashTotalProj: "કુલ પ્રોજેક્ટ્સ",
    dashBen: "લાભાર્થીઓ",
    dashVillages: "આવરી લીધેલ ગામો",
    dashTrees: "વૃક્ષારોપણ",
    dashCamps: "મેડિકલ કેમ્પ",

    // Cards
    locationLabel: "સ્થળ",
    statusLabel: "સ્થિતિ",
    progressLabel: "પ્રગતિ",
    viewProjBtn: "વિગત જુઓ",
    featuredBadge: "મુખ્ય સેવા કાર્ય",
    achievements: "મુખ્ય સિદ્ધિઓ",
    supportBtn: "દાન કરો",

    // Timeline
    timelineTitle: "સમયરેખા અને લક્ષ્યો",
    timelineSubtitle: "સ્થાપનાથી લઈને આજ સુધીની આપણી સેવા યાત્રાનો પથ.",

    // Testimonials
    testTitle: "પ્રભાવિત લોકોના અવાજ",
    testSubtitle: "સ્થાનિક લોકો અને સ્વયંસેવકોના પોતાના અનુભવો.",
    volRole: "સ્વયંસેવક",
    benRole: "લાભાર્થી",

    // Gallery
    galleryTitle: "સેવા ક્ષેત્રની ગેલેરી",
    gallerySubtitle: "સાણંદ તાલુકાના ગામોમાં થતી પ્રવૃત્તિઓની જીવંત તસવીરો.",
  },
  hi: {
    heroChip: "धरातल पर काम",
    heroTitle: "शब्दों से अधिक बोलता है हमारा कार्य",
    heroDesc: "आपातकालीन राहत से लेकर स्थायी ग्रामीण विकास तक की हमारी यात्रा।",

    // Categories
    catAll: "सभी परियोजनाएं",
    catOngoing: "जारी योजनाएं",
    catCompleted: "सम्पन्न योजनाएं",
    catCommunity: "सामुदायिक",
    catEducation: "शैक्षणिक",
    catHealthcare: "स्वास्थ्य संबंधी",
    catEnvironment: "पर्यावरण संबंधी",

    // Dashboard
    dashTitle: "प्रभाव डैशबोर्ड",
    dashTotalProj: "कुल परियोजनाएं",
    dashBen: "कुल लाभार्थी",
    dashVillages: "कवर किए गए गाँव",
    dashTrees: "वृक्षारोपण",
    dashCamps: "चिकित्सा शिविर",

    // Cards
    locationLabel: "स्थान",
    statusLabel: "स्थिति",
    progressLabel: "प्रगति",
    viewProjBtn: "विवरण देखें",
    featuredBadge: "प्रमुख सेवा कार्य",
    achievements: "मुख्य उपलब्धियां",
    supportBtn: "सहायता करें",

    // Timeline
    timelineTitle: "समयरेखा और लक्ष्य",
    timelineSubtitle: "स्थापना से लेकर आज तक की हमारी सेवा यात्रा का मार्ग।",

    // Testimonials
    testTitle: "प्रभाव के साक्षी",
    testSubtitle: "स्थानीय लाभार्थियों और समर्पित स्वयंसेवकों के अपने अनुभव।",
    volRole: "स्वयंसेवक",
    benRole: "लाभार्थी",

    // Gallery
    galleryTitle: "सेवा क्षेत्र की गैलरी",
    gallerySubtitle: "सानंद के गांवों में की गई गतिविधियों की जीवंत तस्वीरें।",
  },
};

const PROJECT_DATA = [
  {
    id: "proj-1",
    img: imgRation,
    categories: ["Completed", "Community"],
    date: "2020 – 2021",
    progress: 100,
    title: {
      en: "COVID-19 Relief & Food Aid",
      gu: "કોવિડ-૧૯ રાહત અને અનાજ સહાય",
      hi: "कोविड-19 राहत और राशन सहायता",
    },
    location: {
      en: "Sanand & Ahmedabad Rural",
      gu: "સાણંદ અને ગ્રામ્ય અમદાવાદ",
      hi: "सानंद और ग्रामीण अहमदाबाद",
    },
    desc: {
      en: "Emergency humanitarian response distributing dry groceries, immunity-boosting medicine kits, and masks to families locked down in villages.",
      gu: "લોકડાઉન દરમિયાન ગામડાઓમાં બંધ પરિવારોને જીવનજરૂરી અનાજ કીટ, માસ્ક અને સેનિટાઈઝર પહોંચાડવાનું રાહત કાર્ય.",
      hi: "लॉकडाउन के दौरान गांवों में फंसे परिवारों को राशन किट, मास्क और सैनिटाइज़र प्रदान करने का आपातकालीन राहत कार्य।",
    },
    impact: {
      en: "10,000+ Grocery Kits",
      gu: "૧૦,૦૦૦+ રાશન કીટોનું વિતરણ",
      hi: "१०,०००+ राशन किटों का वितरण",
    },
    achievements: [
      {
        en: "Assisted over 10,000 families in 45 villages.",
        gu: "૪૫ ગામોના ૧૦,૦૦૦થી વધુ ગરીબ પરિવારોને મદદ કરી.",
        hi: "४५ गांवों के १०,००० से अधिक गरीब परिवारों की मदद की।",
      },
      {
        en: "Provided masks, sanitizers, and medical consultations.",
        gu: "બચાવ માટે ૨૫,૦૦૦ માસ્ક અને સેનિટાઈઝર આપ્યા.",
        hi: "बचाव के लिए २५,००० मास्क और सैनिटाइज़र वितरित किए।",
      },
      {
        en: "Set up isolated village care kits.",
        gu: "સ્થાનિક આઈસોલેશન કીટો પ્રદાન કરી.",
        hi: "स्थानीय आइसोलेशन किट प्रदान कीं।",
      },
    ],
  },
  {
    id: "proj-2",
    img: imgHealth,
    categories: ["Completed", "Community"],
    date: "May 2021",
    progress: 100,
    title: {
      en: "Cyclone Tauktae Emergency Aid",
      gu: "તૌકતે વાવાઝોડા આપત્તિ રાહત",
      hi: "तौकते चक्रवात आपातकालीन राहत",
    },
    location: {
      en: "Coastal Districts & Sanand Rural",
      gu: "અસરગ્રસ્ત વિસ્તારો અને સાણંદ",
      hi: "प्रभावित क्षेत्र और सानंद",
    },
    desc: {
      en: "Quick emergency support providing temporary shelter tarpaulins, cooked meals, and clothing to families hit by severe cyclonic storm.",
      gu: "વાવાઝોડાને કારણે નુકસાન પામેલા કાચા ઘરો માટે તાડપત્રી, તૈયાર ભોજન અને કપડાં પહોંચાડવાની ત્વરિત સેવા.",
      hi: "चक्रवात के कारण क्षतिग्रस्त हुए कच्चे मकानों के लिए तिरपाल, बना हुआ भोजन और कपड़े पहुँचाने की त्वरित सहायता।",
    },
    impact: {
      en: "500+ Tarpaulins Distributed",
      gu: "૫૦૦+ પરિવારોને આશ્રય તાડપત્રી",
      hi: "५००+ तिरपाल वितरित",
    },
    achievements: [
      {
        en: "Distributed 500+ rainproof tarpaulins.",
        gu: "૫૦૦થી વધુ પરિવારોને વરસાદથી બચાવવા તાડપત્રી આપી.",
        hi: "५०० से अधिक परिवारों को बारिश से बचाने के लिए तिरपाल दिए।",
      },
      {
        en: "Supplied 2,000+ cooked meals within 48 hours.",
        gu: "૪૮ કલાકમાં ૨,૦૦૦થી વધુ તૈયાર ભોજનનું વિતરણ કર્યું.",
        hi: "४८ घंटों में २,००० से अधिक भोजन के पैकेट बांटे।",
      },
      {
        en: "Set up basic medical desks in storm-hit centers.",
        gu: "વાવાઝોડા અસરગ્રસ્ત ગામોમાં મેડિકલ હેલ્પ-ડેસ્ક શરૂ કર્યું.",
        hi: "चक्रवात प्रभावित गांवों में मेडिकल हेल्प-डेस्क शुरू किया।",
      },
    ],
  },
  {
    id: "proj-3",
    img: imgChildren,
    categories: ["Ongoing", "Community"],
    date: "April – June (Annual)",
    progress: 85,
    title: {
      en: "Summer Chaas Campaign",
      gu: "ઉનાળામાં છાસ વિતરણ સેવા",
      hi: "ग्रीष्मकालीन छाछ वितरण अभियान",
    },
    location: {
      en: "Sanand Cross Roads & Markets",
      gu: "સાણંદ ચાર રસ્તા અને સ્ટેશન",
      hi: "सानंद चौराहा और बस स्टैंड",
    },
    desc: {
      en: "Distributing fresh, cold buttermilk daily to daily wage workers, travellers, and police personnel under intense summer heatwaves.",
      gu: "ઉનાળાની કાળઝાળ ગરમીમાં મુસાફરો, ખેડૂતો, મજૂરો અને ટ્રાફિક પોલીસ જવાનોને ઠંડી છાસ પીવડાવી ગરમીથી બચાવવાનું અભિયાન.",
      hi: "भीषण गर्मी में यात्रियों, किसानों, मजदूरों और ट्रैफिक पुलिसकर्मियों को ठंडी छाछ पिलाकर गर्मी से राहत देने का अभियान।",
    },
    impact: {
      en: "1,500+ Daily Servings",
      gu: "દરરોજ ૧,૫૦૦+ લોકોને વિતરણ",
      hi: "प्रतिदिन १,५००+ लोगों को वितरण",
    },
    achievements: [
      {
        en: "Serving fresh buttermilk daily throughout hot dry months.",
        gu: "ભીષણ ગરમીના દિવસોમાં રોજ તાજી છાસનું અવિરત વિતરણ.",
        hi: "भीषण गर्मी के दिनों में रोज ताजी छाछ का अनवरत वितरण।",
      },
      {
        en: "Installed three distribution booths at main public junctions.",
        gu: "સાણંદના ૩ મુખ્ય ચાર રસ્તા પર વોટર/છાસ કેન્દ્રો ચાલુ કર્યા.",
        hi: "सानंद के ३ मुख्य चौराहों पर वाटर/छाछ केंद्र चालू किए।",
      },
      {
        en: "Supported highway traffic workers and road sweepers.",
        gu: "હાઈવે પર કામ કરતા મજૂરો અને રસ્તા સાફ કરતા શ્રમિકોને સહાય.",
        hi: "हाईवे पर काम करने वाले मजदूरों और सड़क सफाई कर्मचारियों की सहायता।",
      },
    ],
  },
  {
    id: "proj-4",
    img: imgTrees,
    categories: ["Ongoing", "Environment"],
    date: "Year-round",
    progress: 75,
    title: {
      en: "Tree Plantation Drive",
      gu: "સામૂહિક વૃક્ષારોપણ અભિયાન",
      hi: "सामूहिक वृक्षारोपण अभियान",
    },
    location: {
      en: "Sanand Villages & Schools",
      gu: "સાણંદના ગામો અને શાળાઓ",
      hi: "सानंद के गाँव और स्कूल",
    },
    desc: {
      en: "Community tree plantation campaigns to expand rural green cover, plant shade trees, and educate children on environment care.",
      gu: "પર્યાવરણની સુરક્ષા અને હરિયાળી વધારવા માટે લીમડો, વડ, અને પીપળા જેવા ઉપયોગી વૃક્ષો વાવવાની અને ઉછેરવાની પ્રવૃત્તિ.",
      hi: "पर्यावरण की सुरक्षा और हरियाली बढ़ाने के लिए नीम, बरगद और पीपल जैसे पेड़ लगाने और उनकी देखभाल करने का अभियान।",
    },
    impact: {
      en: "25,000+ Saplings Planted",
      gu: "૨૫,૦૦૦+ વૃક્ષો ઉછેર્યા",
      hi: "२५,०००+ पेड़ लगाए गए",
    },
    achievements: [
      {
        en: "Planted 25,000+ native saplings.",
        gu: "૨૫,૦૦૦થી વધુ સ્વદેશી વૃક્ષારોપણ પૂર્ણ.",
        hi: "२५,००० से अधिक स्वदेशी वृक्षारोपण संपन्न।",
      },
      {
        en: "Achieved a 90% survival rate through village water committees.",
        gu: "૯૦% વૃક્ષોનો જીવંત દર જાળવી રાખ્યો.",
        hi: "९०% पेड़ों की जीवित रहने की दर बनाए रखी।",
      },
      {
        en: "Conducted green workshops in 25 government schools.",
        gu: "૨૫ શાળાઓમાં હરિયાળી જાગૃતિ કેમ્પો યોજ્યા.",
        hi: "२५ स्कूलों में पर्यावरण जागरूकता शिविर आयोजित किए।",
      },
    ],
  },
  {
    id: "proj-5",
    img: imgEdu,
    categories: ["Ongoing", "Education"],
    date: "June – July (Annual)",
    progress: 95,
    title: {
      en: "School Kits & Notebook Drive",
      gu: "સ્કૂલ બેગ અને શૈક્ષણિક સાધનો વિતરણ",
      hi: "स्कूल किट और नोटबुक वितरण",
    },
    location: {
      en: "Rural Primary Schools",
      gu: "સરકારી પ્રાથમિક શાળાઓ",
      hi: "सरकारी प्राथमिक विद्यालय",
    },
    desc: {
      en: "Equipping underprivileged children with school bags, textbooks, notebooks, compass boxes, and uniforms for the new academic year.",
      gu: "આદિવાસી અને ગરીબ પરિવારોના બાળકોને સ્કૂલ બેગ, ચોપડા, પેન-પેન્સિલ અને ગણવેશ આપી પ્રોત્સાહન પૂરું પાડવાનો વાર્ષિક ઉત્સવ.",
      hi: "गरीब परिवारों के बच्चों को स्कूल बैग, किताबें, पेन-पेंसिल और यूनिफॉर्म देकर शिक्षा के लिए प्रोत्साहित करने का वार्षिक उत्सव।",
    },
    impact: {
      en: "4,500+ School Kits Gifted",
      gu: "૪,૫૦૦+ શૈક્ષણિક કીટો આપી",
      hi: "४,५००+ स्कूल किट उपहार",
    },
    achievements: [
      {
        en: "Distributed 4,500+ comprehensive school kits.",
        gu: "૪,૫૦૦થી વધુ બાળકોને સ્ટેશનરી કીટ વિતરણ.",
        hi: "४,५०० से अधिक बच्चों को स्टेशनरी किट वितरित की।",
      },
      {
        en: "Reduced initial primary school dropouts.",
        gu: "શરૂઆતના ધોરણોમાં ડ્રોપ-આઉટ ઘટાડવામાં મદદ મળી.",
        hi: "शुरुआती कक्षाओं में ड्रॉप-आउट कम करने में मदद मिली।",
      },
      {
        en: "Set up interactive study desks in Mu. Soyla.",
        gu: "સોયલા ગામમાં અભ્યાસ માટે બેઠક વ્યવસ્થા ઉભી કરી.",
        hi: "सोयला गाँव में बच्चों की पढ़ाई के लिए बैठक व्यवस्था की।",
      },
    ],
  },
  {
    id: "proj-6",
    img: imgHealth,
    categories: ["Ongoing", "Healthcare"],
    date: "Monthly",
    progress: 90,
    title: {
      en: "Rural Health & Eye Camps",
      gu: "નિઃશુલ્ક હેલ્થ અને મોતીયા તપાસ કેમ્પ",
      hi: "निःशुल्क स्वास्थ्य और नेत्र शिविर",
    },
    location: {
      en: "Sanand Taluka Villages",
      gu: "સાણંદ તાલુકાના અંતરિયાળ ગામો",
      hi: "सानंद तालुका के ग्रामीण इलाके",
    },
    desc: {
      en: "Monthly rural medical diagnostics offering specialist checkups, free medicines, blood tests, and sponsoring cataract eye surgeries.",
      gu: "ગામડાના ગરીબ અને વૃદ્ધ લોકો માટે વિનામૂલ્યે લોહી તપાસ, મોતિયાના ઓપરેશન અને ચશ્મા વિતરણનો માસિક કેમ્પ.",
      hi: "ग्रामीण गरीबों और वृद्धों के लिए मुफ्त रक्त जांच, मोतियाबिंद ऑपरेशन और चश्मा वितरण का मासिक शिविर।",
    },
    impact: {
      en: "38+ Camps Conducted",
      gu: "૩૮+ સફળ શિબિરો યોજી",
      hi: "३८+ सफल शिविर आयोजित",
    },
    achievements: [
      {
        en: "Conducted 38 free medical camps.",
        gu: "૩૮ ફ્રી મેડિકલ કેમ્પ સફળતાપૂર્વક પૂર્ણ કર્યા.",
        hi: "३८ मुफ्त चिकित्सा शिविर सफलतापूर्वक संपन्न किए।",
      },
      {
        en: "Supplied free medicines to 5,000+ villagers.",
        gu: "૫,૦૦૦થી વધુ દર્દીઓને મફત દવા આપી.",
        hi: "५,००० से अधिक रोगियों को मुफ्त दवाएं दीं।",
      },
      {
        en: "Supported 250+ cataract surgeries.",
        gu: "૨૫૦થી વધુ આંખના મોતિયાના ઓપરેશન કરાવ્યા.",
        hi: "२५० से अधिक मोतियाबिंद के ऑपरेशन कराए।",
      },
    ],
  },
];

export function Projects() {
  const { language, t } = useLanguage();
  const tLocal = TRANSLATIONS_LOCAL[language as "en" | "gu" | "hi"] || TRANSLATIONS_LOCAL["en"];
  const [activeCategory, setActiveCategory] = useState("All");

  useDocumentMetadata(
    "Projects — Ongoing & Completed | Uday Foundation Trust",
    "Featured projects of Uday Foundation Trust: COVID-19 relief, Cyclone Tauktae assistance, summer chaas distribution, Diwali welfare, tree plantation and more.",
  );

  const categories = [
    { key: "All", label: tLocal.catAll },
    { key: "Ongoing", label: tLocal.catOngoing },
    { key: "Completed", label: tLocal.catCompleted },
    { key: "Community", label: tLocal.catCommunity },
    { key: "Education", label: tLocal.catEducation },
    { key: "Healthcare", label: tLocal.catHealthcare },
    { key: "Environment", label: tLocal.catEnvironment },
  ];

  // Filtering Logic
  const filteredProjects = PROJECT_DATA.filter((p) => {
    if (activeCategory === "All") return true;
    return p.categories.includes(activeCategory);
  });

  return (
    <div className="bg-[#F8FAFF] min-h-screen">
      {/* SECTION 1: HERO BANNER */}
      <section className="relative overflow-hidden about-hero-bg py-16 md:py-24 border-b border-border">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="about-section-container relative text-center">
          <div className="flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 justify-center">
            <Link to="/" className="hover:text-primary transition-colors">
              {t("nav.home")}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-primary">{t("nav.projects")}</span>
          </div>

          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-primary bg-primary/10 rounded-full mb-5">
            {tLocal.heroChip}
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 tracking-tight leading-none mb-6">
            {tLocal.heroTitle}
          </h1>
          <p className="text-sm md:text-base font-semibold tracking-wider text-slate-600 uppercase max-w-3xl mx-auto leading-relaxed text-balance">
            {tLocal.heroDesc}
          </p>
          <div className="w-20 h-1.5 bg-[#F7E81D] mx-auto mt-8 rounded-full" />
        </div>
      </section>

      {/* SECTION 2: IMPACT DASHBOARD */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="about-section-container">
          <div className="bg-[#F8FAFF] border border-border rounded-3xl p-6 md:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900">
                {tLocal.dashTitle}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="pt-4 md:pt-0">
                <div className="text-3xl font-display font-bold text-primary">
                  <Counter to={6} />
                </div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                  {tLocal.dashTotalProj}
                </div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl font-display font-bold text-[#7A9D1C]">
                  <Counter to={12000} suffix="+" />
                </div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                  {tLocal.dashBen}
                </div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl font-display font-bold text-primary">
                  <Counter to={120} suffix="+" />
                </div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                  {tLocal.dashVillages}
                </div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl font-display font-bold text-[#7A9D1C]">
                  <Counter to={25000} suffix="+" />
                </div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                  {tLocal.dashTrees}
                </div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl font-display font-bold text-primary">
                  <Counter to={38} suffix="+" />
                </div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                  {tLocal.dashCamps}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CATEGORIZED PROJECT GRID */}
      <section className="py-16 md:py-24 bg-white border-t border-border">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary bg-primary/10 rounded-full mb-4">
              PORTFOLIO
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
              All Interventions
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          {/* Filtering Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-[#F8FAFF] hover:bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((proj) => {
              const title = proj.title[language] || proj.title["en"];
              const desc = proj.desc[language] || proj.desc["en"];
              const location = proj.location[language] || proj.location["en"];
              const impact = proj.impact[language] || proj.impact["en"];

              return (
                <article
                  key={proj.id}
                  className="about-card-premium bg-white border border-border h-full flex flex-col justify-between overflow-hidden p-0! group"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={proj.img}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="mb-2">
                        <span className="chip bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
                          {proj.categories[0] === "Completed" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#7A9D1C]" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-[#4040A1]" />
                          )}
                          <span>{proj.categories[0]}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {proj.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {location}
                        </span>
                      </div>

                      <h3 className="text-lg md:text-xl font-display font-bold text-slate-900 group-hover:text-primary transition-colors font-gujarati mb-2 leading-snug">
                        {title}
                      </h3>

                      <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6 font-gujarati line-clamp-3">
                        {desc}
                      </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1.5">
                        <span className="uppercase tracking-wider">{tLocal.progressLabel}</span>
                        <span>{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-5">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>

                      {/* Bottom impact stat */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 gap-2">
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            Metrics
                          </div>
                          <div className="text-xs font-bold text-slate-800 font-gujarati mt-0.5">
                            {impact}
                          </div>
                        </div>

                        <Link
                          to="/donate"
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wider hover:gap-2 transition-all cursor-pointer"
                        >
                          <span>{tLocal.supportBtn}</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-white border-t border-border">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary bg-primary/10 rounded-full mb-4">
              {tLocal.testTitle}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
              {tLocal.testSubtitle}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: {
                  en: "Before Uday Foundation installed the water purification unit, my children would get sick often from fluoride-heavy groundwater. Now, we have pure drinking water right outside our house.",
                  gu: "જ્યારે ઉદય ફાઉન્ડેશને અમારા નગરમાં પીવાના પાણીનું મશીન નહોતું લગાવ્યું ત્યારે બાળકો ગંદા પાણીથી બીમાર પડતા હતા. હવે શુદ્ધ અને સ્વચ્છ પીવાનું પાણી અમને આરામથી મળી જાય છે.",
                  hi: "जब तक उदय फाउंडेशन ने हमारे क्षेत्र में पेयजल शोधन मशीन नहीं लगाई थी, तब तक बच्चे बीमार पड़ते थे। अब हमें स्वच्छ पानी आसानी से मिल जाता है।",
                },
                author: "Babubhai",
                role: tLocal.benRole,
                location: "Soyla",
              },
              {
                quote: {
                  en: "Volunteering for Uday Trust's blanket drive in peak winter showed me the power of collective action. Reaching families on the street and handing out warmth is deeply fulfilling.",
                  gu: "કડાકાની ઠંડીમાં ફૂટપાથ પર રહેતા ગરીબ પરિવારોને ધાબળા વિતરણ કરવાના અભિયાનમાં જોડાવાથી મને અદભુત સંતોષ મળ્યો છે. સંસ્થાની ટીમ ખરેખર નિષ્ઠાવાન છે.",
                  hi: "कड़ाके की ठंड में जरूरतमंद परिवारों को कंबल बांटने के अभियान में शामिल होने से मुझे काफी खुशी मिली। संस्था की टीम वास्तव में काफी समर्पित है।",
                },
                author: "Priyaben",
                role: tLocal.volRole,
                location: "Sanand",
              },
            ].map((test, index) => (
              <div
                key={index}
                className="about-card-premium border border-border bg-[#F8FAFF] relative p-8"
              >
                <Quote className="absolute top-4 right-4 h-12 w-12 text-slate-200/50 pointer-events-none" />
                <p className="text-slate-600 text-sm md:text-base leading-relaxed italic mb-6 font-gujarati z-10 relative">
                  "{test.quote[language] || test.quote["en"]}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {test.author[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{test.author}</h4>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      {test.role} · {test.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Projects;

import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Share2,
  Quote,
  CheckCircle2,
  X,
  Activity,
  BookOpen,
  Trees,
  Trophy,
  UserCheck,
  Flame,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Counter } from "@/components/site/Counter";
import pavaDistributionGroup from "@/assets/pava-distribution-group.jpg";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import { SCHOOL_BAG_EVENTS } from "@/constants/schoolEvents";

const TRANSLATIONS_LOCAL = {
  en: {
    heroEyebrow: "OUR EVENTS & INITIATIVES",
    heroTitle: "Creating Impact Through Community Events",
    heroSub:
      "Join our mission through awareness campaigns, medical camps, educational initiatives, tree plantation drives, and community development programs.",
    btnUpcoming: "Upcoming Events",
    btnBecomeVolunteer: "Become Volunteer",

    featuredTitle: "Featured Initiative",
    featuredSub: "HIGHLIGHTED EVENT",
    btnRegister: "Register Interest",
    btnShare: "Share Event",
    copiedAlert: "Link copied to clipboard!",

    categoriesTitle: "Explore Event Areas",
    categoriesSub: "EVENT CATEGORIES",

    upcomingTitle: "Upcoming Campaigns",
    upcomingSub: "JOIN US ON THE GROUND",
    organizerLabel: "Organizer",
    locationLabel: "Location",
    timeLabel: "Time",

    pastTitle: "Past Campaigns & Impact",
    pastSub: "COMPLETED INITIATIVES",
    participantsLabel: "Participants",
    impactLabel: "Key Impact",

    timelineTitle: "Our Service Timeline",
    timelineSub: "HISTORICAL MILESTONES",

    galleryTitle: "Field Action Gallery",
    gallerySub: "MOMENTS IN SERVICE",

    statsTitle: "Campaign Highlights",
    statsSub: "OUR NUMBERS",
    statEvents: "Total Events",
    statParticipants: "Participants",
    statVolunteers: "Volunteers",
    statVillages: "Villages Reached",
    statTrees: "Trees Planted",
    statMedical: "Medical Beneficiaries",

    testimonialsTitle: "Voices from the Field",
    testimonialsSub: "FEEDBACK & STORIES",
    communityFeedback: "Community Feedback",
    volunteerFeedback: "Volunteer Feedback",
    beneficiaryStory: "Beneficiary Story",

    registerFormTitle: "Register for Event",
    volunteerFormTitle: "Become a Volunteer",
    formName: "Your Name",
    formPhone: "Phone Number",
    formEmail: "Email Address",
    formMessage: "Why do you want to join?",
    formSubmit: "Submit Application",
    formSuccess: "Submitted successfully! We will contact you soon.",
    calSelectedNoEvent: "No campaigns scheduled on this date.",
    ctaTitle: "Be Part of Positive Change",
    ctaSub:
      "Join hands with Uday Foundation to bring hope, support, and sustainable development to rural Gujarat.",
    btnSupport: "Support Our Mission",
  },
  gu: {
    heroEyebrow: "અમારા કાર્યક્રમો અને પહેલ",
    heroTitle: "સામુદાયિક કાર્યક્રમો દ્વારા પ્રભાવ ઊભો કરવો",
    heroSub:
      "જાગૃતિ અભિયાન, તબીબી શિબિર, શૈક્ષણિક પહેલ, વૃક્ષારોપણ અભિયાન અને સામુદાયિક વિકાસ કાર્યક્રમો દ્વારા અમારા મિશનમાં જોડાઓ.",
    btnUpcoming: "આગામી કાર્યક્રમો",
    btnBecomeVolunteer: "સ્વયંસેવક બનો",

    featuredTitle: "મુખ્ય પહેલ",
    featuredSub: "હાઇલાઇટ કરેલ ઇવેન્ટ",
    btnRegister: "રજીસ્ટર કરો",
    btnShare: "શેર કરો",
    copiedAlert: "લિંક કોપી થઈ ગઈ છે!",

    categoriesTitle: "કાર્યક્રમ ક્ષેત્રો શોધો",
    categoriesSub: "કાર્યક્રમ શ્રેણીઓ",

    upcomingTitle: "આગામી ઝુંબેશો",
    upcomingSub: "અમારી સાથે જોડાઓ",
    organizerLabel: "આયોજક",
    locationLabel: "સ્થળ",
    timeLabel: "સમય",

    pastTitle: "ભૂતકાળની ઝુંબેશો અને પ્રભાવ",
    pastSub: "પૂર્ણ થયેલ પહેલ",
    participantsLabel: "ભાગીદારો",
    impactLabel: "મુખ્ય પ્રભાવ",

    timelineTitle: "અમારી સેવા સમયરેખા",
    timelineSub: "ઐતિહાસિક લક્ષ્યો",

    galleryTitle: "ફિલ્ડ એક્શન ગેલેરી",
    gallerySub: "સેવા પળો",

    statsTitle: "ઝુંબેશ હાઇલાઇટ્સ",
    statsSub: "અમારા આંકડા",
    statEvents: "કુલ કાર્યક્રમો",
    statParticipants: "ભાગીદારો",
    statVolunteers: "સ્વયંસેવકો",
    statVillages: "ગામડાઓ સુધી પહોંચ",
    statTrees: "રોપાયેલા વૃક્ષો",
    statMedical: "તબીબી લાભાર્થીઓ",

    testimonialsTitle: "ક્ષેત્રમાંથી અવાજો",
    testimonialsSub: "પ્રતિસાદ અને વાર્તાઓ",
    communityFeedback: "સમુદાય પ્રતિસાદ",
    volunteerFeedback: "સ્વયંસેવક પ્રતિસાદ",
    beneficiaryStory: "લાભાર્થી વાર્તા",

    registerFormTitle: "ઇવેન્ટ માટે નોંધણી કરો",
    volunteerFormTitle: "સ્વયંસેવક બનો",
    formName: "તમારું નામ",
    formPhone: "ફોન નંબર",
    formEmail: "ઈમેલ એડ્રેસ",
    formMessage: "તમે કેમ જોડાવા માંગો છો?",
    formSubmit: "અરજી સબમિટ કરો",
    formSuccess: "સફળતાપૂર્વક સબમિટ સબમિટ થયું! અમે ટૂંક સમયમાં તમારો સંપર્ક કરીશું.",
    calSelectedNoEvent: "આ તારીખે કોઈ ઝુંબેશ નિર્ધારિત નથી.",
    ctaTitle: "સકારાત્મક પરિવર્તનનો ભાગ બનો",
    ctaSub:
      "ગ્રામીણ ગુજરાતમાં આશા, સમર્થન અને ટકાઉ વિકાસ લાવવા માટે ઉદય ફાઉન્ડેશન સાથે હાથ મિલાવો.",
    btnSupport: "અમારા મિશનને ટેકો આપો",
  },
  hi: {
    heroEyebrow: "हमारे कार्यक्रम और पहल",
    heroTitle: "सामुदायिक कार्यक्रमों के माध्यम से प्रभाव पैदा करना",
    heroSub:
      "जागरूकता अभियानों, चिकित्सा शिविरों, शैक्षिक पहलों, वृक्षारोपण अभियानों और सामुदायिक विकास कार्यक्रमों के माध्यम से हमारे मिशन में शामिल हों।",
    btnUpcoming: "आगामी कार्यक्रम",
    btnBecomeVolunteer: "स्वयंसेवक बनें",

    featuredTitle: "मुख्य पहल",
    featuredSub: "हाइलाइट की गई घटना",
    btnRegister: "रजिस्टर करें",
    btnShare: "साझा करें",
    copiedAlert: "लिंक कॉपी हो गई है!",

    categoriesTitle: "कार्यक्रम क्षेत्रों का अन्वेषण करें",
    categoriesSub: "कार्यक्रम श्रेणियां",

    upcomingTitle: "आगामी अभियान",
    upcomingSub: "हमारे साथ जमीन पर जुड़ें",
    organizerLabel: "आयोजक",
    locationLabel: "स्थान",
    timeLabel: "समय",

    pastTitle: "पिछले अभियान और प्रभाव",
    pastSub: "पूर्ण की गई पहल",
    participantsLabel: "प्रतिभागी",
    impactLabel: "मुख्य प्रभाव",

    timelineTitle: "हमारी सेवा समयरेखा",
    timelineSub: "ऐतिहासिक मील के पत्थर",

    galleryTitle: "फील्ड एक्शन गैलरी",
    gallerySub: "सेवा के क्षण",

    statsTitle: "अभियान की मुख्य बातें",
    statsSub: "हमारे आंकड़े",
    statEvents: "कुल कार्यक्रम",
    statParticipants: "प्रतिभागी",
    statVolunteers: "स्वयंसेवक",
    statVillages: "पहुंचे गांव",
    statTrees: "लगाए गए पेड़",
    statMedical: "चिकित्सा लाभार्थी",

    testimonialsTitle: "क्षेत्र से आवाजें",
    testimonialsSub: "प्रतिक्रिया और कहानियां",
    communityFeedback: "सामुदायिक प्रतिक्रिया",
    volunteerFeedback: "स्वयंसेवक प्रतिक्रिया",
    beneficiaryStory: "लाभार्थी की कहानी",

    registerFormTitle: "कार्यक्रम के लिए पंजीकरण करें",
    volunteerFormTitle: "स्वयंसेवक बनें",
    formName: "आपका नाम",
    formPhone: "फ़ोन नंबर",
    formEmail: "ईमेल पता",
    formMessage: "आप क्यों शामिल होना चाहते हैं?",
    formSubmit: "आवेदन जमा करें",
    formSuccess: "सफलतापूर्वक जमा किया गया! हम जल्द ही आपसे संपर्क करेंगे।",
    calSelectedNoEvent: "इस तिथि पर कोई अभियान निर्धारित नहीं है।",
    ctaTitle: "सकारात्मक बदलाव का हिस्सा बनें",
    ctaSub:
      "ग्रामीण गुजरात में आशा, सहायता और सतत विकास लाने के लिए उदय फाउंडेशन के साथ हाथ मिलाएं।",
    btnSupport: "हमारे मिशन का समर्थन करें",
  },
};

const UPCOMING_CAMPAIGNS: any[] = [];

const PAST_CAMPAIGNS = [...SCHOOL_BAG_EVENTS];

const GALLERY_PICTURES: any[] = [];

export function Events() {
  const { language, t } = useLanguage();
  const tLocal = TRANSLATIONS_LOCAL[language as "en" | "gu" | "hi"] || TRANSLATIONS_LOCAL["en"];

  useDocumentMetadata(
    "Events & Campaigns | Uday Foundation Trust",
    "Join our upcoming campaigns, medical camps, educational programs, and environmental sustainability initiatives in rural Gujarat.",
  );

  // States
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeGalleryCat, setActiveGalleryCat] = useState<string>("All");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<string | null>(null);
  const [isVolunteering, setIsVolunteering] = useState<boolean>(false);
  const [regForm, setRegForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [regSuccess, setRegSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Event categories list
  const CATEGORIES = [
    { key: "All", label: { en: "All Events", gu: "બધા કાર્યક્રમો", hi: "सभी कार्यक्रम" } },
    { key: "Healthcare Events", label: { en: "Healthcare", gu: "આરોગ્ય", hi: "स्वास्थ्य सेवा" } },
    { key: "Education Events", label: { en: "Education", gu: "શિક્ષણ", hi: "शिक्षा" } },
    { key: "Environmental Events", label: { en: "Environment", gu: "પર્યાવરણ", hi: "पर्यावरण" } },
    { key: "Sports Activities", label: { en: "Sports", gu: "રમતગમત", hi: "खेलकूद" } },
    { key: "Volunteer Programs", label: { en: "Volunteer", gu: "સ્વયંસેવક", hi: "स्वयंसेवक" } },
  ];

  // Gallery category options
  const GALLERY_CATS = [
    "All",
    "Medical Camps",
    "Tree Plantation",
    "Educational Activities",
    "Volunteer Activities",
    "Community Events",
  ];

  // Filtered upcoming campaigns
  const filteredEvents =
    activeCategory === "All"
      ? UPCOMING_CAMPAIGNS
      : UPCOMING_CAMPAIGNS.filter((e) => e.category === activeCategory);

  // Filtered gallery
  const filteredGallery =
    activeGalleryCat === "All"
      ? GALLERY_PICTURES
      : GALLERY_PICTURES.filter((p) => p.category === activeGalleryCat);

  // Form submits
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone) return;
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setRegForm({ name: "", phone: "", email: "", message: "" });
      setIsRegistering(null);
      setIsVolunteering(false);
    }, 2500);
  };

  const handleShare = (eventId: string) => {
    const url = `${window.location.origin}/events?event=${eventId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(eventId);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  return (
    <div className="bg-[#F8FAFF] min-h-screen text-slate-800 font-sans selection:bg-[#F7E81D] selection:text-[#4040A1]">
      <PageHero
        eyebrow={tLocal.heroEyebrow}
        title={tLocal.heroTitle}
        subtitle={tLocal.heroSub}
        bgImage={pavaDistributionGroup}
        breadcrumbActive={t("nav.events")}
      />
      {/* FEATURED EVENT SECTION */}
      {UPCOMING_CAMPAIGNS.length > 0 && (
      <section className="py-16 md:py-24 bg-white border-b border-border">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#7A9D1C] bg-[#7A9D1C]/10 rounded-full mb-4">
              {tLocal.featuredSub}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {tLocal.featuredTitle}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="about-card-premium p-0! bg-[#F8FAFF] overflow-hidden border border-border shadow-lg">
            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                <img
                  src={pavaDistributionGroup}
                  alt="Free Medical Camp"
                  className="w-full h-full object-cover transform hover:scale-[1.03] transition-transform duration-700"
                  loading="eager"
                />
              </div>

              <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between bg-white">
                <div>
                  <div className="mb-4">
                    <span className="chip bg-[#7A9D1C]/15 text-[#7A9D1C] border-[#7A9D1C]/20 text-xs font-bold uppercase tracking-widest px-3 py-1">
                      Healthcare
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[#4040A1]" />{" "}
                      {UPCOMING_CAMPAIGNS[0].displayDate[language]}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#4040A1]" /> {UPCOMING_CAMPAIGNS[0].time}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-4">
                    {UPCOMING_CAMPAIGNS[0].title[language]}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {UPCOMING_CAMPAIGNS[0].desc[language]}
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 mb-4">
                    <div className="bg-[#F8FAFF] p-4 rounded-2xl border border-slate-100 text-center">
                      <div className="text-2xl font-bold text-[#7A9D1C]">500+</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        Beneficiaries
                      </div>
                    </div>
                    <div className="bg-[#F8FAFF] p-4 rounded-2xl border border-slate-100 text-center">
                      <div className="text-2xl font-bold text-[#4040A1]">15+</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        Doctors Group
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-5">
                    <div className="text-xs text-slate-500 font-semibold leading-relaxed">
                      <span className="font-bold text-slate-800 uppercase tracking-wider">
                        {tLocal.organizerLabel}:{" "}
                      </span>
                      <span>{UPCOMING_CAMPAIGNS[0].organizer[language]}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold leading-relaxed">
                      <span className="font-bold text-slate-800 uppercase tracking-wider">
                        {tLocal.locationLabel}:{" "}
                      </span>
                      <span>{UPCOMING_CAMPAIGNS[0].place[language]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-8 border-t border-slate-100 pt-6">
                  <button
                    onClick={() => setIsRegistering(UPCOMING_CAMPAIGNS[0].id)}
                    className="btn-saffron text-xs font-bold uppercase tracking-wider px-6 py-3.5 cursor-pointer"
                  >
                    {tLocal.btnRegister}
                  </button>

                  <button
                    onClick={() => handleShare(UPCOMING_CAMPAIGNS[0].id)}
                    className="btn-ghost text-xs font-bold uppercase tracking-wider px-5 py-3.5 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>
                      {copiedId === UPCOMING_CAMPAIGNS[0].id ? tLocal.copiedAlert : tLocal.btnShare}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      )}
      {/* EVENT CATEGORIES SECTION */}
      <section className="py-16 md:py-24 bg-[#F8FAFF] border-b border-border">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#4040A1] bg-[#4040A1]/10 rounded-full mb-4">
              {tLocal.categoriesSub}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {tLocal.categoriesTitle}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              {
                icon: Activity,
                title: {
                  en: "Healthcare Events",
                  gu: "આરોગ્ય કાર્યક્રમો",
                  hi: "स्वास्थ्य कार्यक्रम",
                },
                color: "text-[#4040A1] bg-[#4040A1]/10",
              },
              {
                icon: BookOpen,
                title: {
                  en: "Education Events",
                  gu: "શૈક્ષણિક કાર્યક્રમો",
                  hi: "शिक्षा कार्यक्रम",
                },
                color: "text-[#7A9D1C] bg-[#7A9D1C]/10",
              },
              {
                icon: Trees,
                title: { en: "Environmental", gu: "પર્યાવરણ કાર્યક્રમો", hi: "पर्यावरण कार्यक्रम" },
                color: "text-[#7A9D1C] bg-[#7A9D1C]/10",
              },
              {
                icon: Flame,
                title: {
                  en: "Disaster Relief",
                  gu: "આફત રાહત પ્રવૃત્તિઓ",
                  hi: "आपदा राहत गतिविधियां",
                },
                color: "text-[#4040A1] bg-[#4040A1]/10",
              },
              {
                icon: Trophy,
                title: {
                  en: "Sports Activities",
                  gu: "રમતગમત પ્રવૃત્તિઓ",
                  hi: "खेलकूद गतिविधियां",
                },
                color: "text-[#4040A1] bg-[#4040A1]/10",
              },
              {
                icon: UserCheck,
                title: {
                  en: "Volunteer Programs",
                  gu: "સ્વયંસેવક કાર્યક્રમો",
                  hi: "स्वयंसेवक कार्यक्रम",
                },
                color: "text-[#7A9D1C] bg-[#7A9D1C]/10",
              },
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="about-card-premium items-center text-center p-6 bg-white border border-border transition-all flex flex-col h-full justify-between"
                >
                  <div
                    className={`h-12 w-12 rounded-full ${cat.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                    {cat.title[language]}
                  </h4>
                  <div className="w-8 h-0.5 bg-[#F7E81D] mt-2 rounded-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS SECTION */}
      <span id="upcoming" className="block relative -top-24" />
      <section className="py-16 md:py-24 bg-white border-b border-border">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#4040A1] bg-[#4040A1]/10 rounded-full mb-4">
              {tLocal.upcomingSub}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {tLocal.upcomingTitle}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#4040A1] text-white shadow-md border-[#4040A1]"
                      : "bg-[#F8FAFF] hover:bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {cat.label[language]}
                </button>
              );
            })}
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-semibold bg-white border border-border rounded-3xl shadow-xs">
              {language === "gu" ? "હાલમાં કોઈ આગામી કાર્યક્રમો આયોજિત નથી." : language === "hi" ? "वर्तमान में कोई आगामी कार्यक्रम निर्धारित नहीं है।" : "No upcoming campaigns scheduled at this time."}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((evt) => {
                const title = evt.title[language];
                const desc = evt.desc[language];
                const place = evt.place[language];
                const displayDate = evt.displayDate[language];
  
                return (
                  <article
                    key={evt.id}
                    className="about-card-premium p-0! bg-white border border-border shadow-xs overflow-hidden group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={evt.img}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
  
                      <div className="p-6">
                        <div className="mb-3">
                          <span className="chip bg-[#4040A1]/10 text-[#4040A1] text-[10px] font-bold py-1 px-2.5 rounded-full uppercase tracking-widest">
                            {evt.category}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-[#4040A1]" /> {displayDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-[#4040A1]" /> {evt.time}
                          </span>
                        </div>
  
                        <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-[#4040A1] transition-colors mb-3 leading-snug">
                          {title}
                        </h3>
  
                        <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4">
                          {desc}
                        </p>
  
                        <div className="flex items-start gap-1.5 text-xs text-slate-500 border-t border-slate-50 pt-4 mt-2">
                          <MapPin className="h-4 w-4 text-[#7A9D1C] flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{place}</span>
                        </div>
                      </div>
                    </div>
  
                    <div className="p-6 border-t border-slate-100 bg-[#F8FAFF] flex items-center justify-between gap-3 mt-auto">
                      <button
                        onClick={() => setIsRegistering(evt.id)}
                        className="btn-saffron text-[10px] font-bold uppercase tracking-wider py-2.5 px-4 cursor-pointer w-full text-center"
                      >
                        {tLocal.btnRegister}
                      </button>
  
                      <button
                        onClick={() => handleShare(evt.id)}
                        className="text-slate-500 hover:text-[#4040A1] text-[10px] font-bold uppercase tracking-widest inline-flex items-center justify-center p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        title="Share Event"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* PAST EVENTS SECTION */}
      <section className="py-16 md:py-24 bg-white border-b border-border">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#7A9D1C] bg-[#7A9D1C]/10 rounded-full mb-4">
              {tLocal.pastSub}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {tLocal.pastTitle}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          {PAST_CAMPAIGNS.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-semibold bg-[#F8FAFF] border border-border rounded-3xl shadow-xs">
              {language === "gu" ? "હજી સુધી કોઈ ભૂતકાળના કાર્યક્રમો ઉપલબ્ધ નથી." : language === "hi" ? "अभी तक कोई पिछला कार्यक्रम उपलब्ध नहीं है।" : "No past campaigns recorded yet."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PAST_CAMPAIGNS.map((evt) => {
                const title = evt.title[language];
                const summary = evt.summary[language];
                const place = evt.place[language];
                const impact = evt.impact[language];
  
                return (
                  <article
                    key={evt.id}
                    className="about-card-premium p-0! bg-[#F8FAFF] border border-border shadow-xs overflow-hidden group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={evt.img}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
  
                      <div className="p-6">
                        <div className="mb-2.5">
                          <span className="chip bg-[#7A9D1C]/10 text-[#7A9D1C] text-[10px] font-bold py-1 px-2.5 rounded-full uppercase tracking-widest">
                            COMPLETED
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                          <span>{evt.date}</span>
                          <span>{place}</span>
                        </div>
  
                        <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-[#4040A1] transition-colors mb-3 leading-snug">
                          {title}
                        </h3>
  
                        <p className="text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-3">
                          {summary}
                        </p>
                      </div>
                    </div>
  
                    <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between gap-3 mt-auto">
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          {tLocal.participantsLabel}
                        </div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                          <Users className="h-3.5 w-3.5 text-[#4040A1]" />{" "}
                          {evt.participants.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          {tLocal.impactLabel}
                        </div>
                        <div className="text-xs font-bold text-[#7A9D1C] mt-0.5">{impact}</div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* PHOTO GALLERY SECTION */}
      <section className="py-16 md:py-24 bg-[#F8FAFF] border-b border-border">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#4040A1] bg-[#4040A1]/10 rounded-full mb-4">
              {tLocal.gallerySub}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {tLocal.galleryTitle}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          {/* Gallery categories tab */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {GALLERY_CATS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveGalleryCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeGalleryCat === cat
                    ? "bg-[#4040A1] text-white shadow-md border-[#4040A1]"
                    : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          {filteredGallery.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-semibold bg-white border border-border rounded-3xl shadow-xs w-full col-span-full">
              {language === "gu" ? "ગેલેરીમાં હજુ સુધી કોઈ ફોટા નથી." : language === "hi" ? "गैलरी में अभी तक कोई फोटो नहीं हैं।" : "No photos in the gallery yet."}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredGallery.map((pic, idx) => {
                const caption = pic.caption[language] || pic.caption["en"];
                return (
                  <div
                    key={idx}
                    onClick={() => setLightboxImg(pic.img)}
                    className="block w-full rounded-2xl overflow-hidden bg-surface border border-border hover:border-primary/40 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={pic.img}
                        alt={caption}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 bg-white border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span className="truncate">{caption}</span>
                      <span className="text-[10px] text-[#4040A1] bg-[#4040A1]/10 px-2 py-0.5 rounded-md flex-shrink-0">
                        View
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* IMPACT STATISTICS SECTION */}
      <section className="py-16 md:py-24 bg-white border-b border-border">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#4040A1] bg-[#4040A1]/10 rounded-full mb-4">
              {tLocal.statsSub}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {tLocal.statsTitle}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 text-center">
            {[
              { label: tLocal.statEvents, val: 32, suffix: "+" },
              { label: tLocal.statParticipants, val: 15000, suffix: "+" },
              { label: tLocal.statVolunteers, val: 50, suffix: "+" },
              { label: tLocal.statVillages, val: 45, suffix: "+" },
              { label: tLocal.statTrees, val: 10000, suffix: "+" },
              { label: tLocal.statMedical, val: 5000, suffix: "+" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="about-card-premium bg-[#F8FAFF] border border-border p-6 shadow-xs rounded-3xl"
              >
                <span className="text-2xl md:text-3xl font-display font-bold text-[#7A9D1C] flex items-center justify-center">
                  <Counter to={stat.val} duration={1200} />
                  <span>{stat.suffix}</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VOLUNTEER TESTIMONIALS SECTION */}
      <section className="py-16 md:py-24 bg-[#F8FAFF] border-b border-border">
        <div className="about-section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#4040A1] bg-[#4040A1]/10 rounded-full mb-4">
              {tLocal.testimonialsSub}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {tLocal.testimonialsTitle}
            </h2>
            <div className="w-16 h-1 bg-[#F7E81D] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: {
                  en: "Being a volunteer at the Uday Foundation eye camp changed my outlook. The doctors did thorough checkups for 150+ seniors. It was beautiful.",
                  gu: "ઉદય ફાઉન્ડેશનના આંખના કેમ્પમાં સ્વયંસેવક તરીકે કામ કરવાથી મારો દ્રષ્ટિકોણ બદલાઈ ગયો. તબીબોએ ૧૫૦થી વધુ વડીલોની ખૂબ કાળજીપૂર્વક તપાસ કરી.",
                  hi: "उदय फाउंडेशन के नेत्र शिविर में स्वयंसेवक के रूप में काम करने से मेरा दृष्टिकोण बदल गया। डॉक्टरों ने 150 से अधिक बुजुर्गों की बहुत सावधानी से जांच की।",
                },
                author: "Dr. Ramesh Patel",
                tag: tLocal.volunteerFeedback,
              },
              {
                quote: {
                  en: "We had no clean drinking water because of fluoride groundwater. The trust set up filtration facilities that are helping 100+ homes.",
                  gu: "અમારા વિસ્તારમાં પીવાનું પાણી શુદ્ધ નહોતું. ઉદય ટ્રસ્ટ દ્વારા ફિલ્ટરેશન યુનિટ લગાવવામાં આવ્યું જે ૧૦૦થી વધુ પરિવારોને શુદ્ધ પાણી આપે છે.",
                  hi: "हमारे क्षेत्र में पीने का पानी शुद्ध नहीं था। उदय ट्रस्ट द्वारा फिल्ट्रेशन यूनिट लगाया गया जिससे 100 से अधिक परिवारों को शुद्ध पानी मिल रहा है।",
                },
                author: "Savita Rathod",
                tag: tLocal.beneficiaryStory,
              },
              {
                quote: {
                  en: "The school kit distribution in rural Sanand primary schools gave bags and textbooks to kids who couldn't afford them. This is true dharma.",
                  gu: "સાણંદના અંતરિયાળ ગામોની શાળાઓમાં બાળકોને સ્કૂલ બેગ અને ચોપડાઓનું વિતરણ ખરેખર જરૂરિયાત સમયે કરવામાં આવ્યું. આ જ સાચો ધર્મ છે.",
                  hi: "सानंद के ग्रामीण स्कूलों में बच्चों को स्कूल बैग और पुस्तकों का वितरण वास्तव में सही समय पर किया गया। यही सच्चा धर्म है।",
                },
                author: "Devang Bauddh",
                tag: tLocal.communityFeedback,
              },
            ].map((test, index) => (
              <div
                key={index}
                className="about-card-premium border border-border bg-white relative p-8 shadow-xs rounded-2xl"
              >
                <Quote className="absolute top-4 right-4 h-12 w-12 text-slate-100 pointer-events-none" />
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed italic mb-6 z-10 relative">
                  "{test.quote[language] || test.quote["en"]}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#4040A1]/10 text-[#4040A1] flex items-center justify-center font-bold text-xs">
                    {test.author[0]}
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900">{test.author}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {test.tag}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-[#4040A1] text-white text-center">
        <div className="absolute inset-0 z-0">
          <img src={pavaDistributionGroup} alt="Support" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4040A1] via-[#4040A1]/95 to-transparent" />
        </div>

        <div className="about-section-container relative z-10 max-w-3xl px-6">
          <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#F7E81D] bg-[#F7E81D]/10 rounded-full mb-4 border border-[#F7E81D]/25">
            MAKE AN IMPACT
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
            {tLocal.ctaTitle}
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            {tLocal.ctaSub}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsVolunteering(true)}
              className="btn-saffron text-sm font-bold uppercase tracking-wider py-3.5 px-8 cursor-pointer"
            >
              {tLocal.btnBecomeVolunteer}
            </button>
            <Link
              to="/donate"
              className="btn-ghost text-white text-sm font-bold uppercase tracking-wider py-3.5 px-8 border-white hover:bg-white hover:text-[#4040A1] transition-all cursor-pointer"
            >
              {tLocal.btnSupport}
            </Link>
          </div>
        </div>
      </section>

      {/* LIGHTBOX PREVIEW MODAL */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-[#F7E81D] transition-colors p-2 cursor-pointer animate-pulse"
            onClick={() => setLightboxImg(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={lightboxImg}
            alt="Enlarged gallery preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl scale-100 transition-all duration-300"
          />
        </div>
      )}

      {/* REGISTRATION & VOLUNTEER POPUP MODAL */}
      {(isRegistering || isVolunteering) && (
        <div className="fixed inset-0 bg-black/60 backdrop-filter backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-border rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => {
                setIsRegistering(null);
                setIsVolunteering(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 mb-6">
              {isVolunteering ? tLocal.volunteerFormTitle : tLocal.registerFormTitle}
            </h3>

            {regSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-16 w-16 text-[#7A9D1C] mx-auto mb-4 animate-bounce" />
                <p className="text-slate-800 text-sm font-semibold">{tLocal.formSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {tLocal.formName}
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4040A1]/20"
                    placeholder="Gulabbhai Bauddh"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {tLocal.formPhone}
                  </label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4040A1]/20"
                    placeholder="+91 96246 68484"
                  />
                </div>
                {isVolunteering && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        {tLocal.formEmail}
                      </label>
                      <input
                        type="email"
                        required
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4040A1]/20"
                        placeholder="name@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        {tLocal.formMessage}
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={regForm.message}
                        onChange={(e) => setRegForm({ ...regForm, message: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4040A1]/20"
                        placeholder="I want to contribute my time..."
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="btn-primary w-full mt-6 py-3 font-bold uppercase tracking-wider cursor-pointer bg-[#4040A1] text-white hover:bg-[#4040A1]/95"
                >
                  {tLocal.formSubmit}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;

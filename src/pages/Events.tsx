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
import imgEdu from "@/assets/program-education.jpg";
import imgHealth from "@/assets/program-health.jpg";
import imgTrees from "@/assets/program-trees.jpg";
import imgRation from "@/assets/activity-ration.jpg";
import heroChildren from "@/assets/hero-children.jpg";
import imgPavaChildren from "@/assets/event-pava-children.jpg";
import imgPavaCert from "@/assets/event-pava-cert.jpg";
import imgPavaDist from "@/assets/event-pava-dist.jpg";
import imgPavaBook from "@/assets/event-pava-book.jpg";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";

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

const UPCOMING_CAMPAIGNS = [
  {
    id: "med-camp-soyla",
    category: "Healthcare Events",
    date: "12 Jul 2026",
    displayDate: { en: "12 Jul 2026", gu: "૧૨ જુલાઈ ૨૦૨૬", hi: "12 जुलाई 2026" },
    title: {
      en: "Free Medical & Eye Camp",
      gu: "મફત નિદાન અને આંખની સારવાર કેમ્પ",
      hi: "मुफ़्त चिकित्सा और नेत्र शिविर",
    },
    place: {
      en: "Primary School Campus, Soyla, Sanand",
      gu: "પ્રાથમિક શાળા કેમ્પસ, સોયલા, સાણંદ",
      hi: "प्राथमिक विद्यालय परिसर, सोयला, साानंद",
    },
    time: "9:00 AM - 2:00 PM",
    organizer: {
      en: "Uday Trust Medical Wing & Red Cross",
      gu: "ઉદય ટ્રસ્ટ મેડિકલ વિંગ અને રેડ ક્રોસ",
      hi: "उदय ट्रस्ट मेडिकल विंग और रेड क्रॉस",
    },
    desc: {
      en: "Comprehensive general health check-ups, sugar & BP testing, free eye examinations, and distribution of specs and medicines.",
      gu: "સામાન્ય આરોગ્ય તપાસ, બ્લડ સુગર અને બીપી ટેસ્ટિંગ, મફત આંખની તપાસ, તેમજ જરૂરિયાતમંદોને ચશ્મા અને દવાઓનું વિતરણ.",
      hi: "व्यापक सामान्य स्वास्थ्य जांच, शुगर और बीपी परीक्षण, मुफ्त नेत्र परीक्षण, और चश्मे और दवाओं का वितरण।",
    },
    img: imgHealth,
  },
  {
    id: "tree-plantation-ambedkar",
    category: "Environmental Events",
    date: "05 Aug 2026",
    displayDate: { en: "05 Aug 2026", gu: "૦૫ ઓગસ્ટ ૨૦૨૬", hi: "05 अगस्त 2026" },
    title: {
      en: "Tree Plantation — Independence Drive",
      gu: "વૃક્ષારોપણ — સ્વાતંત્ર્ય પર્વ અભિયાન",
      hi: "वृक्षारोपण — स्वतंत्रता दिवस अभियान",
    },
    place: {
      en: "Ambedkar Nagar Roadside, Sanand",
      gu: "આંબેડકર નગર રોડ સાઇડ, સાણંદ",
      hi: "अंबेडकर नगर रोड साइड, साानंद",
    },
    time: "6:30 AM - 10:00 AM",
    organizer: {
      en: "Green Volunteers Team & Forest Dept",
      gu: "ગ્રીન સ્વયંસેવકો અને વન વિભાગ",
      hi: "ग्रीन स्वयंसेवक और वन विभाग",
    },
    desc: {
      en: "Targeting planting of 500 indigenous trees along roadsides and schools to boost biodiversity and green coverage.",
      gu: "ગામડાઓ અને રસ્તાઓ પર હરિયાળી વધારવા માટે સ્થાનિક પ્રજાતિના ૫૦૦ વૃક્ષો રોપવાનું અને જાળવવાનું આયોજન.",
      hi: "हरियाली बढ़ाने के लिए सड़कों और स्कूलों के किनारे 500 स्थानीय प्रजातियों के पेड़ लगाने और उनके संरक्षण का लक्ष्य।",
    },
    img: imgTrees,
  },
  {
    id: "school-kit-rural",
    category: "Education Events",
    date: "21 Aug 2026",
    displayDate: { en: "21 Aug 2026", gu: "૨૧ ઓગસ્ટ ૨૦૨૬", hi: "21 अगस्त 2026" },
    title: {
      en: "Rural School Kit Distribution",
      gu: "ગ્રામીણ શાળાઓમાં સ્કૂલ કીટ વિતરણ",
      hi: "ग्रामीण स्कूलों में स्कूल किट वितरण",
    },
    place: {
      en: "5 Primary Government Schools, Sanand",
      gu: "૫ સરકારી પ્રાથમિક શાળાઓ, સાણંદ",
      hi: "5 सरकारी प्राथमिक विद्यालय, साानंद",
    },
    time: "10:00 AM - 1:00 PM",
    organizer: {
      en: "Uday Trust Education Council",
      gu: "ઉદય ટ્રસ્ટ શિક્ષણ સમિતિ",
      hi: "उदय ट्रस्ट शिक्षा समिति",
    },
    desc: {
      en: "Providing school bags, notebooks, drawing kits, and essential writing materials to underprivileged kids ahead of terminal exams.",
      gu: "પરીક્ષાઓ પહેલા ગરીબ બાળકોને સ્કૂલ બેગ, નોટબુક, ડ્રોઈંગ કીટ અને જરૂરી સ્ટેશનરી સામગ્રી પૂરી પાડવી.",
      hi: "परीक्षाओं से पहले वंचित बच्चों को स्कूल बैग, नोटबुक, ड्राइंग किट और आवश्यक लेखन सामग्री प्रदान करना।",
    },
    img: imgEdu,
  },
  {
    id: "womens-health-camp",
    category: "Healthcare Events",
    date: "14 Sep 2026",
    displayDate: { en: "14 Sep 2026", gu: "૧૪ સપ્ટેમ્બર ૨૦૨૬", hi: "14 सितंबर 2026" },
    title: {
      en: "Women's Health Awareness & Safety Camp",
      gu: "મહિલા સ્વાસ્થ્ય જાગૃતિ અને સુરક્ષા કેમ્પ",
      hi: "महिला स्वास्थ्य जागरूकता और सुरक्षा शिविर",
    },
    place: {
      en: "Community Hall, Soyla, Sanand",
      gu: "કોમ્યુનિટી હોલ, સોયલા, સાણંદ",
      hi: "सामुदायिक भवन, सोयला, साानंद",
    },
    time: "11:00 AM - 1:30 PM",
    organizer: {
      en: "Mahila Shakti Wing & Local ASHA workers",
      gu: "મહિલા શક્તિ વિંગ અને સ્થાનિક આશા વર્કર્સ",
      hi: "महिला शक्ति विंग और स्थानीय आशा कार्यकर्ता",
    },
    desc: {
      en: "Doctor talks on nutrition, anemia prevention, menstrual hygiene management, and distribution of safety kits.",
      gu: "પોષણ, એનિમિયા નિવારણ, માસિક સ્ત્રાવ સ્વાસ્થ્ય અંગે ગાયનેકોલોજિસ્ટ ડોકટરોનું માર્ગદર્શન અને સેનિટરી પેડ્સનું વિતરણ.",
      hi: "पोषण, एनीमिया निवारण, मासिक धर्म स्वास्थ्य पर स्त्री रोग विशेषज्ञ डॉक्टरों का मार्गदर्शन और सेनेटरी पैड्स का वितरण।",
    },
    img: imgRation,
  },
  {
    id: "sports-day-celebration",
    category: "Sports Activities",
    date: "20 Oct 2026",
    displayDate: { en: "20 Oct 2026", gu: "૨૦ ઓક્ટોબર ૨૦૨૬", hi: "20 अक्टूबर 2026" },
    title: {
      en: "Rural Sports Day & Youth Meet",
      gu: "ગ્રામીણ રમતગમત દિવસ અને યુવા મિલન",
      hi: "ग्रामीण खेल दिवस और युवा मिलन",
    },
    place: {
      en: "Soyla Village Playground, Sanand",
      gu: "સોયલા ગામનું રમતગમત મેદાન, સાણંદ",
      hi: "सोयला ग्राम खेल का मैदान, साानंद",
    },
    time: "8:00 AM - 4:00 PM",
    organizer: {
      en: "Uday Youth Sports Council",
      gu: "ઉદય યુવા સ્પોર્ટ્સ કાઉન્સિલ",
      hi: "उदय युवा खेल परिषद",
    },
    desc: {
      en: "Traditional sports competitions like Kabaddi, Kho-Kho, and athletics for village youth to promote physical health and team building.",
      gu: "શારીરિક સ્વાસ્થ્ય અને ટીમ બિલ્ડિંગને પ્રોત્સાહન આપવા માટે ગામડાના યુવાનો માટે કબડ્ડી, ખો-ખો અને એથ્લેટિક્સ જેવી પરંપરાગત રમતો.",
      hi: "शारीरिक स्वास्थ्य और टीम निर्माण को बढ़ावा देने के लिए ग्रामीण युवाओं के लिए कबड्डी, खो-खो और एथलेटिक्स जैसी पारंपरिक खेल प्रतियोगिताएं।",
    },
    img: imgEdu,
  },
  {
    id: "village-cleanup-drive",
    category: "Volunteer Programs",
    date: "10 Nov 2026",
    displayDate: { en: "10 Nov 2026", gu: "૧૦ નવેમ્બર ૨૦૨૬", hi: "10 नवंबर 2026" },
    title: {
      en: "Swachh Gram Cleanliness & Livelihood Seminar",
      gu: "સ્વચ્છ ગ્રામ સફાઈ ઝુંબેશ અને આજીવિકા સેમિનાર",
      hi: "स्वच्छ ग्राम स्वच्छता अभियान और आजीविका सेमिनार",
    },
    place: {
      en: "Gram Panchayat Area, Soyla, Sanand",
      gu: "ગ્રામ પંચાયત વિસ્તાર, સોયલા, સાણંદ",
      hi: "ग्राम पंचायत क्षेत्र, सोयला, साानंद",
    },
    time: "9:00 AM - 3:00 PM",
    organizer: {
      en: "Swachhta Volunteers & Gram Panchayat",
      gu: "સ્વચ્છતા સ્વયંસેવકો અને ગ્રામ પંચायત",
      hi: "स्वच्छता स्वयंसेवक और ग्राम पंचायत",
    },
    desc: {
      en: "Waste segregation awareness drive followed by active volunteer-led cleaning and plastic collection along with local village councils.",
      gu: "કચરાના નિકાલ અંગે જાગૃતિ અભિયાન અને સ્થાનિક પંચાયત સાથે મળીને સ્વયંસેવકો દ્વારા સફાઈ અને પ્લાસ્ટિક એકત્રીકરણ.",
      hi: "कचरा पृथक्करण जागरूकता अभियान और स्थानीय पंचायत के साथ मिलकर स्वयंसेवकों द्वारा स्वच्छता और प्लास्टिक संग्रह अभियान।",
    },
    img: imgTrees,
  },
];

const PAST_CAMPAIGNS = [
  {
    id: "past-pava",
    category: "Educational Activities",
    date: "Jun 2026",
    title: {
      en: "School Entrance Festival & Kit Distribution",
      gu: "શાળા પ્રવેશોત્સવ અને શૈક્ષણિક કીટ વિતરણ-2026",
      hi: "स्कूल प्रवेशोत्सव एवं शैक्षिक किट वितरण-2026",
    },
    place: {
      en: "Pava Primary School, Sanand Taluka",
      gu: "પાવા પ્રાથમિક શાળા, સાણંદ તાલુકો",
      hi: "पावा प्राथमिक विद्यालय, सानंद तालुका",
    },
    summary: {
      en: "President Gulab Bauddh attended the School Entrance & Girls Education Festival. The trust distributed school bags and educational kits to newly enrolled students. The school staff welcomed him with books and presented a certificate of appreciation for the trust's educational support.",
      gu: "સાણંદ તાલુકાની પાવા પ્રાથમિક શાળામાં યોજાયેલા કન્યા કેળવણી મહોત્સવ અને શાળા પ્રવેશોત્સવ-2026 કાર્યક્રમમાં પ્રમુખ શ્રી ગુલાબ બૌદ્ધ ઉપસ્થિત રહ્યા હતા અને વિદ્યાર્થીઓને સ્કૂલ બેગ અને શિક્ષણ કીટનું વિતરણ કર્યું હતું. શાળા પરિવાર દ્વારા તેમનું પુસ્તક અર્પણ કરી સ્વાગત કરાયું અને સન્માનપત્ર આપી સન્માનિત કરાયા હતા.",
      hi: "सानंद तालुका के पावा प्राथमिक विद्यालय में कन्या शिक्षा और स्कूल प्रवेशोत्सव कार्यक्रम में अध्यक्ष गुलाब बौद्ध उपस्थित रहे और विद्यार्थियों को स्कूल बैग और शैक्षिक किट वितरित किए गए। स्कूल स्टाफ ने उन्हें सम्मानित किया।",
    },
    participants: 120,
    volunteers: 10,
    impact: {
      en: "Distributed School Bags & Kits",
      gu: "સ્કૂલ બેગ અને શિક્ષણ કીટ વિતરણ",
      hi: "स्कूल बैग और किट वितरित",
    },
    img: imgPavaChildren,
  },
  {
    id: "past-diwali",
    category: "Disaster Relief Activities",
    date: "Oct 2025",
    title: {
      en: "Diwali Welfare & Clothes Distribution",
      gu: "દીવાળી સ્નેહ મિલન અને વસ્ત્ર વિતરણ",
      hi: "दिवाली मिलन एवं वस्त्र वितरण",
    },
    place: {
      en: "Sanand & surrounding brick kiln settlements",
      gu: "સાણંદ અને આજુબાજુના ઈંટોના ભઠ્ઠાના પરિવારો",
      hi: "सानंद और आसपास के ईंट भट्ठा बस्तियां",
    },
    summary: {
      en: "Distributed sweets, new clothes, and primary blankets to children and widows of migratory brick-kiln laborers.",
      gu: "સ્થળાંતરિત ઈંટોના ભઠ્ઠા પર કામ કરતા મજૂર પરિવારોના બાળકો અને વિધવા મહિલાઓને મીઠાઈ, નવા વસ્ત્રો અને ધાબળાનું વિતરણ.",
      hi: "प्रवासी ईंट-भट्ठा श्रमिकों के बच्चों और विधवा महिलाओं को मिठाई, नए कपड़े और कंबल वितरित किए गए।",
    },
    participants: 350,
    volunteers: 18,
    impact: {
      en: "120+ Families Celebrated Diwali",
      gu: "૧૨૦+ પરિવારોએ દીવાળી ઉજવી",
      hi: "120+ परिवारों ने दिवाली मनाई",
    },
    img: heroChildren,
  },
  {
    id: "past-chaas",
    category: "Volunteer Programs",
    date: "Jun 2025",
    title: {
      en: "Summer Buttermilk (Chaas) Campaign",
      gu: "ઉનાળામાં છાશ વિતરણ અભિયાન",
      hi: "गर्मी में छाछ वितरण अभियान",
    },
    place: {
      en: "10+ rural transit junctions in Sanand Taluka",
      gu: "સાણંદ તાલુકાના ૧૦+ ગ્રામીણ ચાર રસ્તાઓ",
      hi: "सानंद तालुका के 10+ ग्रामीण चौराहे",
    },
    summary: {
      en: "Provided refreshing cold buttermilk daily to auto drivers, daily wagers, and pedestrians during peak heatwave.",
      gu: "ઉનાળાની કાળઝાળ ગરમીમાં રિક્ષાચાલકો, મજૂરો અને રાહદારીઓને રોજ ઠંડી છાશ પૂરી પાડવામાં આવી હતી.",
      hi: "भीषण गर्मी में ऑटो चालकों, मजदूरों और राहगीरों को रोजाना ठंडी छाछ पिलाई गई।",
    },
    participants: 12000,
    volunteers: 25,
    impact: {
      en: "Hydrated thousands of workers",
      gu: "હજારો શ્રમિકોને ગરમીથી રાહત",
      hi: "हजारों श्रमिकों को राहत मिली",
    },
    img: imgRation,
  },
  {
    id: "past-sports",
    category: "Sports Activities",
    date: "Jan 2025",
    title: {
      en: "Republic Day Sports & Cultural Day",
      gu: "પ્રજાસત્તાક દિન રમતગમત અને સાંસ્કૃતિક મહોત્સવ",
      hi: "गणतंत्र दिवस खेल एवं सांस्कृतिक महोत्सव",
    },
    place: {
      en: "Soyla Village Playgrounds",
      gu: "સોયલા ગામનું રમતગમત મેદાન",
      hi: "सोयला ग्राम खेल का मैदान",
    },
    summary: {
      en: "Organized local sports events like kabbadi, running, and drawing competitions for rural kids to encourage team spirit.",
      gu: "બાળકોમાં ખેલદિલી વિકસાવવા માટે કબડ્ડી, દોડ અને ચિત્ર સ્પર્ધાઓ જેવી સ્થાનિક રમતોનું આયોજન કરવામાં આવ્યું હતું.",
      hi: "बच्चों में खेल भावना विकसित करने के लिए कबड्डी, दौड़ और चित्रकला जैसी स्थानीय खेल प्रतियोगिताएं आयोजित की गईं।",
    },
    participants: 220,
    volunteers: 12,
    impact: {
      en: "Distributed 45 trophies & kits",
      gu: "૪૫ ટ્રોફી અને કીટ્સનું વિતરણ",
      hi: "45 ट्रॉफी और किट वितरित किए गए",
    },
    img: imgEdu,
  },
];

const GALLERY_PICTURES = [
  {
    img: imgPavaChildren,
    category: "Educational Activities",
    caption: { en: "Group Photo: School Entrance Festival", gu: "શાળા પ્રવેશોત્સવ સમૂહ તસવીર", hi: "स्कूल प्रवेशोत्सव सामूहिक चित्र" },
  },
  {
    img: imgPavaDist,
    category: "Educational Activities",
    caption: { en: "School Bag Distribution", gu: "શાળા બેગ વિતરણ", hi: "स्कूल बैग वितरण" },
  },
  {
    img: imgPavaCert,
    category: "Educational Activities",
    caption: { en: "Honoring President Gulab Bauddh", gu: "પ્રમુખ શ્રી ગુલાબ બૌદ્ધનું સન્માન", hi: "अध्यक्ष गुलाब बौद्ध का सम्मान" },
  },
  {
    img: imgPavaBook,
    category: "Educational Activities",
    caption: { en: "School Entrance Ceremony Welcome", gu: "શાળા પ્રવેશોત્સવ સ્વાગત", hi: "स्कूल प्रवेशोत्सव स्वागत" },
  },
  {
    img: imgHealth,
    category: "Medical Camps",
    caption: { en: "Eye Diagnostic Camp", gu: "આંખ નિદાન કેમ્પ", hi: "नेत्र जांच शिविर" },
  },
  {
    img: imgTrees,
    category: "Tree Plantation",
    caption: { en: "Village Green Drive", gu: "ગામ હરિયાળી અભિયાન", hi: "ग्राम हरियाली अभियान" },
  },
  {
    img: imgEdu,
    category: "Educational Activities",
    caption: { en: "School Kit Distribution", gu: "શાળા કીટ વિતરણ", hi: "स्कूल किट वितरण" },
  },
  {
    img: imgRation,
    category: "Volunteer Activities",
    caption: { en: "Relief Food Distribution", gu: "રાહત અનાજ વિતરણ", hi: "राहत खाद्यान्न वितरण" },
  },
  {
    img: heroChildren,
    category: "Community Events",
    caption: { en: "Children Meet & Sports", gu: "બાળ મિલન અને રમતો", hi: "बाल मिलन और खेल" },
  },
  {
    img: imgHealth,
    category: "Medical Camps",
    caption: {
      en: "General Health Screening",
      gu: "સામાન્ય આરોગ્ય તપાસ",
      hi: "सामान्य स्वास्थ्य जांच",
    },
  },
  {
    img: imgTrees,
    category: "Tree Plantation",
    caption: { en: "School Yard Plantation", gu: "શાળા વૃક્ષારોપણ", hi: "स्कूल वृक्षारोपण" },
  },
  {
    img: imgEdu,
    category: "Educational Activities",
    caption: {
      en: "Digital Learning Session",
      gu: "ડિજિટલ લર્નિંગ ક્લાસ",
      hi: "डिजिटल लर्निंग क्लास",
    },
  },
];

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
        bgImage={imgHealth}
        breadcrumbActive={t("nav.events")}
      />
      {/* FEATURED EVENT SECTION */}
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
                  src={imgHealth}
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
          <img src={heroChildren} alt="Support" className="w-full h-full object-cover opacity-15" />
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

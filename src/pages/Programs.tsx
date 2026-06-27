import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
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
} from "lucide-react";
import imgEdu from "@/assets/program-education.jpg";
import imgHealth from "@/assets/program-health.jpg";
import imgTrees from "@/assets/program-trees.jpg";
import imgRation from "@/assets/activity-ration.jpg";
import heroChildren from "@/assets/hero-children.jpg";
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

const PROGRAMS_DETAIL_DATA = [
  {
    id: "education",
    Icon: GraduationCap,
    color: "#4040A1",
    image: imgEdu,
    thumbnails: [imgEdu, heroChildren, imgTrees],
    title: {
      en: "Education Support",
      gu: "શિક્ષણ સહાય",
      hi: "शिक्षा सहायता",
    },
    desc: {
      en: "School kits, notebooks, scholarships, and educational support for rural and first-generation students in government schools.",
      gu: "સરકારી શાળાઓમાં ભણતા ગ્રામીણ અને ગરીબ વિદ્યાર્થીઓને શૈક્ષણિક સામગ્રી, ચોપડા અને શિષ્યવૃત્તિ સહાય.",
      hi: "सरकारी स्कूलों में पढ़ने वाले ग्रामीण और गरीब छात्रों को स्कूल किट, नोटबुक, और छात्रवृत्ति सहायता प्रदान करना।",
    },
    objectives: [
      {
        en: "Reduce school dropout rates in remote rural areas.",
        gu: "અંતરિયાળ ગ્રામ્ય વિસ્તારોમાં બાળકોનો ડ્રોપ-આઉટ રેટ ઘટાડવો.",
        hi: "सुदूर ग्रामीण क्षेत्रों में स्कूल छोड़ने वाले बच्चों की दर को कम करना।",
      },
      {
        en: "Provide financial aid and merit scholarships to first-generation learners.",
        gu: "ભણવામાં તેજસ્વી ગરીબ પરિવારોના બાળકોને આર્થિક શિષ્યવૃત્તિ આપવી.",
        hi: "मेधावी और गरीब परिवारों के बच्चों को आर्थिक छात्रवृत्ति देना।",
      },
      {
        en: "Support girls' higher education through targeted campaigns.",
        gu: "દીકરીઓના ઉચ્ચ અભ્યાસ માટે વિશેષ પ્રોત્સાહન અને સહાય પૂરી પાડવી.",
        hi: "बेटियों की उच्च शिक्षा के लिए विशेष प्रोत्साहन और सहायता प्रदान करना।",
      },
    ],
    activities: [
      {
        en: "Annual school bag, notebooks, and writing materials distribution.",
        gu: "દર વર્ષે નવું સત્ર શરૂ થાય ત્યારે સ્કૂલ બેગ અને સ્ટેશનરીનું વિતરણ.",
        hi: "हर साल नया सत्र शुरू होने पर स्कूल बैग और स्टेशनरी का वितरण करना।",
      },
      {
        en: "Sponsoring school fees and tuition costs for orphan and single-parent children.",
        gu: "નિરાધાર અને જરૂરિયાતમંદ બાળકોની ફી અને ભણતરના ખર્ચની સહાય.",
        hi: "अनाथ और जरूरतमंद बच्चों की फीस और पढ़ाई के खर्च में सहायता करना।",
      },
      {
        en: "Conducting village reading sessions and computer literacy classes.",
        gu: "ગામડાઓમાં વાંચન પ્રવૃત્તિ અને પાયાની કમ્પ્યુટર તાલીમનું આયોજન.",
        hi: "गाँवों में पठन-पाठन गतिविधियों और बुनियादी कंप्यूटर प्रशिक्षण का आयोजन।",
      },
    ],
    impactVal: {
      en: "4,500+ Students Supported",
      gu: "૪,૫૦૦+ વિદ્યાર્થીઓને સહાય",
      hi: "४,५००+ छात्रों को सहायता",
    },
    successTitle: {
      en: "Ramesh's Path to Engineering",
      gu: "રમેશની એન્જિનિયરિંગ તરફ સફર",
      hi: "रमेश की इंजीनियरिंग की ओर यात्रा",
    },
    successStory: {
      en: "Ramesh, a first-generation student from Soyla, was about to drop out due to severe financial constraints. Through Uday Foundation's merit scholarship and free study materials, he continued his studies and successfully secured admission to a reputed engineering college in Ahmedabad.",
      gu: "સોયલા ગામના રમેશ આર્થિક તંગીના કારણે અભ્યાસ છોડવાના હતા. ઉદય ફાઉન્ડેશનની શિષ્યવૃત્તિ અને ફ્રી ચોપડા વિતરણ સહાય મળતા, તેઓએ અભ્યાસ ચાલુ રાખ્યો અને આજે અમદાવાદની પ્રતિષ્ઠિત સરકારી એન્જિનિયરિંગ કોલેજમાં અભ્યાસ કરી રહ્યા છે.",
      hi: "सोयला गाँव के रमेश आर्थिक तंगी के कारण पढ़ाई छोड़ने वाले थे। उदय फाउंडेशन की छात्रवृत्ति और मुफ्त पाठ्य सामग्री की सहायता से, उन्होंने पढ़ाई जारी रखी और आज वे इंजीनियरिंग कॉलेज में पढ़ाई कर रहे हैं।",
    },
    successQuote: {
      en: '"Uday Foundation gave me the wings to pursue my dreams." — Ramesh',
      gu: '"ઉદય ફાઉન્ડેશને મને મારા સપના સાકાર કરવાની શક્તિ આપી." — રમેશ',
      hi: '"उदय फाउंडेशन ने मुझे मेरे सपनों को साकार करने की शक्ति दी।" — रमेश',
    },
  },
  {
    id: "healthcare",
    Icon: Stethoscope,
    color: "#7A9D1C",
    image: imgHealth,
    thumbnails: [imgHealth, imgRation, heroChildren],
    title: {
      en: "Healthcare Services",
      gu: "આરોગ્ય સંભાળ",
      hi: "स्वास्थ्य सेवा",
    },
    desc: {
      en: "Free medical camps, diagnostic drives, specialist consultations, medicine distribution, and hygiene awareness.",
      gu: "મફત મેડિકલ નિદાન કેમ્પ, આંખ અને દાંતની તપાસ, વિનામૂલ્યે દવાઓનું વિતરણ અને આરોગ્ય જાગૃતિ.",
      hi: "मुफ़्त चिकित्सा शिविर, आँखों और दाँतों की जाँच, मुफ़्त दवाओं का वितरण और स्वास्थ्य जागरूकता कार्यक्रम।",
    },
    objectives: [
      {
        en: "Provide primary diagnostic care directly in remote villages.",
        gu: "અંતરિયાળ ગામડાઓમાં પ્રાથમિક તબીબી તપાસ ઘર આંગણે ઉપલબ્ધ કરાવી.",
        hi: "सुदूर गांवों में प्राथमिक चिकित्सा जांच उनके घर तक पहुंचाना।",
      },
      {
        en: "Offer free basic medicines and facilitate secondary care referrals.",
        gu: "દર્દીઓને મફત દવાઓ આપવી અને જરૂર જણાયે સર્જરી માટે હોસ્પિટલ રેફર કરવા.",
        hi: "रोगियों को मुफ्त दवाएं देना और जरूरत पड़ने पर सर्जरी के लिए अस्पताल रेफर करना।",
      },
      {
        en: "Promote health, sanitation, and clean water usage among women.",
        gu: "ગ્રામીણ બહેનોમાં માસિક ધર્મ, સ્વચ્છતા અને બાળ પોષણ અંગે જાગૃતિ લાવવી.",
        hi: "ग्रामीण महिलाओं में मासिक धर्म, स्वच्छता और बाल पोषण के बारे में जागरूकता लाना।",
      },
    ],
    activities: [
      {
        en: "Monthly multi-specialty health check-up camps in Sanand taluka.",
        gu: "સાણંદ તાલુકાના જુદા જુદા ગામોમાં દર મહિને મલ્ટી-સ્પેશિયાલિટી હેલ્થ કેમ્પ.",
        hi: "सानंद तालुका के विभिन्न गाँवों में हर महीने बहु-विशेषज्ञ स्वास्थ्य शिविर।",
      },
      {
        en: "Free eye check-up drives with spectacles distribution and cataract surgery sponsorship.",
        gu: "આંખ નિદાન કેમ્પ, મફત ચશ્મા વિતરણ અને મોતિયાના મફત ઓપરેશનની વ્યવસ્થા.",
        hi: "नेत्र जांच शिविर, मुफ्त चश्मा वितरण और मोतियाबिंद के मुफ्त ऑपरेशन की व्यवस्था।",
      },
      {
        en: "Hygiene kit distribution and seminars in schools.",
        gu: "શાળાઓમાં સ્વચ્છતા કીટનું વિતરણ અને બાળકોને આરોગ્યની તાલીમ.",
        hi: "स्कूलों में स्वच्छता किट का वितरण और बच्चों को स्वास्थ्य का प्रशिक्षण।",
      },
    ],
    impactVal: {
      en: "38+ Health Camps Conducted",
      gu: "૩૮+ મેડિકલ કેમ્પનું આયોજન",
      hi: "३८+ चिकित्सा शिविरों का आयोजन",
    },
    successTitle: {
      en: "Laxmiben's Restored Vision",
      gu: "લક્ષ્મીબેનને દૃષ્ટિ પાછી મળી",
      hi: "लक्ष्मीबेन को दृष्टि वापस मिली",
    },
    successStory: {
      en: "Laxmiben, a 65-year-old widow, had lost her sight to cataracts and could not afford private surgery. During our medical camp in Soyla, she was screened, transported, and operated on free of charge. She now walks independently.",
      gu: "૬૫ વર્ષીય વિધવા લક્ષ્મીબેનને મોતિયાના કારણે આંખે દેખાતું બંધ થયું હતું અને પ્રાઈવેટ ઓપરેશન કરાવવા પૈસા ન હતા. સોયલાના તબીબી કેમ્પમાં તપાસ બાદ સંસ્થાએ તેમનું મફત ઓપરેશન કરાવી આપ્યું, અને આજે તેઓ જોઈ શકે છે.",
      hi: "६५ वर्षीय विधवा लक्ष्मीबेन को मोतियाबिंद के कारण दिखाई देना बंद हो गया था। सोयला के स्वास्थ्य शिविर में जांच के बाद संस्था ने उनका मुफ्त ऑपरेशन कराया, और आज वे देख सकती हैं।",
    },
    successQuote: {
      en: '"I can see the smiles of my family again. I am so grateful." — Laxmiben',
      gu: '"હું મારા પરિવારના ચહેરા ફરી ખુશીથી જોઈ શકું છું. સંસ્થાનો ખૂબ આભાર." — લક્ષ્મીબેન',
      hi: '"मैं अपने परिवार के चेहरे फिर से देख सकती हूँ। संस्था का बहुत आभार।" — लक्ष्मीबेन',
    },
  },
  {
    id: "child",
    Icon: Baby,
    color: "#E29A5C",
    image: heroChildren,
    thumbnails: [heroChildren, imgEdu, imgTrees],
    title: {
      en: "Child Welfare",
      gu: "બાળ કલ્યાણ",
      hi: "बाल कल्याण",
    },
    desc: {
      en: "Nutritional meal distribution, health screenings, child protection support, and educational joy camps.",
      gu: "કુપોષણ નિવારણ માટે પૌષ્ટિક આહાર, બાળ સ્વાસ્થ્ય તપાસ, રમત-ગમત પ્રવૃત્તિઓ અને કલ્યાણ.",
      hi: "कुपोषण दूर करने के लिए पौष्टिक भोजन, बाल स्वास्थ्य जांच और खेल-कूद गतिविधियाँ।",
    },
    objectives: [
      {
        en: "Eradicate malnutrition among rural and slum children.",
        gu: "ગરીબ અને આદિવાસી વિસ્તારોના બાળકોમાં કુપોષણનું પ્રમાણ ઘટાડવું.",
        hi: "गरीब और स्लम क्षेत्रों के बच्चों में कुपोषण को दूर करना।",
      },
      {
        en: "Provide a safe, happy environment for overall development.",
        gu: "બાળકોના સર્વાંગી વિકાસ માટે આનંદદાયક અને સુરક્ષિત વાતાવરણ પૂરું પાડવું.",
        hi: "बच्चों के सर्वांगीण विकास के लिए आनंददायक वातावरण प्रदान करना।",
      },
      {
        en: "Ensure access to early education and primary pediatric care.",
        gu: "બાળકો માટે પૂર્વ-શાળા શિક્ષણ અને સમયસર બાળ-રોગ નિષ્ણાતોની સારવાર.",
        hi: "बच्चों के लिए पूर्व-विद्यालय शिक्षा और समय पर बाल रोग विशेषज्ञों का इलाज।",
      },
    ],
    activities: [
      {
        en: "Weekly nutritious food and milk distribution campaigns in rural slums.",
        gu: "દર અઠવાડિયે ઝૂંપડપટ્ટીના બાળકોને પૌષ્ટિક દૂધ, ફળ અને ખોરાકનું વિતરણ.",
        hi: "हर हफ्ते झुग्गी-झोपड़ियों के बच्चों को पौष्टिक भोजन, दूध और फल बांटना।",
      },
      {
        en: "Pediatric diagnostic check-ups and free vitamin supplements.",
        gu: "બાળકો માટે વિટામિન વિતરણ અને બાળરોગ નિષ્ણાતોના કેમ્પ.",
        hi: "बच्चों के लिए विटामिन वितरण और बाल रोग विशेषज्ञों के विशेष शिविर।",
      },
      {
        en: "Organizing 'Joy Camps', drawing competitions, and active sports days.",
        gu: "શિક્ષણ સાથે ગમ્મત માટે ડ્રોઈંગ હરીફાઈ, રમતગમત અને શિબિરોનું આયોજન.",
        hi: "शिक्षा के साथ मनोरंजन के लिए खेल-कूद और चित्रकला प्रतियोगिताओं का आयोजन।",
      },
    ],
    impactVal: {
      en: "1,200+ Children Supported",
      gu: "૧,૨૦૦+ બાળકોને સહાય",
      hi: "१,२०0+ बच्चों को सहायता",
    },
    successTitle: {
      en: "Overcoming Malnutrition in Soyla",
      gu: "સોયલાના આરાવની કુપોષણ સામે જીત",
      hi: "सोयला के आरव की कुपोषण से मुक्ति",
    },
    successStory: {
      en: "Four-year-old Aarav was diagnosed with severe malnutrition. Uday Foundation enrolled him in our weekly nutrition and care drive. Within four months of nutrient supplements, his health recovered, and he is now actively learning.",
      gu: "૪ વર્ષનો આરાવ ગંભીર કુપોષણથી પીડાતો હતો. ઉદય ફાઉન્ડેશનની સાપ્તાહિક પોષણ ઝુંબેશ અને તબીબી માર્ગદર્શન દ્વારા, ચાર મહિનામાં તેનું સ્વાસ્થ્ય સુધરી ગયું અને તે રમતો થયો.",
      hi: "४ साल का आरव गंभीर कुपोषण से पीड़ित था। उदय फाउंडेशन के साप्ताहिक पोषण अभियान और चिकित्सकीय देखरेख से चार महीने में उसका स्वास्थ्य सुधर गया और वह सक्रिय हुआ।",
    },
    successQuote: {
      en: '"My child is active and smiling again, thank you Uday Trust." — Aarav\'s Mother',
      gu: '"મારું બાળક હવે સ્વસ્થ છે અને રમે છે, ઉદય ટ્રસ્ટનો ખૂબ આભાર." — આરાવની માતા',
      hi: '"मेरा बच्चा अब पूरी तरह स्वस्थ है और खेलता है, उदय ट्रस्ट का बहुत आभार।" — आरव की मां',
    },
  },
  {
    id: "rural",
    Icon: HomeIcon,
    color: "#E2C35C",
    image: imgRation,
    thumbnails: [imgRation, heroChildren, imgHealth],
    title: {
      en: "Rural Development",
      gu: "ગ્રામીણ વિકાસ",
      hi: "ग्रामीण विकास",
    },
    desc: {
      en: "Clean drinking water filtration systems, sanitation facilities, community infrastructure, and government scheme awareness.",
      gu: "પીવાના પાણીના પ્યુરિફાયર મશીનો, શૌચાલય સુવિધા, ગ્રામીણ ઈન્ફ્રાસ્ટ્રક્ચર અને સરકારી યોજનાઓની માહિતી.",
      hi: "पीने के पानी की शोधन प्रणाली, स्वच्छता सुविधाएं, ग्रामीण बुनियादी ढांचा और सरकारी योजनाओं की जानकारी।",
    },
    objectives: [
      {
        en: "Establish clean drinking water systems in community areas.",
        gu: "જાહેર સ્થળોએ પીવા માટે શુદ્ધ અને ઠંડા પાણીની વ્યવસ્થા ઊભી કરવી.",
        hi: "सार्वजनिक स्थानों पर पीने के लिए शुद्ध और ठंडे पानी की व्यवस्था करना।",
      },
      {
        en: "Construct clean, safe sanitation blocks in villages.",
        gu: "ગામડાઓમાં જાહેર શૌચાલયો અને શાળા સ્વચ્છતા બ્લોક્સનું નિર્માણ.",
        hi: "गाँवों में सार्वजनिक शौचालयों और स्वच्छता ब्लॉकों का निर्माण।",
      },
      {
        en: "Connect rural families with active government welfare benefits.",
        gu: "ગામડાના પરિવારોને સરકારી સામાજિક કલ્યાણ અને પેન્શન યોજનાઓ સાથે જોડવા.",
        hi: "ग्रामीण परिवारों को सरकारी सामाजिक कल्याण और पेंशन योजनाओं से जोड़ना।",
      },
    ],
    activities: [
      {
        en: "Installing clean drinking water units in government schools and public centers.",
        gu: "સરકારી શાળાઓ અને જાહેર કેન્દ્રોમાં વોટર પ્યુરિફાયર અને કૂલર લગાવવા.",
        hi: "सरकारी स्कूलों और सार्वजनिक केंद्रों में वाटर प्यूरीफायर और कूलर लगाना।",
      },
      {
        en: "Upgrading community spaces and village libraries.",
        gu: "ગ્રામ પંચાયત ચોરા અને સ્થાનિક વાંચનાલયના ઓરડાઓનું સમારકામ.",
        hi: "ग्राम पंचायतों और स्थानीय पुस्तकालयों के कमरों की मरम्मत करना।",
      },
      {
        en: "Holding citizen guidance camps for PM Kisan, widow pension, and insurance registration.",
        gu: "વિધવા સહાય, પ્રધાનમંત્રી કિસાન સન્માન નિધિ અને વીમા યોજનાના ફ્રી ફોર્મ કેમ્પ.",
        hi: "विधवा सहायता, किसान सम्मान निधि और बीमा योजनाओं के पंजीकरण शिविर।",
      },
    ],
    impactVal: {
      en: "120+ Villages Touched",
      gu: "૧૨૦+ ગામોમાં વિકાસ કાર્યો",
      hi: "१२०+ गाँवों में विकास कार्य",
    },
    successTitle: {
      en: "Purified Water for Ambedkar Nagar",
      gu: "આંબેડકર નગરમાં શુદ્ધ પાણીની સુવિધા",
      hi: "अंबेडकर नगर में शुद्ध पानी की सुविधा",
    },
    successStory: {
      en: "Ambedkar Nagar, a locality in Soyla village, had poor groundwater quality, causing bone and dental issues. Uday Foundation installed a community water purification system, providing clean, fluoride-free water to 300 families.",
      gu: "સાણંદના સોયલા ગામના આંબેડકર નગરમાં પાણીમાં ફ્લોરાઈડનું પ્રમાણ વધુ હતું જેથી રોગો થતા હતા. ઉદય ફાઉન્ડેશન દ્વારા મોટું વોટર પ્યુરિફાયર મશીન મુકતા આજે ૩૦૦ પરિવારોને શુદ્ધ પાણી મળે છે.",
      hi: "सानंद के सोयला गाँव के आंबेडकर नगर में पानी में फ्लोराइड की मात्रा अधिक थी। उदय फाउंडेशन द्वारा बड़ी वाटर प्यूरीफायर मशीन लगाने से आज ३०० परिवारों को शुद्ध पानी मिल रहा है।",
    },
    successQuote: {
      en: '"Fluoride-free clean water has saved our children\'s health." — Hasmukhbhai',
      gu: '"શુદ્ધ પાણી મળતા જ અમારા બાળકોના સ્વાસ્થ્યમાં ઘણો સુધારો થયો છે." — હસમુખભાઈ',
      hi: '"शुद्ध पानी मिलने से हमारे बच्चों के स्वास्थ्य में काफी सुधार हुआ है।" — हसमुखभाई',
    },
  },
  {
    id: "environment",
    Icon: Sprout,
    color: "#7A9D1C",
    image: imgTrees,
    thumbnails: [imgTrees, imgEdu, imgHealth],
    title: {
      en: "Environmental Protection",
      gu: "પર્યાવરણ સુરક્ષા",
      hi: "पर्यावरण संरक्षण",
    },
    desc: {
      en: "Tree plantation drives (urban and rural forestry), distributing saplings, waste clean-ups, and sustainable water harvesting.",
      gu: "સામૂહિક વૃક્ષારોપણ, ખેડૂતોને કલમી છોડ વિતરણ, પર્યાવરણ જાગૃતિ અને જળ સંરક્ષણ અભિયાન.",
      hi: "सामूहिक वृक्षारोपण, किसानों को पौधों का वितरण, पर्यावरण जागरूकता और जल संरक्षण अभियान।",
    },
    objectives: [
      {
        en: "Increase rural green cover through community forestation.",
        gu: "ગામડાઓની પડતર જમીનો અને રસ્તાની બંને બાજુ વૃક્ષો વાવી હરિયાળી વધારવી.",
        hi: "गाँवों की बंजर भूमि और सड़कों के दोनों ओर पेड़ लगाकर हरियाली बढ़ाना।",
      },
      {
        en: "Educate school students on plastic waste and waste separation.",
        gu: "શાળાના બાળકોમાં પ્લાસ્ટિક મુક્તિ અને કચરાના યોગ્ય નિકાલની સમજ આપવી.",
        hi: "स्कूली बच्चों में प्लास्टिक मुक्ति और कचरे के सही निपटान की समझ पैदा करना।",
      },
      {
        en: "Distribute fruit-bearing saplings to marginal farmers to build income.",
        gu: "નાના ખેડૂતોને ફળાઉ કલમી રોપાઓ આપી તેઓની આવક વધારવામાં મદદ કરવી.",
        hi: "छोटे किसानों को फलदार पौधे देकर उनकी आय बढ़ाने में मदद करना।",
      },
    ],
    activities: [
      {
        en: "Planting native trees in schools, public commons, and temple surroundings.",
        gu: "સરકારી શાળાઓ, ગૌચર અને મંદિરોના પરિસરમાં વડ, પીપળો અને લીમડા જેવા ઝાડ વાવવા.",
        hi: "सरकारी स्कूलों, गौचर और मंदिरों के परिसरों में बरगद, पीपल और नीम जैसे पेड़ लगाना।",
      },
      {
        en: "Annual distribution of saplings (lemon, guava, mango) to rural families.",
        gu: "ચોમાસામાં ખેડૂતો અને પરિવારોને મફત લીંબુ, જામફળ અને આંબાના છોડનું વિતરણ.",
        hi: "मानसून में किसानों और परिवारों को नींबू, अमरूद और आम के पौधे बांटना।",
      },
      {
        en: "Organizing plastic cleaning drives and environmental rallies in Sanand.",
        gu: "સાણંદમાં પ્લાસ્ટિક મુક્તિ રેલી અને કચરો સાફ કરવા માટે સક્રિય શ્રમદાન.",
        hi: "सानंद में प्लास्टिक मुक्ति रैली और कचरा साफ करने के लिए सक्रिय श्रमदान।",
      },
    ],
    impactVal: {
      en: "25,000+ Saplings Planted",
      gu: "૨૫,૦૦૦+ વૃક્ષારોપણ પૂર્ણ",
      hi: "२५,०००+ वृक्षारोपण संपन्न",
    },
    successTitle: {
      en: "Greening of Soyla Government School",
      gu: "સોયલા પ્રાથમિક શાળાનું ગ્રીન કેમ્પસ",
      hi: "सोयला प्राथमिक विद्यालय का ग्रीन परिसर",
    },
    successStory: {
      en: "The primary school in Soyla village had a dry ground and zero shade. Volunteers and school children planted 500 shade-giving trees. Today, the campus is cool, green, and acts as a living environment classroom for the students.",
      gu: "સોયલા પ્રાથમિક શાળાનું મેદાન ધૂળિયું હતું અને છાંયડો ન હતો. સંસ્થા દ્વારા શાળા પરિસરમાં ૫૦૦ લીમડા અને વડ વાવ્યા. આજે આ મોટો બગીચો બાળકોને ગરમીથી બચાવે છે.",
      hi: "सोयला प्राथमिक विद्यालय का मैदान सूखा था। संस्था द्वारा स्कूल परिसर में ५०० नीम और बरगद के पेड़ लगाए गए। आज यह बगीचा बच्चों को गर्मी से बचाता है।",
    },
    successQuote: {
      en: '"Our school classes feel cooler now under the shade of these trees." — Student',
      gu: '"વૃક્ષોના છાંયડાને લીધે હવે અમારી શાળાના ઓરડામાં ઠંડક રહે છે." — વિદ્યાર્થી',
      hi: '"पेड़ों की छाया के कारण अब हमारे स्कूल के कमरों में ठंडक रहती है।" — छात्र',
    },
  },
  {
    id: "disaster",
    Icon: ShieldCheck,
    color: "#E25C5C",
    image: imgRation,
    thumbnails: [imgRation, imgHealth, heroChildren],
    title: {
      en: "Disaster Relief",
      gu: "આફત રાહત",
      hi: "आपदा राहत",
    },
    desc: {
      en: "Emergency humanitarian assistance, dry ration kits, shelter materials, and medical support in floods, cyclones, and emergencies.",
      gu: "પૂર, વાવાઝોડું કે રોગચાળા જેવી કટોકટીમાં તાત્કાલિક અનાજ કીટ, રહેવાની છત્રછાયા અને દવાની સહાય.",
      hi: "बाढ़, चक्रवात या महामारी जैसी आपात स्थिति में तुरंत राशन किट, तिरपाल और दवा की सहायता।",
    },
    objectives: [
      {
        en: "Provide quick food and drinking water in disaster zones within 24 hours.",
        gu: "આફતગ્રસ્ત વિસ્તારોમાં ૨૪ કલાકની અંદર પૂરતો ખોરાક અને પાણી પહોંચાડવું.",
        hi: "आपदा प्रभावित क्षेत्रों में २४ घंटे के भीतर भोजन और पानी पहुंचाना।",
      },
      {
        en: "Deliver tarpaulins and blankets to families who lost their shelter.",
        gu: "જેઓના ઘર તૂટી ગયા હોય તેવા પરિવારોને તાડપત્રી અને ઓઢવા માટે બ્લેન્કેટ આપવા.",
        hi: "जिनके घर नष्ट हो गए हैं, उन्हें तिरपाल और ओढ़ने के लिए कंबल प्रदान करना।",
      },
      {
        en: "Organize post-disaster medical camps to prevent health epidemics.",
        gu: "રાહત બાદ રોગચાળો ફેલાતો અટકાવવા માટે તબીબી સારવાર કેમ્પનું આયોજન.",
        hi: "राहत के बाद महामारी फैलने से रोकने के लिए चिकित्सा शिविर आयोजित करना।",
      },
    ],
    activities: [
      {
        en: "Distributing dry ration kits (rice, flour, oil, pulses) in flooded villages.",
        gu: "પૂરગ્રસ્ત વિસ્તારોમાં માસિક ડ્રાય રાશન કીટનું (ઘઉં, તેલ, દાળ) વિતરણ.",
        hi: "बाढ़ प्रभावित क्षेत्रों में सूखा राशन (गेहूं, तेल, दाल) वितरित करना।",
      },
      {
        en: "Emergency distribution of blankets, tarpaulins, and clothing.",
        gu: "કટોકટીમાં બચાવ કામગીરી હેઠળ ઓઢવાના ધાબળા અને કપડાનું વિતરણ.",
        hi: "आपातकालीन बचाव अभियान के तहत कंबल और कपड़ों का वितरण।",
      },
      {
        en: "Free medical help desk and disinfection drives in waterlogged sectors.",
        gu: "પાણી ભરાયેલા ગામોમાં કીટાણુનાશક દવાનો છંટકાવ અને મફત તબીબી સારવાર.",
        hi: "जलभराव वाले गांवों में कीटाणुनाशक दावों का छिड़काव और चिकित्सा।",
      },
    ],
    impactVal: {
      en: "15+ Disaster Missions Completed",
      gu: "૧૫+ રાહત અભિયાનો પૂર્ણ",
      hi: "१५+ राहत अभियान पूरे किए",
    },
    successTitle: {
      en: "Rebuilding After Cyclone Tauktae",
      gu: "તૌકતે વાવાઝોડા બાદ પુનઃવસન સહાય",
      hi: "तौकते चक्रवात के बाद पुनर्वास सहायता",
    },
    successStory: {
      en: "When Cyclone Tauktae severely damaged rural roofs and farms in 2021, Uday Foundation reached remote sectors in Gujarat. We distributed emergency meals, tarpaulins for broken roofs, and health kits to 500 affected families.",
      gu: "૨૦૨૧માં તૌકતે વાવાઝોડામાં ગરીબોના છાપરા ઉડી ગયા ત્યારે ઉદય ફાઉન્ડેશનની ટીમે પંચાયતો સાથે મળી ૫૦૦ પરિવારોને ખાવાનું અને છાપરા ઢાંકવા તાડપત્રી આપી હતી.",
      hi: "२०२१ में तौकते चक्रवात में गरीबों के घर नष्ट होने पर उदय फाउंडेशन की टीम ने ५०० परिवारों को भोजन और तिरपाल वितरित किए थे।",
    },
    successQuote: {
      en: '"When our house collapsed, their timely help protected us from the rain." — Recipient Family',
      gu: '"જ્યારે અમારું ઘર પડી ગયું ત્યારે તેઓની સમયસર મદદથી અમે ચોમાસામાં બચી શક્યા." — અસરગ્રસ્ત પરિવાર',
      hi: '"जब हमारा घर गिर गया, तब उनकी समय पर मिली मदद ने हमें बारिश से बचाया।" — प्रभावित परिवार',
    },
  },
  {
    id: "humanitarian",
    Icon: Users,
    color: "#4040A1",
    image: imgRation,
    thumbnails: [imgRation, heroChildren, imgHealth],
    title: {
      en: "Humanitarian Aid",
      gu: "માનવતાવાદી સહાય",
      hi: "मानवीय सहायता",
    },
    desc: {
      en: "Monthly grocery support for widows, winter blanket drives for homeless, and daily buttermilk distribution in hot summers.",
      gu: "નિરાધાર વિધવા બહેનોને માસિક રાશન સામગ્રી, શિયાળામાં ગરીબોને ધાબળા વિતરણ અને ઉનાળામાં છાસ વિતરણ સેવા.",
      hi: "निराश्रित विधवाओं को मासिक राशन, सर्दियों में गरीबों को कंबल वितरण और गर्मियों में छाछ वितरण सेवा।",
    },
    objectives: [
      {
        en: "Provide regular food security to destitute widows and elderly villagers.",
        gu: "નિરાધાર વૃદ્ધો અને વિધવા બહેનોને નિયમિત અનાજની કીટ આપી સુરક્ષા પૂરી પાડવી.",
        hi: "निराश्रित वृद्धों और विधवाओं को नियमित राशन किट देकर खाद्य सुरक्षा प्रदान करना।",
      },
      {
        en: "Offer thermal protection to street-dwellers during severe winters.",
        gu: "કાળઝાળ ઠંડીમાં ફૂટપાથ પર રહેતા ગરીબોને ગરમ ધાબળા આપી બચાવવા.",
        hi: "कड़ाके की ठंड में फुटपाथ पर रहने वाले गरीबों को कंबल बांटकर बचाना।",
      },
      {
        en: "Quench thirst in peak summer for daily wage workers on highways.",
        gu: "ઉનાળાના ધોમધખતા તાપમાં રસ્તે ચાલતા મજૂરો માટે ઠંડી છાસની સેવા ઊભી કરવી.",
        hi: "गर्मियों में धूप में काम करने वाले मजदूरों के लिए ठंडी छाछ की व्यवस्था करना।",
      },
    ],
    activities: [
      {
        en: "Monthly dry ration kit distribution to registered single-woman households.",
        gu: "નોંધાયેલી જરૂરિયાતમંદ વિધવા બહેનોને દર મહિને ઘર બેઠા રાશન કીટ પહોંચાડવી.",
        hi: "पंजीकृत जरूरतमंद विधवाओं को हर महीने उनके घर जाकर राशन किट देना।",
      },
      {
        en: "Annual winter blanket distribution drives in Sanand and Ahmedabad outskirts.",
        gu: "દર વર્ષે શિયાળામાં સાણંદ અને આજુબાજુના ગરીબ પરિવારોને ધાબળા વિતરણ.",
        hi: "हर साल सर्दियों में सानंद और आसपास के गरीब परिवारों को कंबल वितरण।",
      },
      {
        en: "Daily 'Summer Chaas Campaign' serving fresh buttermilk to commuters and laborers.",
        gu: "ઉનાળામાં દરરોજ રસ્તે જતા શ્રમિકો અને મુસાફરોને ઠંડી છાસ પીવડાવવી.",
        hi: "गर्मियों में हर दिन राहगीरों और मजदूरों को ठंडी छाछ पिलाना।",
      },
    ],
    impactVal: {
      en: "12,000+ Grocery Kits Distributed",
      gu: "૧૨,૦૦૦+ પરિવારોને રાશન કીટ વિતરણ",
      hi: "१२,०००+ परिवारों को राशन किट वितरण",
    },
    successTitle: {
      en: "Old Age Dignity for Rambhaben",
      gu: "રાંભીબેનને વૃદ્ધાવસ્થામાં ભોજનની ચિંતા ટળી",
      hi: "रंभाबेन को बुढ़ापे में भोजन की चिंता से मुक्ति",
    },
    successStory: {
      en: "Rambhaben, a 70-year-old widow without family support, frequently went hungry. Uday Foundation enrolled her in our monthly grocery aid. She now receives flour, rice, oil, and lentils at her door, ensuring two hot meals a day.",
      gu: "૭૦ વર્ષીય નિરાધાર વિધવા રાંભીબેનને જમવા માટે બીજા પર નિર્ભર રહેવું પડતું હતું. ઉદય ફાઉન્ડેશનની માસિક રાશન યોજનાથી આજે તેમને ઘરે બેઠા અનાજ મળી જાય છે અને તેઓ ભૂખ્યા સુતા નથી.",
      hi: "७० वर्षीय निराश्रित विधवा रंभाबेन को भोजन के लिए दूसरों पर निर्भर रहना पड़ता था। उदय फाउंडेशन की मासिक राशन योजना से आज उन्हें घर बैठे अनाज मिल जाता है।",
    },
    successQuote: {
      en: '"Uday Trust brings food to my home like my own children would have." — Rambhaben',
      gu: '"ઉદય ટ્રસ્ટ મારા સંતાનોની જેમ જ દર મહિને અનાજ મારા ઘેર પહોંચાડે છે." — રાંભીબેન',
      hi: '"उदय ट्रस्ट मेरे बच्चों की तरह हर महीने मेरे घर राशन पहुंचाता है।" — रंभाबेन',
    },
  },
];

export function Programs() {
  const { language, t } = useLanguage();
  const tLocal = TRANSLATIONS_LOCAL[language as "en" | "gu" | "hi"] || TRANSLATIONS_LOCAL["en"];

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
            {PROGRAMS_DETAIL_DATA.map((prog) => {
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

                  <p className="text-slate-600 text-sm leading-relaxed mb-5 flex-grow line-clamp-3">
                    {desc}
                  </p>

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
      {PROGRAMS_DETAIL_DATA.map((prog, idx) => {
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
                  {prog.thumbnails.map((thumb, tIdx) => (
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

                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 font-gujarati">
                  {desc}
                </p>

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
                      {prog.objectives.map((obj, oIdx) => (
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
                      {prog.activities.map((act, aIdx) => (
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

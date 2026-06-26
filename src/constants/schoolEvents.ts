import pavaCertificate from "@/assets/pava-certificate.jpg";
import pavaDistributionGroup from "@/assets/pava-distribution-group.jpg";
import pavaAward from "@/assets/pava-award.jpg";
import pavaEnvelope from "@/assets/pava-envelope.jpg";
import pavaDistributionTable from "@/assets/pava-distribution-table.jpg";

export interface PastEventItem {
  id: string;
  category: string;
  date: string;
  title: { en: string; gu: string; hi: string };
  place: { en: string; gu: string; hi: string };
  summary: { en: string; gu: string; hi: string };
  participants: number;
  volunteers: number;
  impact: { en: string; gu: string; hi: string };
  img: string;
}

export interface GalleryPicture {
  img: string;
  category: string;
  caption: { en: string; gu: string; hi: string };
}

export interface SimpleGalleryItem {
  img: string;
  cat: string;
  h: "tall" | "short";
}

// Shared school bag distribution metadata
export const SCHOOL_BAG_EVENTS: PastEventItem[] = [
  {
    id: "pava-school-distribution-2026",
    category: "Educational Activities",
    date: "Jun 2026",
    title: {
      en: "School Entrance (Praveshotsav) & Bag Distribution 2026",
      gu: "શાળા પ્રવેશોત્સવ અને સ્કૂલ બેગ વિતરણ કાર્યક્રમ-૨૦૨૬",
      hi: "स्कूल प्रवेशोत्सव एवं बैग वितरण कार्यक्रम-2026",
    },
    place: {
      en: "Pava Primary School, Sanand Taluka",
      gu: "પાવા પ્રાથમિક શાળા, સાણંદ તાલુકો",
      hi: "पावा प्राथमिक विद्यालय, सानंद तालुका",
    },
    summary: {
      en: "On June 23, 2026, President Sri Gulab Bauddh of Uday Foundation Trust, Sanand, attended the Kanya Kelavani Mahotsav and Shala Praveshotsav-2026 program at Pava Primary School in Sanand Taluka. On this occasion, school bags and educational kits were distributed by the organization to the newly admitted students. The school family welcomed Sri Gulab Bauddh by presenting a book and honored him with a certificate of appreciation for his contribution to the field of education. Uday Foundation Trust expressed gratitude to the school family. Wishing a bright future to all the newly admitted children, the organization expressed its commitment to continue serving in the future for the propagation of education and the overall development of students.",
      gu: "તા. 23/06/2026ના રોજ સાણંદ તાલુકાની પાવા પ્રાથમિક શાળામાં યોજાયેલા કન્યા કેળવણી મહોત્સવ અને શાળા પ્રવેશોત્સવ-2026 કાર્યક્રમમાં ઉદય ફાઉન્ડેશન ટ્રસ્ટ, સાણંદના પ્રમુખ શ્રી ગુલાબ બૌદ્ધ ઉપસ્થિત રહ્યા હતા. આ પ્રસંગે નવા પ્રવેશ મેળવનાર વિદ્યાર્થીઓને સંસ્થા દ્વારા સ્કૂલ બેગ અને શિક્ષણ કીટનું વિતરણ કરવામાં આવ્યું હતું. શાળા પરિવાર દ્વારા શ્રી ગુલાબ બૌદ્ધનું પુસ્તક અર્પણ કરીને સ્વાગત કરવામાં આવ્યું તેમજ શિક્ષણક્ષેત્રે આપેલા સહયોગ બદલ સન્માનપત્ર આપી સન્માનિત કરવામાં આવ્યા હતા. ઉદય ફાઉન્ડેશન ટ્રસ્ટ તરફથી શાળા પરિવારનો આભાર વ્યક્ત કરવામાં આવ્યો હતો. પ્રવેશ મેળવનાર તમામ બાળકોને ઉજ્જવળ ભવિષ્ય માટે હાર્દિક શુભેચ્છાઓ પાઠવતા સંસ્થાએ શિક્ષણના પ્રચાર-પ્રસાર અને વિદ્યાર્થીઓના સર્વાંગી વિકાસ માટે ભવિષ્યમાં પણ સતત સેવા આપવાની પ્રતિબદ્ધતા વ્યક્ત કરી હતી.",
      hi: "23/06/2026 को सानंद तालुका के पावा प्राथमिक विद्यालय में आयोजित कन्या केलावनी महोत्सव और स्कूल प्रवेशोत्सव-2026 कार्यक्रम में उदय फाउंडेशन ट्रस्ट, सानंद के अध्यक्ष श्री गुलाब बौद्ध उपस्थित थे। इस अवसर पर संस्था द्वारा नव प्रवेशित विद्यार्थियों को स्कूल बैग एवं शैक्षणिक किट का वितरण किया गया। विद्यालय परिवार द्वारा श्री गुलाब बौद्ध का पुस्तक भेंट कर स्वागत किया गया तथा शिक्षा के क्षेत्र में उनके सहयोग के लिए प्रशस्ति पत्र देकर सम्मानित किया गया। उदय फाउंडेशन ट्रस्ट ने विद्यालय परिवार के प्रति आभार व्यक्त किया। नव प्रवेशित सभी बच्चों के उज्ज्वल भविष्य की कामना करते हुए संस्था ने शिक्षा के प्रचार-प्रसार तथा विद्यार्थियों के सर्वांगीण विकास के लिए भविष्य में भी निरंतर सेवा देने की प्रतिबद्धता व्यक्त की।",
    },
    participants: 120,
    volunteers: 10,
    impact: {
      en: "Distributed School Bags & Kits",
      gu: "સ્કૂલ બેગ અને શિક્ષણ કીટ વિતરણ",
      hi: "स्कूल बैग और किट वितरित",
    },
    img: pavaDistributionGroup,
  }
];

export const SCHOOL_BAG_GALLERY: GalleryPicture[] = [
  {
    img: pavaDistributionGroup,
    category: "Educational Activities",
    caption: {
      en: "School Bags & Kits Distribution at Pava School",
      gu: "પાવા પ્રાથમિક શાળામાં સ્કૂલ બેગ અને શિક્ષણ કીટ વિતરણ",
      hi: "पावा स्कूल में स्कूल बैग और शिक्षा किट वितरण",
    },
  },
  {
    img: pavaCertificate,
    category: "Educational Activities",
    caption: {
      en: "Certificate of Appreciation for Support in Education",
      gu: "શિક્ષણમાં સહયોગ આપવા બદલ સન્માનપત્ર",
      hi: "शिक्षा में सहयोग देने के लिए प्रशस्ति पत्र",
    },
  },
  {
    img: pavaAward,
    category: "Educational Activities",
    caption: {
      en: "President Gulab Bauddh Honored by School Family",
      gu: "શાળા પરિવાર દ્વારા પ્રમુખ શ્રી ગુલાબ બૌદ્ધનું સન્માન",
      hi: "स्कूल परिवार द्वारा अध्यक्ष श्री गुलाब बौद्ध का सम्मान",
    },
  },
  {
    img: pavaEnvelope,
    category: "Educational Activities",
    caption: {
      en: "Welcome of President Sri Gulab Bauddh with Book",
      gu: "પ્રમુખ શ્રી ગુલાબ બૌદ્ધનું પુસ્તક અર્પણ કરીને સ્વાગત",
      hi: "अध्यक्ष श्री गुलाब बौद्ध का पुस्तक भेंट कर स्वागत",
    },
  },
  {
    img: pavaDistributionTable,
    category: "Educational Activities",
    caption: {
      en: "Trustees Distributing Smart Education Kits",
      gu: "વિદ્યાર્થીઓને સ્માર્ટ શિક્ષણ કીટોનું વિતરણ કરતા ટ્રસ્ટીશ્રીઓ",
      hi: "छात्रों को स्मार्ट शिक्षा किट वितरित करते ट्रस्टीगण",
    },
  },
];

export const SCHOOL_BAG_SIMPLE_GALLERY: SimpleGalleryItem[] = [
  { img: pavaDistributionGroup, cat: "Education", h: "tall" },
  { img: pavaCertificate, cat: "Events", h: "short" },
  { img: pavaAward, cat: "Events", h: "tall" },
  { img: pavaEnvelope, cat: "Events", h: "short" },
  { img: pavaDistributionTable, cat: "Education", h: "short" }
];

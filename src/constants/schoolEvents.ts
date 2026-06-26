import pavaCertificate from "@/assets/pava-certificate.jpg";
import pavaDistributionGroup from "@/assets/pava-distribution-group.jpg";
import pavaAward from "@/assets/pava-award.jpg";
import pavaEnvelope from "@/assets/pava-envelope.jpg";
import pavaDistributionTable from "@/assets/pava-distribution-table.jpg";

import hebatpur1 from "@/assets/hebatpur_1.jpg";
import hebatpur2 from "@/assets/hebatpur_2.jpg";
import hebatpur3 from "@/assets/hebatpur_3.jpg";
import hebatpur4 from "@/assets/hebatpur_4.jpg";
import hebatpur5 from "@/assets/hebatpur_5.jpg";
import hebatpur6 from "@/assets/hebatpur_6.jpg";
import hebatpur7 from "@/assets/hebatpur_7.jpg";
import hebatpur8 from "@/assets/hebatpur_8.jpg";
import hebatpur9 from "@/assets/hebatpur_9.jpg";
import hebatpur10 from "@/assets/hebatpur_10.jpg";
import hebatpur11 from "@/assets/hebatpur_11.jpg";
import hebatpur12 from "@/assets/hebatpur_12.jpg";

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
  images: GalleryPicture[];
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
    images: [
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
          gu: "શિક્ષણ પર્યાવરણ અને વિકાસક્ષેત્રે આપેલા સહયોગ બદલ સન્માનપત્ર",
          hi: "शिक्षा क्षेत्र में सहयोग देने के लिए प्रशस्ति पत्र",
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
    ],
  },
  {
    id: "hebatpur-school-distribution-2025",
    category: "Educational Activities",
    date: "Jun 2025",
    title: {
      en: "School Entrance (Praveshotsav) & Bag Distribution 2025",
      gu: "શાળા પ્રવેશોત્સવ અને સ્કૂલ બેગ વિતરણ કાર્યક્રમ-૨૦૨૫",
      hi: "स्कूल प्रवेशोत्सव एवं बैग वितरण कार्यक्रम-2025",
    },
    place: {
      en: "Hebatpur Primary School, Patdi Taluka",
      gu: "હેબતપુર પ્રાથમિક શાળા, પાટડી તાલુકો",
      hi: "हेबतपुर प्राथमिक विद्यालय, पाटडी तालुका",
    },
    summary: {
      en: "On June 28, 2025, President Sri Gulab Bauddh of Uday Foundation Trust, Sanand, Secretary Prakash Parmar, and Executive Committee Member Mehulbhai Bauddh attended the Kanya Kelavani Mahotsav and Shala Praveshotsav-2025 program at Hebatpur Primary School in Patdi Taluka. On this occasion, school bags and educational kits were distributed by the organization to the newly admitted students. The school family welcomed Sri Gulab Bauddh, Prakash Parmar, and Mehulbhai Bauddh by presenting books and honored them with certificates of appreciation for their contribution to the field of education. Uday Foundation Trust expressed gratitude to the school family. Wishing a bright future to all the newly admitted children, the organization expressed its commitment to continue serving in the future for the propagation of education and the overall development of students.",
      gu: "તા. 28/06/2025ના રોજ પાટડી તાલુકાની હેબતપુર પ્રાથમિક શાળામાં યોજાયેલા કન્યા કેળવણી મહોત્સવ અને શાળા પ્રવેશોત્સવ-2025 કાર્યક્રમમાં ઉદય ફાઉન્ડેશન ટ્રસ્ટ, સાણંદના પ્રમુખ શ્રી ગુલાબ બૌદ્ધ,મંત્રી : પ્રકાશ પરમાર, કા. સભ્ય : મેહુલભાઈ બૌદ્ધ ઉપસ્થિત રહ્યા હતા. આ પ્રસંગે નવા પ્રવેશ મેળવનાર વિદ્યાર્થીઓને સંસ્થા દ્વારા સ્કૂલ બેગ અને શિક્ષણ કીટનું વિતરણ કરવામાં આવ્યું હતું. શાળા પરિવાર દ્વારા શ્રી ગુલાબ બૌદ્ધ, પ્રકાશ પરમાર, મેહુલભાઈ બૌદ્ધ નું પુસ્તક અર્પણ કરીને સ્વાગત કરવામાં આવ્યું તેમજ શિક્ષણક્ષેત્રે આપેલા સહયોગ બદલ સન્માનપત્ર આપી સન્માનિત કરવામાં આવ્યા હતા. ઉદય ફાઉન્ડેશન ટ્રસ્ટ તરફથી શાળા પરિવારનો આભાર વ્યક્ત કરવામાં આવ્યો હતો. પ્રવેશ મેળવનાર તમામ બાળકોને ઉજ્જવળ ભવિષ્ય માટે હાર્દિક શુભેચ્છાઓ પાઠવતા સંસ્થાએ શિક્ષણના પ્રચાર-પ્રસાર અને વિદ્યાર્થીઓના સર્વાંગી વિકાસ માટે ભવિષ્યમાં પણ સતત સેવા આપવાની પ્રતિબદ્ધતા વ્યક્ત કરી હતી.",
      hi: "28/06/2025 को पाटडी तालुका के हेबतपुर प्राथमिक विद्यालय में आयोजित कन्या केलावनी महोत्सव और स्कूल प्रवेशोत्सव-2025 कार्यक्रम में उदय फाउंडेशन ट्रस्ट, सानंद के अध्यक्ष श्री गुलाब बौद्ध, सचिव प्रकाश परमार और कार्यकारी समिति के सदस्य मेहुलभाई बौद्ध उपस्थित थे। इस अवसर पर संस्था द्वारा नव प्रवेशित विद्यार्थियों को स्कूल बैग एवं शैक्षणिक किट का वितरण किया गया। विद्यालय परिवार द्वारा श्री गुलाब बौद्ध, प्रकाश परमार और मेहुलभाई बौद्ध का पुस्तक भेंट कर स्वागत किया गया तथा शिक्षा के क्षेत्र में उनके सहयोग के लिए प्रशस्ति पत्र देकर सम्मानित किया गया। उदय फाउंडेशन ट्रस्ट ने विद्यालय परिवार के प्रति आभार व्यक्त किया। नव प्रवेशित सभी बच्चों के उज्ज्वल भविष्य की कामना करते हुए संस्था ने शिक्षा के प्रचार-प्रसार तथा विद्यार्थियों के सर्वांगीण विकास के लिए भविष्य में भी निरंतर सेवा देने की प्रतिबद्धता व्यक्त की।",
    },
    participants: 150,
    volunteers: 12,
    impact: {
      en: "Distributed School Bags & Kits",
      gu: "સ્કૂલ બેગ અને શિક્ષણ કીટ વિતરણ",
      hi: "स्कूल बैग और किट वितरित",
    },
    img: hebatpur5,
    images: [
      {
        img: hebatpur1,
        category: "Educational Activities",
        caption: {
          en: "Certificate of Appreciation from Zelasana Primary School",
          gu: "ઝૈલાસણા પ્રાથમિક શાળા તરફથી મળેલ સન્માનપત્ર",
          hi: "जैलासणा प्राथमिक विद्यालय से प्राप्त प्रशस्ति पत्र",
        },
      },
      {
        img: hebatpur2,
        category: "Educational Activities",
        caption: {
          en: "Certificate of Appreciation & Bag Distribution at Hebatpur Primary School",
          gu: "હેબતપુર પ્રાથમિક શાળા ખાતે સન્માનપત્ર અને બેગ વિતરણ",
          hi: "हेबतपुर प्राथमिक विद्यालय में प्रशस्ति पत्र एवं बैग वितरण",
        },
      },
      {
        img: hebatpur3,
        category: "Educational Activities",
        caption: {
          en: "Trustees Honored by School Family at Hebatpur",
          gu: "શાળા પરિવાર દ્વારા હેબતપુર ખાતે ટ્રસ્ટીશ્રીઓનું સન્માન",
          hi: "हेबतपुर में विद्यालय परिवार द्वारा ट्रस्टीगण का सम्मान",
        },
      },
      {
        img: hebatpur4,
        category: "Educational Activities",
        caption: {
          en: "Distribution of School Bags to Students at Hebatpur",
          gu: "હેબતપુર પ્રાથમિક શાળામાં વિદ્યાર્થીઓને બેગ વિતરણ",
          hi: "हेबतपुर प्राथमिक विद्यालय में छात्रों को बैग वितरण",
        },
      },
      {
        img: hebatpur5,
        category: "Educational Activities",
        caption: {
          en: "Group Photo with Beneficiary Students at Hebatpur Primary School",
          gu: "હેબતપુર પ્રાથમિક શાળામાં લાભાર્થી વિદ્યાર્થીઓ સાથે ગ્રુપ ફોટો",
          hi: "हेबतपुर प्राथमिक विद्यालय में लाभार्थी छात्रों के साथ समूह चित्र",
        },
      },
      {
        img: hebatpur6,
        category: "Educational Activities",
        caption: {
          en: "Lighting of Lamp (Deep Pragaty) & Welcome Ceremony at Hebatpur",
          gu: "હેબતપુર ખાતે દીપ પ્રાગટ્ય અને સ્વાગત સમારોહ",
          hi: "हेबतपुर में दीप प्रज्वलन एवं स्वागत समारोह",
        },
      },
      {
        img: hebatpur7,
        category: "Educational Activities",
        caption: {
          en: "Students Expressing Joy with New Bags at Hebatpur",
          gu: "હેબતપુર ખાતે નવી સ્કૂલ બેગ સાથે આનંદ વ્યક્ત કરતા વિદ્યાર્થીઓ",
          hi: "हेबतपुर में नए बैग के साथ खुशी व्यक्त करते छात्र",
        },
      },
      {
        img: hebatpur8,
        category: "Educational Activities",
        caption: {
          en: "School Bag Distribution Drive at Hebatpur Primary School",
          gu: "હેબતપુર પ્રાથમિક શાળામાં સ્કૂલ બેગ વિતરણ અભિયાન",
          hi: "हेबतपुर प्राथमिक विद्यालय में school बैग वितरण अभियान",
        },
      },
      {
        img: hebatpur9,
        category: "Educational Activities",
        caption: {
          en: "Educational Support at Hebatpur Primary School",
          gu: "હેબતપુર પ્રાથમિક શાળામાં શૈક્ષણિક સહાય વિતરણ",
          hi: "हेबतपुर प्राथमिक विद्यालय में शैक्षणिक सहायता वितरण",
        },
      },
      {
        img: hebatpur10,
        category: "Educational Activities",
        caption: {
          en: "Welcoming Guests at Hebatpur Primary School",
          gu: "હેબતપુર પ્રાથમિક શાળા ખાતે મહેમાનોનું સ્વાગત",
          hi: "हेबतपुर प्राथमिक विद्यालय में अतिथियों का स्वागत",
        },
      },
      {
        img: hebatpur11,
        category: "Educational Activities",
        caption: {
          en: "Trustees Interactive Session with Students at Hebatpur",
          gu: "ટ્રસ્ટીઓનો હેબતપુર ખાતે વિદ્યાર્થીઓ સાથે સંવાદ કાર્યક્રમ",
          hi: "हेबतपुर में छात्रों के साथ ट्रस्टीगण का संवादात्मक सत्र",
        },
      },
      {
        img: hebatpur12,
        category: "Educational Activities",
        caption: {
          en: "Community Support and Education Campaign at Hebatpur",
          gu: "હેબતપુર ખાતે સામુદાયિક સહયોગ અને શિક્ષણ અભિયાન",
          hi: "हेबतपुर में सामुदायिक सहयोग एवं शिक्षा अभियान",
        },
      },
    ],
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
      gu: "શિક્ષણ પર્યાવરણ અને વિકાસક્ષેત્રે આપેલા સહયોગ બદલ સન્માનપત્ર",
      hi: "शिक्षा क्षेत्र में सहयोग देने के लिए प्रशस्ति पत्र",
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
  {
    img: hebatpur1,
    category: "Educational Activities",
    caption: {
      en: "Certificate of Appreciation from Zelasana Primary School",
      gu: "ઝૈલાસણા પ્રાથમિક શાળા તરફથી મળેલ સન્માનપત્ર",
      hi: "जैलासणा प्राथमिक विद्यालय से प्राप्त प्रशस्ति पत्र",
    },
  },
  {
    img: hebatpur2,
    category: "Educational Activities",
    caption: {
      en: "Certificate of Appreciation & Bag Distribution at Hebatpur Primary School",
      gu: "હેબતપુર પ્રાથમિક શાળા ખાતે સન્માનપત્ર અને બેગ વિતરણ",
      hi: "हेबतपुर प्राथमिक विद्यालय में प्रशस्ति पत्र एवं बैग वितरण",
    },
  },
  {
    img: hebatpur3,
    category: "Educational Activities",
    caption: {
      en: "Trustees Honored by School Family at Hebatpur",
      gu: "શાળા પરિવાર દ્વારા હેબતપુર ખાતે ટ્રસ્ટીશ્રીઓનું સન્માન",
      hi: "हेबतपुर में विद्यालय परिवार द्वारा ट्रस्टीगण का सम्मान",
    },
  },
  {
    img: hebatpur4,
    category: "Educational Activities",
    caption: {
      en: "Distribution of School Bags to Students at Hebatpur",
      gu: "હેબતપુર પ્રાથમિક શાળામાં વિદ્યાર્થીઓને બેગ વિતરણ",
      hi: "हेबतपुर प्राथमिक विद्यालय में छात्रों को बैग वितरण",
    },
  },
  {
    img: hebatpur5,
    category: "Educational Activities",
    caption: {
      en: "Group Photo with Beneficiary Students at Hebatpur Primary School",
      gu: "હેબતપુર પ્રાથમિક શાળામાં લાભાર્થી વિદ્યાર્થીઓ સાથે ગ્રુપ ફોટો",
      hi: "हेबतपुर प्राथमिक विद्यालय में लाभार्थी छात्रों के साथ समूह चित्र",
    },
  },
  {
    img: hebatpur6,
    category: "Educational Activities",
    caption: {
      en: "Lighting of Lamp (Deep Pragaty) & Welcome Ceremony at Hebatpur",
      gu: "હેબતપુર ખાતે દીપ પ્રાગટ્ય અને સ્વાગત સમારોહ",
      hi: "हेबतपुर में दीप प्रज्वलन एवं स्वागत समारोह",
    },
  },
  {
    img: hebatpur7,
    category: "Educational Activities",
    caption: {
      en: "Students Expressing Joy with New Bags at Hebatpur",
      gu: "હેબતપુર ખાતે નવી સ્કૂલ બેગ સાથે આનંદ વ્યક્ત કરતા વિદ્યાર્થીઓ",
      hi: "हेबतपुर में नए बैग के साथ खुशी व्यक्त करते छात्र",
    },
  },
  {
    img: hebatpur8,
    category: "Educational Activities",
    caption: {
      en: "School Bag Distribution Drive at Hebatpur Primary School",
      gu: "હેબતપુર પ્રાથમિક શાળામાં સ્કૂલ બેગ વિતરણ અભિયાન",
      hi: "हेबतपुर प्राथमिक विद्यालय में school बैग वितरण अभियान",
    },
  },
  {
    img: hebatpur9,
    category: "Educational Activities",
    caption: {
      en: "Educational Support at Hebatpur Primary School",
      gu: "હેબતપુર પ્રાથમિક શાળામાં શૈક્ષણિક સહાય વિતરણ",
      hi: "हेबतपुर प्राथमिक विद्यालय में शैक्षणिक सहायता वितरण",
    },
  },
  {
    img: hebatpur10,
    category: "Educational Activities",
    caption: {
      en: "Welcoming Guests at Hebatpur Primary School",
      gu: "હેબતપુર પ્રાથમિક શાળા ખાતે મહેમાનોનું સ્વાગત",
      hi: "हेबतपुर प्राथमिक विद्यालय में अतिथियों का स्वागत",
    },
  },
  {
    img: hebatpur11,
    category: "Educational Activities",
    caption: {
      en: "Trustees Interactive Session with Students at Hebatpur",
      gu: "ટ્રસ્ટીઓનો હેબતપુર ખાતે વિદ્યાર્થીઓ સાથે સંવાદ કાર્યક્રમ",
      hi: "हेबतपुर में छात्रों के साथ ट्रस्टीगण का संवादात्मक सत्र",
    },
  },
  {
    img: hebatpur12,
    category: "Educational Activities",
    caption: {
      en: "Community Support and Education Campaign at Hebatpur",
      gu: "હેબતપુર ખાતે સામુદાયિક સહયોગ અને શિક્ષણ અભિયાન",
      hi: "हेबतपुर में सामुदायिक सहयोग एवं शिक्षा अभियान",
    },
  },
];

export const SCHOOL_BAG_SIMPLE_GALLERY: SimpleGalleryItem[] = [
  { img: pavaDistributionGroup, cat: "Education", h: "tall" },
  { img: pavaCertificate, cat: "Events", h: "short" },
  { img: pavaAward, cat: "Events", h: "tall" },
  { img: pavaEnvelope, cat: "Events", h: "short" },
  { img: pavaDistributionTable, cat: "Education", h: "short" },
  { img: hebatpur5, cat: "Education", h: "tall" },
  { img: hebatpur2, cat: "Events", h: "short" },
  { img: hebatpur3, cat: "Events", h: "tall" },
  { img: hebatpur4, cat: "Education", h: "short" },
  { img: hebatpur7, cat: "Education", h: "tall" },
  { img: hebatpur6, cat: "Events", h: "short" },
  { img: hebatpur8, cat: "Education", h: "short" },
  { img: hebatpur9, cat: "Education", h: "short" },
  { img: hebatpur10, cat: "Events", h: "short" },
  { img: hebatpur11, cat: "Education", h: "short" },
  { img: hebatpur12, cat: "Education", h: "short" },
];

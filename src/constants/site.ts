import logo from "@/assets/uday-logo.png";

export const SITE = {
  name: "Uday Foundation Trust",
  nameGu: "ઉદય ફાઉન્ડેશન ટ્રસ્ટ",
  tagline: "સેવા એ જ સંસ્કાર, સેવા એ જ સાચો ધર્મ",
  taglineEn: "Service is Culture, Service is True Dharma",
  established: "05 October 2024",
  address: "314, Ambedkar Nagar, Mu. Soyla, Taluka Sanand, District Ahmedabad – 382110",
  phone: "+91 96246 68484",
  phoneRaw: "919624668484",
  email: "udayfts1024@gmail.com",
  socials: {
    instagram: "https://www.instagram.com/uday_foundation_trust_sanand",
    whatsapp: "https://whatsapp.com/channel/0029Vasojke4NVimvIkQOG1g",
    facebook: "https://facebook.com/",
  },
  registrations: {
    "Trust Reg.": "F/22598/Ahmedabad",
    "F Reg.": "F/22598/Ahmedabad",
    DARPAN: "GJ/2026/0930211",
    PAN: "AABTU5153H",
    "12A": "AABTU5153HE20251",
    "80G": "AABTU5153HF20261",
  },
  logo: logo,
};

export const NAV_LINKS = [
  { to: "/", label: "Home" },

  { to: "/programs", label: "Programs" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/team", label: "Team" },
  { to: "/get-involved", label: "Get Involved" },
  { to: "/transparency", label: "Transparency" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

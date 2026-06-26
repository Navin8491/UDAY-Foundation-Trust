import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "gu" | "hi";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Nav links
    "nav.home": "Home",
    "nav.about": "About",
    "nav.programs": "Programs",
    "nav.gallery": "Gallery",
    "nav.team": "Team",
    "nav.events": "Events",
    "nav.getInvolved": "Get Involved",
    "nav.contact": "Contact",
    "nav.donate": "Donate",
    "nav.transparency": "Transparency",
    "nav.successStories": "Success Stories",
    "nav.blog": "Blog",

    // Footer
    "footer.address": "Address",
    "footer.phone": "Phone",
    "footer.email": "Email",
    "footer.location": "Sanand, Ahmedabad",
    "footer.desc":
      "Serving rural communities in Gujarat through education support, healthcare camps, environmental sustainability, and humanitarian relief.",
    "footer.quickLinks": "Quick Links",
    "footer.certifications": "Certifications",
    "footer.contact": "Contact Us",
    "footer.copyright": "All rights reserved.",
    "footer.madeWith": "Made with",
    "footer.in": "in Sanand, Gujarat",
    "footer.emailPlaceholder": "Email Address",

    // Certifications
    "cert.trust": "Registered Trust",
    "cert.trust.desc": "Public charitable trust",
    "cert.darpan": "DARPAN Registered",
    "cert.darpan.desc": "NITI Aayog verified",
    "cert.12a": "12A Certified",
    "cert.12a.desc": "Tax exemption status",
    "cert.80g": "80G Certified",
    "cert.80g.desc": "Tax deduction benefits",

    // Home - Hero
    "hero.chip": "Established 05 October 2024",
    "hero.title1": "Every village deserves a",
    "hero.title2": "sunrise",
    "hero.desc":
      "Uday Foundation Trust serves rural Gujarat through education, healthcare, women empowerment, environment and humanitarian relief — one family at a time.",
    "hero.donate": "Donate Now",
    "hero.volunteer": "Become a Volunteer",
    "hero.badge1": "12A & 80G Certified",
    "hero.badge2": "DARPAN Registered",
    "hero.badge3": "Sanand, Ahmedabad",
    "hero.stats1": "families supported",
    "hero.verified": "Verified NGO",

    // Home - Impact
    "impact.chip": "Our Impact",
    "impact.title": "A movement measured in smiles.",
    "impact.desc":
      "Every number below is a story — a family fed, a child taught, a tree planted, a life touched.",
    "impact.stat.families": "Families Supported",
    "impact.stat.students": "Students Educated",
    "impact.stat.camps": "Medical Camps",
    "impact.stat.trees": "Trees Planted",
    "impact.stat.volunteers": "Active Volunteers",
    "impact.stat.villages": "Villages Reached",

    // Home - President Message
    "pres.chip": "President's Message",
    "pres.role": "President",
    "pres.title": '"A society moves forward only when no one is left behind."',
    "pres.quote": '"કોઈ પણ માનવી પછાત ન રહે અને સમાજનો દરેક વર્ગ વિકાસના માર્ગે આગળ વધે."',
    "pres.body":
      "Uday Foundation Trust Sanand was born out of a single resolution — to bring the light of education, healthcare, and humanity to every section of society. We believe service is culture, and a small but true step can bring big change. Your support is our strength.",
    "pres.readMore": "Read full message",

    // Home - Programs
    "prog.chip": "What we do",
    "prog.title": "Eight focused programs. One mission.",
    "prog.desc":
      "From classrooms to clinics, from saplings to scholarships — we build dignity at every step.",
    "prog.edu": "Education",
    "prog.edu.desc": "School kits, scholarships & support for girl-child education.",
    "prog.health": "Healthcare",
    "prog.health.desc": "Free medical camps, patient support & health awareness drives.",
    "prog.women": "Women Empowerment",
    "prog.women.desc": "Skill training, livelihood and self-help group support.",
    "prog.child": "Child Welfare",
    "prog.child.desc": "Nutrition, protection and bright futures for every child.",
    "prog.env": "Environment",
    "prog.env.desc": "Tree plantation drives and community sustainability projects.",
    "prog.rural": "Rural Development",
    "prog.rural.desc": "Infrastructure, awareness and uplift in remote villages.",
    "prog.disaster": "Disaster Relief",
    "prog.disaster.desc": "Rapid response in floods, cyclones and emergencies.",
    "prog.human": "Humanitarian Aid",
    "prog.human.desc": "Ration kits, welfare programs and dignity for all.",
    "prog.learnMore": "Learn more",

    // Home - Featured Activities
    "act.chip": "On the ground",
    "act.title": "Featured activities",
    "act.viewAll": "All projects",
    "act.ration.tag": "Relief",
    "act.ration.title": "Ration Kit Distribution",
    "act.ration.desc": "Monthly ration support for vulnerable families across Sanand taluka.",
    "act.health.tag": "Healthcare",
    "act.health.title": "Free Medical Camps",
    "act.health.desc": "General check-ups, eye care, BP & sugar screening for elders.",
    "act.edu.tag": "Education",
    "act.edu.title": "School Kit Drive",
    "act.edu.desc": "Notebooks, bags and books for hundreds of rural students.",
    "act.env.tag": "Environment",
    "act.env.title": "Tree Plantation",
    "act.env.desc": "Community plantation campaigns greening villages, schools and roads.",

    // Home - Trust/Transparency
    "trans.chip": "Transparency",
    "trans.title": "Trust, certified.",
    "trans.desc":
      "Uday Foundation Trust is a fully registered nonprofit. Every rupee is accounted for, every certificate verifiable.",
    "trans.viewDocs": "View documents",
    "trans.eligible": "Donate (80G eligible)",

    // Home - CTA
    "cta.title": "Be the reason someone smiles today.",
    "cta.subtitle": "તમારું એક પગલું, કોઈનું આખું જીવન બદલી શકે છે.",
    "cta.donate": "Donate Now",
    "cta.volunteer": "Volunteer with us",

    // Donate Page
    "donate.title": "Support Our Mission",
    "donate.desc":
      "Your contribution brings education, healthcare, and humanitarian relief to underprivileged communities in Sanand.",
    "donate.card.title": "Make a Donation",
    "donate.amount.label": "Select Donation Amount (INR)",
    "donate.custom.placeholder": "Enter custom amount",
    "donate.name.label": "Full Name",
    "donate.email.label": "Email Address",
    "donate.phone.label": "Phone Number",
    "donate.pan.label": "PAN Card Number (Required for 80G tax exemption receipt)",
    "donate.pan.placeholder": "ABCDE1234F",
    "donate.submit": "Proceed to Pay",
    "donate.benefit.title": "100% Transparency & Benefits",
    "donate.benefit.desc":
      "All donations qualify for 50% tax deductions under Section 80G of the Indian Income Tax Act. A certified receipt is issued instantly.",
    "donate.benefit.point1": "Tax exemption certificate sent via email.",
    "donate.benefit.point2": "Every rupee is tracked and audited.",
    "donate.benefit.point3": "Direct impact reports sent quarterly.",

    // Contact Page
    "contact.title": "Get in Touch",
    "contact.desc":
      "Have questions, want to partner, or join as a volunteer? Reach out to us. We would love to hear from you.",
    "contact.form.title": "Send us a Message",
    "contact.form.subtitle": "We typically respond within 24–48 hours.",
    "contact.form.name": "Full Name",
    "contact.form.email": "Email Address",
    "contact.form.phone": "Phone (optional)",
    "contact.form.opt.volunteer": "I'd like to volunteer",
    "contact.form.opt.donate": "I'd like to donate",
    "contact.form.opt.csr": "CSR / partnership",
    "contact.form.opt.general": "General enquiry",
    "contact.form.msgPlaceholder": "Your message",
    "contact.form.sent": "Message sent — thank you!",
    "contact.form.submit": "Send Message",
    "contact.info.title": "Office Address",
    "contact.info.working": "Working Hours",
    "contact.address.value":
      "314, Ambedkar Nagar, Mu. Soyla, Taluka Sanand, District Ahmedabad – 382110",
    "contact.followUs": "Follow us",

    // About Page Recreated
    "about.hero.chip": "WHO WE ARE",
    "about.hero.title": "About Uday Foundation Trust",
    "about.hero.desc":
      "OUR MISSION IS TO INITIATE UPLIFTMENT OF HUMAN SOCIETY WITH DIGNITY FOR ALL LIFE.",
    "about.story.chip": "OUR STORY",
    "about.story.title": "Serving with dedication since 2024",
    "about.story.body1":
      "Uday Foundation Trust, located in Mu. Soyla, Sanand, Ahmedabad, was established on 05 October 2024 with a deep-seated commitment to human upliftment and welfare. In a short period, we have reached dozens of villages with education, medical care, and disaster relief.",
    "about.story.body2":
      "We believe that society moves forward together. By supporting students with notebooks and bags, conducting diagnostic medical camps, distributing dry ration kits to widows and needy families, and planting thousands of trees, we put our core belief into action every single day.",
    "about.vision.title": "Our Vision",
    "about.vision.desc":
      "To build a society where every village thrives — where education, healthcare, and human dignity are accessible to all, creating a sustainable impact for the upliftment of humanity.",
    "about.mission.title": "Our Mission",
    "about.mission.desc":
      "To initiate the upliftment of human society with a focus on education, healthcare, women empowerment, child welfare, disaster relief, and rural development programs.",
    "about.values.title": "Our Core Values",
    "about.values.service.title": "Selfless Service",
    "about.values.service.desc":
      "Serving those in need with dedication, compassion, and without any expectation of return.",
    "about.values.transparency.title": "Transparency",
    "about.values.transparency.desc":
      "Maintaining 100% transparency in all our operations, funds utilization, and project execution.",
    "about.values.focus.title": "Continuous Focus",
    "about.values.focus.desc":
      "Focusing on continuous, sustainable development that creates long-term benefits for the community.",
    "about.timeline.title": "Our Journey Timeline",
    "about.timeline.subtitle":
      "A trace of our milestones and steps taken in service of the community.",
    "about.timeline.1.year": "Oct 2024",
    "about.timeline.1.title": "Establishment of Uday Foundation Trust",
    "about.timeline.1.desc":
      "Founded in Sanand, Ahmedabad to channel volunteer energy into rural upliftment.",
    "about.timeline.2.year": "2025",
    "about.timeline.2.title": "12A & 80G Tax Exemption Approvals",
    "about.timeline.2.desc":
      "Secured tax exemption status to enable tax-deductible contributions from our donors.",
    "about.timeline.3.year": "2026",
    "about.timeline.3.title": "NITI Aayog DARPAN Registration",
    "about.timeline.3.desc":
      "Successfully registered with DARPAN to enhance credibility and partner for government schemes.",
    "about.reg.title": "Trust Registration & Documents",
    "about.reg.subtitle": "Verified certificates and public registrations of the trust.",
    "about.reg.trust.label": "Trust Reg. Number",
    "about.reg.f.label": "F Registration No.",
    "about.reg.darpan.label": "DARPAN Registration",
    "about.reg.date.label": "Date of Establishment",
    "about.reg.pan.label": "NGO PAN Card No.",
    "about.reg.12a.label": "12A Certification",
    "about.reg.80g.label": "80G Certification",
    "about.reg.alert":
      "All donations to the Trust are eligible for 50% tax deductions under Section 80G of the Indian Income Tax Act. All certificates can be verified online.",
  },
  gu: {
    // Nav links
    "nav.home": "મુખ્ય પૃષ્ઠ",
    "nav.about": "અમારા વિશે",
    "nav.programs": "આયોજનો",
    "nav.gallery": "ગેલેરી",
    "nav.team": "ટીમ",
    "nav.events": "કાર્યક્રમો",
    "nav.getInvolved": "સાથે જોડાઓ",
    "nav.contact": "સંપર્ક",
    "nav.donate": "દાન કરો",
    "nav.transparency": "પારદર્શકતા",
    "nav.successStories": "સફળતાની વાર્તાઓ",
    "nav.blog": "બ્લોગ",

    // Footer
    "footer.address": "સરનામું",
    "footer.phone": "ફોન",
    "footer.email": "ઇમેઇલ",
    "footer.location": "સાણંદ, અમદાવાદ",
    "footer.desc":
      "સાણંદ અને ગુજરાતના ગ્રામીણ વિસ્તારોમાં શિક્ષણ, સ્વાસ્થ્ય, મહિલા સશક્તિકરણ, પર્યાવરણ અને રાહત કાર્યો દ્વારા માનવતાવાદી સેવા.",
    "footer.quickLinks": "ઝડપી લિંક્સ",
    "footer.certifications": "પ્રમાણપત્રો",
    "footer.contact": "સંપર્ક કરો",
    "footer.copyright": "સર્વાધિકાર સુરક્ષિત.",
    "footer.madeWith": "સાથે બનાવેલ",
    "footer.in": "સાણંદ, ગુજરાતમાં",
    "footer.emailPlaceholder": "ઇમેઇલ સરનામું",

    // Certifications
    "cert.trust": "રજિસ્ટર્ડ ટ્રસ્ટ",
    "cert.trust.desc": "જાહેર સખાવતી ટ્રસ્ટ",
    "cert.darpan": "દર્પણ રજિસ્ટર્ડ",
    "cert.darpan.desc": "નીતિ આયોગ દ્વારા પ્રમાણિત",
    "cert.12a": "12A પ્રમાણિત",
    "cert.12a.desc": "કર મુક્તિ સ્ટેટસ",
    "cert.80g": "80G પ્રમાણિત",
    "cert.80g.desc": "કર કપાત લાભો",

    // Home - Hero
    "hero.chip": "સ્થાપના ૦૫ ઓક્ટોબર ૨૦૨૪",
    "hero.title1": "દરેક ગામને એક નવો",
    "hero.title2": "ઉદય મળવો જોઈએ",
    "hero.desc":
      "ઉદય ફાઉન્ડેશન ટ્રસ્ટ સાણંદ તાલુકા અને સમગ્ર ગુજરાતના ગ્રામ્ય વિસ્તારોમાં શિક્ષણ, આરોગ્ય, મહિલા કલ્યાણ અને રાહત સેવા પૂરી પાડે છે.",
    "hero.donate": "દાન કરો",
    "hero.volunteer": "સ્વયંસેવક બનો",
    "hero.badge1": "12A અને 80G પ્રમાણિત",
    "hero.badge2": "દર્પણ રજિસ્ટર્ડ",
    "hero.badge3": "સાણંદ, અમદાવાદ",
    "hero.stats1": "પરિવારોને સહાય",
    "hero.verified": "પ્રમાણિત NGO",

    // Home - Impact
    "impact.chip": "આપણો પ્રભાવ",
    "impact.title": "સ્મિત દ્વારા માપવામાં આવતી ક્રાંતિ.",
    "impact.desc":
      "દરેક આંકડો એક વાર્તા છે — એક પરિવારને અનાજ, બાળકને શિક્ષણ અને છોડને જીવન મળ્યું.",
    "impact.stat.families": "પરિવારોને સહાય",
    "impact.stat.students": "વિદ્યાર્થીઓને શિક્ષણ",
    "impact.stat.camps": "તબીબી કેમ્પ",
    "impact.stat.trees": "વૃક્ષારોપણ",
    "impact.stat.volunteers": "સક્રિય સ્વયંસેવકો",
    "impact.stat.villages": "પહોંચેલા ગામો",

    // Home - President Message
    "pres.chip": "પ્રમુખનો સંદેશ",
    "pres.role": "પ્રમુખ",
    "pres.title": '"જ્યારે કોઈ પાછળ ન રહે, ત્યારે જ સમાજ આગળ વધે છે."',
    "pres.quote": '"કોઈ પણ માનવી પછાત ન રહે અને સમાજનો દરેક વર્ગ વિકાસના માર્ગે આગળ વધે."',
    "pres.body":
      "ઉદય ફાઉન્ડેશન ટ્રસ્ટ સાણંદનો જન્મ એક સંકલ્પથી થયો છે — સમાજના દરેક વર્ગ સુધી શિક્ષણ, સ્વાસ્થ્ય અને માનવતાનું અજવાળું પહોંચાડવાનો. અમે માનીએ છીએ કે સેવા એ જ સંસ્કાર છે, અને નાનું પણ સાચું પગલું મોટું પરિવર્તન લાવી શકે છે. આપ સૌનો સહકાર અમારી શક્તિ છે.",
    "pres.readMore": "પૂરો સંદેશ વાંચો",

    // Home - Programs
    "prog.chip": "આપણે શું કરીએ છીએ",
    "prog.title": "આઠ કેન્દ્રિત કાર્યક્રમો. એક મિશન.",
    "prog.desc":
      "વર્ગખંડોથી લઈને ક્લિનિક્સ સુધી, અને છોડથી લઈને સ્કોલરશિપ સુધી — અમે કલ્યાણ કરીએ છીએ.",
    "prog.edu": "શિક્ષણ",
    "prog.edu.desc": "સ્કૂલ કીટ, શિષ્યવૃત્તિ અને દીકરીઓના શિક્ષણ માટે સહાય.",
    "prog.health": "આરોગ્ય સંભાળ",
    "prog.health.desc": "મફત મેડિકલ કેમ્પ, દર્દી સહાય અને આરોગ્ય જાગૃતિ અભિયાન.",
    "prog.women": "મહિલા સશક્તિકરણ",
    "prog.women.desc": "કૌશલ્ય તાલીમ, આજીવિકા અને સ્વ-સહાય જૂથ સહાય.",
    "prog.child": "બાળ કલ્યાણ",
    "prog.child.desc": "દરેક બાળકના ઉજ્જવળ ભવિષ્ય માટે પોષણ અને સુરક્ષા.",
    "prog.env": "પર્યાવરણ",
    "prog.env.desc": "વૃક્ષારોપણ અભિયાન અને સામુદાયિક ટકાઉપણું પ્રોજેક્ટ્સ.",
    "prog.rural": "ગ્રામીણ વિકાસ",
    "prog.rural.desc": "અંતરિયાળ ગામડાઓમાં માળખાકીય સુવિધાઓ અને જાગૃતિ.",
    "prog.disaster": "આફત રાહત",
    "prog.disaster.desc": "પૂર, વાવાઝોડું અને કટોકટીમાં ઝડપી રાહત કામગીરી.",
    "prog.human": "માનવતાવાદી સહાય",
    "prog.human.desc": "રાશન કીટ વિતરણ અને ગરીબ પરિવારો માટે કલ્યાણ યોજનાઓ.",
    "prog.learnMore": "વધુ જાણો",

    // Home - Featured Activities
    "act.chip": "વાસ્તવિક કામો",
    "act.title": "મુખ્ય પ્રવૃત્તિઓ",
    "act.viewAll": "બધા પ્રોજેક્ટ્સ",
    "act.ration.tag": "રાહત",
    "act.ration.title": "રાશન કીટ વિતરણ",
    "act.ration.desc": "સાણંદ તાલુકાના જરૂરિયાતમંદ પરિવારો માટે માસિક રાશન સહાય.",
    "act.health.tag": "આરોગ્ય",
    "act.health.title": "મફત નિદાન કેમ્પ",
    "act.health.desc": "જનરલ ચેક-અપ, આંખની તપાસ અને બીપી-સુગર ટેસ્ટ.",
    "act.edu.tag": "શિક્ષણ",
    "act.edu.title": "સ્કૂલ બેગ વિતરણ",
    "act.edu.desc": "ગ્રામીણ વિદ્યાર્થીઓ માટે પુસ્તકો, નોટબુક અને શૈક્ષણિક સાધનો.",
    "act.env.tag": "પર્યાવરણ",
    "act.env.title": "સામૂહિક વૃક્ષારોપણ",
    "act.env.desc": "ગામડાઓ અને રસ્તાઓ પર હરિયાળી વધારવા માટે વૃક્ષારોપણ.",

    // Home - Trust/Transparency
    "trans.chip": "પારદર્શકતા",
    "trans.title": "પ્રમાણિત વિશ્વાસ.",
    "trans.desc":
      "ઉદય ફાઉન્ડેશન ટ્રસ્ટ એક સંપૂર્ણ રજિસ્ટર્ડ સંસ્થા છે. દરેક રૂપિયાનો હિસાબ અને તમામ પ્રમાણપત્રો ચકાસી શકાય તેવા છે.",
    "trans.viewDocs": "દસ્તાવેજો જુઓ",
    "trans.eligible": "દાન કરો (80G કર મુક્તિ પાત્ર)",

    // Home - CTA
    "cta.title": "આજે કોઈના સ્મિતનું કારણ બનો.",
    "cta.subtitle": "તમારું એક પગલું, કોઈનું આખું જીવન બદલી શકે છે.",
    "cta.donate": "દાન કરો",
    "cta.volunteer": "અમારી સાથે જોડાઓ",

    // Donate Page
    "donate.title": "અમારા મિશનને સહાય કરો",
    "donate.desc":
      "તમારું દાન સાણંદ તાલુકાના વંચિત પરિવારો સુધી શિક્ષણ, આરોગ્ય અને રાહત સામગ્રી પહોંચાડે છે.",
    "donate.card.title": "દાન કરો",
    "donate.amount.label": "દાનની રકમ પસંદ કરો (INR)",
    "donate.custom.placeholder": "બીજી રકમ લખો",
    "donate.name.label": "પૂરૂં નામ",
    "donate.email.label": "ઇમેઇલ સરનામું",
    "donate.phone.label": "મોબાઇલ નંબર",
    "donate.pan.label": "પાન કાર્ડ નંબર (80G કર મુક્તિ રસીદ માટે જરૂરી)",
    "donate.pan.placeholder": "ABCDE1234F",
    "donate.submit": "ચુકવણી કરો",
    "donate.benefit.title": "૧૦૦% પારદર્શકતા અને લાભો",
    "donate.benefit.desc":
      "તમામ દાન આવકવેરા કાયદાની કલમ 80G હેઠળ કર મુક્તિ માટે પાત્ર છે. રસીદ તુરંત જ જનરેટ થાય છે.",
    "donate.benefit.point1": "ઇમેઇલ દ્વારા કર મુક્તિ પ્રમાણપત્ર મોકલવામાં આવશે.",
    "donate.benefit.point2": "દરેક રૂપિયાનું ઓડિટ કરવામાં આવે છે.",
    "donate.benefit.point3": "દર ત્રણ મહિને કાર્ય અહેવાલ મોકલવામાં આવે છે.",

    // Contact Page
    "contact.title": "સંપર્ક કરો",
    "contact.desc": "કોઈ પ્રશ્ન હોય, જોડાવા ઈચ્છો છો, કે સ્વયંસેવક બનવું છે? અમને લખો.",
    "contact.form.title": "સંદેશ મોકલો",
    "contact.form.subtitle": "અમે સામાન્ય રીતે ૨૪-૪૮ કલાકમાં જવાબ આપીએ છીએ.",
    "contact.form.name": "પૂરૂં નામ",
    "contact.form.email": "ઇમેઇલ સરનામું",
    "contact.form.phone": "મોબાઇલ નંબર (વૈકલ્પિક)",
    "contact.form.opt.volunteer": "હું સ્વયંસેવક બનવા માંગુ છું",
    "contact.form.opt.donate": "હું દાન કરવા માંગુ છું",
    "contact.form.opt.csr": "CSR / ભાગીદારી",
    "contact.form.opt.general": "સામાન્ય પૂછપરછ",
    "contact.form.msgPlaceholder": "તમારો સંદેશ",
    "contact.form.sent": "સંદેશ મોકલાઈ ગયો — આભાર!",
    "contact.form.submit": "સંદેશ મોકલો",
    "contact.info.title": "ઓફિસ સરનામું",
    "contact.info.working": "કામનો સમય",
    "contact.address.value": "૩૧૪, આંબેડકર નગર, મુ. સોયલા, તાલુકો સાણંદ, જીલ્લો અમદાવાદ - ૩૮૨૧૧૦",
    "contact.followUs": "અમારી સાથે જોડાઓ",

    // About Page Recreated
    "about.hero.chip": "અમે કોણ છીએ",
    "about.hero.title": "ઉદય ફાઉન્ડેશન ટ્રસ્ટ વિશે",
    "about.hero.desc":
      "અમારો ઉદ્દેશ્ય તમામ જીવો પ્રત્યે આદર સાથે માનવ સમાજના ઉત્થાનની શરૂઆત કરવાનો છે.",
    "about.story.chip": "અમારી કહાની",
    "about.story.title": "૨૦૨૪ થી સમર્પણ સાથે સેવા",
    "about.story.body1":
      "ઉદય ફાઉન્ડેશન ટ્રસ્ટની સ્થાપના ૦૫ ઓક્ટોબર ૨૦૨૪ના રોજ સાણંદ તાલુકાના સોયલા ગામમાં કરવામાં આવી હતી. ગ્રામીણ અને વંચિત પરિવારો સુધી શિક્ષણ, આરોગ્ય અને રાહત સેવાઓ પહોંચાડવા માટે સંસ્થા કટિબદ્ધ છે.",
    "about.story.body2":
      "અમે માનીએ છીએ કે જ્યારે સમાજનો દરેક વર્ગ આગળ વધે ત્યારે જ સાચો વિકાસ થાય છે. બાળકોને સ્કૂલ બેગ, દર્દીઓ માટે નિદાન કેમ્પ, વિધવા અને નિરાધાર પરિવારોને રાશન કીટ, અને હજારો વૃક્ષારોપણ સાથે અમે દરરોજ સેવાનું કાર્ય કરીએ છીએ.",
    "about.vision.title": "અમારું વિઝન",
    "about.vision.desc":
      "એવા સમાજનું નિર્માણ કરવું જ્યાં દરેક ગામ વિકાસ પામે — જ્યાં શિક્ષણ, આરોગ્ય અને માનવ ગૌરવ દરેક માટે સુલભ હોય, જે માનવતાના ઉત્થાન માટે લાંબા ગાળાની અસર ઉભી કરે.",
    "about.mission.title": "અમારું મિશન",
    "about.mission.desc":
      "શિક્ષણ, આરોગ્ય સંભાળ, મહિલા સશક્તિકરણ, બાળ કલ્યાણ, આપત્તિ રાહત અને ગ્રામીણ વિકાસ કાર્યક્રમો પર વિશેષ ધ્યાન આપીને માનવ સમાજના ઉત્થાનની શરૂઆત કરવી.",
    "about.values.title": "અમારા મુખ્ય મૂલ્યો",
    "about.values.service.title": "નિઃસ્વાર્થ સેવા",
    "about.values.service.desc":
      "જરૂરિયાતમંદોને સમર્પણ, કરુણા સાથે અને કોઈપણ વળતરની અપેક્ષા રાખ્યા વિના સેવા કરવી.",
    "about.values.transparency.title": "પારદર્શકતા",
    "about.values.transparency.desc":
      "અમારા તમામ કાર્યો, ભંડોળના ઉપયોગ અને પ્રોજેક્ટના અમલીકરણમાં ૧૦૦% પારદર્શકતા જાળવવી.",
    "about.values.focus.title": "સતત ધ્યાન",
    "about.values.focus.desc":
      "સતત અને ટકાઉ વિકાસ પર ધ્યાન કેન્દ્રિત કરવું જે સમાજ માટે લાંબા ગાળાના લાભો લાવે.",
    "about.timeline.title": "આપણી સફરની સમયરેખા",
    "about.timeline.subtitle": "સમાજની સેવામાં લેવાયેલા આપણા પગલાં અને મહત્વના સીમાચિહ્નો.",
    "about.timeline.1.year": "ઓક્ટોબર ૨૦૨૪",
    "about.timeline.1.title": "ઉદય ફાઉન્ડેશન ટ્રસ્ટની સ્થાપના",
    "about.timeline.1.desc":
      "ગ્રામીણ ઉત્થાન માટે સ્વયંસેવકોની શક્તિને યોગ્ય દિશા આપવા સાણંદ, અમદાવાદમાં સ્થાપના.",
    "about.timeline.2.year": "૨૦૨૫",
    "about.timeline.2.title": "12A અને 80G કર મુક્તિ મંજૂરીઓ",
    "about.timeline.2.desc":
      "દાતાઓ દ્વારા આપવામાં આવતા દાન પર કર મુક્તિ લાભ આપવા માટે પ્રમાણપત્રો પ્રાપ્ત કર્યા.",
    "about.timeline.3.year": "૨૦૨૬",
    "about.timeline.3.title": "નીતિ આયોગ દર્પણ રજીસ્ટ્રેશન",
    "about.timeline.3.desc":
      "વિશ્વાસપાત્રતા વધારવા અને સરકારી યોજનાઓ સાથે જોડાવા માટે દર્પણ પોર્ટલ પર સફળ નોંધણી.",
    "about.reg.title": "ટ્રસ્ટ રજીસ્ટ્રેશન અને દસ્તાવેજો",
    "about.reg.subtitle": "ટ્રસ્ટના પ્રમાણિત દસ્તાવેજો અને સાર્વજનિક નોંધણીઓ.",
    "about.reg.trust.label": "ટ્રસ્ટ રજી. નંબર",
    "about.reg.f.label": "એફ રજીસ્ટ્રેશન નંબર",
    "about.reg.darpan.label": "દર્પણ રજીસ્ટ્રેશન",
    "about.reg.date.label": "સ્થાપના તારીખ",
    "about.reg.pan.label": "NGO પાન કાર્ડ નંબર",
    "about.reg.12a.label": "12A પ્રમાણપત્ર",
    "about.reg.80g.label": "80G પ્રમાણપત્ર",
    "about.reg.alert":
      "ટ્રસ્ટને આપવામાં આવતું તમામ દાન આવકવેરા કાયદાની કલમ 80G હેઠળ 50% કર કપાત માટે પાત્ર છે. તમામ પ્રમાણપત્રો ઓનલાઇન ચકાસી શકાય છે.",
  },
  hi: {
    // Nav links
    "nav.home": "मुख्य पृष्ठ",
    "nav.about": "हमारे बारे में",
    "nav.programs": "कार्यक्रम",
    "nav.gallery": "गैलरी",
    "nav.team": "हमारी टीम",
    "nav.events": "आयोजन",
    "nav.getInvolved": "जुड़ें",
    "nav.contact": "संपर्क",
    "nav.donate": "दान करें",
    "nav.transparency": "पारदर्शिता",
    "nav.successStories": "सफलता की कहानियाँ",
    "nav.blog": "ब्लॉग",

    // Footer
    "footer.address": "पता",
    "footer.phone": "फ़ोन",
    "footer.email": "ईमेल",
    "footer.location": "सानंद, अहमदाबाद",
    "footer.desc":
      "सानंद और गुजरात के ग्रामीण क्षेत्रों में शिक्षा, स्वास्थ्य, महिला सशक्तिकरण, पर्यावरण और मानवीय राहत के माध्यम से सेवा कार्य।",
    "footer.quickLinks": "त्वरित लिंक्स",
    "footer.certifications": "प्रमाणपत्र",
    "footer.contact": "संपर्क करें",
    "footer.copyright": "सर्वाधिकार सुरक्षित।",
    "footer.madeWith": "के साथ निर्मित",
    "footer.in": "सानंद, गुजरात में",
    "footer.emailPlaceholder": "ईमेल पता",

    // Certifications
    "cert.trust": "पंजीकृत ट्रस्ट",
    "cert.trust.desc": "सार्वजनिक धर्मार्थ ट्रस्ट",
    "cert.darpan": "दर्पण पंजीकृत",
    "cert.darpan.desc": "नीति आयोग द्वारा सत्यापित",
    "cert.12a": "12A प्रमाणित",
    "cert.12a.desc": "कर छूट की स्थिति",
    "cert.80g": "80G प्रमाणित",
    "cert.80g.desc": "कर कटौती के लाभ",

    // Home - Hero
    "hero.chip": "स्थापना 05 अक्टूबर 2024",
    "hero.title1": "हर गाँव को एक नया",
    "hero.title2": "उदय मिलना चाहिए",
    "hero.desc":
      "उदय फाउंडेशन ट्रस्ट सानंद और गुजरात के ग्रामीण क्षेत्रों में शिक्षा, स्वास्थ्य, महिला सशक्तिकरण और मानवीय राहत के माध्यम से काम करता है।",
    "hero.donate": "दान करें",
    "hero.volunteer": "स्वयंसेवक बनें",
    "hero.badge1": "12A और 80G प्रमाणित",
    "hero.badge2": "दर्पण पंजीकृत",
    "hero.badge3": "सानंद, अहमदाबाद",
    "hero.stats1": "परिवारों को सहायता",
    "hero.verified": "सत्यापित एनजीओ",

    // Home - Impact
    "impact.chip": "हमारा प्रभाव",
    "impact.title": "मुस्कान से मापा जाने वाला बदलाव।",
    "impact.desc":
      "हर आँकड़ा एक कहानी है — एक परिवार को राशन, बच्चे को शिक्षा और पौधे को जीवन मिला।",
    "impact.stat.families": "परिवारों को सहायता",
    "impact.stat.students": "छात्रों को शिक्षा",
    "impact.stat.camps": "चिकित्सा शिविर",
    "impact.stat.trees": "वृक्षारोपण",
    "impact.stat.volunteers": "सक्रिय स्वयंसेवक",
    "impact.stat.villages": "पहुंचे हुए गाँव",

    // Home - President Message
    "pres.chip": "अध्यक्ष का संदेश",
    "pres.role": "अध्यक्ष",
    "pres.title": '"कोई भी पीछे न छूटे, तभी समाज आगे बढ़ सकता है।"',
    "pres.quote": '"કોઈ પણ માનવી પછાત ન રહે અને સમાજનો દરેક વર્ગ વિકાસના માર્ગે આગળ વધે."',
    "pres.body":
      "उदय फाउंडेशन ट्रस्ट सानंद का जन्म एक संकल्प से हुआ है — समाज के हर वर्ग तक शिक्षा, स्वास्थ्य और मानवता का प्रकाश पहुँचाने का। हमारा मानना है कि सेवा ही संस्कार है, और एक छोटा लेकिन सच्चा कदम बड़ा बदलाव ला सकता है। आपका सहयोग हमारी शक्ति है।",
    "pres.readMore": "पूरा संदेश पढ़ें",

    // Home - Programs
    "prog.chip": "हम क्या करते हैं",
    "prog.title": "आठ केंद्रित कार्यक्रम। एक मिशन।",
    "prog.desc":
      "कक्षाओं से लेकर क्लीनिक तक, और पौधों से लेकर स्कॉलरशिप तक — हम हर कदम पर कल्याण करते हैं।",
    "prog.edu": "शिक्षा",
    "prog.edu.desc": "स्कूल किट, छात्रवृत्ति और बालिकाओं की शिक्षा के लिए सहायता।",
    "prog.health": "स्वास्थ्य सेवा",
    "prog.health.desc": "मुफ़्त चिकित्सा शिविर, रोगी सहायता और स्वास्थ्य जागरूकता अभियान।",
    "prog.women": "महिला सशक्तिकरण",
    "prog.women.desc": "कौशल प्रशिक्षण, आजीविका और स्वयं सहायता समूह सहायता।",
    "prog.child": "बाल कल्याण",
    "prog.child.desc": "हर बच्चे के उज्ज्वल भविष्य के लिए पोषण और सुरक्षा।",
    "prog.env": "पर्यावरण",
    "prog.env.desc": "वृक्षारोपण अभियान और सामुदायिक स्थिरता परियोजनाएं।",
    "prog.rural": "ग्रामीण विकास",
    "prog.rural.desc": "सुदूर गांवों में बुनियादी ढांचा, जागरूकता और उत्थान।",
    "prog.disaster": "आपदा राहत",
    "prog.disaster.desc": "बाढ़, चक्रवात और आपातकाल में त्वरित राहत कार्य।",
    "prog.human": "मानवीय सहायता",
    "prog.human.desc": "राशन किट वितरण और वंचित परिवारों के लिए कल्याणकारी योजनाएं।",
    "prog.learnMore": "और जानें",

    // Home - Featured Activities
    "act.chip": "धरातल पर काम",
    "act.title": "प्रमुख गतिविधियाँ",
    "act.viewAll": "सभी परियोजनाएं",
    "act.ration.tag": "राहत",
    "act.ration.title": "राशन किट वितरण",
    "act.ration.desc": "सानंद तालुका के जरूरतमंद परिवारों के लिए मासिक राशन सहायता।",
    "act.health.tag": "स्वास्थ्य",
    "act.health.title": "मुफ़्त चिकित्सा शिविर",
    "act.health.desc": "सामान्य जांच, आंखों की जांच और बीपी-शुगर टेस्ट शिविर।",
    "act.edu.tag": "शिक्षा",
    "act.edu.title": "स्कूल बैग वितरण अभियान",
    "act.edu.desc": "ग्रामीण छात्रों के लिए किताबें, नोटबुक और शैक्षणिक सामग्री का वितरण।",
    "act.env.tag": "पर्यावरण",
    "act.env.title": "सामूहिक वृक्षारोपण",
    "act.env.desc": "गांवों और सड़कों को हरा-भरा बनाने के लिए वृक्षारोपण अभियान।",

    // Home - Trust/Transparency
    "trans.chip": "पारदर्शिता",
    "trans.title": "सत्यापित विश्वास।",
    "trans.desc":
      "उदय फाउंडेशन ट्रस्ट एक पूर्णतः पंजीकृत गैर-लाभकारी संस्था है। प्रत्येक रुपये का हिसाब और सभी प्रमाणपत्र सत्यापित किए जा सकते हैं।",
    "trans.viewDocs": "दस्तावेज़ देखें",
    "trans.eligible": "दान करें (80G कर छूट के योग्य)",

    // Home - CTA
    "cta.title": "आज किसी की मुस्कान का कारण बनें।",
    "cta.subtitle": "आपका एक कदम, किसी का पूरा जीवन बदल सकता है।",
    "cta.donate": "दान करें",
    "cta.volunteer": "हमारे साथ जुड़ें",

    // Donate Page
    "donate.title": "हमारे मिशन का समर्थन करें",
    "donate.desc":
      "आपका योगदान सानंद तालुका के वंचित परिवारों तक शिक्षा, स्वास्थ्य और राहत सामग्री पहुँचाता है।",
    "donate.card.title": "दान करें",
    "donate.amount.label": "दान राशि चुनें (INR)",
    "donate.custom.placeholder": "अन्य राशि दर्ज करें",
    "donate.name.label": "पूरा नाम",
    "donate.email.label": "ईमेल पता",
    "donate.phone.label": "मोबाइल नंबर",
    "donate.pan.label": "पैन कार्ड नंबर (80G कर छूट रसीद के लिए आवश्यक)",
    "donate.pan.placeholder": "ABCDE1234F",
    "donate.submit": "भुगतान करें",
    "donate.benefit.title": "100% पारदर्शिता और लाभ",
    "donate.benefit.desc":
      "सभी दान आयकर अधिनियम की धारा 80G के तहत कर छूट के पात्र हैं। रसीद तुरंत प्राप्त होती है।",
    "donate.benefit.point1": "ईमेल द्वारा कर छूट प्रमाण पत्र भेजा जाएगा।",
    "donate.benefit.point2": "प्रत्येक रुपये का ऑडिट किया जाता है।",
    "donate.benefit.point3": "हर तिमाही में कार्य रिपोर्ट भेजी जाती है।",

    // Contact Page
    "contact.title": "संपर्क करें",
    "contact.desc": "कोई प्रश्न है, जुड़ना चाहते हैं, या स्वयंसेवक बनना चाहते हैं? हमें लिखें।",
    "contact.form.title": "संदेश भेजें",
    "contact.form.subtitle": "हम आम तौर पर 24-48 घंटों के भीतर जवाब देते हैं।",
    "contact.form.name": "पूरा नाम",
    "contact.form.email": "ईमेल पता",
    "contact.form.phone": "मोबाइल नंबर (वैकल्पिक)",
    "contact.form.opt.volunteer": "मैं स्वयंसेवक बनना चाहता हूँ",
    "contact.form.opt.donate": "मैं दान करना चाहता हूँ",
    "contact.form.opt.csr": "CSR / भागीदारी",
    "contact.form.opt.general": "सामान्य पूछताछ",
    "contact.form.msgPlaceholder": "आपका संदेश",
    "contact.form.sent": "संदेश भेज दिया गया — धन्यवाद!",
    "contact.form.submit": "संदेश भेजें",
    "contact.info.title": "कार्यालय का पता",
    "contact.info.working": "कार्य समय",
    "contact.address.value": "314, आंबेडकर नगर, मु. सोयला, तालुका सानंद, जिला अहमदाबाद - 382110",
    "contact.followUs": "हमसे जुड़ें",

    // About Page Recreated
    "about.hero.chip": "हम कौन हैं",
    "about.hero.title": "उदय फाउंडेशन ट्रस्ट के बारे में",
    "about.hero.desc":
      "हमारा उद्देश्य सभी जीवों के प्रति सम्मान के साथ मानव समाज के उत्थान की शुरुआत करना है।",
    "about.story.chip": "हमारी कहानी",
    "about.story.title": "२०२४ से समर्पण के साथ सेवा",
    "about.story.body1":
      "उदय फाउंडेशन ट्रस्ट की स्थापना 05 अक्टूबर 2024 को सानंद के सोयला गाँव में ग्रामीण और वंचित परिवारों तक शिक्षा, स्वास्थ्य और राहत सेवाएँ पहुँचाने के लिए की गई थी।",
    "about.story.body2":
      "हमारा मानना है कि जब समाज का हर वर्ग आगे बढ़ेगा, तभी असली विकास होगा। बच्चों को स्कूल किट, रोगियों के लिए मुफ़्त चिकित्सा शिविर, विधवा और जरूरतमंद परिवारों को राशन किट, तथा वृक्षारोपण द्वारा हम सेवा कार्य करते हैं।",
    "about.vision.title": "हमारा दृष्टिकोण (Vision)",
    "about.vision.desc":
      "एक ऐसे समाज का निर्माण करना जहां हर गांव समृद्ध हो — जहां शिक्षा, स्वास्थ्य सेवा और मानवीय गरिमा सभी के लिए सुलभ हो, जो मानवता के उत्थान के लिए स्थायी प्रभाव पैदा करे।",
    "about.mission.title": "हमारा लक्ष्य (Mission)",
    "about.mission.desc":
      "शिक्षा, स्वास्थ्य सेवा, महिला सशक्तिकरण, बाल कल्याण, आपदा राहत और ग्रामीण विकास कार्यक्रमों पर विशेष ध्यान देते हुए मानव समाज के उत्थान की शुरुआत करना।",
    "about.values.title": "हमारे मुख्य मूल्य",
    "about.values.service.title": "निःस्वार्थ सेवा",
    "about.values.service.desc":
      "जरूरतमंदों की समर्पण, करुणा के साथ और किसी भी वापसी की उम्मीद के बिना सेवा करना।",
    "about.values.transparency.title": "पारदर्शिता",
    "about.values.transparency.desc":
      "हमारे सभी कार्यों, धन के उपयोग और परियोजना निष्पादन में 100% पारदर्शिता बनाए रखना।",
    "about.values.focus.title": "सतत ध्यान",
    "about.values.focus.desc":
      "निरंतर और सतत विकास पर ध्यान केंद्रित करना जो समुदाय के लिए दीर्घकालिक लाभ पैदा करे।",
    "about.timeline.title": "हमारी यात्रा की समयरेखा",
    "about.timeline.subtitle":
      "समुदाय की सेवा में उठाए गए हमारे कदमों और प्रमुख मील के पत्थरों का विवरण।",
    "about.timeline.1.year": "अक्टूबर 2024",
    "about.timeline.1.title": "उदय फाउंडेशन ट्रस्ट की स्थापना",
    "about.timeline.1.desc":
      "ग्रामीण उत्थान के लिए स्वयंसेवकों की ऊर्जा को सही दिशा देने हेतु सानंद, अहमदाबाद में स्थापना।",
    "about.timeline.2.year": "2025",
    "about.timeline.2.title": "12A और 80G कर छूट अनुमोदन",
    "about.timeline.2.desc":
      "दाताओं द्वारा दिए जाने वाले दान पर कर छूट का लाभ प्रदान करने के लिए प्रमाण पत्र प्राप्त किए।",
    "about.timeline.3.year": "2026",
    "about.timeline.3.title": "नीति आयोग दर्पण पंजीकरण",
    "about.timeline.3.desc":
      "विश्वसनीयता बढ़ाने और सरकारी योजनाओं के साथ साझेदारी के लिए दर्पण पोर्टल पर सफल पंजीकरण।",
    "about.reg.title": "ट्रस्ट पंजीकरण और दस्तावेज़",
    "about.reg.subtitle": "ट्रस्ट के प्रमाणित दस्तावेज़ और सार्वजनिक पंजीकरण।",
    "about.reg.trust.label": "ट्रस्ट पंजी. संख्या",
    "about.reg.f.label": "एफ पंजीकरण संख्या",
    "about.reg.darpan.label": "दर्पण पंजीकरण",
    "about.reg.date.label": "स्थापना की तारीख",
    "about.reg.pan.label": "एनजीओ पैन कार्ड नंबर",
    "about.reg.12a.label": "12A प्रमाणपत्र",
    "about.reg.80g.label": "80G प्रमाणपत्र",
    "about.reg.alert":
      "ट्रस्ट को दिया जाने वाला सभी दान आयकर अधिनियम की धारा 80G के तहत 50% कर छूट के लिए योग्य है। सभी प्रमाणपत्र ऑनलाइन सत्यापित किए जा सकते हैं।",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("site-lang") as Language;
    if (saved === "en" || saved === "gu" || saved === "hi") {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    } else {
      document.documentElement.lang = "en";
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("site-lang", lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

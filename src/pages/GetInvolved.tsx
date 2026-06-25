import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import { Counter } from "@/components/site/Counter";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import {
  Users,
  Heart,
  Building2,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Stethoscope,
  Sprout,
  Activity,
  FileText,
  Calendar,
  MessageSquare,
  Target,
  ChevronDown,
  ChevronUp,
  X,
  Compass,
  Award,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";

// Types for pre-filling the modal
type InterestCategory = "volunteer" | "donate" | "sponsor" | "csr" | "general";
type VolunteerRole = 
  | "Medical Camp Volunteer"
  | "Teaching Volunteer"
  | "Community Outreach"
  | "Event Management"
  | "Environmental Volunteer"
  | "Social Media Volunteer"
  | "";

export function GetInvolved() {
  useDocumentMetadata(
    "Get Involved — Volunteer, Donate, Partner | Uday Foundation Trust",
    "Become a volunteer, donor, sponsor or CSR partner with Uday Foundation Trust and make impact at scale.",
  );

  const navigate = useNavigate();

  // GSAP animations for entering elements
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in hero content
      gsap.fromTo(
        ".gsap-hero-animate",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
      
      // Fade in sections on load/scroll slowly
      gsap.fromTo(
        ".gsap-section-header",
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".gsap-section-header",
            start: "top 85%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Volunteer Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<InterestCategory>("general");
  const [modalRole, setModalRole] = useState<VolunteerRole>("");

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEducation, setFormEducation] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formSelfie, setFormSelfie] = useState<File | null>(null);
  const [formIdDoc, setFormIdDoc] = useState<File | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);
  const [formMessage, setFormMessage] = useState("");

  const handleOpenModal = (category: InterestCategory, role: VolunteerRole = "") => {
    setModalCategory(category);
    setModalRole(role);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formName ||
      !formEmail ||
      !formPhone ||
      !formEducation ||
      !formAddress ||
      !formSelfie ||
      !formIdDoc
    ) {
      toast.error("Please fill in all required fields and upload all requested documents.");
      return;
    }
    toast.success("Thank you for your interest! Our team will contact you shortly.", {
      description: `Registration submitted. Selfie: ${formSelfie.name}, ID: ${formIdDoc.name}`,
      duration: 6000,
    });
    // Reset Form
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormEducation("");
    setFormAddress("");
    setFormSelfie(null);
    setFormIdDoc(null);
    setFormResetKey((prev) => prev + 1);
    setFormMessage("");
    setIsModalOpen(false);
  };

  // Why Get Involved Cards Data
  const WHY_CARDS = [
    {
      Icon: Users,
      title: "Volunteer Your Time",
      desc: "Offer your unique skills and time on the ground to teach kids, run plantation campaigns, or assist in health checkups.",
      color: "from-blue-500/10 to-indigo-500/10 text-primary border-primary/20",
    },
    {
      Icon: Heart,
      title: "Support a Cause",
      desc: "Help fund crucial projects directly. Every contribution provides health kits, education tools, and nutrition support.",
      color: "from-rose-500/10 to-orange-500/10 text-rose-600 border-rose-500/20",
    },
    {
      Icon: Building2,
      title: "Become a Corporate Partner",
      desc: "Channel corporate CSR funds towards high-impact community building projects, sustainable forestry, and child education.",
      color: "from-amber-500/10 to-yellow-500/10 text-amber-600 border-amber-500/20",
    },
    {
      Icon: Calendar,
      title: "Organize Community Events",
      desc: "Create positive local impact by hosting community drives, medical checkups, and basic awareness sessions in your town.",
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/20",
    },
    {
      Icon: MessageSquare,
      title: "Spread Awareness",
      desc: "Be our digital voice. Amplify our stories and project missions across social media channels to help reach global donors.",
      color: "from-violet-500/10 to-purple-500/10 text-violet-600 border-violet-500/20",
    },
  ];

  // Ways You Can Help Data
  const WAYS_HELP = [
    {
      title: "Volunteer",
      desc: "Join our active community of change-makers working on the ground in rural education and healthcare.",
      Icon: Users,
      action: () => handleOpenModal("volunteer"),
    },
    {
      title: "Donate",
      desc: "Support our operations financially. Contributions receive 80G tax exemptions and visual impact reporting.",
      Icon: Heart,
      action: () => navigate("/donate"),
    },
    {
      title: "Sponsor a Project",
      desc: "Adopt a village school, fund a sanitation project, or sponsor an entire regional health drive.",
      Icon: Target,
      action: () => handleOpenModal("sponsor"),
    },
    {
      title: "CSR Partnership",
      desc: "Collaborate on structural, audited CSR goals aligned with schedule VII guidelines for companies.",
      Icon: Building2,
      action: () => handleOpenModal("csr"),
    },
    {
      title: "Educational Support",
      desc: "Help purchase curriculum guides, smart panels, school bags, notebooks, and digital tools for students.",
      Icon: GraduationCap,
      action: () => handleOpenModal("sponsor"),
    },
    {
      title: "Medical Camp Support",
      desc: "Help secure prescription drugs, medical diagnostics, diagnostic tools, and specialists for camps.",
      Icon: Stethoscope,
      action: () => handleOpenModal("sponsor"),
    },
    {
      title: "Tree Plantation",
      desc: "Sponsor saplings, tree guards, organic manure, and maintenance wages for local green belts.",
      Icon: Sprout,
      action: () => handleOpenModal("sponsor"),
    },
    {
      title: "Disaster Relief",
      desc: "Help store and distribute survival kits, medicine packets, blankets, and foods during sudden emergencies.",
      Icon: Activity,
      action: () => handleOpenModal("general"),
    },
  ];

  // Volunteer Opportunities Grid Data
  const VOL_ROLES = [
    {
      role: "Medical Camp Volunteer",
      responsibilities: "Manage queue flow, handle patient registration sheets, coordinate medicine dispensing tables, and guide senior citizens.",
      commitment: "4-6 hours per weekend camp",
      Icon: Stethoscope,
    },
    {
      role: "Teaching Volunteer",
      responsibilities: "Conduct basic English speaking, elementary arithmetic, and computing workshops for students at our learning centers.",
      commitment: "2-3 hours per week (min 2 months)",
      Icon: GraduationCap,
    },
    {
      role: "Community Outreach",
      responsibilities: "Accompany senior leads to neighboring villages, explain welfare schemes, record feedback, and raise local health awareness.",
      commitment: "4 hours per week (flexible)",
      Icon: Compass,
    },
    {
      role: "Event Management",
      responsibilities: "Assist in setting up fundraising events, coordinating logistics, handling sound/mic systems, and managing site registrations.",
      commitment: "Flexible (on call during events)",
      Icon: Calendar,
    },
    {
      role: "Environmental Volunteer",
      responsibilities: "Join our active tree planting groups, distribute seeds, assist in community weeding, and lead environmental talks.",
      commitment: "3-5 hours per drive",
      Icon: Sprout,
    },
    {
      role: "Social Media Volunteer",
      responsibilities: "Capture raw program updates on-ground, write engaging short-form text copies, and design simple graphics using Canva.",
      commitment: "2-4 hours per week (remote)",
      Icon: MessageSquare,
    },
  ];

  // Corporate & CSR Partnership Cards Data
  const CSR_COLLAB = [
    {
      title: "CSR Collaboration",
      desc: "Direct corporate investment into fully structured, audited developmental goals. We provide full compliance documentation, impact reports, and regular site visits for corporate transparency.",
      benefit: "Tax exemption & detailed ESG reporting alignment",
    },
    {
      title: "Corporate Sponsorship",
      desc: "Sponsor specific local milestones such as a medical diagnostics bus, setting up a digital literacy lab in a village school, or executing large-scale ecological drives.",
      benefit: "Sponsorship branding & local community visibility",
    },
    {
      title: "Employee Volunteering",
      desc: "Curate team-building volunteering days for your employee workforce. Engage them directly in tree plantations, children mentoring drives, or packing emergency relief packages.",
      benefit: "Boosts team moral & aligns corporate empathy targets",
    },
    {
      title: "Community Development Projects",
      desc: "Partner with us for long-term village adoption models, where we collectively establish clean drinking water assets, healthcare accessibility centers, and solid waste setups.",
      benefit: "Generates long-term, verifiable grassroots change",
    },
    {
      title: "Long-Term Partnerships",
      desc: "Establish multi-year joint agreements that enable consistent program maintenance, strategic training support, and institutional capacity upgrades for the rural belt.",
      benefit: "Builds sustainable institutions and generational impact",
    },
  ];

  // Journey Steps
  const JOURNEY_STEPS = [
    {
      step: "01",
      title: "Choose How You Want to Help",
      desc: "Review our options—individual volunteering, project sponsorships, or corporate partnerships. Match your skill set and interest with the respective program.",
      Icon: Compass,
    },
    {
      step: "02",
      title: "Register Your Interest",
      desc: "Fill in our quick digital registration form indicating your availability, professional domain, contact numbers, and preferences.",
      Icon: FileText,
    },
    {
      step: "03",
      title: "Connect with Our Team",
      desc: "Our program coordinator will schedule a brief call to align interests, outline safety guidelines, clarify logistics, and complete onboarding.",
      Icon: Users,
    },
    {
      step: "04",
      title: "Start Making an Impact",
      desc: "Receive your schedule, join the team on the ground, and start bringing positive change into the lives of rural communities.",
      Icon: Award,
    },
  ];

  // Success Stories / Testimonials
  const SUCCESS_STORIES = [
    {
      name: "Aditya Patel",
      role: "Volunteering Lead",
      quote: "Volunteering with Uday Foundation's medical camps opened my eyes to rural healthcare gaps. Being able to help screen over 200 seniors in Sanand was incredibly fulfilling. The organization handles every volunteer's support with great structure.",
      impact: "Organized 12 successful village medical camps",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Meenaben Vaghela",
      role: "Beneficiary Mother",
      quote: "When my children received school kits, it was a huge relief. Uday Foundation Trust's support has kept my daughter in school, and now she wants to become a teacher herself. The regular visits by volunteers keep the kids excited to learn.",
      impact: "Two children continuing school with educational sponsorships",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Rajesh Shah",
      role: "VP of CSR, Alliance Corp",
      quote: "Partnering with Uday for our CSR initiative was seamless. Their transparency, regular reporting, and true focus on community development matched our corporate values perfectly. The employee volunteering day they structured was incredibly impactful.",
      impact: "Adopted 3 community schools and built modern libraries",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop",
    },
  ];

  // FAQ Questions
  const FAQS = [
    {
      q: "How can I volunteer?",
      a: "You can easily volunteer by clicking the 'Join Our Mission' or 'Become a Volunteer' buttons on this page. Simply fill in your contact information and key areas of interest. Our volunteer coordinator will schedule a quick introductory call to guide you on current schedules.",
    },
    {
      q: "Can students volunteer?",
      a: "Yes, students from schools and colleges are highly encouraged to volunteer. We run special weekend workshops and school holiday campaigns that fit perfectly around academic schedules. We also issue formal certificates of volunteering experience.",
    },
    {
      q: "How are donations used?",
      a: "100% of community donations go directly toward project expenses on the ground—such as buying school kits, purchasing wholesale prescription medicines for rural camps, and purchasing tree saplings. Administrative costs are supported separately by trust founders.",
    },
    {
      q: "Can companies partner with us?",
      a: "Yes! We work closely with companies on CSR projects under Schedule VII. We offer full regulatory compliances, project monitoring reports, financial auditing reports, and project site visit coordination for corporate transparency.",
    },
    {
      q: "How do I sponsor a project?",
      a: "You can sponsor educational kits, specific village camps, or sapling plantations by contacting us. For large sponsorships (e.g. digital learning centers), we will draw up custom program designs containing milestone targets and periodic evaluations.",
    },
  ];

  return (
    <div ref={containerRef} className="bg-slate-50 min-h-screen text-slate-800 font-sans overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[75vh] flex items-center justify-center text-white py-20 px-4">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop"
            alt="Uday Foundation Trust Volunteering"
            className="w-full h-full object-cover filter brightness-[0.28]"
          />
          {/* Radial soft overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container-page relative z-10 text-center max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="gsap-hero-animate flex items-center justify-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-300 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-white">Get Involved</span>
          </nav>

          <span className="gsap-hero-animate inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-secondary bg-secondary/15 rounded-full mb-6 border border-secondary/20">
            <Sparkles className="h-3.5 w-3.5" /> Shape the Future
          </span>

          <h1 className="gsap-hero-animate text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight tracking-tight mb-6">
            Together We Can <span className="text-secondary bg-clip-text">Build a Better Tomorrow</span>
          </h1>

          <p className="gsap-hero-animate text-lg md:text-xl lg:text-2xl text-slate-200 font-light leading-relaxed max-w-3xl mx-auto mb-10">
            Join Uday Foundation Trust in creating meaningful impact through education, healthcare, environmental initiatives, disaster relief, and community development.
          </p>

          <div className="gsap-hero-animate flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleOpenModal("volunteer")}
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-base"
            >
              Become a Volunteer <ArrowRight className="h-5 w-5" />
            </button>
            <Link
              to="/donate"
              className="px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-full shadow-lg hover:shadow-secondary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-base"
            >
              Donate Now <Heart className="h-5 w-5 fill-current" />
            </Link>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-8 md:h-12 text-slate-50 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
          </svg>
        </div>
      </section>

      {/* 2. WHY GET INVOLVED SECTION */}
      <section className="py-16 md:py-24 bg-slate-50 relative z-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-16 gsap-section-header">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
              Our Value Proposition
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 mt-4 tracking-tight">
              Why Get Involved with Us
            </h2>
            <p className="text-base md:text-lg text-slate-600 mt-4 leading-relaxed">
              Every hand that joins, every contribution made, fuels our focus on sustainable development, self-reliant villages, and transparent grassroot actions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {WHY_CARDS.map(({ Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-slate-900 leading-snug mb-3">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    {desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1.5 transition-transform duration-300">
                  Read impact metrics <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WAYS YOU CAN HELP */}
      <section className="py-16 md:py-24 bg-white border-y border-slate-200 relative z-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
              Your Path to Action
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 mt-4 tracking-tight">
              Ways You Can Help
            </h2>
            <p className="text-base md:text-lg text-slate-600 mt-4 leading-relaxed">
              Find the perfect engagement model. From immediate micro-actions on your phone to long-term community partnerships on site.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WAYS_HELP.map(({ title, desc, Icon, action }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-light mb-6">
                    {desc}
                  </p>
                </div>
                <button
                  onClick={action}
                  className="w-full py-3 bg-white hover:bg-primary hover:text-white text-primary text-sm font-semibold rounded-2xl border border-primary/20 hover:border-transparent transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-md"
                >
                  Apply Now <ArrowUpRight className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VOLUNTEER OPPORTUNITIES */}
      <section className="py-16 md:py-24 bg-slate-50 relative z-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-leaf bg-leaf/10 text-leaf px-3.5 py-1.5 rounded-full">
              Join the Workforce
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 mt-4 tracking-tight">
              Active Volunteer Opportunities
            </h2>
            <p className="text-base md:text-lg text-slate-600 mt-4 leading-relaxed">
              Become a driver of change. We are looking for volunteers to fill roles across different programs. Apply now to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VOL_ROLES.map(({ role, responsibilities, commitment, Icon }, i) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Visual side highlights */}
                <div className="absolute top-0 left-0 w-2 h-full bg-primary/20 group-hover:bg-primary transition-all duration-300" />
                
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                      On-Ground Role
                    </span>
                    <Icon className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-display font-bold text-slate-955 mb-4 pl-2">
                    {role}
                  </h3>
                  
                  <div className="space-y-4 text-sm pl-2">
                    <div>
                      <span className="text-slate-400 block text-xs font-semibold uppercase tracking-wider">
                        Responsibilities
                      </span>
                      <p className="text-slate-600 font-light mt-1 leading-relaxed">
                        {responsibilities}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs font-semibold uppercase tracking-wider">
                        Time Commitment
                      </span>
                      <p className="text-slate-900 font-semibold mt-1">
                        {commitment}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center pl-2">
                  <button
                    onClick={() => handleOpenModal("volunteer", role as VolunteerRole)}
                    className="py-2.5 px-5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition-all shadow-sm hover:shadow-primary/20 flex items-center gap-1.5"
                  >
                    Join Now <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CORPORATE & CSR PARTNERSHIP */}
      <section className="py-16 md:py-24 bg-white border-y border-slate-200 relative z-20">
        <div className="container-page">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Content Left */}
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-100">
                Institutional Allies
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 mt-6 tracking-tight leading-tight">
                Corporate & CSR Partnerships
              </h2>
              <p className="text-slate-600 mt-6 leading-relaxed font-light">
                We partner with socially conscious companies to structure sustainable programs that meet Corporate Social Responsibility targets, comply fully with statutory rules, and generate clean auditing reports.
              </p>
              
              <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-3xl flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-leaf shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Compliant & Transparent</h4>
                  <p className="text-sm text-slate-600 font-light mt-1">
                    Uday Foundation Trust holds full certification for 12A, 80G, and DARPAN registrations, facilitating easy, clean CSR operations.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => handleOpenModal("csr")}
                  className="px-6 py-3.5 bg-primary text-white text-sm font-semibold rounded-full shadow-md hover:shadow-primary/20 transition-all flex items-center gap-2"
                >
                  Partner With Us <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  to="/transparency"
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-full transition-all flex items-center gap-2"
                >
                  Download Reports <FileText className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Cards Right */}
            <div className="lg:col-span-7 space-y-4">
              {CSR_COLLAB.map(({ title, desc, benefit }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-slate-50 hover:bg-slate-100/50 p-6 rounded-2xl border border-slate-200/80 transition-colors shadow-sm flex flex-col md:flex-row md:items-start gap-4"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    0{i+1}
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-slate-900 mb-1">
                      {title}
                    </h3>
                    <p className="text-sm text-slate-600 font-light leading-relaxed mb-3">
                      {desc}
                    </p>
                    <span className="text-xs font-semibold text-leaf bg-leaf/5 px-2.5 py-1 rounded-full border border-leaf/10">
                      Core Benefit: {benefit}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. VOLUNTEER JOURNEY TIMELINE */}
      <section className="py-16 md:py-24 bg-white border-y border-slate-200 relative z-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
              Simplifying Service
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 mt-4 tracking-tight">
              Your Volunteer Journey
            </h2>
            <p className="text-base md:text-lg text-slate-600 mt-4 leading-relaxed">
              Getting started is easy. We outline steps to prepare you for impact without disrupting your professional calendar.
            </p>
          </div>

          <div className="relative">
            {/* Connecting horizontal line desktop */}
            <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/10 via-primary to-primary/10 z-0" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {JOURNEY_STEPS.map(({ step, title, desc, Icon }) => (
                <div key={title} className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
                  <div className="relative mb-6">
                    {/* Circle Wrapper */}
                    <div className="h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg relative z-10">
                      <Icon className="h-6 w-6" />
                    </div>
                    {/* Step label overlay */}
                    <span className="absolute -top-3 -right-3 bg-secondary text-secondary-foreground font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      {step}
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-slate-900 leading-snug mb-3">
                    {title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. SUCCESS STORIES / TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-white border-y border-slate-200 relative z-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-100">
              Grassroots Echoes
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 mt-4 tracking-tight">
              Success Stories
            </h2>
            <p className="text-base md:text-lg text-slate-600 mt-4 leading-relaxed">
              Listen to the testimonies of volunteers, corporate stakeholders, and beneficiaries whose lives are enriched by Uday Trust programs.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map(({ name, role, quote, impact, img }) => (
              <div key={name} className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={img}
                      alt={name}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-lg leading-tight">
                        {name}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">
                        {role}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm font-light leading-relaxed italic mb-6">
                    "{quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">
                    Verifiable Impact
                  </span>
                  <p className="text-leaf text-sm font-semibold mt-1">
                    {impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. IMPACT STATISTICS */}
      <section className="py-16 md:py-24 bg-primary text-white relative z-20 overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="container-page relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/20 px-3.5 py-1.5 rounded-full border border-secondary/20">
              Stats at a Glance
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-semibold mt-6 tracking-tight text-white">
              Our Collective Impact
            </h2>
            <p className="text-slate-200 mt-4 leading-relaxed font-light">
              Thousands of lives are assisted, saplings planted, and diagnostics completed through combined donations and volunteer hours.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
            {[
              { to: 650, suffix: "+", label: "Volunteers Joined" },
              { to: 12000, suffix: "+", label: "Families Supported" },
              { to: 4500, suffix: "+", label: "Students Benefited" },
              { to: 38, suffix: "", label: "Medical Camps" },
              { to: 25000, suffix: "+", label: "Trees Planted" },
              { to: 120, suffix: "+", label: "Villages Reached" },
            ].map(({ to, suffix, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center shadow-md">
                <span className="block text-3xl md:text-4xl lg:text-5xl font-bold font-display text-secondary tracking-tight">
                  <Counter to={to} suffix={suffix} />
                </span>
                <span className="block text-xs font-semibold text-slate-100 uppercase tracking-wider mt-3">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section className="py-16 md:py-24 bg-slate-50 relative z-20">
        <div className="container-page max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
              Get Answers
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 mt-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-slate-600 mt-4 leading-relaxed">
              Find quick answers regarding volunteer certificates, student engagement guidelines, and donation auditing details.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map(({ q, a }, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={q}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between font-semibold text-slate-900 hover:text-primary transition-colors focus:outline-none"
                  >
                    <span className="pr-4 leading-snug">{q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed font-light border-t border-slate-100 pt-4">
                          {a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. FINAL CALL TO ACTION */}
      <section className="relative py-20 md:py-28 bg-slate-900 text-white text-center overflow-hidden z-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1600&auto=format&fit=crop"
            alt="Uday Trust Community Group"
            className="w-full h-full object-cover filter brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-slate-955/70 to-transparent" />
        </div>

        <div className="container-page relative z-10 max-w-3xl">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight mb-6">
            Be the Reason <span className="text-secondary">Someone Smiles Today</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-200 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Your support can transform lives, support students, build rural health accessibility, and strengthen communities.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleOpenModal("volunteer")}
              className="px-8 py-4 bg-primary text-white font-semibold rounded-full shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              Join Our Mission <ArrowRight className="h-5 w-5" />
            </button>
            <Link
              to="/donate"
              className="px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-full shadow-lg hover:shadow-secondary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              Donate Today <Heart className="h-5 w-5 fill-current" />
            </Link>
          </div>
        </div>
      </section>


      {/* REGISTRATION MODAL FORM */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Close trigger overlay */}
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

            {/* Form content box */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative z-10 border border-slate-200 max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 hover:bg-slate-100 transition-colors text-slate-500 rounded-full flex items-center justify-center focus:outline-none z-30"
              >
                <X className="h-4 w-4" />
              </button>

              <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                {modalCategory === "volunteer" ? "Volunteer Registration" : "Partnership Inquiry"}
              </span>

              <h3 className="text-2xl font-display font-semibold text-slate-900 mt-4">
                {modalCategory === "volunteer" ? "Become a Change Maker" : "Collaborate with Uday Trust"}
              </h3>
              
              <p className="text-sm text-slate-500 mt-2 font-light">
                {modalCategory === "volunteer"
                  ? "Enter your details to register as an on-ground volunteer for our community programs."
                  : "Submit your details and our collaboration coordinator will respond with custom proposals."}
              </p>

              <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                {/* 1. Selfie/Profile Picture Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Profile Picture / Selfie *
                  </label>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                    <div className="relative h-14 w-14 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden flex-none">
                      {formSelfie && formSelfie.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(formSelfie)}
                          alt="Selfie preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Users className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        key={`selfie-${formResetKey}`}
                        type="file"
                        required
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => setFormSelfie(e.target.files?.[0] || null)}
                        className="block w-full text-xs text-slate-500
                          file:mr-3 file:py-1.5 file:px-3
                          file:rounded-full file:border-0
                          file:text-xs file:font-semibold
                          file:bg-primary/10 file:text-primary
                          file:hover:bg-primary/20
                          cursor-pointer file:cursor-pointer"
                      />
                      <p className="text-[9px] text-slate-400 mt-1">
                        JPG, PNG, or PDF formats allowed. Required.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-light text-slate-900 bg-slate-50"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-light text-slate-900 bg-slate-50"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-light text-slate-900 bg-slate-50"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {/* 2. Manual Education Level Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Education Level *
                  </label>
                  <input
                    type="text"
                    required
                    value={formEducation}
                    onChange={(e) => setFormEducation(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-light text-slate-900 bg-slate-50"
                    placeholder="e.g., Bachelor of Arts, High School, Post-Graduate"
                  />
                </div>

                {/* 3. Address / Location field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Location Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-light text-slate-900 bg-slate-50"
                    placeholder="Enter your city/village, district, pincode"
                  />
                </div>

                {modalCategory === "volunteer" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Selected Role / Area of Interest
                    </label>
                    <select
                      value={modalRole}
                      onChange={(e) => setModalRole(e.target.value as VolunteerRole)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-light text-slate-900 bg-slate-50"
                    >
                      <option value="">Select general volunteering</option>
                      <option value="Medical Camp Volunteer">Medical Camp Volunteer</option>
                      <option value="Teaching Volunteer">Teaching Volunteer</option>
                      <option value="Community Outreach">Community Outreach</option>
                      <option value="Event Management">Event Management</option>
                      <option value="Environmental Volunteer">Environmental Volunteer</option>
                      <option value="Social Media Volunteer">Social Media Volunteer</option>
                    </select>
                  </div>
                )}

                {modalCategory !== "volunteer" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Collaboration Type
                    </label>
                    <select
                      value={modalCategory}
                      onChange={(e) => setModalCategory(e.target.value as InterestCategory)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-light text-slate-900 bg-slate-50"
                    >
                      <option value="csr">CSR Collaboration</option>
                      <option value="sponsor">Project Sponsorship</option>
                      <option value="general">Other / Long-Term Partnership</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Brief Message / Availability (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-light text-slate-900 bg-slate-50 resize-none"
                    placeholder="Tell us a bit about yourself or availability..."
                  />
                </div>

                {/* 4. Aadhaar Card / PAN Card Upload Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Upload Identity Document (Aadhaar / PAN Card) *
                  </label>
                  <div className="border border-dashed border-slate-200 hover:border-primary/50 transition-colors rounded-xl p-4 bg-slate-50 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-leaf/10 text-leaf flex items-center justify-center flex-none">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        key={`iddoc-${formResetKey}`}
                        type="file"
                        required
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => setFormIdDoc(e.target.files?.[0] || null)}
                        className="block w-full text-xs text-slate-500
                          file:mr-3 file:py-1.5 file:px-3
                          file:rounded-full file:border-0
                          file:text-xs file:font-semibold
                          file:bg-leaf/10 file:text-leaf
                          file:hover:bg-leaf/20
                          cursor-pointer file:cursor-pointer"
                      />
                      <p className="text-[9px] text-slate-400 mt-1">
                        PDF, JPG, or PNG formats. Required before submission.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-md hover:shadow-primary/20 flex items-center justify-center gap-1.5 mt-2"
                >
                  Submit Registration <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default GetInvolved;

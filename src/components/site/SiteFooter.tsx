import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  BadgeCheck,
  FileText,
  Send,
  Award,
} from "lucide-react";
import { SITE } from "@/constants/site";
import { toast } from "sonner";
import { useLanguage } from "../../context/LanguageContext";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const { t } = useLanguage();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing to our newsletter!", {
        description: `We will send updates to ${email}`,
      });
      setEmail("");
    }
  };

  const QUICK_LINKS = [
    { label: "About", to: "/about" },
    { label: "Programs", to: "/programs" },
    { label: "Gallery", to: "/gallery" },
    { label: "Team", to: "/team" },
    { label: "Success Stories", to: "/events" },
    { label: "Events", to: "/events" },
    { label: "Blog", to: "/events" },
    { label: "Transparency", to: "/transparency" },
    { label: "Contact", to: "/contact" },
  ];

  const getNavLabel = (label: string) => {
    switch (label) {
      case "About":
        return t("nav.about");
      case "Programs":
        return t("nav.programs");
      case "Gallery":
        return t("nav.gallery");
      case "Team":
        return t("nav.team");
      case "Success Stories":
        return t("nav.successStories");
      case "Events":
        return t("nav.events");
      case "Blog":
        return t("nav.blog");
      case "Transparency":
        return t("nav.transparency");
      case "Contact":
        return t("nav.contact");
      default:
        return label;
    }
  };

  const CERTIFICATIONS = [
    {
      icon: ShieldCheck,
      title: t("cert.trust"),
      desc: SITE.registrations["Trust Reg."],
      detail: t("cert.trust.desc"),
    },
    {
      icon: BadgeCheck,
      title: t("cert.darpan"),
      desc: SITE.registrations["DARPAN"],
      detail: t("cert.darpan.desc"),
    },
    {
      icon: Award,
      title: t("cert.12a"),
      desc: SITE.registrations["12A"],
      detail: t("cert.12a.desc"),
    },
    {
      icon: FileText,
      title: t("cert.80g"),
      desc: SITE.registrations["80G"],
      detail: t("cert.80g.desc"),
    },
  ];

  return (
    <footer className="bg-[#121B34] border-t border-[#29324A] text-[#A3A9BD] relative overflow-hidden transition-colors duration-300">
      {/* Luxury Subtle Glow Effects */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#3B82F6]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#22C55E]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Footer Content */}
      <div className="container-full pt-14 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Column 1: Organization */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-[#1E2A45] rounded-xl border border-[#29324A] flex-none">
                <img src={SITE.logo} alt="Logo" className="h-10 w-10 rounded-full" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold leading-tight tracking-wide">
                  {SITE.name}
                </h4>
                <p className="text-[10px] text-[#A3A9BD] font-semibold">{t("footer.location")}</p>
              </div>
            </div>

            <p className="text-[11px] text-[#A3A9BD] leading-relaxed">{t("footer.desc")}</p>

            <div className="pt-2.5 space-y-1.5 text-[10px] border-t border-[#29324A]/40">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#A3A9BD]">Trust Registration No.:</span>
                <span className="font-mono text-white font-semibold select-all">
                  F/22598/Ahmedabad
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#A3A9BD]">Society Registration No.:</span>
                <span className="font-mono text-white font-semibold select-all">
                  GUJ/23016/Ahmedabad
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#A3A9BD]">DARPAN Registration No.:</span>
                <span className="font-mono text-white font-semibold select-all">
                  {SITE.registrations["DARPAN"]}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-[#3B82F6] pl-2.5">
              {t("footer.quickLinks")}
            </h5>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs font-semibold">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="hover:text-[#3B82F6] transition-all duration-300 flex items-center gap-1 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] opacity-0 group-hover:opacity-100 transition-all duration-300 flex-none" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {getNavLabel(link.label)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Certifications */}
          <div className="lg:col-span-4">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-[#3B82F6] pl-2.5">
              {t("footer.certifications")}
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.title}
                  className="bg-[#1E2A45]/80 hover:bg-[#1E2A45] border border-[#29324A] hover:border-[#3B82F6]/40 shadow-sm hover:shadow-[0_0_12px_rgba(59,130,246,0.12)] rounded-2xl p-2.5 flex flex-col gap-1 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center flex-none group-hover:scale-105 transition-transform duration-300">
                      <cert.icon className="h-3.5 w-3.5" />
                    </div>
                    <h6 className="text-white font-bold text-[10px] uppercase tracking-wider truncate leading-tight group-hover:text-[#3B82F6] transition-colors duration-300">
                      {cert.title}
                    </h6>
                  </div>
                  <div className="mt-1">
                    <p className="text-[9px] text-[#A3A9BD]/85 font-mono truncate select-all">
                      {cert.desc}
                    </p>
                    <p className="text-[9px] text-[#A3A9BD]/55 leading-tight mt-0.5">
                      {cert.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-[#3B82F6] pl-2.5">
              {t("footer.contact")}
            </h5>
            <ul className="space-y-2 text-xs text-[#A3A9BD] font-semibold">
              <li className="flex gap-2">
                <MapPin className="h-4 w-4 text-[#3B82F6] flex-none mt-0.5" />
                <span className="leading-relaxed">{SITE.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#3B82F6] flex-none" />
                <a href={`tel:${SITE.phoneRaw}`} className="hover:text-white transition-colors">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#3B82F6] flex-none" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="hover:text-white transition-colors truncate"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            <form onSubmit={handleSubscribe} className="flex gap-1.5 pt-2">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[#1E2A45] border border-[#29324A] text-white placeholder-[#A3A9BD]/50 text-xs focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="h-9 w-9 rounded-xl bg-[#F7E81D] hover:bg-[#F7E81D]/90 text-[#121B34] flex items-center justify-center flex-none transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(247,232,29,0.25)]"
                aria-label="Subscribe"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Legal Links Strip */}
      <div className="bg-[#0F1730] border-t border-[#29324A]/60 py-3 text-[10px] font-semibold relative z-10">
        <div className="container-full flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[#A3A9BD]/70">
          <span className="text-[#A3A9BD]/40 uppercase tracking-widest text-[9px]">Legal</span>
          {[
            { label: "Privacy Policy", to: "/privacy-policy" },
            { label: "Terms & Conditions", to: "/terms-and-conditions" },
            { label: "Refund Policy", to: "/refund-policy" },
            { label: "Return Policy", to: "/return-policy" },
            { label: "Disclaimer", to: "/disclaimer" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="bg-[#0F1730] border-t border-[#29324A] py-4 text-xs font-semibold relative z-10">
        <div className="container-full flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div>
            © {new Date().getFullYear()} Uday Foundation Trust. {t("footer.copyright")}
          </div>

          {/* Center */}
          <div className="flex items-center">
            {t("footer.madeWith")}{" "}
            <span className="text-rose-500 animate-pulse mx-1 font-sans">❤️</span> {t("footer.in")}
          </div>

          {/* Right: Circular glass social icons */}
          <div className="flex items-center gap-2.5">
            {[
              {
                href: SITE.socials.instagram,
                Icon: Instagram,
                label: "Instagram",
                hoverBg: "hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]",
              },
              {
                href: SITE.socials.facebook,
                Icon: Facebook,
                label: "Facebook",
                hoverBg: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
              },
              {
                href: SITE.socials.whatsapp,
                Icon: MessageCircle,
                label: "WhatsApp",
                hoverBg: "hover:bg-[#22C55E] hover:text-white hover:border-[#22C55E]",
              },
            ].map(({ href, Icon, label, hoverBg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={`h-8 w-8 inline-flex items-center justify-center rounded-full bg-[#1E2A45]/80 border border-[#29324A] text-white/80 transition-all duration-300 backdrop-blur-sm ${hoverBg} hover:shadow-[0_0_10px_rgba(59,130,246,0.2)] hover:-translate-y-0.5`}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


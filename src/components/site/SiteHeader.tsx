import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Heart, Globe } from "lucide-react";
import { NAV_LINKS, SITE } from "@/constants/site";
import { useLanguage } from "../../context/LanguageContext";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getNavLabel = (label: string) => {
    switch (label) {
      case "Home":
        return t("nav.home");
      case "About":
        return t("nav.about");
      case "Programs":
        return t("nav.programs");
      case "Gallery":
        return t("nav.gallery");
      case "Team":
        return t("nav.team");
      case "Events":
        return t("nav.events");
      case "Get Involved":
        return t("nav.getInvolved");
      case "Contact":
        return t("nav.contact");
      default:
        return label;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "backdrop-blur-xl bg-[color-mix(in_oklab,var(--surface)_82%,transparent)] border-b border-border/60 shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="container-full flex flex-col lg:flex-row lg:items-center justify-between py-3 md:py-4 gap-2.5 lg:gap-0">
        {/* Row 1 (All Viewports): Logo & Title on Left, Hamburger Menu on Right (Mobile/Tablet only) */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <img
              src={SITE.logo}
              alt={`${SITE.name} logo`}
              className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-full ring-2 ring-primary/15 group-hover:ring-primary/35 transition-all flex-shrink-0"
              loading="eager"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-gujarati text-xs min-[350px]:text-sm lg:text-base xl:text-lg font-bold text-primary whitespace-nowrap">
                {SITE.nameGu}
              </span>
              <span className="text-[8px] min-[350px]:text-[10px] lg:text-xs uppercase tracking-[0.12em] min-[350px]:tracking-[0.18em] text-muted-foreground whitespace-nowrap">
                Uday Foundation Trust
              </span>
            </div>
          </Link>

          {/* Hamburger Menu (Visible below lg) */}
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 min-[380px]:h-11 min-[380px]:w-11 rounded-full border border-border bg-surface shrink-0 flex-shrink-0 cursor-pointer"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Center: Desktop Navigation (Desktop only) */}
        <nav className="hidden lg:flex items-center justify-center gap-1 flex-none">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${isActive
                  ? "text-primary bg-primary/10"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/8"
                }`
              }
            >
              {getNavLabel(l.label)}
            </NavLink>
          ))}
        </nav>

        {/* Row 2 (Mobile/Tablet only) / Right Side (Desktop): Language Selector & Donate Button */}
        <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-2.5 md:gap-3 mt-1.5 pt-2.5 border-t border-border/40 lg:mt-0 lg:pt-0 lg:border-none">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-white/60 hover:bg-white text-xs font-semibold transition-all select-none text-foreground shadow-xs cursor-pointer whitespace-nowrap shrink-0 flex-shrink-0"
              aria-label="Change Language"
            >
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>{language === "en" ? "EN" : language === "gu" ? "GU" : "HI"}</span>
            </button>

            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute left-0 lg:left-auto lg:right-0 mt-2 w-28 rounded-2xl bg-surface border border-border shadow-lg py-1.5 z-50 text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
                  {[
                    { code: "en", label: "English" },
                    { code: "gu", label: "ગુજરાતી" },
                    { code: "hi", label: "हिंदी" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as "en" | "gu" | "hi");
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-primary/8 transition-colors flex items-center justify-between cursor-pointer ${language === lang.code ? "text-primary bg-primary/5" : "text-muted-foreground"}`}
                    >
                      <span>{lang.label}</span>
                      {language === lang.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Donate Button */}
          <Link
            to="/donate"
            className="btn-saffron text-xs md:text-sm px-4 py-2.5 md:px-5 md:py-3 rounded-full shrink-0 whitespace-nowrap flex items-center gap-1.5 font-bold shadow-md hover:scale-105 transition-transform"
          >
            <Heart className="h-3.5 w-3.5 md:h-4 md:w-4 fill-current" /> {t("nav.donate")}
          </Link>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-surface">
          <div className="container-full py-4 flex flex-col gap-1">
            {/* Mobile Language Switcher */}
            <div className="flex gap-2 p-1.5 bg-muted/40 border border-border rounded-2xl mb-3">
              {[
                { code: "en", label: "English" },
                { code: "gu", label: "ગુજરાતી" },
                { code: "hi", label: "हिंदी" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as "en" | "gu" | "hi")}
                  className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${language === lang.code ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted"}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive
                    ? "text-primary bg-primary/10"
                    : "hover:bg-primary/8 text-foreground/80"
                  }`
                }
              >
                {getNavLabel(l.label)}
              </NavLink>
            ))}
            <Link
              to="/donate"
              onClick={() => setOpen(false)}
              className="btn-saffron mt-2 justify-center"
            >
              <Heart className="h-4 w-4" /> {t("nav.donate")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

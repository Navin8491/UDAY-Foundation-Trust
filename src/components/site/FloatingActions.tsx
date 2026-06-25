import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, ArrowUp, MessageCircle } from "lucide-react";
import { SITE } from "@/constants/site";

export function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-40 flex flex-col gap-3 items-end">
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="h-11 w-11 rounded-full bg-surface border border-border shadow-lg inline-flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <a
        href={SITE.socials.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="h-13 w-13 p-3.5 rounded-full bg-[oklch(0.7_0.18_145)] text-white shadow-xl inline-flex items-center justify-center hover:scale-110 transition-transform animate-float-soft"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <Link
        to="/donate"
        aria-label="Donate"
        className="px-5 py-3.5 rounded-full bg-secondary text-secondary-foreground font-bold shadow-xl inline-flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <Heart className="h-5 w-5 fill-current" /> Donate
      </Link>
    </div>
  );
}

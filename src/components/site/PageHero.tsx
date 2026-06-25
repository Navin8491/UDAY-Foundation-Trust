import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  bgImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop",
  breadcrumbActive,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bgImage?: string;
  breadcrumbActive?: string;
  children?: ReactNode;
}) {
  const activeLabel = breadcrumbActive || eyebrow || title;

  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center text-white py-20 px-4 overflow-hidden z-20">
      {/* Background Image & Gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={title}
          className="w-full h-full object-cover filter brightness-[0.25]"
        />
        {/* Soft overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="container-page relative z-10 text-center max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-300 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-white truncate max-w-[200px]">{activeLabel}</span>
        </nav>

        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-secondary bg-secondary/15 rounded-full mb-6 border border-secondary/20">
            <Sparkles className="h-3.5 w-3.5 text-secondary" /> {eyebrow}
          </span>
        )}

        <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight tracking-tight mb-5">
          {title}
        </h1>

        {subtitle && (
          <p className="text-base md:text-lg lg:text-xl text-slate-200 font-light leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>

      {/* Wave divider at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg className="relative block w-full h-8 md:h-12 text-slate-50 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
        </svg>
      </div>
    </section>
  );
}

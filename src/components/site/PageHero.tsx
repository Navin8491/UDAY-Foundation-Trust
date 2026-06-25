import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="hero-gradient">
      <div className="container-page pt-16 md:pt-24 pb-14 md:pb-20">
        {eyebrow && <div className="chip">{eyebrow}</div>}
        <h1 className="mt-4 text-4xl md:text-6xl font-semibold text-balance max-w-3xl leading-[1.05]">
          {title}
        </h1>
        {subtitle && <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

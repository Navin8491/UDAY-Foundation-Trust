import { Link } from "react-router-dom";
import { PageHero } from "@/components/site/PageHero";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import { Users, Heart, Building2, Handshake, Sparkles, ArrowRight } from "lucide-react";

const WAYS = [
  {
    Icon: Users,
    title: "Become a Volunteer",
    text: "Give your time, skills and heart. Join medical camps, education drives and plantation campaigns.",
    cta: "Join the team",
  },
  {
    Icon: Heart,
    title: "Become a Donor",
    text: "Every rupee is accounted for. 80G tax exemption available on all donations.",
    cta: "Donate now",
    to: "/donate",
  },
  {
    Icon: Building2,
    title: "CSR Partnership",
    text: "Companies can partner on focused projects, sponsor camps, or fund long-term programs.",
    cta: "Discuss CSR",
  },
  {
    Icon: Handshake,
    title: "Become a Sponsor",
    text: "Sponsor a school kit, a medical camp, or an entire village's plantation drive.",
    cta: "Sponsor a cause",
  },
];

export function GetInvolved() {
  useDocumentMetadata(
    "Get Involved — Volunteer, Donate, Partner | Uday Foundation Trust",
    "Become a volunteer, donor, sponsor or CSR partner with Uday Foundation Trust and make impact at scale.",
  );

  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="Service is the highest dharma. Choose yours."
        subtitle="There are many ways to walk with us. All of them change someone's life."
      />

      <section className="section-y">
        <div className="container-page grid md:grid-cols-2 gap-5">
          {WAYS.map(({ Icon, title, text, cta, to }) => (
            <article
              key={title}
              className="rounded-3xl p-8 bg-surface border border-border hover:border-primary/40 hover:shadow-xl transition-all"
            >
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary inline-flex items-center justify-center">
                <Icon className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-display font-semibold">{title}</h2>
              <p className="mt-2 text-muted-foreground">{text}</p>
              {to ? (
                <Link to={to} className="mt-6 btn-primary text-sm">
                  {cta} <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link to="/contact" className="mt-6 btn-ghost text-sm">
                  {cta} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-3xl p-10 md:p-14 bg-primary text-primary-foreground relative overflow-hidden">
          <Sparkles className="absolute top-8 right-8 h-20 w-20 opacity-10" />
          <h2 className="text-3xl md:text-5xl font-semibold text-balance max-w-2xl">
            Fundraise for a cause you love.
          </h2>
          <p className="mt-3 text-primary-foreground/80 max-w-2xl">
            Birthdays, anniversaries, milestones — turn them into life-changing campaigns. Talk to
            our team to set up your personal fundraiser.
          </p>
          <Link to="/contact" className="mt-7 btn-saffron">
            Start a fundraiser <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

export default GetInvolved;

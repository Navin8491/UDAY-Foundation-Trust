import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/constants/site";
import {
  Info, Heart, Wifi, Link2, BadgeCheck, Scale, RefreshCw, Mail,
} from "lucide-react";

const LAST_UPDATED = "July 1, 2026";

const SECTIONS = [
  {
    id: "general",
    Icon: Info,
    title: "General Disclaimer",
    paras: [
      `The information contained on this website of ${SITE.name} ("the website") is provided in good faith for general informational and awareness purposes only.`,
      "While we make every reasonable effort to keep the information on this website accurate, current, and complete, we make no representations or warranties of any kind — express or implied — about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on it.",
      "Any reliance you place on such information is therefore strictly at your own risk.",
    ],
  },
  {
    id: "good-faith",
    Icon: Heart,
    title: "Information Provided in Good Faith",
    paras: [
      "All content published on this website — including program descriptions, impact statistics, beneficiary information, event details, team profiles, and certification data — is provided in good faith and reflects our best knowledge at the time of publication.",
      "• Program impact figures (number of beneficiaries, trees planted, medical camps conducted, etc.) are based on field data collected by our volunteers and staff.",
      "• Certification and registration details are provided for transparency purposes. We recommend verifying critical information with the relevant government authority.",
      "• Testimonials and success stories published on our website are genuine and have been shared with the consent of the individuals concerned.",
      "We strive to ensure the accuracy of all information but acknowledge that factual circumstances can change and our website may not always reflect the most current status.",
    ],
  },
  {
    id: "service-interruptions",
    Icon: Wifi,
    title: "Service Interruptions",
    paras: [
      `${SITE.name} will not be liable for the website being temporarily unavailable due to technical issues beyond our reasonable control.`,
      "• Planned or unplanned maintenance may occasionally cause the website to be unavailable.",
      "• Third-party services (payment gateways, database providers, cloud storage, SMTP services) may independently experience outages.",
      "• Internet connectivity issues on the user's side are outside our control.",
      "• We are not responsible for any loss or damage arising from the temporary unavailability of this website or its services.",
      "In the event of extended downtime, we will make reasonable efforts to communicate via our official social media channels.",
    ],
  },
  {
    id: "external-links",
    Icon: Link2,
    title: "External Links",
    paras: [
      "Our website may contain links to external websites, including government portals, partner organisations, social media platforms, and other third-party resources.",
      "• These external links are provided for your convenience and informational purposes only.",
      "• Uday Foundation Trust does not exercise control over the content, privacy practices, or policies of external websites.",
      "• The inclusion of any external link does not imply endorsement, sponsorship, or affiliation with the linked site.",
      "• We are not responsible for any content, accuracy, or services found on externally linked websites.",
      "We encourage you to review the privacy policy and terms of use of any external website you visit from links on our site.",
    ],
  },
  {
    id: "donation-verification",
    Icon: BadgeCheck,
    title: "Donation Information",
    paras: [
      "All donation-related information displayed on this website is subject to verification and applicable legal and regulatory requirements.",
      "• Donation receipt amounts and 80G certificate eligibility are based on the information provided by donors at the time of transaction.",
      "• Tax deduction eligibility under Section 80G of the Income Tax Act, 1961, is subject to the conditions and limits stipulated by the Government of India and may change without notice.",
      "• We strongly recommend consulting a qualified tax advisor for advice specific to your individual tax situation.",
      "• Any representation of fund utilisation is based on our current operational plans and is subject to change based on program needs, regulations, or unforeseen circumstances.",
    ],
  },
  {
    id: "legal-disclaimer",
    Icon: Scale,
    title: "Legal Disclaimer",
    paras: [
      "Nothing on this website constitutes legal, financial, medical, or professional advice of any kind.",
      "• Our content is for informational and awareness purposes only and should not be relied upon as a substitute for professional advice.",
      "• Uday Foundation Trust, its trustees, directors, staff, and volunteers shall not be liable for any loss, injury, or damage of any nature arising from the use of information presented on this website.",
      "• We reserve the right to make changes to our website, policies, programs, and information at any time without prior notice.",
      "• This disclaimer shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts of Ahmedabad, Gujarat.",
    ],
  },
  {
    id: "updates",
    Icon: RefreshCw,
    title: "Updates to This Disclaimer",
    paras: [
      "We may update this Disclaimer from time to time to reflect changes in our practices, legal requirements, or operational context.",
      "• Updated versions will be posted on this page with a revised 'Last Updated' date.",
      "• Continued use of our website following the posting of any changes constitutes acceptance of those changes.",
      "We encourage you to review this page periodically.",
    ],
  },
  {
    id: "contact",
    Icon: Mail,
    title: "Contact Us",
    paras: [
      "If you have any concerns about information on our website or this Disclaimer, please contact us:",
      `• <strong>Organisation:</strong> ${SITE.name}`,
      `• <strong>Email:</strong> ${SITE.email}`,
      `• <strong>Phone:</strong> ${SITE.phone}`,
      `• <strong>Address:</strong> ${SITE.address}`,
    ],
  },
];

export function Disclaimer() {
  useDocumentMetadata(
    "Disclaimer | Uday Foundation Trust",
    "Read the Disclaimer for Uday Foundation Trust's website. Information is provided in good faith. We are not liable for service interruptions, external links, or reliance on website content."
  );

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Disclaimer"
        subtitle="Information on this website is provided in good faith for awareness purposes. Please read this disclaimer carefully."
        bgImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1600&auto=format&fit=crop"
        breadcrumbActive="Disclaimer"
      />

      <section className="section-y">
        <div className="container-page max-w-4xl">
          {/* Intro Banner */}
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 mb-10">
            <p className="text-sm text-muted-foreground leading-relaxed">
              This Disclaimer applies to the website of <strong>{SITE.name}</strong>. By continuing
              to use our website, you accept this Disclaimer in full. If you disagree with any part
              of this Disclaimer, please do not use our website.
            </p>
            <p className="text-xs text-muted-foreground mt-3 font-semibold">
              Last Updated: {LAST_UPDATED}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {SECTIONS.map((section, idx) => (
              <div
                key={section.id}
                id={section.id}
                className="rounded-2xl bg-surface border border-border p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-none">
                    <section.Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-display font-semibold">
                    {idx + 1}. {section.title}
                  </h2>
                </div>
                <div className="space-y-2.5 text-sm text-muted-foreground leading-relaxed">
                  {section.paras.map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-10 rounded-2xl bg-surface-warm border border-border p-5 text-center">
            <p className="text-sm text-muted-foreground">
              This Disclaimer is governed by the laws of India. Any disputes shall be subject to
              the exclusive jurisdiction of the courts of Ahmedabad, Gujarat.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Disclaimer;

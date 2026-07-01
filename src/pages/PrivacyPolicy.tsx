import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/constants/site";
import { Shield, Eye, Database, Cookie, Link2, Lock, Baby, UserCog, Mail, RefreshCw } from "lucide-react";

const LAST_UPDATED = "July 1, 2026";

const SECTIONS = [
  {
    id: "information-we-collect",
    Icon: Database,
    title: "Information We Collect",
    paras: [
      "When you interact with our website, we may collect the following types of personal information:",
      "• <strong>Volunteer Applications:</strong> Name, email, phone, date of birth, gender, address, city, state, pincode, occupation, education, skills, languages, availability, emergency contact, and uploaded documents (ID proof, photograph, resume).",
      "• <strong>Contact Enquiries:</strong> Name, email, phone, subject, and message content.",
      "• <strong>Partnership Requests:</strong> Organisation name, contact person, email, phone, website, organisation type, address, and proposal documents.",
      "• <strong>Donation Transactions:</strong> Donor name, email, phone, address, PAN number (as required under Indian tax law), donation amount, and purpose.",
      "• <strong>Newsletter Subscriptions:</strong> Email address only.",
      "• <strong>Automatically Collected Data:</strong> IP address, browser type, device type, operating system, pages visited, time spent, and referral source.",
    ],
  },
  {
    id: "how-we-use-information",
    Icon: Eye,
    title: "How We Use Your Information",
    paras: [
      "We use the information collected for the following purposes:",
      "• To process volunteer applications, partnership enquiries, and donation transactions.",
      "• To send confirmation emails, application status updates, donation receipts, and notifications.",
      "• To issue donation receipts and tax exemption certificates under Section 80G of the Income Tax Act, 1961.",
      "• To communicate important updates, events, and campaigns related to our programs.",
      "• To improve our website experience based on usage patterns.",
      "• To comply with applicable Indian laws and regulatory requirements.",
      "• To verify identities, prevent fraud, and ensure the security of our systems.",
      "We do not sell, rent, or trade your personal information to third parties for commercial purposes.",
    ],
  },
  {
    id: "donation-information",
    Icon: Shield,
    title: "Donation Information",
    paras: [
      "All donations processed through our website are handled with the highest standards of security and confidentiality.",
      "• Donation transactions are processed through a secure, PCI-DSS compliant payment gateway.",
      "• Your payment card details are never stored on our servers.",
      "• PAN numbers collected are used solely for issuing 80G tax exemption certificates.",
      "• Donor information is used internally for record-keeping, legal compliance, and issuing receipts.",
      "• We retain donation records for a minimum of 7 years as required under Indian accounting and tax laws.",
      `• Donors may request a copy of their donation records by contacting us at ${SITE.email}.`,
    ],
  },
  {
    id: "cookies",
    Icon: Cookie,
    title: "Cookies",
    paras: [
      "Our website uses cookies and similar tracking technologies to enhance your browsing experience.",
      "• <strong>Essential Cookies:</strong> Required for the website to function correctly (e.g., session management).",
      "• <strong>Analytics Cookies:</strong> Used to understand how visitors interact with our website. We use anonymised analytics data only.",
      "• <strong>Preference Cookies:</strong> Remember your language preference (English / Gujarati / Hindi) between sessions.",
      "You may configure your browser to refuse cookies. However, some parts of the website may not function correctly if cookies are disabled.",
    ],
  },
  {
    id: "third-party-services",
    Icon: Link2,
    title: "Third-Party Services",
    paras: [
      "We use the following trusted third-party services that may process your data:",
      "• <strong>Payment Gateway:</strong> For processing donation transactions securely.",
      "• <strong>Supabase:</strong> For secure database storage and real-time data synchronisation.",
      "• <strong>Cloudinary:</strong> For secure storage and delivery of uploaded documents and images.",
      "• <strong>SMTP Email Provider:</strong> For sending transactional emails and notifications.",
      "Each of these services has its own privacy policy. We are not responsible for their data practices, but we ensure they meet adequate data protection standards.",
      "Our website may also contain links to external websites. We are not responsible for the privacy practices or content of those external sites.",
    ],
  },
  {
    id: "data-security",
    Icon: Lock,
    title: "Data Security",
    paras: [
      "We take appropriate technical and organisational measures to protect your personal information:",
      "• All data is transmitted using industry-standard SSL/TLS encryption.",
      "• Admin access is protected by JWT-based authentication with role-based access control.",
      "• Uploaded documents are stored in secured cloud storage with restricted access.",
      "• We conduct regular reviews of our security practices.",
      "While we strive to protect your personal data, no method of internet transmission is 100% secure. We will notify affected users in the event of a data breach as required by applicable law.",
    ],
  },
  {
    id: "childrens-privacy",
    Icon: Baby,
    title: "Children's Privacy",
    paras: [
      "Our website and services are not directed at children under the age of 18.",
      "• We do not knowingly collect personal information from children under 18.",
      "• Volunteer applications from individuals under 18 must be accompanied by parental or guardian consent.",
      `• If we become aware that we have collected personal data from a child under 18 without parental consent, we will promptly delete that information. Contact us at ${SITE.email} if you believe this has occurred.`,
    ],
  },
  {
    id: "your-rights",
    Icon: UserCog,
    title: "Your Rights",
    paras: [
      "You have the following rights regarding your personal information:",
      "• <strong>Right to Access:</strong> Request a copy of the personal data we hold about you.",
      "• <strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data.",
      "• <strong>Right to Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements.",
      "• <strong>Right to Withdraw Consent:</strong> Where processing is based on your consent, you may withdraw it at any time.",
      "• <strong>Right to Object:</strong> Object to the processing of your data for marketing communications.",
      `To exercise any of these rights, please contact us at ${SITE.email}. We will respond within 30 days.`,
    ],
  },
  {
    id: "contact",
    Icon: Mail,
    title: "Contact Information",
    paras: [
      "If you have any questions or concerns regarding this Privacy Policy, please contact us:",
      `• <strong>Organisation:</strong> ${SITE.name}`,
      `• <strong>Email:</strong> ${SITE.email}`,
      `• <strong>Phone:</strong> ${SITE.phone}`,
      `• <strong>Address:</strong> ${SITE.address}`,
      "We aim to respond to all privacy-related enquiries within 7 working days.",
    ],
  },
  {
    id: "policy-updates",
    Icon: RefreshCw,
    title: "Policy Updates",
    paras: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.",
      "• We will post the updated policy on this page with a revised 'Last Updated' date.",
      "• For significant changes, we will notify you via email or a prominent notice on our website.",
      "• Continued use of our website after changes constitutes acceptance of the updated Privacy Policy.",
      "We encourage you to review this page periodically.",
    ],
  },
];

export function PrivacyPolicy() {
  useDocumentMetadata(
    "Privacy Policy | Uday Foundation Trust",
    "Learn how Uday Foundation Trust collects, uses, and protects your personal information. Privacy policy for donors, volunteers, and partners."
  );

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="We are committed to protecting your privacy and handling your personal data with transparency and care."
        bgImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1600&auto=format&fit=crop"
        breadcrumbActive="Privacy Policy"
      />

      <section className="section-y">
        <div className="container-page max-w-4xl">
          {/* Intro Banner */}
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 mb-10">
            <p className="text-sm text-muted-foreground leading-relaxed">
              This Privacy Policy describes how <strong>{SITE.name}</strong> ("we", "our", or "us")
              collects, uses, stores, and protects personal information when you use our website.
              By using our website, you agree to the practices described in this policy.
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

          {/* Governing Law Note */}
          <div className="mt-10 rounded-2xl bg-surface-warm border border-border p-5 text-center">
            <p className="text-sm text-muted-foreground">
              This Privacy Policy is governed by the laws of India. For any disputes, the courts of
              Ahmedabad, Gujarat shall have exclusive jurisdiction.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default PrivacyPolicy;

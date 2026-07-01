import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/constants/site";
import {
  FileCheck, Globe, Heart, Users, Handshake, BookOpen,
  AlertTriangle, Scale, Phone, CheckCircle,
} from "lucide-react";

const LAST_UPDATED = "July 1, 2026";

const SECTIONS = [
  {
    id: "acceptance",
    Icon: CheckCircle,
    title: "Acceptance of Terms",
    paras: [
      `By accessing or using the website of ${SITE.name} ("Uday Foundation Trust", "we", "our", or "us"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access the website.`,
      "These Terms and Conditions apply to all visitors, users, donors, volunteers, partners, and others who access or use our website.",
      "We reserve the right to modify these terms at any time. Changes are effective immediately upon posting. Your continued use of the website constitutes acceptance of any updated terms.",
    ],
  },
  {
    id: "website-usage",
    Icon: Globe,
    title: "Website Usage",
    paras: [
      "By using our website, you agree that you will:",
      "• Not use the website for any unlawful purpose or in violation of any applicable laws or regulations.",
      "• Not attempt to gain unauthorised access to any part of the website, its servers, or any connected systems.",
      "• Not transmit any harmful, offensive, defamatory, or otherwise objectionable content.",
      "• Not use automated tools, bots, or scrapers to access or collect data from our website without prior written permission.",
      "• Not impersonate any person, organisation, or entity, including Uday Foundation Trust staff.",
      "• Not engage in any conduct that disrupts or interferes with the normal operation of the website.",
      "We reserve the right to terminate access to our website for any user who violates these usage terms.",
    ],
  },
  {
    id: "donations",
    Icon: Heart,
    title: "Donations",
    paras: [
      "When making a donation through our website, you acknowledge and agree to the following:",
      "• All donations are voluntary contributions to Uday Foundation Trust, a registered non-profit organisation in India.",
      "• Donations are processed through a secure, third-party payment gateway. By completing a donation, you agree to that payment processor's terms and conditions.",
      "• Uday Foundation Trust is registered under Section 12A and 80G of the Income Tax Act, 1961. Eligible donations may qualify for tax deductions under applicable Indian tax laws.",
      "• Donation receipts and 80G certificates will be issued to the email address provided at the time of donation.",
      `• For queries related to donations, please contact us at ${SITE.email}.`,
      "• Please refer to our Refund Policy for information about refund requests on donations.",
    ],
  },
  {
    id: "volunteer-applications",
    Icon: Users,
    title: "Volunteer Applications",
    paras: [
      "When you submit a volunteer application through our website, you agree to the following:",
      "• All information provided in your application must be accurate, truthful, and complete.",
      "• Uploading fraudulent, forged, or misleading documents (including identity proof) is strictly prohibited and may result in legal action.",
      "• Submission of an application does not guarantee acceptance as a volunteer.",
      "• If your application is approved, you agree to abide by the code of conduct, guidelines, and policies of Uday Foundation Trust.",
      "• Uday Foundation Trust reserves the right to reject any application without providing a reason.",
      "• Volunteers under 18 years of age must have written consent from a parent or legal guardian.",
    ],
  },
  {
    id: "partnership-applications",
    Icon: Handshake,
    title: "Partnership Applications",
    paras: [
      "When you submit a partnership or collaboration request through our website, you agree to the following:",
      "• All information provided must be accurate and represent your organisation truthfully.",
      "• Submission of a partnership request does not create a binding partnership agreement.",
      "• Any formal partnership will be subject to a separate written agreement signed by authorised representatives of both parties.",
      "• Uday Foundation Trust reserves the right to accept or decline any partnership request at its sole discretion.",
      "• Documents submitted as part of a partnership application will be treated confidentially.",
    ],
  },
  {
    id: "intellectual-property",
    Icon: BookOpen,
    title: "Intellectual Property",
    paras: [
      "All content on this website, including but not limited to text, graphics, images, logos, icons, audio clips, and software, is the property of Uday Foundation Trust or its content suppliers and is protected by applicable Indian and international copyright laws.",
      "• You may not reproduce, distribute, display, publish, or create derivative works from any content on this website without prior written permission from Uday Foundation Trust.",
      `• To request permission to use our content, please contact us at ${SITE.email}.`,
      "• The Uday Foundation Trust name, logo, and related marks are trademarks of the organisation and may not be used without prior written consent.",
      "• Limited, non-commercial use of our content for educational or awareness purposes is permitted, provided proper attribution is given.",
    ],
  },
  {
    id: "user-responsibilities",
    Icon: AlertTriangle,
    title: "User Responsibilities",
    paras: [
      "As a user of our website, you are responsible for:",
      "• Ensuring that any information you provide is accurate, current, and complete.",
      "• Maintaining the confidentiality of any login credentials (if applicable) and notifying us immediately of any unauthorised use.",
      "• The legality and accuracy of documents you upload (ID proofs, proposal documents, etc.).",
      "• Your conduct while interacting with our organisation, its staff, and other volunteers.",
      "• Obtaining any necessary permissions before sharing Uday Foundation Trust content on third-party platforms.",
    ],
  },
  {
    id: "limitation-of-liability",
    Icon: Scale,
    title: "Limitation of Liability",
    paras: [
      "To the fullest extent permitted by applicable law, Uday Foundation Trust shall not be liable for:",
      "• Any direct, indirect, incidental, consequential, or punitive damages arising from your use of or inability to use this website.",
      "• Errors, omissions, interruptions, deletions, defects, or delays in operation of this website.",
      "• Unauthorised access to or alteration of your transmissions or data.",
      "• Any content posted by third parties on platforms we do not control.",
      "• Technical failures, server downtime, or security breaches beyond our reasonable control.",
      "Our website is provided 'as is' and 'as available' without any warranties, express or implied.",
    ],
  },
  {
    id: "governing-law",
    Icon: FileCheck,
    title: "Governing Law",
    paras: [
      "These Terms and Conditions shall be governed by and construed in accordance with the laws of India.",
      "• Any disputes arising from the use of this website or these terms shall be subject to the exclusive jurisdiction of the courts of Ahmedabad, Gujarat, India.",
      "• If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable.",
      "• Our failure to enforce any right or provision of these terms shall not constitute a waiver of those rights.",
    ],
  },
  {
    id: "contact",
    Icon: Phone,
    title: "Contact Information",
    paras: [
      "If you have any questions about these Terms and Conditions, please contact us:",
      `• <strong>Organisation:</strong> ${SITE.name}`,
      `• <strong>Email:</strong> ${SITE.email}`,
      `• <strong>Phone:</strong> ${SITE.phone}`,
      `• <strong>Address:</strong> ${SITE.address}`,
    ],
  },
];

export function TermsAndConditions() {
  useDocumentMetadata(
    "Terms & Conditions | Uday Foundation Trust",
    "Read the Terms and Conditions governing the use of Uday Foundation Trust's website, donation services, volunteer applications, and partnership enquiries."
  );

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our website or availing our services."
        bgImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1600&auto=format&fit=crop"
        breadcrumbActive="Terms & Conditions"
      />

      <section className="section-y">
        <div className="container-page max-w-4xl">
          {/* Intro Banner */}
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 mb-10">
            <p className="text-sm text-muted-foreground leading-relaxed">
              These Terms and Conditions ("Terms") govern your access to and use of the website and
              services of <strong>{SITE.name}</strong>. By accessing our website, you confirm that
              you have read, understood, and agree to these Terms.
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
              These Terms and Conditions were last updated on {LAST_UPDATED} and are effective immediately.
              Continued use of our website constitutes acceptance of these terms.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default TermsAndConditions;

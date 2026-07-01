import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/constants/site";
import { PackageX, ShieldCheck, HeartHandshake, Mail, Info } from "lucide-react";

const LAST_UPDATED = "July 1, 2026";

const SECTIONS = [
  {
    id: "no-products",
    Icon: PackageX,
    title: "No Physical Products Sold",
    paras: [
      `${SITE.name} is a registered non-profit charitable organisation. We do not sell, supply, or deliver any physical goods, merchandise, or tangible products through our website.`,
      "All transactions processed through our website relate exclusively to:",
      "• Voluntary monetary donations to support our charitable programs.",
      "• Volunteer application submissions (which are free of charge and involve no product transaction).",
      "• Partnership and collaboration enquiries (which are free of charge and involve no product transaction).",
      "Since we do not sell physical products of any kind, the concept of 'returns' as understood in a commercial or e-commerce context does not apply to our organisation.",
    ],
  },
  {
    id: "not-applicable",
    Icon: ShieldCheck,
    title: "Returns Are Not Applicable",
    paras: [
      "This Return Policy exists solely for the purpose of legal compliance and to meet the requirements of payment gateway providers and applicable regulatory frameworks.",
      "• <strong>No goods are shipped:</strong> We do not dispatch any physical items, packages, or products to donors or users.",
      "• <strong>No returns to process:</strong> Since no products are sold or delivered, there is nothing to return.",
      "• <strong>No return address required:</strong> No physical returns are accepted or expected.",
      "• <strong>Donation-based only:</strong> The only financial transactions on this website are charitable donations.",
      "This document is published transparently to confirm and clarify the nature of our organisation's operations.",
    ],
  },
  {
    id: "donations-and-services",
    Icon: HeartHandshake,
    title: "Concerns Related to Donations or Services",
    paras: [
      "If you have any concerns about a donation transaction or the services/programs of Uday Foundation Trust, please refer to the following resources:",
      "• <strong>Donation Refunds:</strong> Please refer to our Refund Policy for information on how refund requests for erroneous or duplicate donation transactions are handled.",
      "• <strong>Volunteer Applications:</strong> If you have submitted a volunteer application and wish to withdraw it, please contact us directly and we will process the withdrawal.",
      "• <strong>General Concerns:</strong> For any concerns related to how your donation funds are used, you may request a copy of our financial reports or annual audit by contacting us.",
      `• <strong>Contact:</strong> All concerns and queries should be directed to ${SITE.email}.`,
    ],
  },
  {
    id: "contact",
    Icon: Mail,
    title: "Contact Us",
    paras: [
      "If you have any questions about this Return Policy or require clarification on any aspect of our transactions, please contact us:",
      `• <strong>Organisation:</strong> ${SITE.name}`,
      `• <strong>Email:</strong> ${SITE.email}`,
      `• <strong>Phone:</strong> ${SITE.phone}`,
      `• <strong>Address:</strong> ${SITE.address}`,
      "We are committed to transparency and will respond to all enquiries within 3–5 working days.",
    ],
  },
];

export function ReturnPolicy() {
  useDocumentMetadata(
    "Return Policy | Uday Foundation Trust",
    "Uday Foundation Trust does not sell physical products. This Return Policy exists for legal compliance. Read our policy on donation-based transactions and how to resolve any concerns."
  );

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Return Policy"
        subtitle="We are a donation-based NGO. No physical products are sold. This policy exists for legal compliance and payment gateway requirements."
        bgImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1600&auto=format&fit=crop"
        breadcrumbActive="Return Policy"
      />

      <section className="section-y">
        <div className="container-page max-w-4xl">
          {/* Info Banner */}
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 mb-10">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary flex-none mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Important Information</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong>{SITE.name}</strong> is a registered non-profit charitable organisation.
                  We do <strong>not</strong> sell any physical products, goods, or merchandise.
                  This Return Policy is published solely for legal compliance and payment gateway
                  requirements. There are <strong>no returns to process</strong>.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 font-semibold">
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
              This Return Policy is governed by the laws of India. For donation-related concerns,
              please refer to our{" "}
              <a href="/refund-policy" className="text-primary hover:underline font-semibold">
                Refund Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default ReturnPolicy;

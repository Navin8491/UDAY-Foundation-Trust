import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/constants/site";
import { RefreshCw, Heart, AlertCircle, Clock, CreditCard, Mail, CheckCircle2 } from "lucide-react";

const LAST_UPDATED = "July 1, 2026";

const SECTIONS = [
  {
    id: "overview",
    Icon: Heart,
    title: "Overview",
    paras: [
      `${SITE.name} is a registered non-profit charitable organisation operating under the Income Tax Act, 1961 (Sections 12A and 80G). All donations made to our organisation are voluntary contributions intended to support our charitable programs and activities.`,
      "This Refund Policy governs all donation transactions processed through our website. Please read this policy carefully before making a donation.",
      "By making a donation through our website, you acknowledge and agree to this Refund Policy.",
    ],
  },
  {
    id: "non-refundable-donations",
    Icon: CheckCircle2,
    title: "General Policy — Donations Are Non-Refundable",
    paras: [
      "As a general rule, all donations made to Uday Foundation Trust are voluntary, non-refundable, and non-transferable.",
      "This policy exists because:",
      "• Donations are immediately committed to our programs — healthcare camps, education drives, environment initiatives, and community welfare activities.",
      "• Operating costs are incurred as soon as funds are committed.",
      "• We issue tax exemption certificates (80G) upon receipt of donations, which cannot be revoked once issued.",
      "We strongly encourage donors to review the purpose of their donation before completing a transaction.",
    ],
  },
  {
    id: "exceptional-circumstances",
    Icon: AlertCircle,
    title: "Exceptional Circumstances — When Refunds May Apply",
    paras: [
      "Notwithstanding our general non-refund policy, we may consider a refund request in the following exceptional circumstances:",
      "• <strong>Duplicate Transactions:</strong> If a donation is processed more than once due to a technical error (e.g., payment gateway timeout or double-click).",
      "• <strong>Incorrect Amount:</strong> If an amount significantly different from the intended donation amount is charged due to a technical error.",
      "• <strong>Unauthorised Transaction:</strong> If you believe your payment information was used without your authorisation to make a donation.",
      "• <strong>Failed but Charged:</strong> If your payment was debited but the transaction was not recorded as successful in our system.",
      "Refund decisions in all cases are at the sole discretion of Uday Foundation Trust. We reserve the right to request supporting documentation.",
    ],
  },
  {
    id: "request-window",
    Icon: Clock,
    title: "Refund Request Window",
    paras: [
      "Refund requests must be submitted within <strong>7 calendar days</strong> from the date of the donation transaction.",
      "• Requests submitted after the 7-day window will not be entertained under any circumstances.",
      "• The date of the transaction (as per payment gateway records) shall be considered the starting date for this window.",
      "• We strongly advise donors to check their bank statement or email confirmation immediately after donating and to contact us promptly if any discrepancy is noticed.",
    ],
  },
  {
    id: "refund-process",
    Icon: RefreshCw,
    title: "Refund Process",
    paras: [
      "If your refund request is approved, the following process will apply:",
      "• Approved refunds will be processed to the <strong>original payment method</strong> (credit card, debit card, UPI, or net banking) used for the donation.",
      "• Refunds typically take <strong>7–14 business days</strong> to reflect in your account, depending on your bank or payment provider.",
      "• Cash refunds are not issued under any circumstances.",
      "• Any payment gateway processing fees or transaction charges are non-refundable.",
      "• Once an 80G tax exemption certificate has been issued for a donation, the refund process may require additional steps including surrender of the certificate.",
      "• We will communicate the outcome of your refund request to the email address used during the original transaction.",
    ],
  },
  {
    id: "how-to-request",
    Icon: CreditCard,
    title: "How to Request a Refund",
    paras: [
      "To initiate a refund request, please contact us within 7 days of your transaction with the following details:",
      "• Full name of the donor",
      "• Email address used for the donation",
      "• Date of transaction",
      "• Amount donated",
      "• Transaction ID or payment reference number (available in your confirmation email or bank statement)",
      "• Reason for refund request",
      "• Any supporting documentation (screenshots, bank statements, etc.)",
      `Please send your refund request to: <strong>${SITE.email}</strong> with the subject line: <em>"Refund Request – [Your Name] – [Transaction ID]"</em>`,
    ],
  },
  {
    id: "contact",
    Icon: Mail,
    title: "Contact Us",
    paras: [
      "For any questions or concerns regarding this Refund Policy or a specific donation transaction, please reach out to us:",
      `• <strong>Email:</strong> ${SITE.email}`,
      `• <strong>Phone:</strong> ${SITE.phone}`,
      `• <strong>Address:</strong> ${SITE.address}`,
      "Our team will respond to all refund-related queries within 3–5 working days.",
    ],
  },
];

export function RefundPolicy() {
  useDocumentMetadata(
    "Refund Policy | Uday Foundation Trust",
    "Read Uday Foundation Trust's refund policy for donations. Understand when refunds may apply, how to request a refund, and the refund processing timeline."
  );

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Refund Policy"
        subtitle="Our refund policy for donations — transparent, fair, and aligned with our commitment to donor trust."
        bgImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1600&auto=format&fit=crop"
        breadcrumbActive="Refund Policy"
      />

      <section className="section-y">
        <div className="container-page max-w-4xl">
          {/* Important Notice Banner */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 mb-10">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-none mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Important Notice</p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Donations to Uday Foundation Trust are generally voluntary and non-refundable.
                  Refunds are only considered in exceptional circumstances such as duplicate transactions,
                  technical errors, or unauthorised payments — and must be requested within{" "}
                  <strong>7 days</strong> of the transaction.
                </p>
              </div>
            </div>
            <p className="text-xs text-amber-600 font-semibold mt-4">
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
              This Refund Policy is governed by the laws of India. Uday Foundation Trust reserves
              the right to amend this policy at any time without prior notice.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default RefundPolicy;

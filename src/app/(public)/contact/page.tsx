import ContactView from "@/views/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Uday Foundation Trust — Sanand, Gujarat",
  description:
    "Get in touch with Uday Foundation Trust. Reach us at udayfts1024@gmail.com or call +91 96246 68484. Located at 314, Ambedkar Nagar, Sanand, Ahmedabad – 382110.",
  openGraph: {
    title: "Contact Uday Foundation Trust — Sanand, Gujarat",
    description:
      "Contact our team for volunteering, partnerships, donations, or any queries. We are based in Sanand, Ahmedabad, Gujarat.",
    url: "https://www.udayfoundationstrust.org/contact",
    type: "website",
  },
};

export default function ContactPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.udayfoundationstrust.org/" },
      { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://www.udayfoundationstrust.org/contact" },
    ],
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "url": "https://www.udayfoundationstrust.org/contact",
    "name": "Contact Uday Foundation Trust",
    "description": "Contact Uday Foundation Trust for volunteering, partnerships, or donations.",
    "mainEntity": { "@id": "https://www.udayfoundationstrust.org/#organization" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <ContactView />
    </>
  );
}

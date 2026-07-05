import TransparencyView from "@/views/Transparency";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparency | Uday Foundation Trust — Financial Reports & Certifications",
  description:
    "View Uday Foundation Trust's financial reports, 80G & 12A certifications, DARPAN registration, and annual accounts. We are committed to 100% transparency in all our operations.",
  openGraph: {
    title: "Transparency — Uday Foundation Trust",
    description:
      "100% transparent NGO. View our 80G, 12A, DARPAN, PAN certifications and annual financial reports.",
    url: "https://www.udayfoundationstrust.org/transparency",
    type: "website",
  },
};

export default function TransparencyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.udayfoundationstrust.org/" },
      { "@type": "ListItem", "position": 2, "name": "Transparency", "item": "https://www.udayfoundationstrust.org/transparency" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <TransparencyView />
    </>
  );
}

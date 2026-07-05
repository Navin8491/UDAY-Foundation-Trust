import DonateView from "@/views/Donate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate | Support Rural Gujarat — Uday Foundation Trust",
  description:
    "Donate to Uday Foundation Trust and help transform lives in 120+ villages across Gujarat. Your contribution funds education, healthcare, and humanitarian relief. Tax exemption under 80G available.",
  openGraph: {
    title: "Donate to Uday Foundation Trust — Help Rural Gujarat",
    description:
      "Every rupee you donate goes directly to education, healthcare, and humanitarian relief across rural Gujarat. 80G tax exemption available.",
    url: "https://www.udayfoundationstrust.org/donate",
    type: "website",
  },
};

export default function DonatePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.udayfoundationstrust.org/" },
      { "@type": "ListItem", "position": 2, "name": "Donate", "item": "https://www.udayfoundationstrust.org/donate" },
    ],
  };

  const donateSchema = {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    "agent": { "@id": "https://www.udayfoundationstrust.org/#organization" },
    "name": "Donate to Uday Foundation Trust",
    "url": "https://www.udayfoundationstrust.org/donate",
    "description": "Support education, healthcare, and rural development in Gujarat. 80G tax exemption under AABTU5153HF20261.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donateSchema) }} />
      <DonateView />
    </>
  );
}

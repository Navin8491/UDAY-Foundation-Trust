import dynamic from "next/dynamic";
import { PageSkeleton } from "@/components/site/Skeleton";
import { Metadata } from "next";

const AboutView = dynamic(() => import("@/views/About"), {
  loading: () => <PageSkeleton />,
});

export const metadata: Metadata = {
  title: "About Us | Uday Foundation Trust — NGO in Sanand, Gujarat",
  description:
    "Learn about Uday Foundation Trust — a registered NGO in Sanand, Gujarat serving 120+ villages through education, healthcare, women empowerment, and humanitarian aid since 2024.",
  openGraph: {
    title: "About Uday Foundation Trust — NGO in Sanand, Gujarat",
    description:
      "Discover our mission, vision, and the communities we serve across rural Gujarat. Registered under Trust Reg. F/22598 & DARPAN GJ/2026/0930211.",
    url: "https://www.udayfoundationstrust.org/about",
    type: "website",
  },
};

export default function AboutPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.udayfoundationstrust.org/" },
      { "@type": "ListItem", "position": 2, "name": "About", "item": "https://www.udayfoundationstrust.org/about" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutView />
    </>
  );
}

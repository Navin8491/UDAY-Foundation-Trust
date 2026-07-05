import ProgramsView from "@/views/Programs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Programs | Education, Healthcare & More — Uday Foundation Trust",
  description:
    "Explore Uday Foundation Trust's community programs including free education, healthcare camps, women empowerment, environmental sustainability, and disaster relief across 120+ villages in Gujarat.",
  openGraph: {
    title: "Our Programs — Uday Foundation Trust",
    description:
      "From free education and healthcare camps to women empowerment and disaster relief — discover how Uday Foundation Trust is transforming rural Gujarat.",
    url: "https://www.udayfoundationstrust.org/programs",
    type: "website",
  },
};

export default function ProgramsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.udayfoundationstrust.org/" },
      { "@type": "ListItem", "position": 2, "name": "Programs", "item": "https://www.udayfoundationstrust.org/programs" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ProgramsView />
    </>
  );
}

import TeamView from "@/views/Team";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team | Uday Foundation Trust — Dedicated Volunteers & Leaders",
  description:
    "Meet the passionate team behind Uday Foundation Trust — dedicated volunteers, community leaders, and professionals working together to uplift rural Gujarat.",
  openGraph: {
    title: "Our Team — Uday Foundation Trust",
    description:
      "The people powering change in Gujarat's rural communities. Meet our volunteers, leaders, and dedicated team members.",
    url: "https://www.udayfoundationstrust.org/team",
    type: "website",
  },
};

export default function TeamPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.udayfoundationstrust.org/" },
      { "@type": "ListItem", "position": 2, "name": "Team", "item": "https://www.udayfoundationstrust.org/team" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <TeamView />
    </>
  );
}

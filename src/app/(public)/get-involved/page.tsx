import dynamic from "next/dynamic";
import { PageSkeleton } from "@/components/site/Skeleton";
import { Metadata } from "next";

const GetInvolvedView = dynamic(() => import("@/views/GetInvolved"), {
  loading: () => <PageSkeleton />,
});

export const metadata: Metadata = {
  title: "Get Involved | Volunteer with Uday Foundation Trust — Gujarat",
  description:
    "Join Uday Foundation Trust as a volunteer or partner. Help us serve 120+ villages in Gujarat through education, healthcare, and community development. Apply to volunteer today.",
  openGraph: {
    title: "Get Involved — Volunteer with Uday Foundation Trust",
    description:
      "Become a volunteer or partner with Uday Foundation Trust. Make a real difference in Gujarat's rural communities.",
    url: "https://www.udayfoundationstrust.org/get-involved",
    type: "website",
  },
};

export default function GetInvolvedPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.udayfoundationstrust.org/" },
      { "@type": "ListItem", "position": 2, "name": "Get Involved", "item": "https://www.udayfoundationstrust.org/get-involved" },
    ],
  };

  const volunteerSchema = {
    "@context": "https://schema.org",
    "@type": "VolunteerAction",
    "name": "Volunteer with Uday Foundation Trust",
    "url": "https://www.udayfoundationstrust.org/get-involved",
    "agent": { "@id": "https://www.udayfoundationstrust.org/#organization" },
    "description": "Join Uday Foundation Trust as a volunteer and help transform lives in Gujarat's rural communities.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(volunteerSchema) }} />
      <GetInvolvedView />
    </>
  );
}

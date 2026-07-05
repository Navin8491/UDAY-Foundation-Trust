import EventsView from "@/views/Events";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Uday Foundation Trust — Community Programs in Gujarat",
  description:
    "Stay updated with Uday Foundation Trust's upcoming community events, health camps, education drives, and volunteer programs across Sanand and rural Gujarat.",
  openGraph: {
    title: "Upcoming Events — Uday Foundation Trust",
    description:
      "Join Uday Foundation Trust's events — health camps, tree planting drives, education programs, and more across Gujarat's rural communities.",
    url: "https://www.udayfoundationstrust.org/events",
    type: "website",
  },
};

export default function EventsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.udayfoundationstrust.org/" },
      { "@type": "ListItem", "position": 2, "name": "Events", "item": "https://www.udayfoundationstrust.org/events" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <EventsView />
    </>
  );
}

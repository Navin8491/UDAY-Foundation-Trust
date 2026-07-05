import GalleryView from "@/views/Gallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Gallery | Uday Foundation Trust — Community Impact in Gujarat",
  description:
    "View photos from Uday Foundation Trust's community programs — health camps, education drives, tree plantations, and rural development initiatives across Gujarat.",
  openGraph: {
    title: "Gallery — Uday Foundation Trust Community Impact",
    description:
      "Photos from our health camps, education drives, and community events across 120+ villages in Gujarat.",
    url: "https://www.udayfoundationstrust.org/gallery",
    type: "website",
  },
};

export default function GalleryPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.udayfoundationstrust.org/" },
      { "@type": "ListItem", "position": 2, "name": "Gallery", "item": "https://www.udayfoundationstrust.org/gallery" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <GalleryView />
    </>
  );
}

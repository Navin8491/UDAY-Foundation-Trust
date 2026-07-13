import dynamic from "next/dynamic";
import { PageSkeleton } from "@/components/site/Skeleton";
import { Metadata } from "next";

const HomeView = dynamic(() => import("@/views/Home"), {
  loading: () => <PageSkeleton />,
});

export const metadata: Metadata = {
  title: "Uday Foundation Trust — NGO in Sanand, Gujarat | Service is True Dharma",
  description:
    "Uday Foundation Trust is a registered NGO in Sanand, Gujarat, serving 120+ villages through free education, healthcare camps, women empowerment, disaster relief, and environmental sustainability. Donate today.",
  openGraph: {
    title: "Uday Foundation Trust — NGO in Sanand, Gujarat",
    description:
      "Serving 120+ villages across Gujarat with education, healthcare, and humanitarian aid. 80G tax-exempt donations accepted.",
    url: "https://www.udayfoundationstrust.org/",
    type: "website",
    images: [{ url: "https://www.udayfoundationstrust.org/uday-logo.png", width: 512, height: 512, alt: "Uday Foundation Trust Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uday Foundation Trust — NGO in Sanand, Gujarat",
    description: "Serving 120+ villages in Gujarat with education, healthcare, and humanitarian relief.",
    images: ["https://www.udayfoundationstrust.org/uday-logo.png"],
  },
  keywords: [
    "Uday Foundation Trust",
    "NGO in Gujarat",
    "NGO in Sanand",
    "NGO in Ahmedabad",
    "donate to NGO",
    "education NGO Gujarat",
    "healthcare NGO Gujarat",
    "80G tax exemption NGO",
    "volunteer Gujarat",
  ],
};

export default function HomePage() {
  return <HomeView />;
}

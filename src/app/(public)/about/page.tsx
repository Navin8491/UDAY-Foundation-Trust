import AboutView from "@/views/About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Uday Foundation Trust",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function AboutPage() {
  return <AboutView />;
}

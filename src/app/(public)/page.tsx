import HomeView from "@/views/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uday Foundation Trust, Sanand — Service is True Dharma",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function HomePage() {
  return <HomeView />;
}

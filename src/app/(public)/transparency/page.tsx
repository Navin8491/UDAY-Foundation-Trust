import TransparencyView from "@/views/Transparency";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparency | Uday Foundation Trust",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function TransparencyPage() {
  return <TransparencyView />;
}

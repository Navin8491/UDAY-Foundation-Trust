import DonateView from "@/views/Donate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate | Uday Foundation Trust",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function DonatePage() {
  return <DonateView />;
}

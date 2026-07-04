import TermsAndConditionsView from "@/views/TermsAndConditions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TermsAndConditions | Uday Foundation Trust",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsView />;
}

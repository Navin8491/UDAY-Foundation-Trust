import TermsAndConditionsView from "@/views/TermsAndConditions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Uday Foundation Trust",
  description:
    "Read the Terms and Conditions of Uday Foundation Trust governing the use of our website, donation services, and community programs.",
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsView />;
}

import PrivacyPolicyView from "@/views/PrivacyPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Uday Foundation Trust",
  description:
    "Read the Privacy Policy of Uday Foundation Trust. We are committed to protecting your personal data and ensuring transparency about how your information is collected and used.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView />;
}

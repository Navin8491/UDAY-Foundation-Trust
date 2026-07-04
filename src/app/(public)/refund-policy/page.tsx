import RefundPolicyView from "@/views/RefundPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RefundPolicy | Uday Foundation Trust",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function RefundPolicyPage() {
  return <RefundPolicyView />;
}

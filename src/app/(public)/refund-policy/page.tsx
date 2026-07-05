import RefundPolicyView from "@/views/RefundPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Uday Foundation Trust",
  description:
    "Read the Refund Policy of Uday Foundation Trust. Understand the conditions under which donations and payments may be refunded.",
};

export default function RefundPolicyPage() {
  return <RefundPolicyView />;
}

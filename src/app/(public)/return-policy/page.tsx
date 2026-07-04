import ReturnPolicyView from "@/views/ReturnPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReturnPolicy | Uday Foundation Trust",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function ReturnPolicyPage() {
  return <ReturnPolicyView />;
}

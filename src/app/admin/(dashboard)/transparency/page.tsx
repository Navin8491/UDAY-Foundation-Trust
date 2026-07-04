import TransparencyView from "@/views/admin/Transparency";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Transparency | Uday Foundation Trust Portal",
  description: "Manage transparency for the Uday Foundation Trust portal.",
};

export default function AdminTransparencyPage() {
  return <TransparencyView />;
}

import PartnershipsView from "@/views/admin/Partnerships";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Partnerships | Uday Foundation Trust Portal",
  description: "Manage partnerships for the Uday Foundation Trust portal.",
};

export default function AdminPartnershipsPage() {
  return <PartnershipsView />;
}

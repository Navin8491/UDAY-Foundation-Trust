import DonationsView from "@/views/admin/Donations";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Donations | Uday Foundation Trust Portal",
  description: "Manage donations for the Uday Foundation Trust portal.",
};

export default function AdminDonationsPage() {
  return <DonationsView />;
}

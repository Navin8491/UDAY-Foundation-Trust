import VolunteersView from "@/views/admin/Volunteers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Volunteers | Uday Foundation Trust Portal",
  description: "Manage volunteers for the Uday Foundation Trust portal.",
};

export default function AdminVolunteersPage() {
  return <VolunteersView />;
}

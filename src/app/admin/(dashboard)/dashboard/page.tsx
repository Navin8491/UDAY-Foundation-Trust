import DashboardView from "@/views/admin/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Uday Foundation Trust Portal",
  description: "Manage dashboard for the Uday Foundation Trust portal.",
};

export default function AdminDashboardPage() {
  return <DashboardView />;
}

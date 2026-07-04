import ReportsView from "@/views/admin/Reports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Reports | Uday Foundation Trust Portal",
  description: "Manage reports for the Uday Foundation Trust portal.",
};

export default function AdminReportsPage() {
  return <ReportsView />;
}

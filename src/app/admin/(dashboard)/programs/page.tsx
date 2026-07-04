import ProgramsView from "@/views/admin/Programs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Programs | Uday Foundation Trust Portal",
  description: "Manage programs for the Uday Foundation Trust portal.",
};

export default function AdminProgramsPage() {
  return <ProgramsView />;
}

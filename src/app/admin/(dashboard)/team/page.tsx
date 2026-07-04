import TeamView from "@/views/admin/Team";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Team | Uday Foundation Trust Portal",
  description: "Manage team for the Uday Foundation Trust portal.",
};

export default function AdminTeamPage() {
  return <TeamView />;
}

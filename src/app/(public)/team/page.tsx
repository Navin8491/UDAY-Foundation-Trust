import TeamView from "@/views/Team";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team | Uday Foundation Trust",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function TeamPage() {
  return <TeamView />;
}

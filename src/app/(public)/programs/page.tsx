import ProgramsView from "@/views/Programs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs | Uday Foundation Trust",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function ProgramsPage() {
  return <ProgramsView />;
}

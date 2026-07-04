import EventsView from "@/views/admin/Events";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Events | Uday Foundation Trust Portal",
  description: "Manage events for the Uday Foundation Trust portal.",
};

export default function AdminEventsPage() {
  return <EventsView />;
}

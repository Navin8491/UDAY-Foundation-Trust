import EventsView from "@/views/Events";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Uday Foundation Trust",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function EventsPage() {
  return <EventsView />;
}

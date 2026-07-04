import ContactMessagesView from "@/views/admin/ContactMessages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin ContactMessages | Uday Foundation Trust Portal",
  description: "Manage contact for the Uday Foundation Trust portal.",
};

export default function AdminContactMessagesPage() {
  return <ContactMessagesView />;
}

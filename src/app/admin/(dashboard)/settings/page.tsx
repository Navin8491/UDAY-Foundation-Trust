import SettingsView from "@/views/admin/Settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Settings | Uday Foundation Trust Portal",
  description: "Manage settings for the Uday Foundation Trust portal.",
};

export default function AdminSettingsPage() {
  return <SettingsView />;
}

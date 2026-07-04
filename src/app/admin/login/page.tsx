import LoginView from "@/views/admin/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Uday Foundation Trust Portal",
  description: "Secure login for the Uday Foundation Trust administration portal.",
};

export default function AdminLoginPage() {
  return <LoginView />;
}

import CertificatesView from "@/views/admin/Certificates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Certificates | Uday Foundation Trust Portal",
  description: "Manage certificates for the Uday Foundation Trust portal.",
};

export default function AdminCertificatesPage() {
  return <CertificatesView />;
}

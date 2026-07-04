import ContactView from "@/views/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Uday Foundation Trust",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function ContactPage() {
  return <ContactView />;
}

import GalleryView from "@/views/admin/Gallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Gallery | Uday Foundation Trust Portal",
  description: "Manage gallery for the Uday Foundation Trust portal.",
};

export default function AdminGalleryPage() {
  return <GalleryView />;
}

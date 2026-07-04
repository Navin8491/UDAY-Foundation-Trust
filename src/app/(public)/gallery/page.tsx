import GalleryView from "@/views/Gallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Uday Foundation Trust",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function GalleryPage() {
  return <GalleryView />;
}

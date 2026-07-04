import GetInvolvedView from "@/views/GetInvolved";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GetInvolved | Uday Foundation Trust",
  description: "Uday Foundation Trust is dedicated to serving rural communities through educational, health, and empowerment initiatives.",
};

export default function GetInvolvedPage() {
  return <GetInvolvedView />;
}

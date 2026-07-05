import DisclaimerView from "@/views/Disclaimer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | Uday Foundation Trust",
  description:
    "Read the Disclaimer of Uday Foundation Trust regarding the accuracy of information on our website and limitation of liability for our programs and services.",
};

export default function DisclaimerPage() {
  return <DisclaimerView />;
}

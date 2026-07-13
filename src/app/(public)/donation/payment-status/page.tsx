import PaymentStatusView from "../../../../views/PaymentStatus";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Status | Uday Foundation Trust",
  description: "Verifying your donation transaction status with Uday Foundation Trust.",
};

export default function PaymentStatusPage() {
  return <PaymentStatusView />;
}

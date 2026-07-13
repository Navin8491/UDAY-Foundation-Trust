import dynamic from "next/dynamic";
import { PageSkeleton } from "@/components/site/Skeleton";
import { Metadata } from "next";

const PaymentStatusView = dynamic(() => import("../../../../views/PaymentStatus"), {
  loading: () => <PageSkeleton />,
});

export const metadata: Metadata = {
  title: "Payment Status | Uday Foundation Trust",
  description: "Verifying your donation transaction status with Uday Foundation Trust.",
};

export default function PaymentStatusPage() {
  return <PaymentStatusView />;
}

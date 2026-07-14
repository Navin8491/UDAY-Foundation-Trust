"use client";

import { useState, useEffect } from "react";
import { subscribePaymentEvents } from "@/services/db";

export function Donations() {
  const [donationsList, setDonationsList] = useState<any[]>([]);

  const getStatusLabel = (status: string) => {
    if (["COMPLETED", "DONATION_SAVED", "EMAIL_SENT", "ADMIN_NOTIFIED"].includes(status))
      return "Success";
    if (status === "FAILED") return "Failed";
    if (status === "REFUNDED" || status === "REFUND_INITIATED" || status === "REFUND_FAILED")
      return "Refunded";
    return "Pending";
  };

  useEffect(() => {
    const unsubscribe = subscribePaymentEvents(
      (items) => {
        if (items) {
          const mapped = items.map((item: any) => ({
            amount: Number(item.amount),
            status: getStatusLabel(item.current_state),
          }));
          setDonationsList(mapped);
        } else {
          setDonationsList([]);
        }
      },
      (err) => {
        console.error("subscribePaymentEvents in admin Donations.tsx failed:", err);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const totalDonations = donationsList
    .filter((d) => d.status === "Success")
    .reduce((sum, d) => sum + d.amount, 0);

  const refundCount = donationsList.filter((d) => d.status === "Refunded").length;
  const successCount = donationsList.filter((d) => d.status === "Success").length;

  return (
    <div className="space-y-6 pb-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Donations</h1>
        <p className="text-sm text-slate-500 font-medium font-gujarati">
          ટ્રસ્ટના મળેલા નાણાકીય દાન અને ફંડનું મેનેજમેન્ટ
        </p>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Total Donations",
            value: `₹${totalDonations.toLocaleString("en-IN")}`,
            desc: "Cumulative",
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            title: "Successful Donations",
            value: successCount.toString(),
            desc: "Completed",
            color: "text-[#7A9D1C] bg-[#7A9D1C]/10",
          },
          {
            title: "Total Refunds",
            value: refundCount.toString(),
            desc: "Compensated",
            color: "text-purple-600 bg-purple-50",
          },
        ].map((c, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block leading-tight">
              {c.title}
            </span>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                {c.value}
              </span>
              <span
                className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${c.color} self-start sm:self-auto`}
              >
                {c.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Donations;

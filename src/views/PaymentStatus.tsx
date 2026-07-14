"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Printer,
  Download,
  Loader2,
  XCircle,
  ShieldCheck,
  Heart,
  Clock,
  ArrowRight,
  ChevronRight,
  ArrowLeft,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { fetchPaymentStatus } from "@/services/db";
import { toast } from "sonner";
import { SITE } from "@/constants/site";

// Confetti Component for Successful Payment
function Confetti() {
  const [pieces, setPieces] = useState<any[]>([]);
  useEffect(() => {
    const colors = ["#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6", "#EF4444"];
    const newPieces = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 100,
      size: 5 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? "circle" : "rect",
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50 rounded-[32px]">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `rotate(${p.rotation}deg)`,
            animation: `fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fall {
          0% { top: -10%; transform: rotate(0deg); opacity: 1; }
          100% { top: 110%; transform: rotate(360deg); opacity: 0.5; }
        }
      ` }} />
    </div>
  );
}

export function PaymentStatus() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<string>("INITIATED");
  const [amount, setAmount] = useState<number>(0);
  const [donorName, setDonorName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [receiptNumber, setReceiptNumber] = useState<string | null>(null);
  const [donationId, setDonationId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [gatewayTransactionId, setGatewayTransactionId] = useState<string | null>(null);

  const [verifying, setVerifying] = useState<boolean>(true);
  const [verificationError, setVerificationError] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("order_id") || params.get("idempotency_key");
    if (id) {
      setOrderId(id);
    } else {
      setVerificationError("Missing Order ID parameter in the URL.");
      setVerifying(false);
    }
  }, []);

  const pollStatus = async (id: string) => {
    try {
      const res = await fetchPaymentStatus(id);
      setCurrentState(res.currentState);
      setAmount(res.amount || 0);
      setDonorName(res.donorName || "");
      setEmail(res.email || "");
      setPhone(res.phone || "");
      setReceiptNumber(res.receiptNumber || null);
      setDonationId(res.donationId || null);
      setPaymentMethod(res.paymentMethod || null);
      setLastError(res.lastError || null);
      setGatewayTransactionId(res.gatewayTransactionId || null);

      const paymentSuccessful = [
        "CHARGED",
        "PAYMENT_VERIFIED",
        "DONATION_SAVED",
        "EMAIL_SENT",
        "ADMIN_NOTIFIED",
        "COMPLETED",
      ].includes(res.currentState);

      if (paymentSuccessful) {
        setVerifying(false);
        setVerificationError("");
        const isFullyCompleted = res.currentState === "COMPLETED" || (res.receiptNumber && res.receiptNumber !== "Pending");
        return { shouldStop: isFullyCompleted, state: res.currentState };
      } else if (res.currentState === "FAILED") {
        setVerifying(false);
        setVerificationError(res.lastError || "Payment failed or was cancelled at checkout.");
        return { shouldStop: true, state: res.currentState };
      }
      return { shouldStop: false, state: res.currentState };
    } catch (e: any) {
      console.error("[PaymentStatus] Polling error:", e);
    }
    return { shouldStop: false, state: "ERROR" };
  };

  useEffect(() => {
    if (!orderId) return;

    let pollCount = 0;
    const maxPolls = 100; // 5 minutes max polling (100 polls * 3s)

    // Initial immediate check
    pollStatus(orderId);

    const interval = setInterval(async () => {
      pollCount++;
      setRetryCount(pollCount);
      const result = await pollStatus(orderId);
      
      const isStillPending = ["INITIATED", "CHECKOUT_CREATED", "PAYMENT_PENDING", "ERROR"].includes(result.state);

      if (result.shouldStop || (pollCount >= maxPolls && isStillPending)) {
        clearInterval(interval);
        if (pollCount >= maxPolls && verifying) {
          setVerifying(false);
          setVerificationError("Verification timeout. The payment status check is taking longer than expected. Please wait or contact support.");
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  const handleManualCheck = () => {
    if (orderId) {
      setVerifying(true);
      setVerificationError("");
      pollStatus(orderId);
    }
  };

  // Timeline Progress Calculator
  const getStepStatus = (stepName: string) => {
    const states = [
      "INITIATED",
      "CHECKOUT_CREATED",
      "CHARGED",
      "PAYMENT_VERIFIED",
      "DONATION_SAVED",
      "EMAIL_SENT",
      "ADMIN_NOTIFIED",
      "COMPLETED",
    ];

    const currentIdx = states.indexOf(currentState === "FAILED" ? "CHECKOUT_CREATED" : currentState);

    switch (stepName) {
      case "SUBMITTED":
        return currentIdx >= 0 ? "completed" : "waiting";
      case "SESSION_CREATED":
        return currentIdx >= 1 ? "completed" : "waiting";
      case "REDIRECTED":
        return currentIdx >= 1 ? "completed" : "waiting";
      case "PROCESSING":
        if (currentState === "FAILED") return "failed";
        if (currentIdx > 1) return "completed";
        if (currentIdx === 1) return "processing";
        return "waiting";
      case "VERIFICATION":
        if (currentState === "FAILED") return "failed";
        if (currentIdx > 2) return "completed";
        if (currentIdx === 2) return "processing";
        return "waiting";
      case "SAVED":
        if (currentState === "FAILED") return "failed";
        if (currentIdx > 4) return "completed";
        if (currentIdx === 4) return "processing";
        return "waiting";
      case "RECEIPT":
        if (currentState === "FAILED") return "failed";
        if (currentIdx > 5) return "completed";
        if (currentIdx === 5) return "processing";
        return "waiting";
      case "EMAIL":
        if (currentState === "FAILED") return "failed";
        if (currentIdx >= 7) return "completed";
        if (currentIdx === 6) return "processing";
        return "waiting";
      default:
        return "waiting";
    }
  };

  const renderTimelineItem = (label: string, stepKey: string) => {
    const status = getStepStatus(stepKey);
    let colorClass = "text-slate-400 border-slate-200";
    let icon = "○";

    if (status === "completed") {
      colorClass = "text-emerald-500 border-emerald-500 font-bold";
      icon = "✔";
    } else if (status === "processing") {
      colorClass = "text-primary border-primary font-bold";
      icon = "⏳";
    } else if (status === "failed") {
      colorClass = "text-rose-500 border-rose-500 font-bold";
      icon = "✖";
    }

    return (
      <div className="flex items-center justify-between text-xs py-2 px-3 border border-slate-100 rounded-xl bg-slate-50/50">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className={`px-2 py-0.5 rounded-full border text-[9px] uppercase tracking-wider ${colorClass}`}>
          {icon} {status}
        </span>
      </div>
    );
  };

  return (
    <section className="section-y bg-surface min-h-[80vh] flex items-center">
      <div className="container-page max-w-2xl mx-auto text-center">
        {verifying ? (
          /* Loader & Progress State */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-2xl space-y-6 animate-pulse text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden">
              <div className="h-full bg-primary animate-[shimmer_1.5s_infinite]" style={{ width: "30%" }} />
            </div>

            <div className="flex items-center gap-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                  Verifying Your Payment...
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Checking order status with Cashfree. Please do not refresh or press back.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-3">
              <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-2">
                Real-Time Payment Timeline
              </h4>
              {renderTimelineItem("Donation Submitted", "SUBMITTED")}
              {renderTimelineItem("Payment Session Created", "SESSION_CREATED")}
              {renderTimelineItem("Redirected to Cashfree", "REDIRECTED")}
              {renderTimelineItem("Payment Processing", "PROCESSING")}
              {renderTimelineItem("Payment Verification", "VERIFICATION")}
              {renderTimelineItem("Donation Saved", "SAVED")}
              {renderTimelineItem("Receipt Generated", "RECEIPT")}
              {renderTimelineItem("Confirmation Email Sent", "EMAIL")}
            </div>

            {retryCount >= 20 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-4 shadow-xs animate-fade-in">
                <div className="flex justify-center">
                  <Clock className="h-8 w-8 text-amber-500 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  Payment Verification is Taking Longer Than Expected
                </h4>
                <p className="text-xs text-amber-800 font-semibold max-w-md mx-auto leading-relaxed">
                  We are still checking your payment status in the background. Please do not close or reload this page.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleManualCheck}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white border border-transparent rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all shadow-xs"
                  >
                    Check Again
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                  >
                    Refresh Status
                  </button>
                  <a
                    href="/contact"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-transparent text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : verificationError ? (
          /* Error State */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-2xl space-y-6 text-center animate-scale-up">
            <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-xs">
              <XCircle className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">
                Payment Verification Failed
              </h2>
              <p className="text-xs text-rose-500 font-semibold max-w-sm mx-auto leading-relaxed mt-2">
                {verificationError}
              </p>
            </div>

            {/* Timeline in Error state */}
            <div className="border-t border-slate-100 pt-6 space-y-3 text-left">
              <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-black text-center mb-2">
                Payment Pipeline Detail
              </h4>
              {renderTimelineItem("Donation Submitted", "SUBMITTED")}
              {renderTimelineItem("Payment Session Created", "SESSION_CREATED")}
              {renderTimelineItem("Redirected to Cashfree", "REDIRECTED")}
              {renderTimelineItem("Payment Processing", "PROCESSING")}
              {renderTimelineItem("Payment Verification", "VERIFICATION")}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
              <a
                href="/donate"
                className="btn-primary text-xs font-bold uppercase tracking-wider py-3 px-6 cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" /> Retry Donation Payment
              </a>
              <a
                href="/contact"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Mail className="h-4 w-4" /> Contact Support
              </a>
            </div>
          </div>
        ) : (
          /* Successful Confirmation State */
          <div className="space-y-6 relative text-left animate-scale-up">
            <Confetti />

            {/* Success Header Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-md text-center print:hidden">
              <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xs mb-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                Donation Successful!
              </h2>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                Thank you, <span className="font-bold text-slate-800">{donorName}</span>! Your
                contribution makes a real difference in the lives of rural communities.
              </p>
            </div>

            {/* Receipt Printable Card */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 md:p-8 space-y-6 relative overflow-hidden text-left text-xs font-semibold text-slate-600 print:border-none print:shadow-none print:p-0 print:m-0">
              {/* Receipt Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={SITE.logo}
                    alt="NGO Logo"
                    className="h-12 w-12 object-contain"
                  />
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">
                      Uday Foundation Trust
                    </h3>
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">
                      Reg No: Guj/23016/Ahmedabad
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold text-[9px] uppercase tracking-wider inline-block mb-1">
                    Payment Successful
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Date: {new Date().toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Dashed Line separator */}
              <div className="border-t-2 border-dashed border-slate-200/80 my-4 relative">
                <div className="absolute left-[-29px] top-[-6px] h-3 w-3 rounded-full bg-surface border border-slate-200 border-l-0 print:hidden" />
                <div className="absolute right-[-29px] top-[-6px] h-3 w-3 rounded-full bg-surface border border-slate-200 border-r-0 print:hidden" />
              </div>

              {/* Receipt Main Details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 pt-1 text-slate-700">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">
                    Receipt Number
                  </span>
                  <span className="font-mono text-slate-900 font-bold text-[11px]">
                    {receiptNumber || `UFT-REC-${(donationId || orderId || "").substring(0, 8).toUpperCase()}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">
                    Order ID
                  </span>
                  <span className="font-mono text-slate-900 font-bold uppercase block truncate max-w-[180px]">
                    {orderId || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">
                    Transaction ID
                  </span>
                  <span className="font-mono text-slate-900 font-bold block truncate max-w-[180px]">
                    {gatewayTransactionId || donationId || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">
                    Donor Name
                  </span>
                  <span className="text-slate-900 font-bold">{donorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">
                    Email Address
                  </span>
                  <span className="text-slate-900 font-bold truncate block max-w-[180px]">
                    {email}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">
                    Phone Number
                  </span>
                  <span className="text-slate-900 font-bold">{phone || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">
                    Payment Method
                  </span>
                  <span className="text-slate-900 font-bold capitalize">
                    {paymentMethod || "Online Gateway"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">
                    Tax Slab Benefit
                  </span>
                  <span className="text-emerald-600 font-bold uppercase block">
                    80G EXEMPT
                  </span>
                </div>
              </div>

              {/* Amount Box */}
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center justify-between mt-2 print:bg-slate-50">
                <div>
                  <span className="text-primary font-bold text-[9px] uppercase tracking-wider block mb-0.5">
                    Donated Amount
                  </span>
                  <span className="text-slate-400 text-[10px] block font-medium">
                    INR {Number(amount).toLocaleString("en-IN")} Rupees Only
                  </span>
                </div>
                <span className="text-primary font-bold text-xl md:text-2xl">
                  ₹{amount.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Tax Slab Notice */}
              <div className="border-t border-slate-100 pt-4 text-[9px] text-slate-400 font-medium leading-relaxed">
                <p>
                  * This is a computer-generated tax receipt eligible for tax deduction
                  under Section 80G of the Income Tax Act, 1961. A copy of this receipt
                  has been emailed to you.
                </p>
              </div>
            </div>

            {/* Interactive Receipt Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 print:hidden">
               {(() => {
                 const isReceiptReady = receiptNumber && receiptNumber !== "Pending";
                 return (
                   <button
                     onClick={() => {
                       if (isReceiptReady) {
                         window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/payments/receipt/${donationId}`, "_blank");
                       }
                     }}
                     disabled={!isReceiptReady}
                     className={`inline-flex items-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl transition-all ${
                       isReceiptReady
                         ? "bg-[#7A9D1C]/15 hover:bg-[#7A9D1C]/20 text-[#7A9D1C] cursor-pointer"
                         : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                     }`}
                   >
                     {isReceiptReady ? (
                       <>
                         <Download className="h-4 w-4" /> Download PDF Receipt
                       </>
                     ) : (
                       <>
                         <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                         Generating Receipt...
                       </>
                     )}
                   </button>
                 );
               })()}
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4" /> Print Receipt
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-1 bg-primary text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
              >
                Go Back Home <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      ` }} />
    </section>
  );
}

export default PaymentStatus;

"use client";

import { useState, useEffect } from "react";
import { PageHero } from "@/components/site/PageHero";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import {
  Heart,
  ShieldCheck,
  FileCheck2,
  BadgeCheck,
  GraduationCap,
  Stethoscope,
  Sprout,
  Users,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  FileDown,
  Home,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { initiateDonationPayment, fetchPaymentStatus } from "@/services/db";
import { toast } from "sonner";
import { SITE } from "@/constants/site";

const LOCAL_DONATE_TRANS = {
  en: {
    donorDetails: "Donor Details",
    back: "Back to Amount Selection",
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    address: "Full Address (with Pincode)",
    pan: "PAN Card Number (10-char alphanumeric)",
    panPlaceholder: "e.g., ABCDE1234F",
    panError: "Invalid PAN format. Must be 10 characters (5 Letters, 4 Digits, 1 Letter).",
    proceed: "Proceed to Donor Details",
    complete: "Complete Donation",
    successMsg: "Donation Successful!",
    receiptSent: "A donation receipt has been generated and sent to",
    amountText: "Amount",
    legalNote: "Indian tax laws require a PAN card number to issue 80G tax-exemption receipts.",
    donateAgain: "Make Another Donation",
  },
  gu: {
    donorDetails: "દાતાની વિગતો",
    back: "રકમની પસંદગી પર પાછા જાઓ",
    name: "પૂરું નામ",
    email: "ઇમેઇલ સરનામું",
    phone: "ફોન નંબર",
    address: "સરનામું (પીનકોડ સાથે)",
    pan: "પાન કાર્ડ નંબર (૧૦ અક્ષરનો)",
    panPlaceholder: "દા.ત. ABCDE1234F",
    panError: "ખોટો પાન નંબર. ૧૦ અક્ષર હોવા જોઈએ (૫ અક્ષર, ૪ આંકડા, ૧ અક્ષર).",
    proceed: "દાતાની વિગતો ભરો",
    complete: "દાન કરો",
    successMsg: "દાન સફળતાપૂર્વક પૂર્ણ થયું!",
    receiptSent: "દાનની સત્તાવાર રસીદ અને 80G સર્ટિફિકેટ આ ઇમેઇલ પર મોકલી દેવામાં આવ્યું છે:",
    amountText: "રકમ",
    legalNote: "આવકવેરા મુક્તિ (80G) મેળવવા માટે ભારતીય કાયદા મુજબ પાન કાર્ડ નંબર આપવો ફરજિયાત છે.",
    donateAgain: "બીજું દાન કરો",
  },
  hi: {
    donorDetails: "दाता का विवरण",
    back: "राशि चयन पर वापस जाएं",
    name: "पूरा नाम",
    email: "ईमेल आईडी",
    phone: "फ़ोन नंबर",
    address: "पूरा पता (पिनकोड सहित)",
    pan: "पैन कार्ड नंबर (१० अंकों का)",
    panPlaceholder: "उदा: ABCDE1234F",
    panError: "अमान्य पैन प्रारूप। १० अंक होने चाहिए (५ अक्षर, ४ अंक, १ अक्षर)।",
    proceed: "दाता विवरण पर आगे बढ़ें",
    complete: "दान पूर्ण करें",
    successMsg: "दान सफलतापूर्वक प्राप्त हुआ!",
    receiptSent: "दान की रसीद और 80G प्रमाणपत्र इस ईमेल पर भेज दिया गया है:",
    amountText: "राशि",
    legalNote:
      "भारतीय आयकर नियमों के अनुसार 80G कर छूट के लिए पैन कार्ड नंबर प्रदान करना अनिवार्य है.",
    donateAgain: "दूसरा दान करें",
  },
};

export function Donate() {
  const [step, setStep] = useState(1); // 1 = select amount, 2 = fill details
  const [selected, setSelected] = useState(2500);
  const [paymentState, setPaymentState] = useState<"form" | "waiting" | "success" | "failed" | "pending">("form");
  const [paymentSession, setPaymentSession] = useState<any>(null);
  const [paymentStatusData, setPaymentStatusData] = useState<any>(null);
  const [popupBlockerActive, setPopupBlockerActive] = useState<boolean>(false);
  const [pollingIntervalId, setPollingIntervalId] = useState<any>(null);
  const [custom, setCustom] = useState("");

  // Donor details fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pan, setPan] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [idempotencyKey, setIdempotencyKey] = useState(() => {
    const uuidFallback = () =>
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    if (typeof window !== "undefined") {
      return window.crypto?.randomUUID?.() || uuidFallback();
    }
    return uuidFallback();
  });

  const loadCashfreeScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Cashfree) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openCashfreeCheckout = async (sessionData: any) => {
    const loaded = await loadCashfreeScript();
    if (!loaded) {
      toast.error("Failed to load Cashfree payment script. Check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const mode = (process.env.NEXT_PUBLIC_CASHFREE_ENV || "sandbox").toLowerCase();
      const cashfree = (window as any).Cashfree({
        mode: mode === "production" ? "production" : "sandbox",
      });

      console.log("[Cashfree] Launching checkout for session:", sessionData.sessionId);

      cashfree.checkout({
        paymentSessionId: sessionData.sessionId,
        redirectTarget: "_self",
      });
    } catch (err: any) {
      console.error("[Cashfree] Initialization error:", err);
      toast.error("Failed to initialize Cashfree checkout.");
      setLoading(false);
    }
  };

  const startPolling = (key: string) => {
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
    }

    const interval = setInterval(async () => {
      try {
        const data = await fetchPaymentStatus(key);
        setPaymentStatusData(data);

        const currentState = data.currentState;

        if (["CHARGED", "PAYMENT_VERIFIED", "DONATION_SAVED", "EMAIL_SENT", "ADMIN_NOTIFIED", "COMPLETED"].includes(currentState)) {
          clearInterval(interval);
          setPaymentState("success");
          toast.success("Donation completed successfully!");
        } else if (currentState === "FAILED") {
          clearInterval(interval);
          setPaymentState("failed");
          toast.error("Payment failed.");
        } else if (currentState === "PAYMENT_PENDING") {
          setPaymentState("pending");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    setPollingIntervalId(interval);
  };

  useEffect(() => {
    return () => {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };
  }, [pollingIntervalId]);

  const { t, language } = useLanguage();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const key = params.get("idempotency_key") || params.get("order_id");

    if (status === "success" && key) {
      window.location.href = `/donation/payment-status?order_id=${key}`;
    } else if (status === "cancel") {
      toast.error("Donation checkout cancelled.");
      setStep(1);
    }
  }, []);

  const trans = LOCAL_DONATE_TRANS[language as "en" | "gu" | "hi"] || LOCAL_DONATE_TRANS.en;
  const amount = custom ? Number(custom) : selected;

  useDocumentMetadata(
    "Donate — Support Rural Gujarat | Uday Foundation Trust",
    "Donate to Uday Foundation Trust and transform lives. 80G tax exempt. Choose from impact-based amounts or enter your own.",
  );

  const AMOUNTS = [
    { value: 500, impact: t("act.ration.desc") },
    { value: 1000, impact: t("act.edu.desc") },
    { value: 2500, impact: t("act.health.desc") },
    { value: 5000, impact: t("act.env.desc") },
    { value: 10000, impact: t("prog.health.desc") },
    { value: 25000, impact: t("prog.edu.desc") },
  ];

  const IMPACT = [
    { Icon: GraduationCap, label: t("prog.edu") },
    { Icon: Stethoscope, label: t("prog.health") },
    { Icon: Sprout, label: t("prog.env") },
    { Icon: Users, label: t("prog.human") },
  ];

  const formattedPan = pan.toUpperCase().trim();
  const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formattedPan);
  const showPanError = touched && formattedPan.length > 0 && !isPanValid;

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    phone.trim().length >= 8 &&
    address.trim().length > 0 &&
    isPanValid;

  const writeBrandedLoadingPage = (targetWindow: Window) => {
    const logoUrl = typeof window !== "undefined" ? `${window.location.origin}/uday-logo.png` : "";
    targetWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Connecting to Secure Payment Gateway...</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #f8fafc;
              color: #1e293b;
            }
            .card {
              background: white;
              padding: 40px;
              border-radius: 24px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
              border: 1px solid #e2e8f0;
              text-align: center;
              max-width: 400px;
              width: 90%;
              box-sizing: border-box;
            }
            .logo {
              height: 70px;
              margin-bottom: 24px;
              object-fit: contain;
            }
            .spinner-container {
              position: relative;
              width: 64px;
              height: 64px;
              margin: 0 auto 24px auto;
            }
            .spinner {
              box-sizing: border-box;
              display: block;
              position: absolute;
              width: 64px;
              height: 64px;
              border: 5px solid #e2e8f0;
              border-radius: 50%;
              animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
              border-top-color: #f5a623;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            h3 {
              font-size: 18px;
              margin: 0 0 8px 0;
              color: #0f172a;
              font-weight: 700;
            }
            p {
              font-size: 14px;
              color: #64748b;
              margin: 0 0 24px 0;
              line-height: 1.5;
            }
            .progress-bar-bg {
              background-color: #f1f5f9;
              border-radius: 9999px;
              height: 6px;
              width: 100%;
              overflow: hidden;
              margin-bottom: 24px;
            }
            .progress-bar {
              background: linear-gradient(90deg, #f5a623, #ea580c);
              height: 100%;
              width: 0%;
              border-radius: 9999px;
              animation: progress 4s ease-out forwards;
            }
            @keyframes progress {
              0% { width: 0%; }
              20% { width: 25%; }
              50% { width: 65%; }
              80% { width: 85%; }
              100% { width: 90%; }
            }
            .security-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background-color: #f0fdf4;
              color: #166534;
              padding: 6px 12px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 600;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              border: 1px solid #bbf7d0;
            }
            .security-icon {
              width: 12px;
              height: 12px;
              fill: currentColor;
            }
            .error-container {
              display: none;
            }
          </style>
        </head>
        <body>
          <div class="card" id="loading-container">
            <img src="${logoUrl}" class="logo" alt="Uday Foundation Trust" />
            <div class="spinner-container">
              <div class="spinner"></div>
            </div>
            <h3>Redirecting to Secure Payment Gateway...</h3>
            <p>Please wait, preparing your secure Cashfree payment.</p>
            <div class="progress-bar-bg">
              <div class="progress-bar"></div>
            </div>
            <div class="security-badge">
              <svg class="security-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              PCI-DSS COMPLIANT • SSL SECURED
            </div>
          </div>
          <div class="card error-container" id="error-container">
            <img src="${logoUrl}" class="logo" alt="Uday Foundation Trust" />
            <h3 style="color:#ef4444;">Connection Failed</h3>
            <p>Failed to load payment gateway checkout session. Please close this tab and try again from the donation page.</p>
          </div>
          <script>
            window.startCheckout = function(sessionId, mode) {
              try {
                const pb = document.querySelector('.progress-bar');
                if (pb) {
                  pb.style.animation = 'none';
                  pb.style.width = '100%';
                }
                
                const initCheckout = () => {
                  if (typeof Cashfree !== 'undefined') {
                    const cashfree = Cashfree({ mode: mode });
                    cashfree.checkout({
                      paymentSessionId: sessionId,
                      redirectTarget: "_self"
                    });
                  } else {
                    setTimeout(initCheckout, 100);
                  }
                };
                
                setTimeout(initCheckout, 300);
              } catch (err) {
                console.error(err);
                document.getElementById("error-container").style.display = "block";
                document.getElementById("loading-container").style.display = "none";
              }
            };
          </script>
        </body>
      </html>
    `);
    targetWindow.document.close();
  };

  const handleDonateNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isFormValid || loading) return;
    setLoading(true);
    setPopupBlockerActive(false);

    // Pre-open a tab synchronously to bypass browser popup blocker and write loading HTML immediately
    const checkoutWindow = window.open("about:blank", "_blank");
    if (checkoutWindow) {
      writeBrandedLoadingPage(checkoutWindow);
    }

    try {
      const session = await initiateDonationPayment({
        donorName: name,
        email,
        phone,
        address,
        panNumber: pan,
        amount,
        purpose: "General Donation",
        idempotencyKey,
      });

      if (session.status === "already_completed") {
        if (checkoutWindow) checkoutWindow.close();
        toast.success("This donation has already been processed!");
        window.location.href = `/donation/payment-status?order_id=${idempotencyKey}`;
        return;
      }

      setPaymentSession(session);

      if (session.sessionId) {
        if (checkoutWindow) {
          // Trigger SDK checkout in pre-loaded tab using startCheckout helper
          try {
            (checkoutWindow as any).startCheckout(session.sessionId, (session.environment || "sandbox").toLowerCase());
          } catch (sdkErr) {
            console.error("SDK initialization trigger failed:", sdkErr);
            checkoutWindow.close();
            setPopupBlockerActive(true);
          }
        } else {
          setPopupBlockerActive(true);
          toast.warning("Popup blocker detected! Please allow popups or click the button to continue.");
        }
        
        setPaymentState("waiting");
        startPolling(idempotencyKey);
      } else {
        if (checkoutWindow) checkoutWindow.close();
        throw new Error("No payment session details returned.");
      }
    } catch (err: any) {
      if (checkoutWindow) {
        try {
          (checkoutWindow as any).document.getElementById("error-container").style.display = "block";
          (checkoutWindow as any).document.getElementById("loading-container").style.display = "none";
        } catch (_) {
          checkoutWindow.close();
        }
      }
      console.error(err);
      toast.error(err.message || "Failed to initiate payment session.");
      
      // Regenerate key so retry starts fresh
      setIdempotencyKey(window.crypto?.randomUUID?.() || "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }));
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow={t("nav.donate")}
        title={t("donate.title")}
        subtitle={t("donate.desc")}
        bgImage="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1600&auto=format&fit=crop"
        breadcrumbActive={t("nav.donate")}
      />

      <section className="section-y bg-surface">
        <div className="container-page grid lg:grid-cols-12 gap-10 items-start">
          {/* Main Card Viewport */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-surface border border-border p-7 md:p-10 shadow-sm transition-all duration-300">
              {/* STEP 1: Amount Selection */}
              {paymentState === "form" && step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-display font-semibold">
                    {t("donate.card.title")}
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    {t("donate.amount.label")}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {AMOUNTS.map((a) => (
                      <button
                        key={a.value}
                        onClick={() => {
                          setSelected(a.value);
                          setCustom("");
                        }}
                        className={`text-left rounded-2xl p-5 border-2 transition-all cursor-pointer ${
                          selected === a.value && !custom
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="font-display text-2xl font-semibold text-slate-900">
                          ₹{a.value.toLocaleString("en-IN")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 leading-relaxed font-semibold">
                          {a.impact}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="custom-amount" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {t("donate.custom.placeholder")}
                    </label>
                    <input
                      id="custom-amount"
                      name="custom-amount"
                      type="number"
                      value={custom}
                      onChange={(e) => setCustom(e.target.value)}
                      placeholder="₹ Enter Custom Amount"
                      className="w-full rounded-2xl border border-border bg-surface-warm px-4 py-3.5 text-lg font-semibold focus:outline-hidden focus:border-primary transition-colors"
                    />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!amount || amount <= 0}
                    className="w-full btn-saffron text-sm font-bold uppercase tracking-wider py-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Heart className="h-4.5 w-4.5 animate-pulse" /> {trans.proceed}
                  </button>

                  <p className="text-[10px] text-muted-foreground text-center font-semibold">
                    {t("donate.benefit.desc")}
                  </p>
                </div>
              )}

              {/* STEP 2: Donor Details Form */}
              {paymentState === "form" && step === 2 && (
                <div className="space-y-6">
                  {/* Back button */}
                  <button
                    onClick={() => {
                      setStep(1);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />{" "}
                    {trans.back}
                  </button>

                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-2xl font-display font-semibold">
                      {trans.donorDetails}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 font-semibold">
                      Selected Donation:{" "}
                      <span className="text-primary font-bold">
                        ₹{amount.toLocaleString("en-IN")}
                      </span>
                    </p>
                  </div>

                  <form
                    onSubmit={handleDonateNow}
                    className="space-y-4 text-xs font-semibold"
                  >
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="donor-name" className="text-slate-500 uppercase tracking-wider">
                        {trans.name} *
                      </label>
                      <input
                        id="donor-name"
                        name="donor-name"
                        autoComplete="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full h-11 px-4 rounded-xl border border-border bg-surface-warm focus:outline-hidden focus:border-primary text-sm font-medium"
                      />
                    </div>

                    {/* Email & Phone grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Email */}
                      <div className="space-y-1.5">
                        <label htmlFor="donor-email" className="text-slate-500 uppercase tracking-wider">
                          {trans.email} *
                        </label>
                        <input
                          id="donor-email"
                          name="donor-email"
                          autoComplete="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full h-11 px-4 rounded-xl border border-border bg-surface-warm focus:outline-hidden focus:border-primary text-sm font-medium"
                        />
                      </div>
                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label htmlFor="donor-phone" className="text-slate-500 uppercase tracking-wider">
                          {trans.phone} *
                        </label>
                        <input
                          id="donor-phone"
                          name="donor-phone"
                          autoComplete="tel"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g., +91 98765 43210"
                          className="w-full h-11 px-4 rounded-xl border border-border bg-surface-warm focus:outline-hidden focus:border-primary text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                      <label htmlFor="donor-address" className="text-slate-500 uppercase tracking-wider">
                        {trans.address} *
                      </label>
                      <textarea
                        id="donor-address"
                        name="donor-address"
                        autoComplete="street-address"
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House no., Street, City, State & Pincode"
                        className="w-full p-4 rounded-xl border border-border bg-surface-warm focus:outline-hidden focus:border-primary text-sm font-medium"
                      />
                    </div>

                    {/* PAN Card Field with Validation */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label htmlFor="donor-pan" className="text-slate-500 uppercase tracking-wider">
                          {trans.pan} *
                        </label>
                        <span className="text-[10px] text-slate-400 font-bold">
                          10-characters
                        </span>
                      </div>
                      <input
                        id="donor-pan"
                        name="donor-pan"
                        type="text"
                        required
                        maxLength={10}
                        value={pan}
                        onBlur={() => setTouched(true)}
                        onChange={(e) => {
                          setPan(e.target.value.toUpperCase());
                        }}
                        placeholder={trans.panPlaceholder}
                        className={`w-full h-11 px-4 rounded-xl border ${
                          showPanError
                            ? "border-rose-500 focus:border-rose-500"
                            : "border-border focus:border-primary"
                        } bg-surface-warm focus:outline-hidden text-sm font-medium uppercase`}
                      />
                      {showPanError && (
                        <p className="text-[10px] font-bold text-rose-500 leading-snug mt-1">
                          {trans.panError}
                        </p>
                      )}
                    </div>

                    {/* Tax notice */}
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-[10px] leading-relaxed text-slate-500">
                      <span className="font-bold text-primary uppercase tracking-wider block mb-0.5">
                        80G Tax Rebate Benefit
                      </span>
                      {trans.legalNote}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!isFormValid || loading}
                      className="w-full btn-saffron text-sm font-bold uppercase tracking-wider py-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Heart className="h-4.5 w-4.5 animate-pulse" />{" "}
                      {loading
                        ? "Processing..."
                        : `Donate Now : ₹${amount.toLocaleString("en-IN")}`}
                    </button>
                  </form>
                </div>
              )}

              {/* PAYMENT STATUS TRACKING VIEW (waiting or pending) */}
              {(paymentState === "waiting" || paymentState === "pending") && (() => {
                const currentState = paymentStatusData?.currentState || "INITIATED";
                const steps = [
                  {
                    label: "Donation Details Submitted",
                    status: "completed",
                  },
                  {
                    label: "Payment Session Created",
                    status: "completed",
                  },
                  {
                    label: "Cashfree Checkout Opened",
                    status: popupBlockerActive ? "warning" : "completed",
                  },
                  {
                    label: "Waiting for Payment",
                    status: ["CHARGED", "PAYMENT_VERIFIED", "DONATION_SAVED", "EMAIL_SENT", "ADMIN_NOTIFIED", "COMPLETED"].includes(currentState)
                      ? "completed"
                      : ["INITIATED", "CHECKOUT_CREATED", "PAYMENT_PENDING"].includes(currentState)
                      ? "active"
                      : "future",
                  },
                  {
                    label: "Verifying Payment",
                    status: ["PAYMENT_VERIFIED", "DONATION_SAVED", "EMAIL_SENT", "ADMIN_NOTIFIED", "COMPLETED"].includes(currentState)
                      ? "completed"
                      : currentState === "CHARGED"
                      ? "active"
                      : "future",
                  },
                  {
                    label: "Saving Donation",
                    status: ["DONATION_SAVED", "EMAIL_SENT", "ADMIN_NOTIFIED", "COMPLETED"].includes(currentState)
                      ? "completed"
                      : currentState === "PAYMENT_VERIFIED"
                      ? "active"
                      : "future",
                  },
                  {
                    label: "Generating Receipt",
                    status: ["EMAIL_SENT", "ADMIN_NOTIFIED", "COMPLETED"].includes(currentState) || (paymentStatusData?.receiptNumber)
                      ? "completed"
                      : currentState === "DONATION_SAVED"
                      ? "active"
                      : "future",
                  },
                  {
                    label: "Sending Confirmation Email",
                    status: ["EMAIL_SENT", "ADMIN_NOTIFIED", "COMPLETED"].includes(currentState)
                      ? "completed"
                      : (currentState === "DONATION_SAVED" && paymentStatusData?.receiptNumber)
                      ? "active"
                      : "future",
                  },
                  {
                    label: "Notifying Admin",
                    status: ["ADMIN_NOTIFIED", "COMPLETED"].includes(currentState)
                      ? "completed"
                      : currentState === "EMAIL_SENT"
                      ? "active"
                      : "future",
                  },
                ];

                return (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-2xl font-display font-semibold flex items-center gap-2 text-slate-800">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        Payment Status
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1 font-medium">
                        Waiting for payment completion...
                      </p>
                    </div>

                    {popupBlockerActive && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs space-y-3">
                        <div className="flex gap-2 text-amber-800 font-bold items-start">
                          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p>Popup Blocker Active</p>
                            <p className="font-medium text-amber-700 mt-1">
                              Your browser blocked opening the Cashfree payment tab. Please allow pop-ups for this site or click the button below to open checkout.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (paymentSession?.sessionId) {
                              const w = window.open("about:blank", "_blank");
                              if (w) {
                                writeBrandedLoadingPage(w);
                                try {
                                  (w as any).startCheckout(paymentSession.sessionId, (paymentSession.environment || "sandbox").toLowerCase());
                                  setPopupBlockerActive(false);
                                } catch (sdkErr) {
                                  console.error("SDK initialization trigger failed:", sdkErr);
                                  w.close();
                                }
                              }
                            }
                          }}
                          className="btn-saffron py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open Cashfree Checkout
                        </button>
                      </div>
                    )}

                    <div className="relative pl-8 space-y-6 mt-6">
                      {/* Vertical line connector */}
                      <div className="absolute left-[10px] top-2 bottom-2 w-0.5 bg-slate-100" />

                      {steps.map((s, idx) => {
                        let iconEl = null;
                        let textClass = "text-slate-400 font-semibold";

                        if (s.status === "completed") {
                          iconEl = <CheckCircle2 className="h-5 w-5 text-emerald-500 bg-surface" />;
                          textClass = "text-slate-700 font-bold";
                        } else if (s.status === "active") {
                          iconEl = <Loader2 className="h-5 w-5 text-amber-500 animate-spin bg-surface" />;
                          textClass = "text-amber-600 font-bold animate-pulse";
                        } else if (s.status === "warning") {
                          iconEl = <AlertCircle className="h-5 w-5 text-amber-500 bg-surface" />;
                          textClass = "text-amber-700 font-bold";
                        } else {
                          iconEl = (
                            <div className="h-5 w-5 rounded-full border-2 border-slate-200 bg-surface flex items-center justify-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                            </div>
                          );
                        }

                        return (
                          <div key={idx} className="relative flex items-center gap-4 text-sm leading-relaxed">
                            <div className="absolute -left-[29px] flex items-center justify-center bg-surface w-6 h-6">
                              {iconEl}
                            </div>
                            <span className={textClass}>{s.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          if (pollingIntervalId) {
                            clearInterval(pollingIntervalId);
                          }
                          // Regenerate idempotency key to prevent session reuse
                          setIdempotencyKey(window.crypto?.randomUUID?.() || "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
                            const r = (Math.random() * 16) | 0;
                            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
                          }));
                          setPaymentState("form");
                          setPaymentStatusData(null);
                          setPaymentSession(null);
                          setLoading(false);
                        }}
                        className="w-full sm:w-auto border-2 border-slate-200 hover:border-slate-300 text-slate-600 py-2.5 px-5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Modify Details / Cancel
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* PAYMENT SUCCESS VIEW */}
              {paymentState === "success" && (
                <div className="space-y-6 text-center py-4">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 text-emerald-500 animate-bounce mb-2">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-slate-800">
                    Donation Successful
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    Thank you for your contribution. Your donation is saved and receipt generated successfully.
                  </p>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left space-y-4 text-xs font-semibold text-slate-600 max-w-md mx-auto">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-400">Donor Name</span>
                      <span className="text-slate-800">{paymentStatusData?.donorName || name}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-400">Donation Amount</span>
                      <span className="text-slate-800 font-bold text-primary">
                        ₹{(paymentStatusData?.amount || amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-400">Transaction ID</span>
                      <span className="text-slate-800 truncate max-w-[180px]" title={paymentStatusData?.id}>
                        {paymentStatusData?.id}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-400">Order ID</span>
                      <span className="text-slate-800 truncate max-w-[180px]" title={paymentStatusData?.idempotencyKey}>
                        {paymentStatusData?.idempotencyKey}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-400">Payment Date</span>
                      <span className="text-slate-800">{new Date().toLocaleDateString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Receipt Number</span>
                      <span className="text-slate-800 font-bold">{paymentStatusData?.receiptNumber || "Pending"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-4">
                    <button
                      onClick={() => {
                        const donationId = paymentStatusData?.donationId || paymentStatusData?.id;
                        if (donationId) {
                          window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/payments/receipt/${donationId}`, "_blank");
                        } else {
                          toast.error("Receipt still generating, please wait a moment.");
                        }
                      }}
                      className="btn-saffron w-full sm:w-auto py-3 px-6 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileDown className="h-4 w-4" />
                      Download Receipt
                    </button>
                    
                    <button
                      onClick={() => {
                        setPaymentState("form");
                        setPaymentStatusData(null);
                        setPaymentSession(null);
                        setStep(1);
                        setCustom("");
                        setName("");
                        setEmail("");
                        setPhone("");
                        setAddress("");
                        setPan("");
                        setTouched(false);
                        setLoading(false);
                      }}
                      className="w-full sm:w-auto border-2 border-slate-200 hover:border-slate-300 text-slate-600 py-3 px-6 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Make Another Donation
                    </button>

                    <button
                      onClick={() => {
                        window.location.href = "/";
                      }}
                      className="w-full sm:w-auto border-2 border-slate-200 hover:border-slate-300 text-slate-600 py-3 px-6 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Home className="h-4 w-4" />
                      Return Home
                    </button>
                  </div>
                </div>
              )}

              {/* PAYMENT FAILED VIEW */}
              {paymentState === "failed" && (
                <div className="space-y-6 text-center py-6">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-rose-50 text-rose-500 animate-pulse mb-2">
                    <XCircle className="h-10 w-10" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-slate-800">
                    Payment Failed
                  </h2>
                  <p className="text-slate-500 text-sm font-medium max-w-md mx-auto">
                    {paymentStatusData?.lastError || "The transaction was declined by the bank or payment gateway. Please check your credentials and try again."}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-6">
                    <button
                      onClick={() => {
                        setIdempotencyKey(window.crypto?.randomUUID?.() || "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
                          const r = (Math.random() * 16) | 0;
                          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
                        }));
                        setPaymentState("form");
                        setPaymentStatusData(null);
                        setLoading(false);
                      }}
                      className="btn-saffron w-full sm:w-auto py-3.5 px-6 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4 animate-spin-reverse" />
                      Retry Payment
                    </button>

                    <button
                      onClick={() => {
                        window.location.href = "/contact";
                      }}
                      className="w-full sm:w-auto border-2 border-slate-200 hover:border-slate-300 text-slate-600 py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl p-7 bg-surface-warm border border-border">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-leaf" /> {t("donate.benefit.title")}
              </h3>
              <ul className="mt-4 space-y-3 text-sm font-medium">
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 mt-0.5 text-primary flex-none" /> {t("cert.trust")}{" "}
                  ({t("cert.trust.desc")})
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 mt-0.5 text-primary flex-none" /> {t("cert.12a")} &{" "}
                  {t("cert.80g")} — {t("donate.benefit.point1")}
                </li>
                <li className="flex items-start gap-2">
                  <FileCheck2 className="h-4 w-4 mt-0.5 text-primary flex-none" />{" "}
                  {t("cert.darpan")} ({t("cert.darpan.desc")})
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 mt-0.5 text-primary flex-none" />{" "}
                  {t("donate.benefit.point2")} & {t("donate.benefit.point3")}
                </li>
              </ul>
            </div>

            <div className="rounded-3xl p-7 bg-[#121B34] text-white border border-[#29324A]">
              <h3 className="font-display text-xl font-semibold">{t("donate.benefit.title")}</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {IMPACT.map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-white/10 p-3 flex items-center gap-2 text-sm font-semibold"
                  >
                    <Icon className="h-4 w-4 text-[#F7E81D]" /> {label}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Donate;

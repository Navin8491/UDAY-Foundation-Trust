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
  CheckCircle2,
  Printer,
  Download,
  Loader2,
  XCircle,
  CreditCard,
  Landmark,
  Lock,
  QrCode,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { initiateDonationPayment, fetchPaymentStatus, verifyRazorpaySignature } from "@/services/db";
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
    legalNote: "भारतीय आयकर नियमों के अनुसार 80G कर छूट के लिए पैन कार्ड नंबर प्रदान करना अनिवार्य है.",
    donateAgain: "दूसरा दान करें",
  },
};

export function Donate() {
  const [step, setStep] = useState(1); // 1 = select amount, 2 = fill details, 3 = success screen
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  
  const [selected, setSelected] = useState(2500);
  const [custom, setCustom] = useState("");
  
  // Donor details fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pan, setPan] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");
  
  const [idempotencyKey, setIdempotencyKey] = useState(() => {
    return window.crypto?.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  });
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [donationId, setDonationId] = useState("");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpayCheckout = async (sessionData: any) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load Razorpay payment script. Check your internet connection.");
      setLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_T8ZPJRLY7gu0e8",
      amount: sessionData.amount,
      currency: sessionData.currency,
      name: "Uday Foundation Trust",
      description: "General Donation Contribution",
      order_id: sessionData.orderId,
      handler: async function (response: any) {
        setVerifying(true);
        setStep(3);
        setLoading(false);
        try {
          const verifyRes = await verifyRazorpaySignature({
            idempotencyKey: sessionData.idempotencyKey,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.success) {
            toast.success("Payment verified successfully!");
            setDonationId(verifyRes.donationId || verifyRes.eventId);
            // Fetch status to load receipt number
            const status = await fetchPaymentStatus(sessionData.idempotencyKey);
            if (status.receiptNumber) {
              setReceiptNo(status.receiptNumber);
            }
          } else {
            setVerificationError("Signature verification failed.");
          }
        } catch (err: any) {
          setVerificationError(err.message || "Failed to verify transaction signature.");
        } finally {
          setVerifying(false);
        }
      },
      prefill: {
        name: sessionData.donorName,
        email: sessionData.email,
        contact: sessionData.phone,
      },
      theme: {
        color: "#7A9D1C",
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment modal dismissed by user.");
          setLoading(false);
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", function (resp: any) {
      toast.error(`Payment failed: ${resp.error.description}`);
    });
    rzp.open();
  };

  const { t, language } = useLanguage();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const key = params.get("idempotency_key");

    if (status === "success" && key) {
      setStep(3);
      setVerifying(true);
      setVerificationError("");

      // Poll backend status for transaction completion
      let pollCount = 0;
      const interval = setInterval(async () => {
        pollCount++;
        try {
          const res = await fetchPaymentStatus(key);
          
          if (["COMPLETED", "DONATION_SAVED", "EMAIL_SENT", "ADMIN_NOTIFIED"].includes(res.currentState)) {
            clearInterval(interval);
            setName(res.donorName || "");
            setEmail(res.email || "");
            setPhone(res.phone || "");
            if (res.donationId) {
              setDonationId(res.donationId);
            }
            if (res.receiptNumber) {
              setReceiptNo(res.receiptNumber);
            }
            setVerifying(false);
          } else if (res.currentState === "FAILED") {
            clearInterval(interval);
            setVerificationError(res.lastError || "Payment failed at gateway.");
            setVerifying(false);
          }
        } catch (e: any) {
          console.error("Error polling payment status:", e.message);
        }

        if (pollCount >= 20) {
          clearInterval(interval);
          setVerificationError("Verification timeout. Please check your email or contact support.");
          setVerifying(false);
        }
      }, 1000);

      return () => clearInterval(interval);
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

  // PAN card verification: 5 Letters, 4 Digits, 1 Letter
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

  const handleReset = () => {
    setSelected(2500);
    setCustom("");
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPan("");
    setTouched(false);
    setStep(1);
    setShowPaymentSelection(false);
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardName("");
    setUpiId("");
    setSelectedBank("");
    setVerificationError("");
    setVerifying(false);
    // Clear URL search params
    window.history.replaceState({}, document.title, window.location.pathname);
    // Generate new key
    setIdempotencyKey(window.crypto?.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }));
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
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-display font-semibold">
                    {t("donate.card.title")}
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">{t("donate.amount.label")}</p>

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
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {t("donate.custom.placeholder")}
                    </label>
                    <input
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
              {step === 2 && (
                <div className="space-y-6">
                  
                  {/* Back button */}
                  <button
                    onClick={() => {
                      if (showPaymentSelection) {
                        setShowPaymentSelection(false);
                      } else {
                        setStep(1);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> {showPaymentSelection ? "Back to Donor Details" : trans.back}
                  </button>

                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-2xl font-display font-semibold">
                      {showPaymentSelection ? "Choose Payment Method" : trans.donorDetails}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 font-semibold">
                      Selected Donation: <span className="text-primary font-bold">₹{amount.toLocaleString("en-IN")}</span>
                    </p>
                  </div>

                  {!showPaymentSelection ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setTouched(true);
                        if (!isFormValid) return;
                        setShowPaymentSelection(true);
                      }}
                      className="space-y-4 text-xs font-semibold"
                    >
                    
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider">{trans.name} *</label>
                      <input
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
                        <label className="text-slate-500 uppercase tracking-wider">{trans.email} *</label>
                        <input
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
                        <label className="text-slate-500 uppercase tracking-wider">{trans.phone} *</label>
                        <input
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
                      <label className="text-slate-500 uppercase tracking-wider">{trans.address} *</label>
                      <textarea
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
                        <label className="text-slate-500 uppercase tracking-wider">{trans.pan} *</label>
                        <span className="text-[10px] text-slate-400 font-bold">10-characters</span>
                      </div>
                      <input
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
                          showPanError ? "border-rose-500 focus:border-rose-500" : "border-border focus:border-primary"
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
                      <span className="font-bold text-primary uppercase tracking-wider block mb-0.5">80G Tax Rebate Benefit</span>
                      {trans.legalNote}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!isFormValid || loading}
                      className="w-full btn-saffron text-sm font-bold uppercase tracking-wider py-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Heart className="h-4.5 w-4.5 animate-pulse" /> {loading ? "Processing..." : `${trans.complete} : ₹${amount.toLocaleString("en-IN")}`}
                    </button>
                  </form>
                ) : (
                  /* Redesigned Payment Selection (Step 2.5) */
                  <div className="space-y-6 animate-scale-up">
                    {/* Summary Card */}
                    <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-3.5">
                      <h4 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider">Donation Summary</h4>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-400">Total Contribution</span>
                        <span className="text-primary font-bold text-base">₹{amount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="border-t border-slate-100/80 pt-3 space-y-2 text-[11px] font-semibold text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Donor Name:</span>
                          <span className="text-slate-800 font-bold">{name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Email Address:</span>
                          <span className="text-slate-800">{email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">PAN Card:</span>
                          <span className="text-slate-800 uppercase">{pan}</span>
                        </div>
                      </div>
                    </div>

                    {/* Selector Tabs */}
                    <div className="bg-slate-100/80 border border-slate-200/50 rounded-2xl p-1 flex font-bold text-xs">
                      {[
                        { id: "card", Icon: CreditCard, label: "Card" },
                        { id: "upi", Icon: QrCode, label: "UPI" },
                        { id: "netbanking", Icon: Landmark, label: "Net Bank" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            paymentMethod === m.id
                              ? "bg-white text-primary shadow-xs border border-slate-200/40"
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          <m.Icon className="h-4 w-4" /> {m.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Contents */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-100 min-h-[220px]">
                      {paymentMethod === "card" && (
                        <div className="space-y-4">
                          {/* Card Preview Graphic */}
                          <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-primary/95 to-[#1A2E66] text-white p-5 flex flex-col justify-between shadow-sm relative overflow-hidden select-none">
                            <div className="absolute right-[-10px] top-[-10px] w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none" />
                            <div className="flex justify-between items-start">
                              <span className="font-display font-bold text-[9px] uppercase tracking-widest text-white/80">Secured Donation Card</span>
                              <Lock className="h-3.5 w-3.5 text-white/60" />
                            </div>
                            <div className="font-mono text-base tracking-widest text-center my-2 font-bold">
                              {cardNumber || "•••• •••• •••• ••••"}
                            </div>
                            <div className="flex justify-between items-center text-[9px] uppercase font-bold text-white/90">
                              <div>
                                <span className="text-[7px] text-white/50 block mb-0.5">Card Holder</span>
                                <span className="truncate max-w-[150px] inline-block">{cardName || "YOUR NAME"}</span>
                              </div>
                              <div className="text-right font-mono">
                                <span className="text-[7px] text-white/50 block mb-0.5">Expires</span>
                                <span>{cardExpiry || "MM/YY"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Inputs */}
                          <div className="space-y-3 text-xs font-semibold text-left">
                            <div className="space-y-1">
                              <label className="text-slate-400 uppercase tracking-wider">Cardholder Name</label>
                              <input
                                type="text"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                placeholder="CARDHOLDER NAME"
                                className="w-full h-10 px-4 rounded-xl border border-border bg-slate-50 focus:outline-hidden focus:border-primary text-sm font-medium"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400 uppercase tracking-wider">Card Number</label>
                              <input
                                type="text"
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, "");
                                  const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
                                  setCardNumber(formatted);
                                }}
                                placeholder="4111 2222 3333 4444"
                                className="w-full h-10 px-4 rounded-xl border border-border bg-slate-50 focus:outline-hidden focus:border-primary text-sm font-medium font-mono"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-slate-400 uppercase tracking-wider">Expiry Date</label>
                                <input
                                  type="text"
                                  maxLength={5}
                                  value={cardExpiry}
                                  placeholder="MM/YY"
                                  onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, "");
                                    if (val.length > 2) {
                                      val = val.substring(0, 2) + "/" + val.substring(2);
                                    }
                                    setCardExpiry(val);
                                  }}
                                  className="w-full h-10 px-4 rounded-xl border border-border bg-slate-50 focus:outline-hidden focus:border-primary text-sm font-medium font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-slate-400 uppercase tracking-wider">CVV</label>
                                <input
                                  type="password"
                                  maxLength={3}
                                  value={cardCvv}
                                  placeholder="•••"
                                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                                  className="w-full h-10 px-4 rounded-xl border border-border bg-slate-50 focus:outline-hidden focus:border-primary text-sm font-medium font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "upi" && (
                        <div className="space-y-5 text-center flex flex-col items-center py-2">
                          <div className="p-3 border border-slate-100 rounded-3xl bg-slate-50 shadow-xs relative group select-none">
                            <div className="absolute inset-0 bg-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Scan with any UPI App</span>
                            </div>
                            <div className="h-28 w-28 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-2">
                              <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100">
                                <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                                <rect x="5" y="5" width="20" height="20" fill="white" />
                                <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                                <rect x="75" y="5" width="20" height="20" fill="white" />
                                <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                                <rect x="5" y="75" width="20" height="20" fill="white" />
                                <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                                <path d="M40,0 h10 v10 h-10 z M50,20 h10 v10 h-10 z M80,40 h10 v20 h-10 z M0,40 h10 v10 h-10 z M20,50 h15 v10 h-15 z M60,70 h20 v10 h-20 z M80,80 h10 v10 h-10 z M50,80 h10 v10 h-10 z" fill="currentColor" />
                              </svg>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">or pay using UPI ID</span>
                          <div className="w-full space-y-1.5 text-xs font-semibold text-left">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                              placeholder="e.g., username@upi"
                              className="w-full h-11 px-4 rounded-xl border border-border bg-slate-50 focus:outline-hidden focus:border-primary text-sm font-medium font-mono text-center"
                            />
                          </div>
                        </div>
                      )}

                      {paymentMethod === "netbanking" && (
                        <div className="space-y-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 text-left">Popular Banks</span>
                          <div className="grid grid-cols-2 gap-2.5 text-xs font-bold">
                            {[
                              { id: "sbi", label: "State Bank of India" },
                              { id: "hdfc", label: "HDFC Bank" },
                              { id: "icici", label: "ICICI Bank" },
                              { id: "axis", label: "Axis Bank" },
                            ].map((bank) => (
                              <button
                                key={bank.id}
                                type="button"
                                onClick={() => setSelectedBank(bank.id)}
                                className={`py-3 px-4 rounded-xl border text-center transition-all cursor-pointer truncate ${
                                  selectedBank === bank.id
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600"
                                  }`}
                              >
                                {bank.label}
                              </button>
                            ))}
                          </div>
                          <div className="space-y-1.5 text-xs font-semibold mt-3 text-left">
                            <label className="text-slate-400 uppercase tracking-wider block">Other Banks</label>
                            <select
                              value={selectedBank}
                              onChange={(e) => setSelectedBank(e.target.value)}
                              className="w-full h-11 px-4 rounded-xl border border-border bg-slate-50 focus:outline-hidden focus:border-primary text-sm font-medium cursor-pointer"
                            >
                              <option value="">-- Select Your Bank --</option>
                              <option value="kotak">Kotak Mahindra Bank</option>
                              <option value="pnb">Punjab National Bank</option>
                              <option value="bob">Bank of Baroda</option>
                              <option value="yes">Yes Bank</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pay CTA Button */}
                    <button
                      type="button"
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const session = await initiateDonationPayment({
                            donorName: name,
                            email,
                            phone,
                            address,
                            panNumber: pan,
                            amount,
                            purpose: "General Donation",
                            idempotencyKey
                          });

                          if (session.status === "already_completed") {
                            toast.success("This donation has already been processed!");
                            if (session.eventId) setDonationId(session.eventId);
                            setStep(3);
                            setLoading(false);
                          } else if (session.url) {
                            window.location.href = session.url;
                          } else if (session.orderId) {
                            await openRazorpayCheckout(session);
                          } else {
                            throw new Error("No payment session details returned.");
                          }
                        } catch (err: any) {
                          console.error(err);
                          toast.error(err.message || "Failed to initiate payment session.");
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="w-full btn-saffron text-sm font-bold uppercase tracking-wider py-4 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Lock className="h-4 w-4" /> {loading ? "Processing..." : `Pay Securely : ₹${amount.toLocaleString("en-IN")}`}
                    </button>
                  </div>
                )}
              </div>
            )}

              {/* STEP 3: Success Confirmation */}
              {step === 3 && (
                <div className="text-center py-6 space-y-6">
                  {verifying ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />
                      <h3 className="font-display text-lg font-bold text-slate-800">Verifying Payment Status...</h3>
                      <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
                        Please do not refresh the page. We are securely validating your contribution with the bank.
                      </p>
                    </div>
                  ) : verificationError ? (
                    <div className="py-8 space-y-4 text-center">
                      <div className="h-14 w-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                        <XCircle className="h-8 w-8" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-800">Verification Failed</h3>
                      <p className="text-xs text-rose-500 font-bold max-w-sm mx-auto leading-relaxed">
                        {verificationError}
                      </p>
                      <button
                        onClick={handleReset}
                        className="btn-ghost text-xs font-bold uppercase tracking-wider py-2.5 px-6 border border-slate-200"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-scale-up">
                      {/* Success Badge & Headline (hidden during print) */}
                      <div className="print:hidden">
                        <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xs mb-4">
                          <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                          {trans.successMsg}
                        </h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium">
                          Thank you, <span className="font-bold text-slate-800">{name}</span>! Your contribution makes a real difference.
                        </p>
                      </div>

                      {/* REDESIGNED PAPER RECEIPT CARD */}
                      <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-6 md:p-8 space-y-6 relative overflow-hidden text-left text-xs font-semibold text-slate-600 print:border-none print:shadow-none print:p-0 print:m-0">
                        {/* Receipt Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <img src={SITE.logo} alt="NGO Logo" className="h-12 w-12 object-contain" />
                            <div>
                              <h3 className="font-display font-bold text-sm text-slate-900">Uday Foundation Trust</h3>
                              <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Reg No: Guj/23016/Ahmedabad</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold text-[9px] uppercase tracking-wider inline-block mb-1">
                              Payment Successful
                            </span>
                            <span className="text-[10px] text-slate-400 block font-mono">Date: {new Date().toLocaleDateString("en-IN")}</span>
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
                            <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">Receipt Number</span>
                            <span className="font-mono text-slate-900 font-bold text-[11px]">{receiptNo || `UFT-REC-${(donationId || idempotencyKey).substring(0, 8).toUpperCase()}`}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">PAN Number (80G Tax Exempt)</span>
                            <span className="text-slate-900 font-bold uppercase">{pan || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">Donor Name</span>
                            <span className="text-slate-900 font-bold">{name}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">Email Address</span>
                            <span className="text-slate-900 font-bold truncate block max-w-[180px]">{email}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">Phone Number</span>
                            <span className="text-slate-900 font-bold">{phone || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-0.5">Payment Method</span>
                            <span className="text-slate-900 font-bold capitalize">{paymentMethod === "netbanking" ? "Net Banking" : paymentMethod.toUpperCase()}</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <span className="text-slate-400 uppercase tracking-wider text-[8px] block mb-1">Donor Address</span>
                          <span className="text-slate-900 font-bold text-[10px] leading-relaxed block bg-slate-50 border border-slate-100 rounded-xl p-3">{address || "N/A"}</span>
                        </div>

                        {/* Amount Box */}
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center justify-between mt-2 print:bg-slate-50">
                          <div>
                            <span className="text-primary font-bold text-[9px] uppercase tracking-wider block mb-0.5">Donated Amount</span>
                            <span className="text-slate-400 text-[10px] block font-medium">INR {Number(amount).toLocaleString("en-IN")} Rupees Only</span>
                          </div>
                          <span className="text-primary font-bold text-xl md:text-2xl">
                            ₹{amount.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Tax Slab Notice */}
                        <div className="border-t border-slate-100 pt-4 text-[9px] text-slate-400 font-medium leading-relaxed">
                          <p>
                            * This is a computer-generated tax receipt eligible for tax deduction under Section 80G of the Income Tax Act, 1961. A copy of this receipt has been emailed to you.
                          </p>
                        </div>
                      </div>

                      {/* Interactive Receipt Actions */}
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        {donationId && (
                          <a
                            href={`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/payments/receipt/${donationId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#7A9D1C]/15 hover:bg-[#7A9D1C]/20 text-[#7A9D1C] text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                          >
                            <Download className="h-4 w-4" /> Download PDF Receipt
                          </a>
                        )}
                        <button
                          onClick={() => window.print()}
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                        >
                          <Printer className="h-4 w-4" /> Print Page
                        </button>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleReset}
                          className="btn-primary text-xs font-bold uppercase tracking-wider py-3 px-6 cursor-pointer"
                        >
                          {trans.donateAgain}
                        </button>
                      </div>
                    </div>
                  )}
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

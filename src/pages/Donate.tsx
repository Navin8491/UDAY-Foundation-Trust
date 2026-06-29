import { useState } from "react";
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
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { submitDonation } from "@/services/db";
import { toast } from "sonner";

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

  const { t, language } = useLanguage();

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
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> {trans.back}
                  </button>

                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-2xl font-display font-semibold">
                      {trans.donorDetails}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 font-semibold">
                      Selected Donation: <span className="text-primary font-bold">₹{amount.toLocaleString("en-IN")}</span>
                    </p>
                  </div>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setTouched(true);
                      if (!isFormValid) return;
                      
                      setLoading(true);
                      try {
                        const receipt = await submitDonation({
                          donorName: name,
                          email,
                          phone,
                          address,
                          panNumber: pan,
                          amount,
                          purpose: "General Donation"
                        });
                        setReceiptNo(receipt);
                        setStep(3);
                      } catch (err) {
                        console.error(err);
                        toast.error("Donation record submission failed. Please try again.");
                      } finally {
                        setLoading(false);
                      }
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
                </div>
              )}

              {/* STEP 3: Success Confirmation */}
              {step === 3 && (
                <div className="text-center py-6 space-y-6 animate-scale-up">
                  <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                      {trans.successMsg}
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                      Thank you, <span className="font-bold text-slate-800">{name}</span>!
                    </p>
                  </div>

                  <div className="max-w-md mx-auto bg-slate-50 border border-slate-200/60 rounded-3xl p-5 text-xs font-semibold text-slate-600 space-y-3">
                    <div className="flex justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-400">DONATION AMOUNT</span>
                      <span className="text-primary font-bold text-sm">₹{amount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-400">DONOR EMAIL</span>
                      <span>{email}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-400">PAN CARD NUMBER</span>
                      <span className="uppercase">{pan}</span>
                    </div>
                    {receiptNo && (
                      <div className="flex justify-between pb-2 border-b border-slate-100">
                        <span className="text-slate-400">RECEIPT NUMBER</span>
                        <span className="font-mono font-bold text-slate-700">{receiptNo}</span>
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 text-left leading-normal">
                      {trans.receiptSent} <span className="text-slate-800 font-bold">{email}</span> and sms receipt to <span className="text-slate-800 font-bold">{phone}</span>.
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="btn-primary text-xs font-bold uppercase tracking-wider py-3 px-6 cursor-pointer"
                  >
                    {trans.donateAgain}
                  </button>
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

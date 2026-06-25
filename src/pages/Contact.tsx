import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/constants/site";
import { useDocumentMetadata } from "@/hooks/useDocumentMetadata";
import { MapPin, Phone, Mail, Send, Instagram, Facebook, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function Contact() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  useDocumentMetadata(
    "Contact Uday Foundation Trust, Sanand",
    `Reach Uday Foundation Trust at Ambedkar Nagar, Soyla, Sanand. Phone: ${SITE.phone}. Email: ${SITE.email}.`,
  );

  return (
    <>
      <PageHero
        eyebrow={t("nav.contact")}
        title={t("contact.title")}
        subtitle={t("contact.desc")}
      />

      <section className="section-y">
        <div className="container-page grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-5">
            {[
              {
                Icon: MapPin,
                label: t("footer.address"),
                value: t("contact.address.value"),
                href: undefined,
              },
              {
                Icon: Phone,
                label: t("footer.phone"),
                value: SITE.phone,
                href: `tel:${SITE.phoneRaw}`,
              },
              {
                Icon: Mail,
                label: t("footer.email"),
                value: SITE.email,
                href: `mailto:${SITE.email}`,
              },
            ].map(({ Icon, label, value, href }) => (
              <a
                key={label}
                href={href ?? undefined}
                className={`block rounded-2xl p-6 bg-surface border border-border ${href ? "hover:border-primary/40 transition-colors" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center flex-none">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {label}
                    </div>
                    <div className="mt-1 font-medium break-words">{value}</div>
                  </div>
                </div>
              </a>
            ))}

            <div className="rounded-2xl p-6 bg-surface-warm border border-border">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {t("contact.followUs")}
              </div>
              <div className="mt-3 flex gap-2">
                <a
                  href={SITE.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 w-11 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href={SITE.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 w-11 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href={SITE.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 w-11 rounded-full bg-[oklch(0.7_0.18_145)] text-white inline-flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-surface border border-border p-7 md:p-10 shadow-xs">
              <h2 className="text-2xl font-display font-semibold">{t("contact.form.title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("contact.form.subtitle")}</p>

              {sent ? (
                <div className="mt-8 rounded-2xl bg-[oklch(0.95_0.03_145)] border border-[oklch(0.85_0.08_145)] p-5 text-[oklch(0.35_0.12_145)] font-semibold text-center animate-in fade-in zoom-in-95">
                  {t("contact.form.sent")}
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="mt-8 space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-sm font-semibold text-foreground/80">
                        {t("contact.form.name")}
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        className="w-full h-11 px-4 rounded-xl border border-border bg-surface focus:outline-none focus:border-primary text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-sm font-semibold text-foreground/80">
                        {t("contact.form.email")}
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        className="w-full h-11 px-4 rounded-xl border border-border bg-surface focus:outline-none focus:border-primary text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-sm font-semibold text-foreground/80">
                        {t("contact.form.phone")}
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full h-11 px-4 rounded-xl border border-border bg-surface focus:outline-none focus:border-primary text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-sm font-semibold text-foreground/80">
                        Subject
                      </label>
                      <select
                        id="subject"
                        defaultValue="general"
                        className="w-full h-11 px-4 rounded-xl border border-border bg-surface focus:outline-none focus:border-primary text-sm transition-colors cursor-pointer"
                      >
                        <option value="general">{t("contact.form.opt.general")}</option>
                        <option value="volunteer">{t("contact.form.opt.volunteer")}</option>
                        <option value="donate">{t("contact.form.opt.donate")}</option>
                        <option value="csr">{t("contact.form.opt.csr")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-sm font-semibold text-foreground/80">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      placeholder={t("contact.form.msgPlaceholder")}
                      className="w-full p-4 rounded-xl border border-border bg-surface focus:outline-none focus:border-primary text-sm transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto btn-primary text-sm mt-2 cursor-pointer"
                  >
                    <Send className="h-4 w-4" /> {t("contact.form.submit")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;

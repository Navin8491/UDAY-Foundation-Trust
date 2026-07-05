import type { Metadata } from "next";
import "@/styles/index.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Uday Foundation Trust, Sanand — Service is True Dharma",
  description: "Uday Foundation Trust, Sanand is a Gujarat-based NGO serving education, healthcare, women empowerment, disaster relief and rural development across Ahmedabad and beyond.",
  authors: [{ name: "Uday Foundation Trust" }],
  openGraph: {
    title: "Uday Foundation Trust, Sanand",
    description: "Service is Culture, Service is True Dharma — Uday Foundation Trust transforms rural lives across Gujarat.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/png" href="/uday-logo.png" />
        <meta name="theme-color" content="#1e3a8a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://euhlbtlwbtsyrjryoesk.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://uday-foundation-trust.onrender.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Gujarati:wght@400;500;600;700;800&family=Noto+Serif+Gujarati:wght@500;700&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Noto+Serif+Devanagari:wght@500;700&display=swap"
          rel="stylesheet"
        />
        {/* ── Structured Data: Organization + NGO Schema ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["Organization", "NGO"],
                  "@id": "https://www.udayfoundationstrust.org/#organization",
                  "name": "Uday Foundation Trust",
                  "alternateName": "ઉદય ફાઉન્ડેશન ટ્રસ્ટ",
                  "url": "https://www.udayfoundationstrust.org",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.udayfoundationstrust.org/uday-logo.png",
                    "width": 512,
                    "height": 512,
                  },
                  "description": "Uday Foundation Trust is a Gujarat-based NGO serving education, healthcare, women empowerment, disaster relief and rural development across Ahmedabad and beyond.",
                  "slogan": "Service is Culture, Service is True Dharma",
                  "foundingDate": "2024-10-05",
                  "taxID": "AABTU5153H",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "314, Ambedkar Nagar, Mu. Soyla, Taluka Sanand",
                    "addressLocality": "Sanand",
                    "addressRegion": "Gujarat",
                    "postalCode": "382110",
                    "addressCountry": "IN",
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-96246-68484",
                    "contactType": "customer support",
                    "availableLanguage": ["English", "Gujarati", "Hindi"],
                  },
                  "email": "udayfts1024@gmail.com",
                  "telephone": "+91-96246-68484",
                  "sameAs": [
                    "https://www.instagram.com/uday_foundation_trust_sanand",
                    "https://facebook.com/",
                    "https://whatsapp.com/channel/0029Vasojke4NVimvIkQOG1g",
                  ],
                  "areaServed": {
                    "@type": "State",
                    "name": "Gujarat",
                  },
                  "knowsAbout": [
                    "Education",
                    "Healthcare",
                    "Women Empowerment",
                    "Disaster Relief",
                    "Rural Development",
                    "Environmental Sustainability",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.udayfoundationstrust.org/#website",
                  "url": "https://www.udayfoundationstrust.org",
                  "name": "Uday Foundation Trust",
                  "publisher": {
                    "@id": "https://www.udayfoundationstrust.org/#organization",
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.udayfoundationstrust.org/?s={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

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
        <link rel="icon" type="image/png" href="/src/assets/uday-logo.png" />
        <meta name="theme-color" content="#1e3a8a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://euhlbtlwbtsyrjryoesk.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://uday-foundation-trust.onrender.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Gujarati:wght@400;500;600;700;800&family=Noto+Serif+Gujarati:wght@500;700&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Noto+Serif+Devanagari:wght@500;700&display=swap"
          rel="stylesheet"
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

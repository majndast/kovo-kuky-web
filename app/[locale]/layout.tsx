import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingCta } from "@/components/floating-cta";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const meta = messages.metadata as Record<string, string>;

  return {
    title: {
      default: meta.title,
      template: `%s | KOVO-KUKY`,
    },
    description: meta.description,
    metadataBase: new URL("https://www.kovokuky.cz"),
    alternates: {
      canonical: "/",
      languages: {
        cs: "/cs",
        en: "/en",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: locale === "cs" ? "cs_CZ" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "cs" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "KOVO-KUKY",
    "image": "https://kovokuky.cz/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Veselská 59",
      "addressLocality": "Dolní Bukovsko",
      "postalCode": "373 65",
      "addressCountry": "CZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 49.172,
      "longitude": 14.583
    },
    "url": "https://www.kovokuky.cz",
    "telephone": "+420725770820",
    "description": locale === "cs"
      ? "Specialista na CNC obrábění, soustružení a frézování v Jihočeském kraji."
      : "CNC machining, turning, and milling specialist in South Bohemia, Czech Republic.",
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "16:00"
    }
  };

  const alternateLocale = locale === "cs" ? "en" : "cs";

  return (
    <html lang={locale}>
      <head>
        <link rel="alternate" hrefLang="cs" href="https://www.kovokuky.cz/cs" />
        <link rel="alternate" hrefLang="en" href="https://www.kovokuky.cz/en" />
        <link rel="alternate" hrefLang="x-default" href="https://www.kovokuky.cz/cs" />
        <link rel="help" type="text/plain" href="https://www.kovokuky.cz/llms.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingCta />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

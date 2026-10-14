import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingCta } from "@/components/floating-cta";
import { CookieConsent } from "@/components/cookie-consent";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Ambient } from "@/components/ambient";
import { JsonLd } from "@/components/json-ld";
import { siteSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/seo";
import "../globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

  // Page level metadata (title, canonical, hreflang, Open Graph) is set by each page.
  return {
    title: { default: meta.title, template: "%s" },
    description: meta.description,
    metadataBase: new URL(SITE_URL),
    applicationName: "KOVO-KUKY",
    authors: [{ name: "KOVO-KUKY" }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
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

  if (!routing.locales.includes(locale as "cs" | "de")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-background font-sans antialiased`}
      >
        <JsonLd
          data={siteSchema(
            locale as "cs" | "de",
            messages as unknown as Parameters<typeof siteSchema>[1]
          )}
        />
        <NextIntlClientProvider messages={messages}>
          <Ambient />
          <Navbar />
          <main className="min-h-[100dvh]">{children}</main>
          <Footer />
          <FloatingCta />
          <CookieConsent />
          <GoogleAnalytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

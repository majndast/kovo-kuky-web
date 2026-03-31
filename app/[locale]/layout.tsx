import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingCta } from "@/components/floating-cta";
import { CookieConsent } from "@/components/cookie-consent";
import { GoogleAnalytics } from "@/components/google-analytics";
import { RecaptchaProvider } from "@/components/recaptcha-provider";
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
      languages: {
        cs: "/cs",
        de: "/de",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: locale === "cs" ? "cs_CZ" : "de_DE",
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

  if (!routing.locales.includes(locale as "cs" | "de")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  // LocalBusiness + Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ManufacturingBusiness"],
    "@id": "https://www.kovokuky.cz/#organization",
    "name": "KOVO-KUKY",
    "legalName": "Václav Kukačka",
    "alternateName": "KOVO KUKY",
    "taxID": "CZ8011251237",
    "vatID": "CZ8011251237",
    "iso6523Code": "72180714",
    "foundingDate": "1990",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": 6
    },
    "image": "https://www.kovokuky.cz/logo.png",
    "logo": "https://www.kovokuky.cz/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Veselská 58",
      "addressLocality": "Dolní Bukovsko",
      "addressRegion": "Jihočeský kraj",
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
    "email": "info@kovo-kuky.cz",
    "description": locale === "cs"
      ? "Rodinná firma specializující se na CNC obrábění, soustružení a frézování kovů. 13 CNC strojů, přesnost ±0.005 mm, nabídka do 48 hodin."
      : "Familienunternehmen spezialisiert auf CNC-Bearbeitung, Drehen und Fräsen von Metallen. 13 CNC-Maschinen, Präzision ±0,005 mm, Angebot innerhalb 48 Stunden.",
    "priceRange": "$$",
    "currenciesAccepted": "CZK, EUR",
    "paymentAccepted": "Bank Transfer, Cash",
    "areaServed": ["CZ", "DE", "AT", "SK"],
    "knowsLanguage": ["cs", "de"],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "16:00"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": locale === "cs" ? "CNC služby" : "CNC-Dienstleistungen",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": locale === "cs" ? "CNC Soustružení" : "CNC-Drehen",
            "description": locale === "cs"
              ? "Přesné soustružení rotačních dílů na CNC soustruzích Doosan a Goodway s řízením Fanuc."
              : "Präzisionsdrehen von Rotationsteilen auf CNC-Drehmaschinen Doosan und Goodway mit Fanuc-Steuerung."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": locale === "cs" ? "CNC Frézování" : "CNC-Fräsen",
            "description": locale === "cs"
              ? "3-osé frézování na centrech XHS a Robodrill s přesností ±0.005 mm."
              : "3-Achsen-Fräsen auf XHS und Robodrill Zentren mit Präzision ±0,005 mm."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": locale === "cs" ? "Řezání materiálu" : "Materialzuschnitt",
            "description": locale === "cs"
              ? "Přesné dělení tyčového materiálu a profilů na pilách Bianco."
              : "Präzisionszuschnitt von Rundmaterial und Profilen auf Bianco-Sägen."
          }
        }
      ]
    },
    "sameAs": []
  };

  // FAQ Schema for GEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === "cs" ? [
      {
        "@type": "Question",
        "name": "Jaká je minimální objednávka?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Přijímáme zakázky od 1 kusu. Vyrábíme prototypy i série."
        }
      },
      {
        "@type": "Question",
        "name": "Jak rychle dostanu cenovou nabídku?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cenovou nabídku zasíláme do 48 hodin od přijetí poptávky s technickým výkresem."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké materiály obrábíte?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Obrábíme ocel, nerez, hliník, mosaz a technické plasty (POM, PA6, PTFE)."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké přesnosti dosahujete?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standardní tolerance je ±0,01 mm. Pro přesné díly dosahujeme ±0,005 mm."
        }
      },
      {
        "@type": "Question",
        "name": "Spolupracujete se zahraničními firmami?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano, pravidelně spolupracujeme s firmami z Německa, Rakouska a Slovenska. Komunikujeme česky a německy."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "Was ist die Mindestbestellmenge?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Wir nehmen Aufträge ab 1 Stück an. Wir fertigen sowohl Prototypen als auch Serien."
        }
      },
      {
        "@type": "Question",
        "name": "Wie schnell bekomme ich ein Angebot?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Wir senden Angebote innerhalb von 48 Stunden nach Erhalt Ihrer Anfrage mit technischer Zeichnung."
        }
      },
      {
        "@type": "Question",
        "name": "Welche Materialien bearbeiten Sie?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Wir bearbeiten Stahl, Edelstahl, Aluminium, Messing und technische Kunststoffe (POM, PA6, PTFE)."
        }
      },
      {
        "@type": "Question",
        "name": "Welche Toleranzen erreichen Sie?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standardtoleranz ist ±0,01 mm. Für Präzisionsteile erreichen wir ±0,005 mm."
        }
      },
      {
        "@type": "Question",
        "name": "Arbeiten Sie mit ausländischen Unternehmen zusammen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, wir arbeiten regelmäßig mit Unternehmen aus Deutschland, Österreich und der Slowakei zusammen. Wir kommunizieren auf Tschechisch und Deutsch."
        }
      }
    ]
  };

  // WebSite schema for sitelinks
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.kovokuky.cz/#website",
    "url": "https://www.kovokuky.cz",
    "name": "KOVO-KUKY",
    "description": locale === "cs"
      ? "CNC obrábění, soustružení a frézování na zakázku"
      : "CNC-Bearbeitung, Drehen und Fräsen auf Bestellung",
    "publisher": {
      "@id": "https://www.kovokuky.cz/#organization"
    },
    "inLanguage": [locale === "cs" ? "cs-CZ" : "de-DE"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.kovokuky.cz/{locale}/kontakt?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Combined JSON-LD
  const jsonLd = [organizationSchema, faqSchema, websiteSchema];

  const alternateLocale = locale === "cs" ? "de" : "cs";

  return (
    <html lang={locale}>
      <head>
        {/* Language alternates */}
        <link rel="alternate" hrefLang="cs" href="https://www.kovokuky.cz/cs" />
        <link rel="alternate" hrefLang="de" href="https://www.kovokuky.cz/de" />
        <link rel="alternate" hrefLang="x-default" href="https://www.kovokuky.cz/cs" />

        {/* GEO: AI/LLM discovery */}
        <link rel="help" type="text/plain" href="https://www.kovokuky.cz/llms.txt" />
        <link rel="author" href="https://www.kovokuky.cz/llms-full.txt" />
        <meta name="ai-content-declaration" content="human-created" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        {jsonLd.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <RecaptchaProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <FloatingCta />
            <CookieConsent />
          </RecaptchaProvider>
        </NextIntlClientProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}

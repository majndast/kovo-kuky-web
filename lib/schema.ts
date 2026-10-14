import { SITE_URL, SITE_NAME, urlFor, type Href, type Locale } from "@/lib/seo";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

type Messages = {
  metadata: { description: string };
  services: Record<string, { title: string; description: string }> & { title: string };
};

/** LocalBusiness + WebSite, emitted once in the layout. Only facts that appear on the site. */
export function siteSchema(locale: Locale, m: Messages) {
  const offers = (["turning", "milling", "cutting", "external"] as const).map((key) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: m.services[key].title,
      description: m.services[key].description,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ManufacturingBusiness"],
        "@id": ORG_ID,
        name: SITE_NAME,
        legalName: "Václav Kukačka",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
        image: `${SITE_URL}/${locale}/opengraph-image`,
        description: m.metadata.description,
        foundingDate: "1990",
        taxID: "CZ8011251237",
        identifier: { "@type": "PropertyValue", propertyID: "IČO", value: "72180714" },
        vatID: "CZ8011251237",
        numberOfEmployees: { "@type": "QuantitativeValue", value: 6 },
        telephone: "+420725770820",
        email: "info@kovokuky.cz",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Veselská 58",
          addressLocality: "Dolní Bukovsko",
          addressRegion: "Jihočeský kraj",
          postalCode: "373 65",
          addressCountry: "CZ",
        },
        areaServed: ["CZ", "DE", "AT", "SK"],
        knowsLanguage: ["cs", "de"],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "07:00",
          closes: "16:00",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: m.services.title,
          itemListElement: offers,
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: ["cs-CZ", "de-DE"],
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export function breadcrumbSchema(
  locale: Locale,
  trail: { name: string; href: Href }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: urlFor(t.href, locale),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function servicesSchema(
  locale: Locale,
  services: { name: string; description: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@graph": services.map((s) => ({
      "@type": "Service",
      name: s.name,
      description: s.description,
      serviceType: s.name,
      provider: { "@id": ORG_ID },
      areaServed: ["CZ", "DE", "AT", "SK"],
      url: urlFor("/sluzby", locale),
    })),
  };
}

export function pageSchema(
  type: "AboutPage" | "ContactPage" | "CollectionPage",
  locale: Locale,
  href: Href,
  name: string,
  description: string
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: urlFor(href, locale),
    inLanguage: locale === "cs" ? "cs-CZ" : "de-DE",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  };
}

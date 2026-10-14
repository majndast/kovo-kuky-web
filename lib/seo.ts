import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export const SITE_URL = "https://www.kovokuky.cz";
export const SITE_NAME = "KOVO-KUKY";

export type Href = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export function urlFor(href: Href, locale: Locale) {
  return SITE_URL + getPathname({ href, locale });
}

/** Canonical, hreflang pair, Open Graph and Twitter tags for one page. */
export function pageMetadata({
  locale,
  href,
  title,
  description,
}: {
  locale: string;
  href: Href;
  title: string;
  description: string;
}): Metadata {
  const l = locale as Locale;
  const url = urlFor(href, l);
  const other = l === "cs" ? "de" : "cs";

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        cs: urlFor(href, "cs"),
        de: urlFor(href, "de"),
        "x-default": urlFor(href, "cs"),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: l === "cs" ? "cs_CZ" : "de_DE",
      alternateLocale: other === "cs" ? "cs_CZ" : "de_DE",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { GalleryPageContent } from "./content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  const path = locale === "cs" ? "/cs/galerie" : "/en/gallery";
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `https://www.kovokuky.cz${path}`,
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GalleryPageContent />;
}

import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { GalleryPageContent } from "./content";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, pageSchema } from "@/lib/schema";
import { pageMetadata, type Locale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  // thin placeholder page until real photos are added
  return {
    ...pageMetadata({ locale, href: "/galerie", title: t("seo.title"), description: t("seo.description") }),
    robots: { index: false, follow: true },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "gallery" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(l, [
            { name: nav("home"), href: "/" },
            { name: nav("gallery"), href: "/galerie" },
          ]),
          pageSchema("CollectionPage", l, "/galerie", t("seo.title"), t("seo.description")),
        ]}
      />
      <GalleryPageContent />
    </>
  );
}

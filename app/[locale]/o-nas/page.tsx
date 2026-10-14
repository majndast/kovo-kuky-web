import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { AboutPageContent } from "./content";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, pageSchema } from "@/lib/schema";
import { pageMetadata, type Locale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ locale, href: "/o-nas", title: t("seo.title"), description: t("seo.description") });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(l, [
            { name: nav("home"), href: "/" },
            { name: nav("about"), href: "/o-nas" },
          ]),
          pageSchema("AboutPage", l, "/o-nas", t("seo.title"), t("seo.description")),
        ]}
      />
      <AboutPageContent />
    </>
  );
}

import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ContactPageContent } from "./content";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, pageSchema } from "@/lib/schema";
import { pageMetadata, type Locale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({ locale, href: "/kontakt", title: t("seo.title"), description: t("seo.description") });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "contact" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(l, [
            { name: nav("home"), href: "/" },
            { name: nav("contact"), href: "/kontakt" },
          ]),
          pageSchema("ContactPage", l, "/kontakt", t("seo.title"), t("seo.description")),
        ]}
      />
      <ContactPageContent />
    </>
  );
}

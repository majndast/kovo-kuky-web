import { setRequestLocale, getTranslations, getMessages } from "next-intl/server";
import type { Metadata } from "next";
import { ServicesPageContent } from "./content";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema, servicesSchema } from "@/lib/schema";
import { pageMetadata, type Locale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return pageMetadata({ locale, href: "/sluzby", title: t("seo.title"), description: t("seo.description") });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "services" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const messages = (await getMessages()) as unknown as { faq: { items: { q: string; a: string }[] } };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(l, [
            { name: nav("home"), href: "/" },
            { name: nav("services"), href: "/sluzby" },
          ]),
          servicesSchema(
            l,
            (["turning", "milling", "cutting", "external"] as const).map((k) => ({
              name: t(`${k}.title`),
              description: t(`${k}.description`),
            }))
          ),
          faqSchema(messages.faq.items),
        ]}
      />
      <ServicesPageContent />
    </>
  );
}

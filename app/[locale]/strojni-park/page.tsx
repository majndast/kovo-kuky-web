import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { MachineryPageContent } from "./content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "machinery" });
  const path = locale === "cs" ? "/cs/strojni-park" : "/en/machinery";
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `https://www.kovokuky.cz${path}`,
    },
  };
}

export default async function MachineryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MachineryPageContent />;
}

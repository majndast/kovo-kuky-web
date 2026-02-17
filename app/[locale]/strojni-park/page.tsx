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
  return {
    title: t("title"),
    description: t("subtitle"),
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

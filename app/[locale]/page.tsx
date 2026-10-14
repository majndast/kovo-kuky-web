import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { ServicesSection } from "@/components/services-section";
import { WhyUsSection } from "@/components/why-us-section";
import { ProcessSection } from "@/components/process-section";
import { AboutTeaser } from "@/components/about-teaser";
import { FaqSection } from "@/components/faq-section";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return pageMetadata({ locale, href: "/", title: t("title"), description: t("description") });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as unknown as { faq: { items: { q: string; a: string }[] } };

  return (
    <>
      <JsonLd data={faqSchema(messages.faq.items)} />
      <Hero />
      <ServicesSection />
      <WhyUsSection />
      <ProcessSection />
      <AboutTeaser />
      <FaqSection />
      <CtaSection />
    </>
  );
}

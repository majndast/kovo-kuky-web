import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/hero";
import { ServicesSection } from "@/components/services-section";
import { ProcessSection } from "@/components/process-section";
import { WhyUsSection } from "@/components/why-us-section";
import { StatsSection } from "@/components/stats-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CtaSection } from "@/components/cta-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ServicesSection />
      <StatsSection />
      <ProcessSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}

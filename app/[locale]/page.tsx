import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { Hero } from "@/components/hero";

// Lazy load sections below the fold - they use Framer Motion
const ServicesSection = dynamic(
  () => import("@/components/services-section").then((mod) => mod.ServicesSection),
  { ssr: true }
);
const StatsSection = dynamic(
  () => import("@/components/stats-section").then((mod) => mod.StatsSection),
  { ssr: true }
);
const ProcessSection = dynamic(
  () => import("@/components/process-section").then((mod) => mod.ProcessSection),
  { ssr: true }
);
const WhyUsSection = dynamic(
  () => import("@/components/why-us-section").then((mod) => mod.WhyUsSection),
  { ssr: true }
);
const TestimonialsSection = dynamic(
  () => import("@/components/testimonials-section").then((mod) => mod.TestimonialsSection),
  { ssr: true }
);
const CtaSection = dynamic(
  () => import("@/components/cta-section").then((mod) => mod.CtaSection),
  { ssr: true }
);

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

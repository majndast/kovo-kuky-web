"use client";

import { useTranslations } from "next-intl";
import { Bezel, Reveal, SectionHeading } from "@/components/ui-kit";

const reasons = ["precision", "quality", "delivery", "support", "speed", "series"] as const;

export function WhyUsSection() {
  const t = useTranslations("whyUs");

  return (
    <section className="px-4 py-24 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("title")} />

        <Reveal className="mt-16 md:mt-24">
          <Bezel innerClassName="overflow-hidden">
            {/* gap-px over a hairline background = crisp internal dividers */}
            <div className="grid gap-px bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
              {reasons.map((key) => (
                <div
                  key={key}
                  className="bg-black/40 p-8 transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.04] md:p-10"
                >
                  <h3 className="text-xl font-semibold leading-snug tracking-[-0.02em]">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {t(`${key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </Bezel>
        </Reveal>
      </div>
    </section>
  );
}

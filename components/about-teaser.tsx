"use client";

import { useTranslations } from "next-intl";
import { Bezel, PillLink, Reveal } from "@/components/ui-kit";

export function AboutTeaser() {
  const t = useTranslations("teaser");

  return (
    <section className="px-4 py-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Bezel innerClassName="px-8 py-14 md:px-16 md:py-20">
            <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
              <div>
                <h2 className="text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-4xl md:text-5xl">
                  {t("title")}
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  {t("text")}
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <PillLink href="/o-nas">{t("cta")}</PillLink>
                <PillLink href="/strojni-park" variant="glass">
                  {t("machinery")}
                </PillLink>
              </div>
            </div>
          </Bezel>
        </Reveal>
      </div>
    </section>
  );
}

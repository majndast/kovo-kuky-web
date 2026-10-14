"use client";

import { useTranslations } from "next-intl";
import { PillLink, Reveal } from "@/components/ui-kit";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="flex min-h-[100dvh] items-center px-4 pb-24 pt-32">
      <div className="mx-auto w-full max-w-6xl text-center">
        <Reveal immediate>
          <h1 className="mx-auto max-w-6xl text-balance text-[clamp(2.5rem,6.4vw,6rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            {t("title")} <span className="text-primary">{t("titleAccent")}</span>
          </h1>
        </Reveal>

        <Reveal immediate delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {t("subtitle")}
          </p>
        </Reveal>

        <Reveal immediate delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillLink href="/kontakt">{t("cta")}</PillLink>
            <PillLink href="/sluzby" variant="glass">
              {t("secondary")}
            </PillLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

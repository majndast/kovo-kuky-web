"use client";

import { useTranslations } from "next-intl";
import { Bezel, PillLink, Reveal } from "@/components/ui-kit";

export function CtaSection() {
  const t = useTranslations("cta");

  return (
    <section className="px-4 pb-24 pt-8 md:pb-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Bezel innerClassName="relative px-6 py-20 text-center md:px-16 md:py-32">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(34,197,94,0.12),transparent)]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-4xl text-balance text-[clamp(2.25rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
                {t("title")}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {t("subtitle")}
              </p>
              <div className="mt-10 flex justify-center">
                <PillLink href="/kontakt">{t("button")}</PillLink>
              </div>
            </div>
          </Bezel>
        </Reveal>
      </div>
    </section>
  );
}

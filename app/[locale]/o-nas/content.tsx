"use client";

import { useTranslations } from "next-intl";
import { Bezel, PageHeader, PillLink, Reveal } from "@/components/ui-kit";

const values = ["precision", "reliability", "flexibility", "quality"] as const;

export function AboutPageContent() {
  const t = useTranslations("about");
  const nav = useTranslations("nav");

  return (
    <section className="px-4 pb-24 pt-36 md:pb-40 md:pt-48">
      <div className="mx-auto max-w-6xl">
        <PageHeader title={t("title")} subtitle={t("subtitle")} />

        <Reveal className="mt-12 max-w-3xl">
          <p className="text-xl leading-relaxed text-foreground/90 md:text-2xl">{t("intro")}</p>
        </Reveal>

        {/* Story: editorial split */}
        <div className="mt-28 grid gap-10 border-t border-white/[0.1] pt-16 md:mt-40 lg:grid-cols-[5fr_7fr] lg:gap-24">
          <Reveal>
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-5xl">
              {t("story.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>{t("story.part1")}</p>
              <p>{t("story.part2")}</p>
              <p>{t("story.part3")}</p>
              <p>{t("story.part4")}</p>
            </div>
          </Reveal>
        </div>

        {/* Transition + today */}
        <div className="mt-24 grid gap-4 md:grid-cols-2">
          <Reveal>
            <Bezel className="h-full" innerClassName="p-8 md:p-12">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                {t("transition.title")}
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">{t("transition.text")}</p>
            </Bezel>
          </Reveal>
          <Reveal delay={0.1}>
            <Bezel className="h-full" innerClassName="p-8 md:p-12">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                {t("today.title")}
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">{t("today.text")}</p>
            </Bezel>
          </Reveal>
        </div>

        {/* Partners */}
        <Reveal className="mt-28 max-w-3xl md:mt-40">
          <p className="text-xl leading-relaxed text-foreground/90 md:text-2xl">{t("partnerships")}</p>
          <ul className="mt-8 space-y-3 text-[15px] text-foreground/80">
            {["s1", "s2", "s3", "s4"].map((key) => (
              <li key={key} className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-primary" />
                {t(`coreServices.${key}`)}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Values */}
        <Reveal className="mt-28 md:mt-40">
          <h2 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-5xl">
            {t("values.title")}
          </h2>
        </Reveal>

        <Reveal className="mt-12">
          <Bezel innerClassName="overflow-hidden">
            <div className="grid gap-px bg-white/[0.08] sm:grid-cols-2">
              {values.map((key) => (
                <div key={key} className="bg-black/40 p-8 md:p-10">
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">
                    {t(`values.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {t(`values.${key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </Bezel>
        </Reveal>

        <Reveal className="mt-16">
          <PillLink href="/kontakt">{nav("inquiry")}</PillLink>
        </Reveal>
      </div>
    </section>
  );
}

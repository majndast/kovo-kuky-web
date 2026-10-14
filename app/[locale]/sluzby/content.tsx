"use client";

import { useTranslations } from "next-intl";
import { Bezel, PageHeader, PillLink, Reveal } from "@/components/ui-kit";
import { ServiceArt } from "@/components/service-art";
import { FaqSection } from "@/components/faq-section";

const services = ["turning", "milling", "cutting", "external"] as const;

export function ServicesPageContent() {
  const t = useTranslations("services");

  return (
    <>
      <section className="px-4 pb-12 pt-36 md:pt-48">
        <div className="mx-auto max-w-6xl">
          <PageHeader title={t("title")} subtitle={t("subtitle")} />

          <div className="mt-20 space-y-4 md:mt-28">
            {services.map((key) => (
              <Reveal key={key}>
                <Bezel innerClassName="group grid gap-10 p-8 md:grid-cols-2 md:gap-16 md:p-14">
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-semibold tracking-[-0.035em] md:text-5xl">
                      {t(`${key}.title`)}
                    </h2>
                    <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                      {t(`${key}.description`)}
                    </p>
                    <ul className="mt-8 space-y-2 text-[15px] text-foreground/80">
                      {(t.raw(`details.${key}`) as string[]).map((d) => (
                        <li key={d} className="flex items-center gap-3">
                          <span className="h-1 w-1 rounded-full bg-primary" />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-10">
                      <PillLink href="/kontakt" variant="glass">
                        {t("learnMore")}
                      </PillLink>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ServiceArt name={key} />
                  </div>
                </Bezel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
    </>
  );
}

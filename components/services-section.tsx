"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { ServiceArt } from "@/components/service-art";
import { Link } from "@/i18n/navigation";
import { Bezel, Reveal, SectionHeading } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

const services = [
  { key: "turning", span: "md:col-span-4" },
  { key: "milling", span: "md:col-span-2" },
  { key: "cutting", span: "md:col-span-2" },
  { key: "external", span: "md:col-span-4" },
] as const;

export function ServicesSection() {
  const t = useTranslations("services");

  return (
    <section className="px-4 py-24 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-16 grid grid-cols-1 gap-4 md:mt-24 md:grid-cols-6">
          {services.map((service, i) => (
            <Reveal key={service.key} delay={(i % 2) * 0.1} className={cn(service.span)}>
              <Link href="/sluzby" className="group block h-full">
                <Bezel
                  className="h-full group-hover:bg-white/[0.06] group-hover:ring-primary/30"
                  innerClassName="flex min-h-[26rem] flex-col p-8 md:p-10"
                >
                  <div className="flex flex-1 items-center justify-center py-6">
                    <ServiceArt name={service.key} />
                  </div>

                  <div className="pt-4">
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                      {t(`${service.key}.title`)}
                    </h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                      {t(`${service.key}.description`)}
                    </p>
                    <span className="mt-8 inline-flex items-center gap-3 text-sm font-medium">
                      {t("learnMore")}
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105">
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                    </span>
                  </div>
                </Bezel>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

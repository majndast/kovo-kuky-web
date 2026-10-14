"use client";

import { useTranslations } from "next-intl";
import { Bezel, PageHeader, Reveal } from "@/components/ui-kit";

export function GalleryPageContent() {
  const t = useTranslations("gallery");

  return (
    <section className="px-4 pb-24 pt-36 md:pb-40 md:pt-48">
      <div className="mx-auto max-w-6xl">
        <PageHeader title={t("title")} subtitle={t("subtitle")} />

        {/* Placeholder bento – will be replaced with real photos */}
        <div className="mt-20 grid gap-4 md:mt-28 md:grid-cols-6">
          {[
            "md:col-span-4 aspect-[16/10]",
            "md:col-span-2 aspect-[4/5] md:aspect-auto",
            "md:col-span-2 aspect-[4/5] md:aspect-auto",
            "md:col-span-2 aspect-[4/5] md:aspect-auto",
            "md:col-span-2 aspect-[4/5] md:aspect-auto",
            "md:col-span-6 aspect-[21/9]",
          ].map((cls, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08} className={cls}>
              <Bezel className="h-full" innerClassName="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  {t("placeholder")}
                </p>
              </Bezel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

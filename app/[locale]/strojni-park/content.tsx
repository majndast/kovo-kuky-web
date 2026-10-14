"use client";

import { useTranslations } from "next-intl";
import { MachineCard } from "@/components/machine-card";
import { PageHeader } from "@/components/ui-kit";

const machineKeys = [
  "bianco1",
  "doosan",
  "goodway200",
  "goodway150",
  "millingXHS",
  "robodrill",
] as const;

export function MachineryPageContent() {
  const t = useTranslations("machinery");

  return (
    <section className="px-4 pb-24 pt-36 md:pb-40 md:pt-48">
      <div className="mx-auto max-w-6xl">
        <PageHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-20 grid gap-4 sm:grid-cols-2 md:mt-28 lg:grid-cols-3">
          {machineKeys.map((key, i) => {
            const specsRaw = t.raw(`machines.${key}.specs`) as string[] | undefined;

            return (
              <MachineCard
                key={key}
                name={t(`machines.${key}.name`)}
                type={t(`machines.${key}.type`)}
                control={
                  key !== "bianco1" ? t(`machines.${key}.control`) : undefined
                }
                controlLabel={t("controlLabel")}
                description={t(`machines.${key}.description`)}
                quantity={t(`machines.${key}.quantity`)}
                specs={specsRaw}
                index={i}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

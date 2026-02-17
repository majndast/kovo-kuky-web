"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MachineCard } from "@/components/machine-card";

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
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {machineKeys.map((key, i) => (
            <MachineCard
              key={key}
              name={t(`machines.${key}.name`)}
              type={t(`machines.${key}.type`)}
              control={
                key !== "bianco1" ? t(`machines.${key}.control`) : undefined
              }
              description={t(`machines.${key}.description`)}
              quantity={t(`machines.${key}.quantity`)}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

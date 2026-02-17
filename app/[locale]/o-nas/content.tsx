"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Target, Shield, Repeat, Award } from "lucide-react";

const values = [
  { key: "precision", icon: Target },
  { key: "reliability", icon: Shield },
  { key: "flexibility", icon: Repeat },
  { key: "quality", icon: Award },
] as const;

export function AboutPageContent() {
  const t = useTranslations("about");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-primary">{t("subtitle")}</p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {t("description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight">
            {t("values.title")}
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold">
                  {t(`values.${value.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`values.${value.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

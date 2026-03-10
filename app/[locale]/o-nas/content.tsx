"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Wrench, Handshake, Settings, Users } from "lucide-react";

const values = [
  { key: "precision", icon: Wrench },
  { key: "reliability", icon: Handshake },
  { key: "flexibility", icon: Settings },
  { key: "quality", icon: Users },
] as const;

export function AboutPageContent() {
  const t = useTranslations("about");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-xl text-primary font-medium">{t("subtitle")}</p>
          <p className="mt-6 text-lg text-muted-foreground">
            {t("intro")}
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold tracking-tight">
            {t("story.title")}
          </h2>
          <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
            <p>{t("story.part1")}</p>
            <p>{t("story.part2")}</p>
            <p>{t("story.part3")}</p>
            <p>{t("story.part4")}</p>
          </div>
        </motion.div>

        {/* Transition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-xl border border-primary/20 bg-primary/5 p-8"
        >
          <h2 className="text-2xl font-bold tracking-tight">
            {t("transition.title")}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("transition.text")}
          </p>
        </motion.div>

        {/* Today */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold tracking-tight">
            {t("today.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {t("today.text")}
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight">
            {t("values.title")}
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
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

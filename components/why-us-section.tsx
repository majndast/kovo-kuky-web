"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Gauge,
  ShieldCheck,
  Truck,
  HeadphonesIcon,
  Zap,
  BadgeCheck,
} from "lucide-react";

const reasons = [
  { key: "precision", icon: Gauge },
  { key: "quality", icon: ShieldCheck },
  { key: "delivery", icon: Truck },
  { key: "support", icon: HeadphonesIcon },
  { key: "speed", icon: Zap },
  { key: "certified", icon: BadgeCheck },
] as const;

export function WhyUsSection() {
  const t = useTranslations("whyUs");

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {t("label")}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-light group rounded-2xl p-6 transition-all hover:glow-green-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold">
                  {t(`${reason.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${reason.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

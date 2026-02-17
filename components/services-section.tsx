"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Cog, Wrench, Scissors, Users } from "lucide-react";

const services = [
  { key: "turning", icon: Cog },
  { key: "milling", icon: Wrench },
  { key: "cutting", icon: Scissors },
  { key: "external", icon: Users },
] as const;

export function ServicesSection() {
  const t = useTranslations("services");

  return (
    <section className="relative py-24 overflow-hidden">
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

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href="/sluzby"
                  className="gradient-border glass-light group flex h-full flex-col rounded-2xl p-8 transition-all hover:glow-green-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      <Icon className="h-7 w-7" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground/50 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">
                    {t(`${service.key}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {t(`${service.key}.description`)}
                  </p>
                  <div className="mt-5 flex items-center text-sm font-semibold text-primary">
                    {t("learnMore")}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

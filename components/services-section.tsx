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
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {t(`${service.key}.title`)}
                  </h3>
                  <p className="flex-1 text-sm text-muted-foreground">
                    {t(`${service.key}.description`)}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary">
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

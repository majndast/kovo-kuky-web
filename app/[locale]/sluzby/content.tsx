"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cog, Wrench, Scissors, Users, ArrowRight } from "lucide-react";

const services = [
  {
    key: "turning",
    icon: Cog,
    details: [
      "Doosan Lynx 220 (2x)",
      "Goodway GLS-200",
      "Goodway GLS-150",
      "Fanuc řízení",
    ],
  },
  {
    key: "milling",
    icon: Wrench,
    details: ["CNC Frézka XHS", "CNC Frézka Robodrill", "Fanuc řízení", "3-osé frézování"],
  },
  {
    key: "cutting",
    icon: Scissors,
    details: ["Pila Bianco (2x)", "Tyčový materiál", "Profily", "Přesné dělení"],
  },
  {
    key: "external",
    icon: Users,
    details: ["Zinkování", "Svařování", "Povrchové úpravy", "Ověření partneři"],
  },
] as const;

export function ServicesPageContent() {
  const t = useTranslations("services");

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

        <div className="mt-16 space-y-12">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="grid gap-8 rounded-xl border border-border bg-card p-8 md:grid-cols-2"
              >
                <div>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {t(`${service.key}.title`)}
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    {t(`${service.key}.description`)}
                  </p>
                  <Button asChild className="mt-6">
                    <Link href="/kontakt">
                      {t("learnMore")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center">
                  <ul className="grid w-full gap-3 sm:grid-cols-2">
                    {service.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-sm"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

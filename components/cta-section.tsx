"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";

export function CtaSection() {
  const t = useTranslations("cta");

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
          <div className="absolute inset-0 bg-grid-dense" />
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/10 blur-[100px]" />

          <div className="gradient-border relative rounded-3xl p-8 sm:p-12 md:p-16">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
              >
                <Zap className="h-8 w-8 text-primary" />
              </motion.div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {t("title")}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                {t("subtitle")}
              </p>

              {/* Trust points */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  {t("point1")}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {t("point2")}
                </span>
              </div>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="pulse-green text-base font-semibold"
                >
                  <Link href="/kontakt">
                    {t("button")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">{t("note")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

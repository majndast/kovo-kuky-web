"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Shield, Clock, Star } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />

      {/* Animated orbs - CSS only for performance */}
      <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[150px] animate-orb-1" />
      <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px] animate-orb-2" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full py-20 lg:py-0">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left - Text */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-sm font-medium text-primary">
                  {t("badge")}
                </span>
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {t("title")}{" "}
                <span className="gradient-text text-glow">
                  {t("titleAccent")}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl animate-fade-in-delay-1">
                {t("subtitle")}
              </p>

              {/* Trust badges inline */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground animate-fade-in-delay-2">
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-primary" />
                  {t("trust1")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  {t("trust2")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-primary" />
                  {t("trust3")}
                </span>
              </div>

              {/* CTA buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-fade-in-delay-3">
                <Button
                  asChild
                  size="lg"
                  className="pulse-green relative text-base font-semibold"
                >
                  <Link href="/kontakt">
                    {t("cta")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group text-base"
                >
                  <Link href="/sluzby">
                    <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    {t("secondary")}
                  </Link>
                </Button>
              </div>

              {/* Quick social proof */}
              <div className="mt-10 flex items-center gap-4 animate-fade-in-delay-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-bold text-primary"
                    >
                      {["CZ", "SK", "DE", "AT"][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("socialProof")}
                </p>
              </div>
            </div>

            {/* Right - Stats card */}
            <div className="hidden lg:block animate-slide-in-right">
              <div className="gradient-border glass rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "8+", label: "statMachines", icon: "CNC" },
                    { value: "0.01", label: "statPrecision", unit: "mm" },
                    { value: "100%", label: "statQuality" },
                    { value: "48h", label: "statQuote" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-white/[0.02] p-5 text-center"
                    >
                      <div className="text-3xl font-extrabold text-primary">
                        {stat.value}
                        {stat.unit && (
                          <span className="text-lg text-muted-foreground">
                            {stat.unit}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {t(stat.label)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini CTA in card */}
                <div className="mt-6 rounded-xl bg-primary/5 p-4 text-center">
                  <p className="text-sm font-medium text-primary">
                    {t("cardCta")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile stats */}
          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:hidden animate-fade-in-delay-4">
            {[
              { value: "8+", label: "statMachines" },
              { value: "0.01mm", label: "statPrecision" },
              { value: "100%", label: "statQuality" },
              { value: "48h", label: "statQuote" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-light rounded-xl p-4 text-center"
              >
                <div className="text-xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {t(stat.label)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Bezel, PageHeader, Reveal } from "@/components/ui-kit";
import { ContactForm } from "@/components/contact-form";
import { RecaptchaProvider } from "@/components/recaptcha-provider";

export function ContactPageContent() {
  const t = useTranslations("contact");

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: t("info.emailLabel"), value: <a href="mailto:info@kovokuky.cz" className="transition-colors duration-500 hover:text-primary">{t("info.email")}</a> },
    { label: t("info.phoneLabel"), value: <a href="tel:+420725770820" className="transition-colors duration-500 hover:text-primary">{t("info.phone")}</a> },
    { label: t("info.addressLabel"), value: t("info.address") },
    { label: `${t("info.icoLabel")} / ${t("info.dicLabel")}`, value: <span className="font-mono text-sm">{t("info.ico")} · {t("info.dic")}</span> },
  ];

  return (
    <section className="px-4 pb-24 pt-36 md:pb-40 md:pt-48">
      <div className="mx-auto max-w-6xl">
        <PageHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-5 lg:gap-16">
          <Reveal className="lg:col-span-2">
            <p className="text-3xl font-semibold tracking-[-0.035em]">
              {t("info.company")}
            </p>
            <p className="mt-1 text-muted-foreground">{t("info.owner")}</p>

            <dl className="mt-10 border-t border-white/[0.08]">
              {rows.map((r) => (
                <div
                  key={r.label}
                  className="grid gap-1 border-b border-white/[0.08] py-5 sm:grid-cols-[8rem_1fr] sm:gap-6"
                >
                  <dt className="text-sm text-muted-foreground">{r.label}</dt>
                  <dd className="text-[15px]">{r.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <Bezel innerClassName="p-6 sm:p-10">
              <RecaptchaProvider>
                <ContactForm />
              </RecaptchaProvider>
            </Bezel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

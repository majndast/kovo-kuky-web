import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

type Section = {
  title: string;
  text?: string[];
  items?: string[];
  after?: string[];
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return pageMetadata({
    locale,
    href: "/privacy",
    title: `${t("title")} | KOVO-KUKY`,
    description: t("intro"),
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrivacyContent />;
}

function PrivacyContent() {
  const t = useTranslations("privacy");
  const sections = t.raw("sections") as Section[];

  return (
    <div className="px-4 pb-24 pt-36 md:pt-48">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t("intro")}</p>
        <p className="mt-3 text-sm text-muted-foreground">{t("updated")}</p>

        <div className="mt-14 space-y-12 text-[15px] leading-relaxed text-muted-foreground">
          {sections.map((s, i) => (
            <section key={s.title} className="border-t border-white/[0.08] pt-8">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">
                <span className="mr-3 text-primary">{i + 1}.</span>
                {s.title}
              </h2>
              {s.text?.map((p) => (
                <p key={p} className="mt-4">
                  {p}
                </p>
              ))}
              {s.items && (
                <ul className="mt-4 space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.after?.map((p) => (
                <p key={p} className="mt-4">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

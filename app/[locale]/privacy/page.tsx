import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrivacyContent />;
}

function PrivacyContent() {
  const t = useTranslations("privacy");

  return (
    <div className="py-20">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">{t("title")}</h1>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="lead text-lg text-muted-foreground">{t("intro")}</p>

          <section className="mt-10">
            <h2 className="text-xl font-semibold">{t("dataCollection.title")}</h2>
            <p>{t("dataCollection.description")}</p>
            <ul className="list-disc pl-6">
              {(t.raw("dataCollection.items") as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">{t("purpose.title")}</h2>
            <p>{t("purpose.description")}</p>
            <ul className="list-disc pl-6">
              {(t.raw("purpose.items") as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">{t("retention.title")}</h2>
            <p>{t("retention.description")}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">{t("rights.title")}</h2>
            <p>{t("rights.description")}</p>
            <ul className="list-disc pl-6">
              {(t.raw("rights.items") as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">{t("cookies.title")}</h2>
            <p>{t("cookies.description")}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">{t("contact.title")}</h2>
            <p>{t("contact.description")}</p>
            <p className="mt-2">
              <strong>KOVO-KUKY</strong> — Václav Kukačka
              <br />
              IČO: 721 80 714 | DIČ: CZ8011251237
              <br />
              Veselská 58, Dolní Bukovsko 373 65
              <br />
              Email: info@kovo-kuky.cz
              <br />
              Tel: +420 725 770 820
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

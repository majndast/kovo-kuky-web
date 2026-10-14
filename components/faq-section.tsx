import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Bezel, Reveal, SectionHeading } from "@/components/ui-kit";

type Item = { q: string; a: string };

/** Native <details> accordion: works without JS and every answer stays in the HTML for crawlers. */
export function FaqSection() {
  const t = useTranslations("faq");
  const items = t.raw("items") as Item[];

  return (
    <section className="px-4 py-24 md:py-40">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[5fr_7fr] lg:gap-24">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          className="lg:sticky lg:top-32 lg:self-start"
        />

        <Reveal>
          <Bezel innerClassName="px-6 md:px-10">
            <div className="divide-y divide-white/[0.08]">
              {items.map((item) => (
                <details key={item.q} name="faq" className="group/faq py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-medium tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                    <h3 className="text-[1.0625rem] font-medium leading-snug">{item.q}</h3>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-open/faq:rotate-45">
                      <Plus className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </Bezel>
        </Reveal>
      </div>
    </section>
  );
}

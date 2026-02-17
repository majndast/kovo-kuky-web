"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="relative border-t border-border">
      {/* Mini CTA bar */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm font-medium">{t("ctaText")}</p>
          <Button asChild size="sm" className="font-semibold">
            <Link href="/kontakt">
              {nav("inquiry")}
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="KOVO-KUKY"
                  width={32}
                  height={32}
                />
                <span className="text-lg font-bold tracking-tight">
                  KOVO-<span className="text-primary">KUKY</span>
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {t("description")}
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("navigation")}
              </h3>
              <nav className="flex flex-col gap-2.5">
                {([
                  { href: "/sluzby" as const, key: "services" },
                  { href: "/o-nas" as const, key: "about" },
                  { href: "/strojni-park" as const, key: "machinery" },
                  { href: "/galerie" as const, key: "gallery" },
                  { href: "/kontakt" as const, key: "contact" },
                ]).map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {nav(item.key)}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("contactTitle")}
              </h3>
              <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <a
                  href="mailto:info@kovo-kuky.cz"
                  className="transition-colors hover:text-primary"
                >
                  info@kovo-kuky.cz
                </a>
                <p>+420 XXX XXX XXX</p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KOVO-KUKY. {t("rights")}
          </div>
        </div>
      </div>
    </footer>
  );
}

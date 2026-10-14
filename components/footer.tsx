"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { openCookieSettings } from "@/lib/consent";

const links = [
  { href: "/sluzby", key: "services" },
  { href: "/o-nas", key: "about" },
  { href: "/strojni-park", key: "machinery" },
  { href: "/galerie", key: "gallery" },
  { href: "/kontakt", key: "contact" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const contact = useTranslations("contact");

  const heading = "text-sm font-medium text-foreground";
  const link =
    "text-[15px] text-muted-foreground transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-primary";

  return (
    <footer className="border-t border-white/[0.08] px-4 pb-10 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.svg" alt="KOVO-KUKY" width={32} height={32} />
              <span className="text-xl font-semibold tracking-tight">
                KOVO<span className="text-primary">KUKY</span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <nav aria-label={t("navigation")}>
            <h2 className={heading}>{t("navigation")}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {links.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className={link}>
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <address className="not-italic">
            <h2 className={heading}>{t("contactTitle")}</h2>
            <div className="mt-5 flex flex-col gap-3 text-[15px] text-muted-foreground">
              <p className="text-foreground">{contact("info.owner")}</p>
              <p>{contact("info.address")}</p>
              <a href="mailto:info@kovokuky.cz" className={link}>
                info@kovokuky.cz
              </a>
              <a href="tel:+420725770820" className={link}>
                +420 725 770 820
              </a>
              <p className="font-mono text-xs">
                {contact("info.icoLabel")} {contact("info.ico")} · {contact("info.dicLabel")} {contact("info.dic")}
              </p>
            </div>
          </address>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.08] pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} KOVO-KUKY. {t("rights")}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className={link}>
              {t("legal")}
            </Link>
            <button type="button" onClick={openCookieSettings} className={link}>
              {t("cookieSettings")}
            </button>
            <span>
              {t("madeBy")}{" "}
              <a
                href="https://jpvision.cz"
                target="_blank"
                rel="noopener"
                title={t("madeByTitle")}
                className="transition-colors duration-500 hover:text-primary"
              >
                JP Vision
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

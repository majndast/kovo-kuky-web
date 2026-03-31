"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: "cs" | "de") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
      <button
        onClick={() => switchLocale("cs")}
        className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
          locale === "cs"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        CZ
      </button>
      <button
        onClick={() => switchLocale("de")}
        className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
          locale === "de"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        DE
      </button>
    </div>
  );
}

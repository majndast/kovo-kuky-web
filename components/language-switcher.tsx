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
    <div className="flex items-center rounded-full bg-white/[0.06] p-0.5">
      {(["cs", "de"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`rounded-full px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            locale === l
              ? "bg-white/15 text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

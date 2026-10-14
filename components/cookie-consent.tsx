"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { setConsent, useConsent } from "@/lib/consent";
import { EASE } from "@/components/ui-kit";

export function CookieConsent() {
  const t = useTranslations("cookies");
  const { consent, settingsOpen } = useConsent();

  // `undefined` = not hydrated yet, `null` = nothing chosen
  const show = consent === null || (consent !== undefined && settingsOpen);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-label={t("title")}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[26rem]"
        >
          <div className="rounded-[1.75rem] bg-black/55 p-1.5 ring-1 ring-white/15 backdrop-blur-2xl">
            <div className="rounded-[calc(1.75rem-0.375rem)] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
              <p className="text-base font-semibold tracking-[-0.01em]">{t("title")}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t("description")}{" "}
                <Link
                  href="/privacy"
                  className="text-foreground underline underline-offset-4 hover:text-primary"
                >
                  {t("privacy")}
                </Link>
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConsent("necessary")}
                  className="rounded-full bg-white/[0.08] px-4 py-2.5 text-sm font-medium ring-1 ring-white/10 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.14] active:scale-[0.98]"
                >
                  {t("necessary")}
                </button>
                <button
                  type="button"
                  onClick={() => setConsent("all")}
                  className="rounded-full bg-white/[0.08] px-4 py-2.5 text-sm font-medium ring-1 ring-white/10 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.14] active:scale-[0.98]"
                >
                  {t("acceptAll")}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

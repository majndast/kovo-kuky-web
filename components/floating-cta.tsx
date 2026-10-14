"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { EASE } from "./ui-kit";

export function FloatingCta() {
  const t = useTranslations("floatingCta");
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 800;
    setVisible((prev) => (prev === next ? prev : next));
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed bottom-5 right-5 z-20"
        >
          <Link
            href="/kontakt"
            className="group flex items-center gap-3 rounded-full bg-black/60 py-1.5 pl-5 pr-1.5 text-sm font-medium ring-1 ring-white/10 backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
          >
            {t("text")}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-black transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-0.5">
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

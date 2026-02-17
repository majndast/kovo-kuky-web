"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

export function GalleryPageContent() {
  const t = useTranslations("gallery");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </motion.div>

        {/* Placeholder grid - will be replaced with real photos */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex aspect-[4/3] items-center justify-center rounded-xl border border-border bg-card"
            >
              <div className="text-center text-muted-foreground">
                <ImageIcon className="mx-auto mb-2 h-10 w-10 opacity-30" />
                <p className="text-sm">{t("placeholder")}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

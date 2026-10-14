"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { PillLink, SectionHeading } from "@/components/ui-kit";

const steps = ["step1", "step2", "step3", "step4"] as const;

/** One step on the line; lights up once the green fill reaches its node. */
function Step({
  fill,
  at,
  title,
  description,
}: {
  fill: MotionValue<number>;
  at: number;
  title: string;
  description: string;
}) {
  const on = useTransform(fill, [at - 0.06, at], [0, 1]);
  const textOpacity = useTransform(on, [0, 1], [0.3, 1]);
  const dotScale = useTransform(on, [0, 1], [0.6, 1]);

  return (
    <li className="relative pb-8 pl-9 last:pb-0 md:pb-14 md:pl-14">
      <span
        aria-hidden
        className="absolute -left-[6px] top-2.5 h-3 w-3 rounded-full bg-white/20 ring-4 ring-black md:top-3"
      />
      <motion.span
        aria-hidden
        style={{ opacity: on, scale: dotScale }}
        className="absolute -left-[6px] top-2.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_0_6px_rgba(34,197,94,0.15)] ring-4 ring-black md:top-3"
      />
      <motion.div style={{ opacity: textOpacity }}>
        <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl md:text-4xl">{title}</h3>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground md:mt-3 md:text-base">
          {description}
        </p>
      </motion.div>
    </li>
  );
}

/**
 * Pinned scroll scene: the section is taller than the screen, its content
 * sticks to the viewport while the scroll fills the line step by step, then
 * the page moves on. Kept on phones too.
 */
export function ProcessSection() {
  const t = useTranslations("process");
  const sceneRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ["start start", "end end"] });
  // a short pause at both ends of the pinned stretch
  const raw = useTransform(scrollYProgress, [0.08, 0.9], [0, 1], { clamp: true });
  const fill = useSpring(raw, { stiffness: 160, damping: 32, mass: 0.4 });

  return (
    <section ref={sceneRef} className="relative h-[280vh]">
      <div className="sticky top-0 flex min-h-[100dvh] items-center px-4 py-24 md:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[5fr_7fr] lg:gap-24">
          <div className="lg:self-center">
            <SectionHeading title={t("title")} subtitle={t("subtitle")} />
            <div className="mt-8 hidden md:mt-10 md:block">
              <PillLink href="/kontakt">{t("cta")}</PillLink>
            </div>
          </div>

          <ol className="relative ml-2">
            <span aria-hidden className="absolute bottom-3 left-0 top-3 w-px bg-white/[0.12]" />
            <motion.span
              aria-hidden
              style={{ scaleY: fill }}
              className="absolute bottom-3 -left-px top-3 w-[3px] origin-top rounded-full bg-primary"
            />
            {steps.map((key, i) => (
              <Step
                key={key}
                fill={fill}
                at={i / (steps.length - 1)}
                title={t(`${key}.title`)}
                description={t(`${key}.description`)}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

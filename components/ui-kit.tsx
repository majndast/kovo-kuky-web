"use client";

import { useRef, type ComponentProps, type ReactNode, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const EASE = [0.32, 0.72, 0, 1] as const;

/** Heavy fade-up used for every scroll entry. */
// stable objects, so re-renders of a parent never restart the animation
const REVEAL_FROM = { opacity: 0, y: 36, filter: "blur(8px)" };
const REVEAL_TO = { opacity: 1, y: 0, filter: "blur(0px)" };
const REVEAL_VIEWPORT = { once: true, margin: "-80px" };

export function Reveal({
  children,
  delay = 0,
  className,
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** animate on mount instead of on scroll (page headers) */
  immediate?: boolean;
}) {
  return (
    <motion.div
      className={cn("reveal", className)}
      initial={REVEAL_FROM}
      {...(immediate
        ? { animate: REVEAL_TO }
        : {
            whileInView: REVEAL_TO,
            viewport: REVEAL_VIEWPORT,
          })}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Frosted glass panel: machined outer tray, translucent inner core with a
 * specular edge and a soft sheen that follows the pointer.
 */
export function Bezel({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={move}
      className={cn(
        "group/glass relative rounded-[2rem] bg-white/[0.035] p-1.5 ring-1 ring-white/[0.09] backdrop-blur-xl transition-[box-shadow,background-color] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        className
      )}
    >
      <div className="relative h-full overflow-hidden rounded-[calc(2rem-0.375rem)] bg-gradient-to-b from-white/[0.07] to-white/[0.015] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_0_0_1px_rgba(255,255,255,0.03)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/glass:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.09), transparent 60%)",
          }}
        />
        <div className={cn("relative h-full", innerClassName)}>{children}</div>
      </div>
    </div>
  );
}

/** Pill CTA with the arrow living in its own circle (button-in-button). */
export function PillLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: ComponentProps<typeof Link>["href"];
  children: ReactNode;
  variant?: "primary" | "glass";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[15px] font-medium transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]",
        variant === "primary"
          ? "bg-primary text-black hover:bg-[#2fd36b]"
          : "bg-white/[0.06] text-foreground ring-1 ring-white/10 hover:bg-white/[0.1]",
        className
      )}
    >
      {children}
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105",
          variant === "primary" ? "bg-black/10" : "bg-white/10"
        )}
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
      </span>
    </Link>
  );
}

/** Large page title used on every sub page. */
/** Large page title used on every sub page. */
export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal immediate className="max-w-4xl">
      <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl md:text-7xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

export function SectionHeading({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", className)}>
      <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

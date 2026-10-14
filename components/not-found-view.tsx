"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { animate, useReducedMotion } from "framer-motion";
import { Bezel, PillLink, Reveal } from "@/components/ui-kit";
import { useIsPhone } from "@/lib/use-is-phone";

/**
 * 404 as a CNC control screen: program O0404 mills the number "404",
 * the G-code listing follows the tool, then the control raises an alarm.
 * Easter egg: RESET (button or the R key) runs the program again.
 */

// toolpath in a 300 x 130 field; each digit is one continuous cut
const D4 = (x: number) => `M${x + 50} 112 L${x + 50} 14 L${x} 82 L${x + 72} 82`;
const D0 = (x: number) =>
  `M${x + 36} 14 Q${x + 72} 14 ${x + 72} 48 L${x + 72} 78 Q${x + 72} 112 ${x + 36} 112 Q${x} 112 ${x} 78 L${x} 48 Q${x} 14 ${x + 36} 14`;
// separate paths: SVG restarts dashing on every subpath, so each digit is drawn on its own
const DIGITS = [D4(14), D0(114), D4(214)];
// rapid moves between the digits, shown dashed
const RAPIDS = "M86 82 L150 14 M150 14 L264 112";

const GCODE = [
  "O0404 (404)",
  "G21 G90 G17",
  "T1 M06 (FREZA D6)",
  "S8000 M03",
  "G00 X64. Y112.",
  "G01 Z-1. F600",
  "G01 Y14. X14. Y82. X86.",
  "G00 X150. Y14.",
  "G03 X150. Y14. I0. J49.",
  "G00 X264. Y112.",
  "G01 Y14. X214. Y82. X286.",
  "M30",
];

const DURATION = 6.5;

export function NotFoundView() {
  const t = useTranslations("notFound");
  const reduce = useReducedMotion();
  const phone = useIsPhone();
  const still = Boolean(reduce) || phone;

  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const toolRef = useRef<SVGGElement>(null);
  const droX = useRef<HTMLSpanElement>(null);
  const droY = useRef<HTMLSpanElement>(null);
  const [line, setLine] = useState(0);
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0);

  // painting touches the DOM directly; React only re-renders when the G-code line changes
  const paint = useCallback((k: number) => {
    const paths = pathRefs.current.filter((x): x is SVGPathElement => Boolean(x));
    if (!paths.length) return;
    const lens = paths.map((x) => x.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);
    let left = total * k;
    let tip: DOMPoint | null = null;
    paths.forEach((x, i) => {
      const done = Math.max(0, Math.min(lens[i], left));
      x.style.strokeDasharray = `${lens[i]}`;
      x.style.strokeDashoffset = `${lens[i] - done}`;
      if (done > 0 || i === 0) tip = x.getPointAtLength(done);
      left -= lens[i];
    });
    const pt = tip as DOMPoint | null;
    if (pt) {
      toolRef.current?.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      if (droX.current) droX.current.textContent = pt.x.toFixed(3).padStart(8, " ");
      if (droY.current) droY.current.textContent = (130 - pt.y).toFixed(3).padStart(8, " ");
    }
  }, []);

  const draw = useCallback(
    (k: number) => {
      paint(k);
      setLine(Math.min(GCODE.length - 1, Math.floor(k * GCODE.length)));
    },
    [paint]
  );

  useEffect(() => {
    if (still) {
      paint(1);
      return;
    }
    const controls = animate(0, 1, {
      duration: DURATION,
      ease: "linear",
      onUpdate: (k) => draw(k),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [run, still, draw, paint]);

  const reset = useCallback(() => {
    setDone(false);
    setRun((r) => r + 1);
  }, []);
  const finished = still || done;
  const shownLine = still ? GCODE.length - 1 : line;

  // not-found pages inherit the layout title, so set our own
  useEffect(() => {
    document.title = "404 | KOVO-KUKY";
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reset]);

  return (
    <section className="flex min-h-[100dvh] items-center px-4 pb-24 pt-32">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal immediate>
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">{t("text")}</p>
          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
            <PillLink href="/">{t("home")}</PillLink>
            <PillLink href="/kontakt" variant="glass">
              {t("contact")}
            </PillLink>
          </div>
        </Reveal>

        <Reveal immediate delay={0.1}>
          <Bezel innerClassName="p-5 font-mono text-[11px] sm:p-6 sm:text-xs">
            {/* status bar */}
            <div className="flex items-center justify-between text-muted-foreground">
              <span>
                PROG <span className="text-foreground">O0404</span>
              </span>
              <span className="tabular-nums">
                X <span ref={droX} className="text-foreground">   0.000</span>
                &nbsp;&nbsp;Y <span ref={droY} className="text-foreground">   0.000</span>
              </span>
            </div>

            {/* toolpath plot */}
            <div className="mt-4 overflow-hidden rounded-xl bg-black/50 ring-1 ring-white/[0.08]">
              <svg viewBox="0 0 300 130" className="h-auto w-full" aria-hidden>
                <defs>
                  <pattern id="nf-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M10 0 H0 V10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="300" height="130" fill="url(#nf-grid)" />
                <path d={RAPIDS} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeDasharray="3 3" />
                {DIGITS.map((d) => (
                  <path key={`g${d}`} d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                ))}
                {DIGITS.map((d, i) => (
                  <path
                    key={d}
                    ref={(el) => {
                      pathRefs.current[i] = el;
                    }}
                    d={d}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
                  />
                ))}
                <g ref={toolRef}>
                  <circle r="6" fill="#0b0b0c" stroke="#f5f5f7" strokeWidth="1.2" />
                  <path d="M-3 0 H3 M0 -3 V3" stroke="#f5f5f7" strokeWidth="0.8" />
                </g>
              </svg>
            </div>

            {/* program listing + alarm */}
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
              <ol className="h-[7.5rem] overflow-hidden leading-5">
                {GCODE.slice(Math.max(0, shownLine - 3), Math.max(0, shownLine - 3) + 6).map((code, i) => {
                  const n = Math.max(0, shownLine - 3) + i;
                  const active = n === shownLine && !finished;
                  return (
                    <li key={n} className={active ? "text-primary" : "text-muted-foreground"}>
                      <span className="mr-3 opacity-50">N{String((n + 1) * 10).padStart(4, "0")}</span>
                      {code}
                    </li>
                  );
                })}
              </ol>

              <div className="flex flex-row items-end justify-between gap-3 sm:flex-col sm:items-end">
                <span
                  className={`rounded-full px-3 py-1.5 ring-1 transition-colors duration-500 ${
                    finished
                      ? "bg-red-500/10 text-red-400 ring-red-500/40"
                      : "bg-primary/10 text-primary ring-primary/30"
                  }`}
                >
                  {finished ? t("alarm") : t("running")}
                </span>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full bg-white/[0.08] px-5 py-2 font-sans text-sm font-medium text-foreground ring-1 ring-white/10 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.14] active:scale-[0.97]"
                >
                  {t("reset")}
                </button>
              </div>
            </div>
          </Bezel>
        </Reveal>
      </div>
    </section>
  );
}

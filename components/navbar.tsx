"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { EASE } from "./ui-kit";

const navItems = [
  { href: "/sluzby", key: "services" },
  { href: "/o-nas", key: "about" },
  { href: "/strojni-park", key: "machinery" },
  { href: "/galerie", key: "gallery" },
] as const;

const allItems = [{ href: "/", key: "home" } as const, ...navItems, { href: "/kontakt", key: "contact" } as const];

export function Navbar() {
  const nav = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
        <div className="flex w-full max-w-4xl items-center justify-between rounded-full bg-black/60 py-2 pl-5 pr-2 ring-1 ring-white/10 backdrop-blur-2xl">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <Image src="/logo.svg" alt="" width={26} height={26} aria-hidden="true" />
            <span className="text-[15px] font-semibold tracking-tight">
              KOVO<span className="text-primary">KUKY</span>
            </span>
          </Link>

          <nav className="hidden items-center md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-[13px] transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    active
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {nav(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              href="/kontakt"
              className="hidden rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-black transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#2fd36b] active:scale-[0.97] md:inline-flex"
            >
              {nav("inquiry")}
            </Link>

            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] md:hidden"
            >
              <span
                className={`absolute h-px w-4 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "rotate-45" : "-translate-y-[3px]"
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "-rotate-45" : "translate-y-[3px]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-0 z-30 flex flex-col justify-center bg-black/85 px-8 backdrop-blur-3xl md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {allItems.map((item, i) => (
                <div key={item.key} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "110%", opacity: 0 }}
                    transition={{ duration: 0.7, delay: 0.08 + i * 0.06, ease: EASE }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block py-1 text-5xl font-semibold tracking-[-0.04em] ${
                        pathname === item.href ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {nav(item.key)}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

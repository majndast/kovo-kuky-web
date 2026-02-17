"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/", key: "home" },
  { href: "/sluzby", key: "services" },
  { href: "/o-nas", key: "about" },
  { href: "/strojni-park", key: "machinery" },
  { href: "/galerie", key: "gallery" },
  { href: "/kontakt", key: "contact" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="KOVO-KUKY" width={40} height={40} />
          <span className="text-lg font-bold tracking-tight">
            KOVO-<span className="text-primary">KUKY</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Button asChild size="sm">
            <Link href="/kontakt">{t("inquiry")}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background">
              <nav className="mt-8 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-4 py-3 text-base font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <Button asChild className="mt-4">
                  <Link href="/kontakt" onClick={() => setOpen(false)}>
                    {t("inquiry")}
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

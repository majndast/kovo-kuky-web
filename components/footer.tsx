import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="KOVO-KUKY" width={32} height={32} />
              <span className="text-lg font-bold tracking-tight">
                KOVO-<span className="text-primary">KUKY</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("navigation")}
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/sluzby"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {nav("services")}
              </Link>
              <Link
                href="/o-nas"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {nav("about")}
              </Link>
              <Link
                href="/strojni-park"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {nav("machinery")}
              </Link>
              <Link
                href="/galerie"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {nav("gallery")}
              </Link>
              <Link
                href="/kontakt"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {nav("contact")}
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("contactTitle")}
            </h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>info@kovo-kuky.cz</p>
              <p>+420 XXX XXX XXX</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} KOVO-KUKY. {t("rights")}
        </div>
      </div>
    </footer>
  );
}

import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { urlFor, type Href } from "@/lib/seo";

const priority: Record<string, number> = {
  "/": 1,
  "/sluzby": 0.9,
  "/kontakt": 0.9,
  "/strojni-park": 0.8,
  "/o-nas": 0.7,
  "/galerie": 0.5,
  "/privacy": 0.2,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // /galerie stays out until it has real photos (it is noindex)
  const hrefs = (Object.keys(routing.pathnames) as Href[]).filter((h) => h !== "/galerie");

  return hrefs.flatMap((href) =>
    routing.locales.map((locale) => ({
      url: urlFor(href, locale),
      lastModified,
      changeFrequency: href === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: priority[href] ?? 0.5,
      alternates: {
        languages: {
          cs: urlFor(href, "cs"),
          de: urlFor(href, "de"),
          "x-default": urlFor(href, "cs"),
        },
      },
    }))
  );
}

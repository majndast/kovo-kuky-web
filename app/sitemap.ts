import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.kovokuky.cz";

  // Route pairs: [cs path, en path]
  const routes: [string, string][] = [
    ["/cs", "/en"],
    ["/cs/sluzby", "/en/services"],
    ["/cs/o-nas", "/en/about"],
    ["/cs/strojni-park", "/en/machinery"],
    ["/cs/galerie", "/en/gallery"],
    ["/cs/kontakt", "/en/contact"],
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Root URL
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1.0,
    alternates: {
      languages: {
        cs: `${baseUrl}/cs`,
        en: `${baseUrl}/en`,
      },
    },
  });

  // All route pairs with alternates
  routes.forEach(([csPath, enPath]) => {
    const isHome = csPath === "/cs";

    // CS version
    entries.push({
      url: `${baseUrl}${csPath}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: isHome ? 1.0 : 0.8,
      alternates: {
        languages: {
          cs: `${baseUrl}${csPath}`,
          en: `${baseUrl}${enPath}`,
        },
      },
    });

    // EN version
    entries.push({
      url: `${baseUrl}${enPath}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: isHome ? 0.9 : 0.7,
      alternates: {
        languages: {
          cs: `${baseUrl}${csPath}`,
          en: `${baseUrl}${enPath}`,
        },
      },
    });
  });

  return entries;
}

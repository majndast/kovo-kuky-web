import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.kovokuky.cz";

  // Route pairs: [cs path, de path]
  const routes: [string, string][] = [
    ["/cs", "/de"],
    ["/cs/sluzby", "/de/dienstleistungen"],
    ["/cs/o-nas", "/de/ueber-uns"],
    ["/cs/strojni-park", "/de/maschinenpark"],
    ["/cs/galerie", "/de/galerie"],
    ["/cs/kontakt", "/de/kontakt"],
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
        de: `${baseUrl}/de`,
      },
    },
  });

  // All route pairs with alternates
  routes.forEach(([csPath, dePath]) => {
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
          de: `${baseUrl}${dePath}`,
        },
      },
    });

    // DE version
    entries.push({
      url: `${baseUrl}${dePath}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: isHome ? 0.9 : 0.7,
      alternates: {
        languages: {
          cs: `${baseUrl}${csPath}`,
          de: `${baseUrl}${dePath}`,
        },
      },
    });
  });

  return entries;
}

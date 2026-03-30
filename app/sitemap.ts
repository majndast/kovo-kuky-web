import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kovokuky.cz";

  const routes = ["", "/sluzby", "/o-nas", "/strojni-park", "/galerie", "/kontakt"];

  const entries: MetadataRoute.Sitemap = [];

  // CS routes (primary)
  routes.forEach((route) => {
    entries.push({
      url: `${baseUrl}/cs${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: route === "" ? 1.0 : 0.8,
    });
  });

  // EN routes
  routes.forEach((route) => {
    entries.push({
      url: `${baseUrl}/en${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: route === "" ? 0.9 : 0.7,
    });
  });

  return entries;
}

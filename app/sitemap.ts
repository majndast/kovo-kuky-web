import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kovo-kuky.cz";

  const csRoutes = ["", "/sluzby", "/o-nas", "/strojni-park", "/galerie", "/kontakt"];
  const enRoutes = ["", "/services", "/about", "/machinery", "/gallery", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  csRoutes.forEach((route) => {
    entries.push({
      url: `${baseUrl}/cs${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: route === "" ? 1.0 : 0.8,
    });
  });

  enRoutes.forEach((route) => {
    entries.push({
      url: `${baseUrl}/en${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: route === "" ? 0.9 : 0.7,
    });
  });

  return entries;
}

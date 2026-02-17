import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["cs", "en"],
  defaultLocale: "cs",
  pathnames: {
    "/": "/",
    "/sluzby": {
      cs: "/sluzby",
      en: "/services",
    },
    "/o-nas": {
      cs: "/o-nas",
      en: "/about",
    },
    "/strojni-park": {
      cs: "/strojni-park",
      en: "/machinery",
    },
    "/galerie": {
      cs: "/galerie",
      en: "/gallery",
    },
    "/kontakt": {
      cs: "/kontakt",
      en: "/contact",
    },
  },
});

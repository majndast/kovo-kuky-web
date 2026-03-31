import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["cs", "de"],
  defaultLocale: "cs",
  pathnames: {
    "/": "/",
    "/sluzby": {
      cs: "/sluzby",
      de: "/dienstleistungen",
    },
    "/o-nas": {
      cs: "/o-nas",
      de: "/ueber-uns",
    },
    "/strojni-park": {
      cs: "/strojni-park",
      de: "/maschinenpark",
    },
    "/galerie": {
      cs: "/galerie",
      de: "/galerie",
    },
    "/kontakt": {
      cs: "/kontakt",
      de: "/kontakt",
    },
  },
});

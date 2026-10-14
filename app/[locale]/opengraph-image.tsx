import { ImageResponse } from "next/og";

export const alt = "KOVO-KUKY – CNC obrábění";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const copy = {
  cs: { line1: "CNC obrábění kovů", line2: "přesné na setiny milimetru", sub: "Soustružení · Frézování · Řezání" },
  de: { line1: "CNC-Bearbeitung von Metall", line2: "genau auf den Hundertstel", sub: "Drehen · Fräsen · Zuschnitt" },
} as const;

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const c = copy[locale === "de" ? "de" : "cs"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          color: "#f5f5f7",
          backgroundColor: "#000",
          backgroundImage:
            "radial-gradient(circle at 0% 0%, rgba(34,197,94,0.28), rgba(0,0,0,0) 60%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
          KOVO<span style={{ color: "#22c55e" }}>KUKY</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, fontWeight: 700, letterSpacing: -4, lineHeight: 1.02 }}>{c.line1}</div>
          <div style={{ fontSize: 82, fontWeight: 700, letterSpacing: -4, lineHeight: 1.02, color: "#22c55e" }}>
            {c.line2}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#86868b" }}>{c.sub} · kovokuky.cz</div>
      </div>
    ),
    size
  );
}

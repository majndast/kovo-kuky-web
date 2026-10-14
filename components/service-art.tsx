"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useIsPhone } from "@/lib/use-is-phone";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Four simple looping drawings in one shared oblique view: depth runs up and
 * to the right, so every object shows its front, top and right side. Shapes
 * use solid fills so nothing shows through. Each loop is driven by one
 * progress value `p` (0..1) and pauses while off-screen.
 */

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const easeIO = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const ACCENT = "#22c55e";
const ACCENT_DARK = "#14532d";

// solid shades: light from the top, right side in shadow
const TOP = "#4a4a51";
const FRONT = "#2e2e33";
const SIDE = "#1f1f23";
const BRIGHT = "#6c6c74";

/* ---------------------------- projection --------------------------- */
const DX = 0.55;
const DY = -0.6;
const depth = (z: number): [number, number] => [DX * z, DY * z];

type Pt = [number, number];
const poly = (pts: Pt[], close = true) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join("") + (close ? "Z" : "");

// circle of radius r perpendicular to the x axis, centred at (x, cy)
const xFacePt = (x: number, cy: number, r: number, a: number): Pt => [
  x + DX * r * Math.sin(a),
  cy - r * Math.cos(a) + DY * r * Math.sin(a),
];
const T0 = Math.atan(-DY);
const TX = DX * Math.sin(T0);
const TY = Math.cos(T0) - DY * Math.sin(T0);

/** visible end face of a cylinder lying along x */
const xFace = (x: number, cy: number, r: number) =>
  poly(Array.from({ length: 48 }, (_, i) => xFacePt(x, cy, r, (i / 48) * Math.PI * 2)));

/** body of a cylinder lying along x, including its rounded far end */
const xBody = (x1: number, x2: number, cy: number, r: number) => {
  const back = Array.from({ length: 25 }, (_, i) => xFacePt(x1, cy, r, T0 + Math.PI + (i / 24) * Math.PI));
  return poly([[x2 - TX * r, cy + TY * r], ...back, [x2 + TX * r, cy - TY * r]]);
};

/** front, top and right faces of a box; corners given on the front face */
const boxFaces = (pts: [Pt, Pt, Pt, Pt], d: number) => {
  const [ox, oy] = depth(d);
  const [tl, tr, br, bl] = pts;
  const o = (q: Pt): Pt => [q[0] + ox, q[1] + oy];
  return {
    front: poly([tl, tr, br, bl]),
    top: poly([tl, tr, o(tr), o(tl)]),
    side: poly([tr, o(tr), o(br), br]),
  };
};

function Box({ x, y, w, h, d }: { x: number; y: number; w: number; h: number; d: number }) {
  const f = boxFaces([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], d);
  return (
    <>
      <path d={f.top} fill={TOP} />
      <path d={f.side} fill={SIDE} />
      <path d={f.front} fill={FRONT} />
    </>
  );
}

/**
 * Drives one loop. On phones and with reduced motion the drawing stays
 * still at `stillAt`, a frame that explains the process on its own.
 */
function useLoop(duration: number, stillAt: number) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const phone = useIsPhone();
  const still = Boolean(reduce) || phone;
  const stillRef = useRef(still);
  const p = useMotionValue(0);

  useEffect(() => {
    stillRef.current = still;
    if (still) p.set(stillAt);
  }, [still, stillAt, p]);

  useAnimationFrame((t) => {
    if (stillRef.current || !inView) return;
    p.set((t % duration) / duration);
  });
  const fade = useTransform(p, (v) =>
    stillRef.current ? 1 : Math.min(seg(v, 0, 0.05), 1 - seg(v, 0.95, 1))
  );
  return { ref, p, fade };
}

function Frame({ svgRef, children }: { svgRef: React.Ref<SVGSVGElement>; children: ReactNode }) {
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 320 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
      className="h-auto w-full max-w-[26rem] text-white/60 transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-[#4ade80]"
    >
      {children}
    </svg>
  );
}

function Shadow({ cx, cy, rx }: { cx: number; cy: number; rx: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry="6" fill="#fff" fillOpacity=".05" stroke="none" />;
}

/* ------------------------------------------------------------------ */
/* Turning: the tool runs from the free end towards the chuck         */
/* ------------------------------------------------------------------ */
function Turning() {
  const { ref, p, fade } = useLoop(6400, 0.55);
  const cy = 112;
  const R = 32;
  const r = 22;
  const X0 = 74;
  const XE = 268;
  const XS = X0 + 28;

  const toolX = useTransform(p, (v) => XE + 26 - (XE + 26 - XS) * easeIO(seg(v, 0.12, 0.8)));
  const shoulder = useTransform(toolX, (x) => Math.min(x, XE));
  const wideD = useTransform(shoulder, (s) => xBody(X0, s, cy, R));
  const narrowD = useTransform(shoulder, (s) => xBody(s, XE, cy, r));
  const faceShift = useTransform(shoulder, (s) => s - XE);
  const cutOn = useTransform(shoulder, (s) => (s < XE - 0.5 ? 1 : 0));

  const lift = useTransform(
    p,
    (v) => -26 * (1 - easeOut(seg(v, 0.03, 0.12))) - 30 * easeIO(seg(v, 0.82, 0.92))
  );
  const tipX = useTransform(toolX, (x) => x + TX * r);
  const tipY = useTransform(lift, (l) => cy - TY * r + l);

  const tool = boxFaces([[-1, -60], [17, -60], [17, -14], [-1, -14]], 16);

  return (
    <Frame svgRef={ref}>
      <motion.g style={{ opacity: fade }}>
        <Shadow cx={170} cy={184} rx={128} />

        {/* chuck */}
        <path d={xBody(30, X0, cy, 52)} fill={SIDE} />
        <path d={xFace(X0, cy, 52)} fill={FRONT} />

        {/* raw stock up to the shoulder */}
        <motion.path d={wideD} fill={FRONT} />
        <motion.g style={{ x: faceShift }}>
          <path d={xFace(XE, cy, R)} fill={TOP} />
        </motion.g>

        {/* machined diameter */}
        <motion.g style={{ opacity: cutOn }}>
          <motion.path d={narrowD} fill={TOP} />
          <path d={xFace(XE, cy, r)} fill={BRIGHT} />
        </motion.g>

        {/* tool: square shank with an insert, cutting edge leading left */}
        <motion.g style={{ x: tipX, y: tipY }}>
          <path d={tool.top} fill={TOP} />
          <path d={tool.side} fill={SIDE} />
          <path d={tool.front} fill={FRONT} />
          <path d="M0 0 L16 -5 L17 -14 L-1 -14 Z" fill={ACCENT_DARK} stroke={ACCENT} />
        </motion.g>
      </motion.g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Milling: an end mill in the spindle cuts a rounded pocket outline   */
/* ------------------------------------------------------------------ */
const BLOCK = { x: 50, y: 126, w: 170, h: 44, d: 60 };
const onTop = (u: number, v: number): Pt => [
  BLOCK.x + BLOCK.w * u + DX * BLOCK.d * v,
  BLOCK.y + DY * BLOCK.d * v,
];

function buildTrack() {
  const u0 = 0.2,
    u1 = 0.8,
    v0 = 0.22,
    v1 = 0.78,
    ru = 0.09,
    rv = 0.2;
  const pts: Pt[] = [];
  const arc = (cu: number, cv: number, a0: number, a1: number) => {
    for (let i = 0; i <= 10; i++) {
      const a = a0 + ((a1 - a0) * i) / 10;
      pts.push(onTop(cu + ru * Math.cos(a), cv + rv * Math.sin(a)));
    }
  };
  pts.push(onTop(u0 + ru, v0));
  pts.push(onTop(u1 - ru, v0));
  arc(u1 - ru, v0 + rv, -Math.PI / 2, 0);
  pts.push(onTop(u1, v1 - rv));
  arc(u1 - ru, v1 - rv, 0, Math.PI / 2);
  pts.push(onTop(u0 + ru, v1));
  arc(u0 + ru, v1 - rv, Math.PI / 2, Math.PI);
  pts.push(onTop(u0, v0 + rv));
  arc(u0 + ru, v0 + rv, Math.PI, Math.PI * 1.5);

  // resample evenly by length so the cutter moves at constant speed
  const cum = [0];
  for (let i = 1; i < pts.length; i++)
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[cum.length - 1];
  const N = 160;
  const out: Pt[] = [];
  let j = 1;
  for (let i = 0; i <= N; i++) {
    const d = (total * i) / N;
    while (j < cum.length - 1 && cum[j] < d) j++;
    const t = (d - cum[j - 1]) / (cum[j] - cum[j - 1] || 1);
    out.push([
      pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * t,
      pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * t,
    ]);
  }
  return out;
}
const TRACK = buildTrack();
const TRACK_D = poly(TRACK, false);
const trackAt = (t: number): Pt => {
  const f = clamp(t) * (TRACK.length - 1);
  const i = Math.min(TRACK.length - 2, Math.floor(f));
  const k = f - i;
  return [
    TRACK[i][0] + (TRACK[i + 1][0] - TRACK[i][0]) * k,
    TRACK[i][1] + (TRACK[i + 1][1] - TRACK[i][1]) * k,
  ];
};

function Milling() {
  const { ref, p, fade } = useLoop(7000, 0.62);

  const t = useTransform(p, (v) => seg(v, 0.08, 0.88));
  const px = useTransform(t, (v) => trackAt(v)[0]);
  const plunge = useTransform(p, (v) => 22 * (1 - easeOut(seg(v, 0.0, 0.08)) * (1 - seg(v, 0.9, 0.97))));
  const py = useTransform([t, plunge], ([v, z]: number[]) => trackAt(v)[1] - z);

  const head = boxFaces([[-22, -140], [22, -140], [22, -54], [-22, -54]], 22);

  return (
    <Frame svgRef={ref}>
      <motion.g style={{ opacity: fade }}>
        <Shadow cx={160} cy={184} rx={120} />
        <Box {...BLOCK} />

        {/* groove, being cut */}
        <motion.path d={TRACK_D} strokeWidth="6" stroke="#0a0a0b" style={{ pathLength: t }} />

        {/* spindle head and end mill */}
        <motion.g style={{ x: px, y: py }}>
          <path d={head.top} fill={TOP} />
          <path d={head.side} fill={SIDE} />
          <path d={head.front} fill={FRONT} />
          <path d="M-10 -54 L10 -54 L7 -38 L-7 -38 Z" fill={TOP} />
          <rect x="-5" y="-38" width="10" height="38" fill={ACCENT_DARK} stroke={ACCENT} />
        </motion.g>
      </motion.g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Cutting: a saw arm running into the depth swings down through a    */
/* bar lying left to right; the offcut slides away                    */
/* ------------------------------------------------------------------ */
// world coordinates: x right, y up, z into the depth. Base top is y = 0.
const P3 = (x: number, y: number, z: number): Pt => [x + DX * z, 158 - y + DY * z];

const BAR_R = 14;
const BAR_Z = 40; // bar axis depth
const BAR_X1 = 60;
const BAR_X2 = 226;
const XC = 170; // cutting plane
const BAR_CY = P3(0, BAR_R, BAR_Z)[1];
const BAR_SX = DX * BAR_Z; // screen shift of the bar due to its depth

// arm: a rounded beam in the cutting plane, pivot at the back,
// the blade runs a little below it between two short guides
const ZP = 118;
const YP = 21;
const ARM_W = 16;
const ARM_TOP = 9;
const ARM_BOT = -9;
const ARM_RAD = (ARM_TOP - ARM_BOT) / 2;
const ARM_MID = (ARM_TOP + ARM_BOT) / 2;
const BLADE_DY = -21; // blade sits at y = 0 (base top) when the arm is down
// blade runs nearly the full length of the arm, between two short guides
const GUIDES = [-136, -14];

// cut line marked on the bar: the visible half of its cross-section at XC
const KERF = poly(
  Array.from({ length: 25 }, (_, i) => xFacePt(XC + BAR_SX, BAR_CY, BAR_R, T0 + Math.PI + (i / 24) * Math.PI)),
  false
);

function armPt(dz: number, dy: number, deg: number, x: number): Pt {
  const a = (deg * Math.PI) / 180;
  const z = dz * Math.cos(a) + dy * Math.sin(a);
  const y = dy * Math.cos(a) - dz * Math.sin(a);
  return P3(x, YP + y, ZP + z);
}

/** side profile of an arm segment, rounded where it is a real end */
function armProfile(a: number, b: number, roundA: boolean, roundB: boolean): Pt[] {
  const pts: Pt[] = [];
  const arc = (cz: number, t0: number, t1: number) => {
    for (let i = 0; i <= 10; i++) {
      const t = t0 + ((t1 - t0) * i) / 10;
      pts.push([cz + ARM_RAD * Math.cos(t), ARM_MID + ARM_RAD * Math.sin(t)]);
    }
  };
  const a2 = roundA ? a + ARM_RAD : a;
  const b2 = roundB ? b - ARM_RAD : b;
  pts.push([a2, ARM_BOT], [b2, ARM_BOT]);
  if (roundB) arc(b2, -Math.PI / 2, Math.PI / 2);
  else pts.push([b, ARM_TOP]);
  pts.push([a2, ARM_TOP]);
  if (roundA) arc(a2, Math.PI / 2, (3 * Math.PI) / 2);
  else pts.push([a, ARM_BOT]);
  return pts;
}

/** convex hull, monotone chain */
function hull(pts: Pt[]): Pt[] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper: Pt[] = [];
  for (const q of [...p].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

function armSeg(a: number, b: number, deg: number, roundA: boolean, roundB: boolean) {
  // arm centred on the cutting plane so the blade runs exactly through the cut
  const L = XC - ARM_W / 2;
  const R = XC + ARM_W / 2;
  const prof = armProfile(a, b, roundA, roundB);
  const pl = prof.map(([dz, dy]) => armPt(dz, dy, deg, L));
  const pr = prof.map(([dz, dy]) => armPt(dz, dy, deg, R));
  // the profile is convex, so the solid swept from L to R is the hull of both profiles
  const solid = poly(hull([...pl, ...pr]));
  const mid = XC;
  const z1 = Math.max(a, GUIDES[0]);
  const z2 = Math.min(b, GUIDES[1]);
  const blade = z2 > z1 ? poly([armPt(z1, BLADE_DY, deg, mid), armPt(z2, BLADE_DY, deg, mid)], false) : "";
  const guides = GUIDES.filter((g) => g >= a && g <= b)
    .map((g) =>
      poly([
        armPt(g - 3, ARM_BOT, deg, mid),
        armPt(g + 3, ARM_BOT, deg, mid),
        armPt(g + 3, BLADE_DY, deg, mid),
        armPt(g - 3, BLADE_DY, deg, mid),
      ])
    )
    .join("");
  return { solid, side: poly(pr), blade, guides };
}

function ArmSeg({ seg: s, teeth }: { seg: MotionValue<ReturnType<typeof armSeg>>; teeth: MotionValue<number> }) {
  const solid = useTransform(s, (v) => v.solid);
  const side = useTransform(s, (v) => v.side);
  const blade = useTransform(s, (v) => v.blade);
  const guides = useTransform(s, (v) => v.guides);
  return (
    <>
      <motion.path d={guides} fill={TOP} />
      <motion.path d={blade} stroke={ACCENT} strokeWidth="3" strokeDasharray="2 3" style={{ strokeDashoffset: teeth }} />
      {/* one solid body (top and front end), the near side face on top of it */}
      <motion.path d={solid} fill={BRIGHT} />
      <motion.path d={side} fill={TOP} />
    </>
  );
}

function Cutting() {
  const { ref, p, fade } = useLoop(6600, 0.47);

  const angle = useTransform(
    p,
    (v) => 24 - 24 * easeIO(seg(v, 0.1, 0.46)) + 24 * easeIO(seg(v, 0.52, 0.72))
  );
  const arm = useTransform(angle, (a) => armSeg(-150, 0, a, true, true));
  const teeth = useTransform(p, (v) => -v * 900);

  const cutDone = useTransform(p, (v) => (v > 0.46 ? 1 : 0));
  const slide = useTransform(p, (v) => 34 * easeOut(seg(v, 0.5, 0.84)));
  const pieceO = useTransform(p, (v) => 1 - seg(v, 0.6, 0.86));
  const kerfO = useTransform(p, (v) => (v > 0.46 ? 0 : 1));
  const pivot = P3(XC + ARM_W / 2, YP, ZP);

  return (
    <Frame svgRef={ref}>
      <motion.g style={{ opacity: fade }}>
        <Shadow cx={160} cy={188} rx={130} />

        {/* machine base */}
        <Box x={40} y={158} w={210} h={22} d={100} />

        {/* pivot post */}
        <path
          d={poly([P3(XC - 6, 0, ZP), P3(XC + 6, 0, ZP), P3(XC + 6, YP, ZP), P3(XC - 6, YP, ZP)])}
          fill={FRONT}
        />

        {/* bar: the part that stays, its fresh face, then the offcut */}
        <path d={xBody(BAR_X1 + BAR_SX, XC + BAR_SX, BAR_CY, BAR_R)} fill={FRONT} />
        <motion.path d={xFace(XC + BAR_SX, BAR_CY, BAR_R)} fill={BRIGHT} style={{ opacity: cutDone }} />
        <motion.g style={{ x: slide, opacity: pieceO }}>
          <path d={xBody(XC + BAR_SX, BAR_X2 + BAR_SX, BAR_CY, BAR_R)} fill={FRONT} />
          <path d={xFace(BAR_X2 + BAR_SX, BAR_CY, BAR_R)} fill={TOP} />
        </motion.g>
        <motion.path d={KERF} stroke={ACCENT} strokeWidth="1.5" strokeDasharray="3 3" style={{ opacity: kerfO }} />

        {/* saw arm with the blade a little below it */}
        <ArmSeg seg={arm} teeth={teeth} />
        <circle cx={pivot[0]} cy={pivot[1]} r="2.5" fill={TOP} />
      </motion.g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Finishing: a nut hanging on a wire is dipped into the bath         */
/* ------------------------------------------------------------------ */
function Ripple({ p, a, b, cx, cy }: { p: MotionValue<number>; a: number; b: number; cx: number; cy: number }) {
  const rx = useTransform(p, (v) => 6 + 34 * easeOut(seg(v, a, b)));
  const ry = useTransform(rx, (v) => v * 0.34);
  const o = useTransform(p, (v) => (v < a || v > b ? 0 : 0.9 * (1 - seg(v, a, b))));
  return <motion.ellipse cx={cx} cy={cy} rx={rx} ry={ry} stroke={ACCENT} style={{ opacity: o }} />;
}

function Drop({ p, nutY, x, delay }: { p: MotionValue<number>; nutY: MotionValue<number>; x: number; delay: number }) {
  const y = useTransform([p, nutY], ([v, ny]: number[]) => ny + 18 + 58 * Math.pow(seg(v, 0.76 + delay, 0.97), 2));
  const o = useTransform(p, (v) => {
    const s = seg(v, 0.76 + delay, 0.97);
    return s <= 0 || s >= 1 ? 0 : 1 - s * 0.6;
  });
  return <motion.ellipse cx={x} cy={y} rx="1.8" ry="2.8" fill={ACCENT} stroke="none" style={{ opacity: o }} />;
}

// hex nut standing upright, face towards us, thickness along depth
const NUT_R = 17;
const NUT_T = 12;
const HEX: Pt[] = Array.from({ length: 6 }, (_, k) => {
  const a = (-90 + 60 * k) * (Math.PI / 180);
  return [NUT_R * Math.cos(a), NUT_R * Math.sin(a)];
});

function External() {
  const { ref, p, fade } = useLoop(6600, 0.47);
  const id = "svc-dip";
  const NX = 172;
  const surfaceY = 123;

  const nutY = useTransform(
    p,
    (v) =>
      34 +
      112 * easeIO(seg(v, 0.1, 0.4)) -
      112 * easeIO(seg(v, 0.62, 0.9)) +
      1.6 * Math.sin(v * Math.PI * 2 * 14) * seg(v, 0.4, 0.45) * (1 - seg(v, 0.58, 0.62))
  );
  const [ox, oy] = depth(NUT_T);
  const back = HEX.map(([x, y]): Pt => [x + ox, y + oy]);

  return (
    <Frame svgRef={ref}>
      <defs>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ACCENT} stopOpacity=".34" />
          <stop offset="1" stopColor={ACCENT} stopOpacity=".12" />
        </linearGradient>
      </defs>

      <motion.g style={{ opacity: fade }}>
        <Shadow cx={170} cy={190} rx={120} />

        {/* tank back */}
        <polygon points="80,124 240,124 270,92 110,92" fill="#fff" fillOpacity=".04" />
        <polygon points="238,138 266,108 266,160 238,180" fill={ACCENT} fillOpacity=".12" stroke="none" />

        {/* nut on its wire */}
        <motion.g style={{ x: NX, y: nutY }}>
          <path d="M0 -320 V0" />
          <path d={poly(back)} fill={SIDE} />
          {HEX.map(([x, y], i) => (
            <line key={i} x1={x} y1={y} x2={back[i][0]} y2={back[i][1]} />
          ))}
          <path d={poly(HEX)} fill={TOP} />
          <circle cx="0" cy="0" r="7" fill="#0a0a0b" />
        </motion.g>

        {/* bath: liquid, then the glass outline */}
        <polygon points="82,138 238,138 266,108 110,108" fill={`url(#${id}l)`} stroke="none" />
        <rect x="82" y="138" width="156" height="42" fill={`url(#${id}l)`} stroke="none" />
        <line x1="82" y1="138" x2="238" y2="138" stroke={ACCENT} strokeOpacity=".6" />
        <rect x="80" y="124" width="160" height="58" rx="2" />
        <polygon points="240,124 270,92 270,150 240,182" fill="#fff" fillOpacity=".04" />
        <polygon points="80,124 240,124 270,92 110,92" />

        <Ripple p={p} a={0.24} b={0.5} cx={NX} cy={surfaceY} />
        <Ripple p={p} a={0.29} b={0.55} cx={NX} cy={surfaceY} />
        <Ripple p={p} a={0.62} b={0.86} cx={NX} cy={surfaceY} />

        <Drop p={p} nutY={nutY} x={NX - 6} delay={0} />
        <Drop p={p} nutY={nutY} x={NX + 7} delay={0.04} />
      </motion.g>
    </Frame>
  );
}

const art: Record<string, () => ReactNode> = {
  turning: () => <Turning />,
  milling: () => <Milling />,
  cutting: () => <Cutting />,
  external: () => <External />,
};

export function ServiceArt({ name }: { name: string }) {
  return <>{art[name]?.()}</>;
}

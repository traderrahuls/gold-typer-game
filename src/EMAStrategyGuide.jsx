import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ReferenceLine,
} from "recharts";

// ---------- deterministic pseudo-random (so charts look same every load) ----------
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ema(values, period) {
  const k = 2 / (period + 1);
  const out = [values[0]];
  for (let i = 1; i < values.length; i++) {
    out.push(values[i] * k + out[i - 1] * (1 - k));
  }
  return out;
}

function buildScenario(kind) {
  const rnd = mulberry32(kind === "bullish" ? 11 : kind === "bearish" ? 22 : kind === "whipsaw" ? 33 : 44);
  const n = 60;
  const prices = [2350];
  for (let i = 1; i < n; i++) {
    let drift = 0;
    if (kind === "bullish") drift = i < 28 ? -0.55 : 0.65;
    if (kind === "bearish") drift = i < 28 ? 0.55 : -0.65;
    if (kind === "whipsaw") drift = Math.sin(i / 4) * 0.4;
    if (kind === "fulltrade") drift = i < 22 ? -0.5 : 0.7;
    const noise = (rnd() - 0.5) * 2.2;
    prices.push(prices[i - 1] + drift + noise);
  }
  const e9 = ema(prices, 9);
  const e15 = ema(prices, 15);

  const data = prices.map((p, i) => ({
    i,
    price: +p.toFixed(2),
    ema9: +e9[i].toFixed(2),
    ema15: +e15[i].toFixed(2),
  }));

  // find first meaningful crossover after index 15
  let crossIdx = null;
  for (let i = 16; i < n; i++) {
    const prevDiff = e9[i - 1] - e15[i - 1];
    const currDiff = e9[i] - e15[i];
    if (kind === "bullish" || kind === "fulltrade") {
      if (prevDiff < 0 && currDiff >= 0) { crossIdx = i; break; }
    } else if (kind === "bearish") {
      if (prevDiff > 0 && currDiff <= 0) { crossIdx = i; break; }
    }
  }
  if (crossIdx === null) crossIdx = 30;

  const allCrosses = [];
  for (let i = 11; i < n; i++) {
    const prevDiff = e9[i - 1] - e15[i - 1];
    const currDiff = e9[i] - e15[i];
    if (prevDiff * currDiff < 0) allCrosses.push(i);
  }

  return { data, crossIdx, allCrosses };
}

const COLORS = {
  bg: "#0b1016",
  panel: "#121923",
  panelBorder: "#22303f",
  gold: "#e0a72e",
  cyan: "#22d3ee",
  green: "#34d399",
  red: "#f87171",
  text: "#e6edf3",
  muted: "#8a97a6",
};

const TABS = [
  { key: "bullish", label: "Bullish Cross", color: COLORS.green },
  { key: "bearish", label: "Bearish Cross", color: COLORS.red },
  { key: "whipsaw", label: "Whipsaw", color: "#f472b6" },
  { key: "fulltrade", label: "Full Trade", color: COLORS.gold },
];

function StrategyChart({ kind }) {
  const { data, crossIdx, allCrosses } = useMemo(() => buildScenario(kind), [kind]);
  const entry = data[crossIdx]?.price ?? 0;
  const sl = kind === "fulltrade" ? entry - 5.5 : null;
  const tp = kind === "fulltrade" ? entry + 11 : null;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={COLORS.panelBorder} strokeDasharray="3 3" />
          <XAxis dataKey="i" tick={{ fill: COLORS.muted, fontSize: 10 }} axisLine={{ stroke: COLORS.panelBorder }} tickLine={false} />
          <YAxis domain={["auto", "auto"]} tick={{ fill: COLORS.muted, fontSize: 10 }} axisLine={{ stroke: COLORS.panelBorder }} tickLine={false} width={46} />
          <Tooltip
            contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: COLORS.muted }}
            itemStyle={{ color: COLORS.text }}
          />
          <Line type="monotone" dataKey="price" stroke="#556270" strokeWidth={1.2} dot={false} name="Price" />
          <Line type="monotone" dataKey="ema9" stroke={COLORS.cyan} strokeWidth={2.2} dot={false} name="EMA 9" />
          <Line type="monotone" dataKey="ema15" stroke={COLORS.gold} strokeWidth={2.2} dot={false} name="EMA 15" />

          {kind !== "whipsaw" && (
            <ReferenceDot
              x={data[crossIdx].i}
              y={data[crossIdx].ema9}
              r={6}
              fill={kind === "bearish" ? COLORS.red : COLORS.green}
              stroke="#fff"
              strokeWidth={1.5}
            />
          )}
          {kind === "whipsaw" &&
            allCrosses.slice(0, 6).map((idx) => (
              <ReferenceDot key={idx} x={data[idx].i} y={data[idx].ema9} r={4} fill="#f472b6" stroke="#fff" strokeWidth={1} />
            ))}
          {kind === "fulltrade" && (
            <>
              <ReferenceLine y={entry} stroke={COLORS.gold} strokeDasharray="4 3" label={{ value: "Entry", position: "right", fill: COLORS.gold, fontSize: 10 }} />
              <ReferenceLine y={sl} stroke={COLORS.red} strokeDasharray="4 3" label={{ value: "SL", position: "right", fill: COLORS.red, fontSize: 10 }} />
              <ReferenceLine y={tp} stroke={COLORS.green} strokeDasharray="4 3" label={{ value: "TP", position: "right", fill: COLORS.green, fontSize: 10 }} />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

const CHAPTER_TEXT = {
  bullish: {
    title: "Bullish Crossover",
    body: "EMA 9 neeche se upar EMA 15 ko cross karti hai. Seller pressure kam ho raha hai, buyers control lene lage hain. Candle close ke baad hi entry lo — beech mein jump mat karo.",
  },
  bearish: {
    title: "Bearish Crossover",
    body: "EMA 9 upar se neeche EMA 15 ko cross karti hai. Buying momentum khatam ho raha hai. Confirm karo ki yeh resistance zone ke paas ho raha hai, phir SELL entry lo.",
  },
  whipsaw: {
    title: "Whipsaw — False Signals",
    body: "Sideways/choppy market mein EMA baar-baar cross hoti hai bina real trend ke. Yahi wo zone hai jahan naye traders sabse zyada paisa lose karte hain — is zone mein trade avoid karo.",
  },
  fulltrade: {
    title: "Full Trade — Entry, SL, TP",
    body: "Crossover confirm hote hi entry, recent swing ke neeche stop-loss, aur minimum 1:2 risk-reward par target. Yeh EMA 9/15 ka poora trade cycle hai.",
  },
};

export default function EMAStrategyGuide() {
  const [tab, setTab] = useState("bullish");

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* HERO */}
      <div style={{ padding: "36px 20px 24px", borderBottom: `1px solid ${COLORS.panelBorder}`, background: "linear-gradient(180deg, #121923 0%, #0b1016 100%)" }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.gold, fontWeight: 700, marginBottom: 8 }}>
          GIGILIFE · TRADING LAB
        </div>
        <h1 style={{ fontSize: 30, lineHeight: 1.15, margin: 0, fontWeight: 800 }}>
          EMA 9 <span style={{ color: COLORS.cyan }}>×</span> EMA 15
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 8, maxWidth: 480 }}>
          XAU/USD crossover strategy — interactive charts ke saath seekho ki fast aur slow EMA kab
          milte hain, aur uska matlab kya hota hai.
        </p>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 8, padding: "16px 16px 0", overflowX: "auto" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: "0 0 auto",
              padding: "9px 14px",
              borderRadius: 999,
              border: `1px solid ${tab === t.key ? t.color : COLORS.panelBorder}`,
              background: tab === t.key ? `${t.color}22` : "transparent",
              color: tab === t.key ? t.color : COLORS.muted,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CHART CARD */}
      <div style={{ margin: "16px", background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 14, padding: "14px 10px 6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 6px" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{CHAPTER_TEXT[tab].title}</span>
          <div style={{ display: "flex", gap: 10, fontSize: 10, color: COLORS.muted }}>
            <span style={{ color: COLORS.cyan }}>● EMA 9</span>
            <span style={{ color: COLORS.gold }}>● EMA 15</span>
          </div>
        </div>
        <StrategyChart kind={tab} />
        <p style={{ fontSize: 12.5, color: COLORS.muted, padding: "4px 8px 10px", lineHeight: 1.6 }}>
          {CHAPTER_TEXT[tab].body}
        </p>
      </div>

      {/* RULES */}
      <div style={{ margin: "0 16px 16px", background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: COLORS.gold }}>Quick Rulebook</div>
        {[
          ["BUY", "EMA 9 crosses ABOVE EMA 15", COLORS.green],
          ["SELL", "EMA 9 crosses BELOW EMA 15", COLORS.red],
          ["AVOID", "Sideways market, weak trend (ADX < 20)", COLORS.muted],
          ["RISK", "Fixed lot size + SL, minimum 1:2 RR", COLORS.gold],
        ].map(([tag, desc, c]) => (
          <div key={tag} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderTop: `1px solid ${COLORS.panelBorder}` }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: c, background: `${c}22`, padding: "3px 8px", borderRadius: 6, minWidth: 52, textAlign: "center" }}>
              {tag}
            </span>
            <span style={{ fontSize: 12.5, color: COLORS.text, lineHeight: 1.5 }}>{desc}</span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "8px 16px 28px", fontSize: 11, color: COLORS.muted }}>
        GigiLife Trading Lab · Tap a tab above to explore each scenario
      </div>
    </div>
  );
              }

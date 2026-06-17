import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// WORD BANK — trading themed
// ============================================================
const WORD_BANK = [
  "gold", "scalp", "entry", "target", "profit", "candle", "trend",
  "ema", "cross", "angle", "support", "resist", "order", "block",
  "liquidity", "grab", "fvg", "gap", "rsi", "bullish", "bearish",
  "signal", "setup", "stoploss", "riskmanagement", "breakout",
  "reversal", "momentum", "volume", "pivot", "zone", "confirm",
  "wait", "patience", "discipline", "strategy", "mayank", "rahul",
  "xau", "usd", "buy", "sell", "tp", "sl", "chart", "trade",
  "pattern", "level", "swing", "scalper",
];

const TIERS = [
  { name: "ROOKIE", color: "#7dd3fc", minScore: 0 },
  { name: "TRADER", color: "#4ade80", minScore: 150 },
  { name: "SHARP SHOOTER", color: "#facc15", minScore: 400 },
  { name: "GOLD HUNTER", color: "#fb923c", minScore: 800 },
  { name: "EMA MASTER", color: "#f87171", minScore: 1400 },
];

const KEY_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

function getTier(score) {
  let tier = TIERS[0];
  for (const t of TIERS) {
    if (score >= t.minScore) tier = t;
  }
  return tier;
}

function randomWord(usedRecently) {
  let w;
  let tries = 0;
  do {
    w = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    tries++;
  } while (usedRecently.includes(w) && tries < 8);
  return w;
}

let enemyIdCounter = 0;
let particleIdCounter = 0;
let starIdCounter = 0;

// ============================================================
// AUDIO ENGINE — WebAudio synthesized SFX (no external files)
// ============================================================
function useAudioEngine() {
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const mutedRef = useRef(false);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
      masterRef.current = ctxRef.current.createGain();
      masterRef.current.gain.value = 0.35;
      masterRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (freq, dur, type, gainStart, freqEnd) => {
      if (mutedRef.current) return;
      const ctx = getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (freqEnd) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(freqEnd, 1),
          ctx.currentTime + dur
        );
      }
      gain.gain.setValueAtTime(gainStart || 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(masterRef.current);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    },
    [getCtx]
  );

  const sfx = {
    type: useCallback(() => tone(680, 0.045, "square", 0.12), [tone]),
    shoot: useCallback(() => tone(880, 0.09, "sawtooth", 0.18, 220), [tone]),
    explode: useCallback(() => {
      tone(160, 0.18, "triangle", 0.25, 40);
      setTimeout(() => tone(90, 0.12, "square", 0.12, 30), 30);
    }, [tone]),
    miss: useCallback(() => tone(140, 0.3, "sawtooth", 0.2, 60), [tone]),
    wrong: useCallback(() => tone(220, 0.08, "square", 0.1, 110), [tone]),
    levelUp: useCallback(() => {
      tone(440, 0.1, "sine", 0.2);
      setTimeout(() => tone(660, 0.12, "sine", 0.2), 90);
      setTimeout(() => tone(880, 0.16, "sine", 0.22), 180);
    }, [tone]),
    gameOver: useCallback(() => {
      tone(300, 0.2, "sawtooth", 0.2, 150);
      setTimeout(() => tone(180, 0.3, "sawtooth", 0.2, 60), 150);
      setTimeout(() => tone(90, 0.5, "sawtooth", 0.18, 30), 320);
    }, [tone]),
  };

  const setMuted = useCallback((m) => {
    mutedRef.current = m;
  }, []);

  return { sfx, setMuted, getCtx };
}

export default function TraderTypeGame() {
  const [screen, setScreen] = useState("menu");
  const [enemies, setEnemies] = useState([]);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [particles, setParticles] = useState([]);
  const [stars, setStars] = useState([]);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [wrongFlash, setWrongFlash] = useState(false);

  const { sfx, setMuted } = useAudioEngine();

  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const spawnTimerRef = useRef(0);
  const lastTimeRef = useRef(0);
  const recentWordsRef = useRef([]);
  const widthRef = useRef(800);
  const heightRef = useRef(500);
  const gameStateRef = useRef({ enemies: [], score: 0, lives: 3, wave: 1 });
  const waveRef = useRef(1);

  useEffect(() => {
    gameStateRef.current = { enemies, score, lives, wave };
  }, [enemies, score, lives, wave]);

  useEffect(() => {
    setMuted(muted);
  }, [muted, setMuted]);

  const measure = useCallback(() => {
    if (containerRef.current) {
      widthRef.current = containerRef.current.clientWidth;
      heightRef.current = containerRef.current.clientHeight;
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // ambient starfield
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 60; i++) {
      starIdCounter += 1;
      arr.push({
        id: starIdCounter,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
      });
    }
    setStars(arr);
  }, []);

  useEffect(() => {
    if (screen !== "playing") return;
    const id = setInterval(() => {
      setStars((prev) =>
        prev.map((s) => {
          let ny = s.y + s.speed * 8;
          if (ny > 100) ny = 0;
          return { ...s, y: ny };
        })
      );
    }, 60);
    return () => clearInterval(id);
  }, [screen]);

  const startGame = () => {
    enemyIdCounter = 0;
    particleIdCounter = 0;
    recentWordsRef.current = [];
    spawnTimerRef.current = 0;
    lastTimeRef.current = performance.now();
    waveRef.current = 1;
    setEnemies([]);
    setParticles([]);
    setTyped("");
    setScore(0);
    setLives(3);
    setWave(1);
    setCombo(0);
    setBestCombo(0);
    setScreen("playing");
  };

  const endGame = useCallback(() => {
    sfx.gameOver();
    setScreen("gameover");
    setHighScore((hs) => Math.max(hs, gameStateRef.current.score));
  }, [sfx]);

  const spawnEnemy = useCallback(() => {
    const word = randomWord(recentWordsRef.current);
    recentWordsRef.current = [...recentWordsRef.current.slice(-4), word];
    const w = widthRef.current || 800;
    const margin = 60;
    const x = margin + Math.random() * Math.max(1, w - margin * 2);
    const speedBase = 14 + gameStateRef.current.wave * 2.2;
    const speed = speedBase + Math.random() * 6;
    enemyIdCounter += 1;
    const enemy = {
      id: enemyIdCounter,
      word,
      x,
      y: -30,
      speed,
      typedCount: 0,
      hit: false,
    };
    setEnemies((prev) => [...prev, enemy]);
  }, []);

  useEffect(() => {
    if (screen !== "playing") return;

    const loop = (time) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      spawnTimerRef.current -= dt;
      const spawnInterval = Math.max(0.55, 1.8 - gameStateRef.current.wave * 0.08);
      if (spawnTimerRef.current <= 0) {
        spawnEnemy();
        spawnTimerRef.current = spawnInterval;
      }

      setEnemies((prev) => {
        const h = heightRef.current || 500;
        const next = [];
        let livesLost = 0;
        for (const e of prev) {
          if (e.hit) continue;
          const ny = e.y + e.speed * dt;
          if (ny >= h - 40) {
            livesLost += 1;
            continue;
          }
          next.push({ ...e, y: ny });
        }
        if (livesLost > 0) {
          sfx.miss();
          setLives((l) => {
            const nl = l - livesLost;
            if (nl <= 0) {
              setTimeout(() => endGame(), 0);
              return 0;
            }
            return nl;
          });
          setCombo(0);
          setShake(true);
          setTimeout(() => setShake(false), 250);
        }
        return next;
      });

      const newWave = 1 + Math.floor(gameStateRef.current.score / 250);
      if (newWave > waveRef.current) {
        waveRef.current = newWave;
        setWave(newWave);
        sfx.levelUp();
      }

      setParticles((prev) =>
        prev.map((p) => ({ ...p, life: p.life - dt })).filter((p) => p.life > 0)
      );

      animFrameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [screen, spawnEnemy, endGame, sfx]);

  const pressKey = useCallback(
    (ch) => {
      if (screen !== "playing") return;
      setActiveKey(ch);
      setTimeout(() => setActiveKey(null), 100);

      const nextTyped = typed + ch;

      setEnemies((prev) => {
        const candidates = prev.filter((en) => en.word.startsWith(nextTyped));
        if (candidates.length === 0) {
          sfx.wrong();
          setWrongFlash(true);
          setTimeout(() => setWrongFlash(false), 150);
          setTyped("");
          return prev;
        }
        let target = candidates[0];
        for (const c of candidates) {
          if (c.y > target.y) target = c;
        }

        if (target.word === nextTyped) {
          sfx.explode();
          const points = 10 + target.word.length * 4 + gameStateRef.current.wave * 2;
          setScore((s) => s + points);
          setCombo((c) => {
            const nc = c + 1;
            setBestCombo((b) => Math.max(b, nc));
            return nc;
          });
          particleIdCounter += 1;
          setParticles((ps) => [
            ...ps,
            { id: particleIdCounter, x: target.x, y: target.y, life: 0.5, text: "+" + points },
          ]);
          setTyped("");
          return prev.map((en) => (en.id === target.id ? { ...en, hit: true } : en));
        }

        sfx.type();
        setTyped(nextTyped);
        return prev;
      });
    },
    [screen, typed, sfx]
  );

  const handleBackspace = useCallback(() => {
    setTyped((t) => t.slice(0, -1));
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (screen !== "playing") return;
      if (e.key === "Backspace") {
        handleBackspace();
        return;
      }
      if (!/^[a-zA-Z]$/.test(e.key)) return;
      pressKey(e.key.toLowerCase());
    },
    [screen, pressKey, handleBackspace]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const hitOnes = enemies.filter((e) => e.hit);
    if (hitOnes.length === 0) return;
    const timer = setTimeout(() => {
      setEnemies((prev) => prev.filter((e) => !e.hit));
    }, 180);
    return () => clearTimeout(timer);
  }, [enemies]);

  // letters still "live" on screen (i.e. some enemy could still use them)
  const liveLetters = (() => {
    const set = new Set();
    enemies.forEach((e) => {
      if (e.word.startsWith(typed)) {
        const nextChar = e.word[typed.length];
        if (nextChar) set.add(nextChar);
      }
    });
    return set;
  })();

  const tier = getTier(score);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background:
          "radial-gradient(ellipse at 50% -10%, #1c1408 0%, #0a0805 55%, #050403 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Courier New', monospace",
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.035) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "min(900px, 98vw)",
          height: "min(680px, 96vh)",
          background: "linear-gradient(180deg, #14100a 0%, #0d0a06 100%)",
          border: "1px solid #4a3a1a",
          borderRadius: 16,
          boxShadow:
            "0 0 60px rgba(212,175,55,0.08), inset 0 0 80px rgba(0,0,0,0.5)" +
            (wrongFlash ? ", inset 0 0 0 3px rgba(220,60,40,0.6)" : ""),
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          transform: shake ? "translate(2px, -1px)" : "none",
          transition: "transform 0.05s",
        }}
      >
        {/* HUD */}
        {screen === "playing" && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 20px",
              borderBottom: "1px solid #2a2010",
              background: "rgba(0,0,0,0.3)",
              zIndex: 5,
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 9, color: "#8a7245", letterSpacing: 2 }}>SCORE</div>
                <div style={{ fontSize: 20, color: "#d4af37", fontWeight: 700 }}>{score}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: "#8a7245", letterSpacing: 2 }}>WAVE</div>
                <div style={{ fontSize: 20, color: "#e8e3d4", fontWeight: 700 }}>{wave}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: "#8a7245", letterSpacing: 2 }}>COMBO</div>
                <div
                  style={{
                    fontSize: 20,
                    color: combo > 4 ? "#fb923c" : "#e8e3d4",
                    fontWeight: 700,
                  }}
                >
                  x{combo}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: i < lives ? "#d4af37" : "#2a2010",
                      border: "1px solid #4a3a1a",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => setMutedState((m) => !m)}
                style={{
                  background: "transparent",
                  border: "1px solid #4a3a1a",
                  borderRadius: 6,
                  color: "#8a7245",
                  fontSize: 11,
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {muted ? "SOUND OFF" : "SOUND ON"}
              </button>
            </div>
          </div>
        )}

        {/* Game area */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {stars.map((s) => (
            <div
              key={s.id}
              style={{
                position: "absolute",
                left: s.x + "%",
                top: s.y + "%",
                width: s.size,
                height: s.size,
                borderRadius: "50%",
                background: "#d4af37",
                opacity: s.opacity,
                pointerEvents: "none",
              }}
            />
          ))}

          {screen === "menu" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 24,
              }}
            >
              <div style={{ fontSize: 12, letterSpacing: 4, color: "#8a7245", marginBottom: 12 }}>
                TRADERRAHUL PRESENTS
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  color: "#d4af37",
                  letterSpacing: 2,
                  textShadow: "0 0 30px rgba(212,175,55,0.4)",
                  marginBottom: 8,
                  fontFamily: "Georgia, serif",
                }}
              >
                GOLD TYPER
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#a89968",
                  marginBottom: 32,
                  maxWidth: 400,
                  lineHeight: 1.6,
                }}
              >
                Trading terms fall from above. Type the word to shoot it down before it reaches
                your account.
                <br />
                Miss three and the trade is over.
              </div>
              <button
                onClick={startGame}
                style={{
                  background: "linear-gradient(180deg, #e8c655, #b8932e)",
                  color: "#1a1306",
                  border: "none",
                  padding: "14px 48px",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 2,
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "'Courier New', monospace",
                  boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
                }}
              >
                START TRADING
              </button>
              <button
                onClick={() => setMutedState((m) => !m)}
                style={{
                  marginTop: 18,
                  background: "transparent",
                  border: "1px solid #4a3a1a",
                  borderRadius: 6,
                  color: "#8a7245",
                  fontSize: 11,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: 1,
                }}
              >
                {muted ? "SOUND: OFF" : "SOUND: ON"}
              </button>
            </div>
          )}

          {screen === "playing" && (
            <>
              {enemies.map((e) => {
                const isTarget = e.word.startsWith(typed) && typed.length > 0;
                const typedPart = isTarget ? typed : "";
                const restPart = isTarget ? e.word.slice(typed.length) : e.word;
                return (
                  <div
                    key={e.id}
                    style={{
                      position: "absolute",
                      left: e.x,
                      top: e.y,
                      transform: "translate(-50%, -50%) scale(" + (e.hit ? 1.7 : 1) + ")",
                      opacity: e.hit ? 0 : 1,
                      transition: e.hit ? "opacity 0.18s, transform 0.18s" : "none",
                      fontSize: 17,
                      fontWeight: 700,
                      padding: "5px 12px",
                      borderRadius: 6,
                      background: e.hit
                        ? "rgba(251,146,60,0.35)"
                        : isTarget
                        ? "rgba(212,175,55,0.18)"
                        : "rgba(20,16,10,0.7)",
                      border: isTarget ? "1px solid #d4af37" : "1px solid #3a2f18",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      boxShadow: isTarget ? "0 0 16px rgba(212,175,55,0.35)" : "none",
                    }}
                  >
                    <span style={{ color: "#fb923c" }}>{typedPart}</span>
                    <span style={{ color: isTarget ? "#e8e3d4" : "#8a7245" }}>{restPart}</span>
                  </div>
                );
              })}

              {particles.map((p) => (
                <div
                  key={p.id}
                  style={{
                    position: "absolute",
                    left: p.x,
                    top: p.y,
                    transform: "translate(-50%, -50%)",
                    color: "#4ade80",
                    fontWeight: 700,
                    fontSize: 14,
                    opacity: Math.max(p.life * 2, 0),
                    pointerEvents: "none",
                  }}
                >
                  {p.text}
                </div>
              ))}

              {/* player turret */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 16,
                  transform: "translateX(-50%)",
                  fontSize: 22,
                  filter: "drop-shadow(0 0 8px rgba(212,175,55,0.6))",
                  pointerEvents: "none",
                }}
              >
                ▲
              </div>

              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 40,
                  height: 1,
                  background: "linear-gradient(90deg, transparent, #6b1a1a, transparent)",
                }}
              />
            </>
          )}

          {screen === "gameover" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 24,
                background: "rgba(5,4,3,0.85)",
              }}
            >
              <div style={{ fontSize: 12, letterSpacing: 3, color: "#6b1a1a", marginBottom: 10 }}>
                ACCOUNT BLOWN
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: "#e8e3d4",
                  marginBottom: 4,
                  fontFamily: "Georgia, serif",
                }}
              >
                {score} pts
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: tier.color,
                  marginBottom: 24,
                  padding: "4px 14px",
                  border: "1px solid " + tier.color,
                  borderRadius: 20,
                }}
              >
                RANK: {tier.name}
              </div>
              <div style={{ display: "flex", gap: 28, marginBottom: 28, flexWrap: "wrap", justifyContent: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: "#8a7245", letterSpacing: 1 }}>BEST COMBO</div>
                  <div style={{ fontSize: 18, color: "#fb923c", fontWeight: 700 }}>x{bestCombo}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#8a7245", letterSpacing: 1 }}>HIGH SCORE</div>
                  <div style={{ fontSize: 18, color: "#d4af37", fontWeight: 700 }}>{highScore}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#8a7245", letterSpacing: 1 }}>WAVE REACHED</div>
                  <div style={{ fontSize: 18, color: "#e8e3d4", fontWeight: 700 }}>{wave}</div>
                </div>
              </div>
              <button
                onClick={startGame}
                style={{
                  background: "linear-gradient(180deg, #e8c655, #b8932e)",
                  color: "#1a1306",
                  border: "none",
                  padding: "12px 40px",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 2,
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "'Courier New', monospace",
                }}
              >
                TRADE AGAIN
              </button>
            </div>
          )}
        </div>

        {/* Typed text display */}
        {screen === "playing" && (
          <div
            style={{
              padding: "8px 20px",
              borderTop: "1px solid #2a2010",
              background: "rgba(0,0,0,0.35)",
              minHeight: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 18,
                letterSpacing: 3,
                color: "#d4af37",
                fontWeight: 700,
                minHeight: 22,
              }}
            >
              {typed || "\u00A0"}
              <span style={{ opacity: 0.5, animation: "blink 1s infinite" }}>|</span>
            </span>
          </div>
        )}

        {/* On-screen keyboard */}
        {screen === "playing" && (
          <div
            style={{
              padding: "10px 8px 14px",
              background: "rgba(0,0,0,0.45)",
              borderTop: "1px solid #2a2010",
              flexShrink: 0,
            }}
          >
            {KEY_ROWS.map((row, ri) => (
              <div
                key={ri}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 5,
                  marginBottom: 5,
                  paddingLeft: ri === 1 ? 14 : ri === 2 ? 28 : 0,
                  paddingRight: ri === 1 ? 14 : ri === 2 ? 28 : 0,
                }}
              >
                {row.map((k) => {
                  const isLive = liveLetters.has(k);
                  const isActive = activeKey === k;
                  return (
                    <button
                      key={k}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        pressKey(k);
                      }}
                      style={{
                        flex: 1,
                        maxWidth: 38,
                        minWidth: 22,
                        height: 38,
                        borderRadius: 6,
                        border: isLive ? "1px solid #d4af37" : "1px solid #3a2f18",
                        background: isActive
                          ? "#d4af37"
                          : isLive
                          ? "rgba(212,175,55,0.16)"
                          : "rgba(255,255,255,0.03)",
                        color: isActive ? "#1a1306" : isLive ? "#e8c655" : "#7a6a48",
                        fontSize: 13,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "background 0.08s, color 0.08s",
                        touchAction: "manipulation",
                      }}
                    >
                      {k}
                    </button>
                  );
                })}
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleBackspace();
                }}
                style={{
                  width: 140,
                  height: 34,
                  borderRadius: 6,
                  border: "1px solid #3a2f18",
                  background: "rgba(255,255,255,0.03)",
                  color: "#7a6a48",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  touchAction: "manipulation",
                }}
              >
                ⌫ BACKSPACE
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
      `}</style>
    </div>
  );
}

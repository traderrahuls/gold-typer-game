import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  blue:"#2563EB",green:"#10B981",yellow:"#F59E0B",purple:"#8B5CF6",
  red:"#EF4444",orange:"#F97316",cyan:"#0EA5E9",dark:"#1E3A8A",
  gray:"#64748B",bg:"#F1F5F9",white:"#FFFFFF",
};

/* ─── HELPERS ─── */
const px = (style={}) => ({ fontFamily:"'Poppins',sans-serif", ...style });
const Btn = ({ children, color=C.blue, onClick, style={}, sm }) => (
  <button onClick={onClick} style={{
    background:color, color:"#fff", border:"none", borderRadius:12,
    padding: sm ? "8px 16px":"12px 24px",
    ...px({ fontWeight:700, fontSize: sm?12:14, cursor:"pointer",
      boxShadow:`0 4px 12px ${color}55`, transition:"transform .1s", ...style }),
  }}
    onMouseDown={e=>e.currentTarget.style.transform="scale(.95)"}
    onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
  >{children}</button>
);

/* AdSense banner placeholder */
const AdBanner = ({ slot="top" }) => (
  <div style={{
    width:"100%", height: slot==="top"?50:90,
    background:"linear-gradient(90deg,#f0f4ff,#e0f2fe)",
    border:"1.5px dashed #93c5fd", borderRadius:10,
    display:"flex", alignItems:"center", justifyContent:"center",
    color:"#60a5fa", fontSize:11, fontWeight:700, letterSpacing:1,
    margin:"6px 0", flexShrink:0,
  }}>📢 AD BANNER ({slot === "top" ? "320×50" : "320×90"})</div>
);

const Header = ({ title, icon, color, onBack, score }) => (
  <div style={{
    background:color, padding:"36px 16px 14px",
    display:"flex", alignItems:"center", justifyContent:"space-between",
    boxShadow:`0 4px 12px ${color}66`,
  }}>
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      {onBack && (
        <button onClick={onBack} style={{
          background:"rgba(255,255,255,0.2)", border:"none", borderRadius:8,
          color:"#fff", fontSize:18, cursor:"pointer", padding:"4px 10px", fontWeight:900,
        }}>‹</button>
      )}
      <span style={{ fontSize:22 }}>{icon}</span>
      <span style={px({ color:"#fff", fontWeight:800, fontSize:17 })}>{title}</span>
    </div>
    {score !== undefined && (
      <div style={{
        background:"rgba(255,255,255,0.2)", borderRadius:10,
        padding:"4px 12px", color:"#fff", fontWeight:700, fontSize:13,
      }}>⭐ {score}</div>
    )}
  </div>
);

/* ─── SPLASH ─── */
function Splash({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      width:"100%", height:"100vh",
      background:"linear-gradient(170deg,#1e3a8a,#1d4ed8 45%,#2563eb)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      position:"relative", overflow:"hidden",
    }}>
      {/* stars */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 400 800">
        {Array.from({length:20},(_,i)=>(
          <circle key={i} cx={20+i*18} cy={30+i*30} r={i%3===0?2.5:1.5} fill="#fff" opacity={.5+Math.random()*.5}/>
        ))}
        {[[60,40],[330,100],[190,180]].map(([x,y],i)=>(
          <text key={i} x={x} y={y} fontSize={i===1?24:16} fill="#F59E0B" opacity={.9}>★</text>
        ))}
      </svg>
      {/* clouds */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:130 }}>
        <svg viewBox="0 0 400 100" style={{ width:"100%", height:"100%" }}>
          <ellipse cx="50" cy="90" rx="90" ry="45" fill="#3b82f6" opacity=".45"/>
          <ellipse cx="200" cy="95" rx="130" ry="52" fill="#60a5fa" opacity=".4"/>
          <ellipse cx="360" cy="88" rx="80" ry="42" fill="#3b82f6" opacity=".45"/>
          <ellipse cx="200" cy="105" rx="200" ry="50" fill="#93c5fd" opacity=".3"/>
        </svg>
      </div>
      <div style={{ zIndex:2, textAlign:"center" }}>
        <div style={px({ fontSize:52, fontWeight:900, letterSpacing:-1 })}>
          <span style={{ color:C.blue }}>Gi</span><span style={{ color:C.green }}>g</span>
          <span style={{ color:"#fff" }}>Li</span><span style={{ color:C.yellow }}>fe</span>
        </div>
        <div style={{
          background:C.blue, color:"#fff", borderRadius:20,
          padding:"4px 18px", fontSize:13, fontWeight:800, letterSpacing:1,
          display:"inline-block", marginTop:4,
        }}>LEARN &amp; PLAY</div>
        <div style={{ marginTop:28, display:"flex", flexDirection:"column", gap:8 }}>
          {["Play Smart","Learn Faster","Grow Better"].map((t,i)=>(
            <div key={i} style={px({ color:"#fff", fontWeight:700, fontSize:19,
              display:"flex", alignItems:"center", gap:8, justifyContent:"center" })}>
              {i>0&&<span style={{ color:C.yellow, fontSize:8 }}>●</span>}{t}
            </div>
          ))}
        </div>
      </div>
      {/* loader */}
      <div style={{ position:"absolute", bottom:56, display:"flex", gap:5, zIndex:2 }}>
        {Array.from({length:12},(_,i)=>(
          <div key={i} style={{ width:5, height:5, borderRadius:"50%",
            background: i<8?C.yellow:"rgba(255,255,255,.3)" }}/>
        ))}
      </div>
    </div>
  );
}

/* ─── LOGIN ─── */
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleGoogle = () => {
    if (!isValidEmail(email)) {
      setError("Pehle valid email address daalein");
      return;
    }
    setError("");
    onLogin(email);
  };

  const handleGuest = () => {
    onLogin("guest");
  };

  return (
    <div style={{
      width:"100%", minHeight:"100vh", background:"#fff",
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"36px 20px 20px", ...px(),
    }}>
      <div style={{ fontSize:13, color:C.gray, marginBottom:6 }}>Welcome to</div>
      <div style={px({ fontSize:38, fontWeight:900, letterSpacing:-1 })}>
        <span style={{ color:C.blue }}>Gi</span><span style={{ color:C.green }}>g</span>
        <span style={{ color:"#1e293b" }}>Li</span><span style={{ color:C.yellow }}>fe</span>
      </div>
      <div style={{
        background:C.blue, color:"#fff", borderRadius:20,
        padding:"3px 14px", fontSize:11, fontWeight:800, marginTop:4,
      }}>LEARN &amp; PLAY</div>
      <div style={{ color:C.blue, fontSize:13, fontWeight:600, marginTop:6 }}>
        सीखें • खेलें • बढ़ें
      </div>

      <div style={{
        width:"100%", height:130, marginTop:14, marginBottom:10,
        background:"linear-gradient(135deg,#dbeafe,#e0f2fe)", borderRadius:18,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:56, gap:8,
      }}>🧒👧</div>

      <AdBanner slot="top" />

      <input
        type="email"
        value={email}
        onChange={(e)=>{ setEmail(e.target.value); if(error) setError(""); }}
        placeholder="Apna email daalein"
        style={{
          width:"100%", padding:"12px 14px", marginTop:8,
          border:`2px solid ${error?C.red:"#e5e7eb"}`, borderRadius:14,
          ...px({ fontSize:14, outline:"none" }),
        }}
      />
      {error && (
        <div style={px({ color:C.red, fontSize:11, fontWeight:600, marginTop:4, alignSelf:"flex-start" })}>
          ⚠️ {error}
        </div>
      )}

      <button onClick={handleGoogle} style={{
        width:"100%", padding:"13px", marginTop:10,
        background:C.blue, color:"#fff", border:"none", borderRadius:14, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        ...px({ fontWeight:700, fontSize:15, boxShadow:`0 4px 12px ${C.blue}44` }),
      }}>
        <span style={{ fontSize:20 }}>🔵</span> Continue with Google
      </button>
      <button onClick={handleGuest} style={{
        width:"100%", padding:"12px", marginTop:8,
        background:"#fff", color:"#374151", border:"2px solid #e5e7eb",
        borderRadius:14, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        ...px({ fontWeight:600, fontSize:14 }),
      }}>
        👤 Continue as Guest
      </button>
      <div style={{ color:C.gray, fontSize:11, margin:"10px 0 6px" }}>या / OR</div>
      <div style={{ display:"flex", gap:10, width:"100%" }}>
        {[["🇮🇳","हिन्दी"],["🇬🇧","English"]].map(([f,l])=>(
          <button key={l} style={{
            flex:1, padding:"10px", background:"#f8fafc", border:"2px solid #e2e8f0",
            borderRadius:12, cursor:"pointer", ...px({ fontWeight:700, fontSize:13,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6 }),
          }}>{f} {l}</button>
        ))}
      </div>
      <div style={{ color:C.gray, fontSize:10, marginTop:14, textAlign:"center" }}>
        By continuing, you agree to our <span style={{ color:C.blue }}>Terms</span> &amp; <span style={{ color:C.blue }}>Privacy Policy</span>
      </div>
    </div>
  );
}

/* ─── GAMES DATA ─── */
const GAMES = [
  { id:"typing",  icon:"⌨️", name:"Typing Blaster", color:C.blue,   cat:"Skills"   },
  { id:"quiz",    icon:"❓", name:"Quiz Arena",      color:C.yellow, cat:"Knowledge"},
  { id:"math",    icon:"➕", name:"Math Master",     color:C.green,  cat:"Math"     },
  { id:"english", icon:"🔤", name:"English Words",   color:C.purple, cat:"Language" },
  { id:"science", icon:"🔬", name:"Science Lab",     color:C.orange, cat:"Science"  },
  { id:"chess",   icon:"♟️", name:"Chess",           color:C.dark,   cat:"Strategy" },
  { id:"ttt",     icon:"⭕", name:"Tic Tac Toe",     color:C.red,    cat:"Fun"      },
  { id:"memory",  icon:"🧠", name:"Memory Match",    color:C.cyan,   cat:"Brain"    },
];

/* ─── HOME DASHBOARD ─── */
function Home({ onGame, scores }) {
  const totalXP = Object.values(scores).reduce((a,b)=>a+b,0);
  return (
    <div style={{ width:"100%", display:"flex", flexDirection:"column", ...px() }}>
      {/* top header */}
      <div style={{ background:C.blue, padding:"36px 16px 16px",
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:42, height:42, borderRadius:"50%", background:"#dbeafe",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🧒</div>
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Hello, Gigi!</div>
            <div style={{ background:C.yellow, color:"#7c2d12", fontSize:10,
              fontWeight:700, padding:"2px 10px", borderRadius:10, display:"inline-block" }}>
              🎮 Level {Math.min(100,Math.floor(totalXP/100)+1)}
            </div>
          </div>
        </div>
        <div style={{ fontSize:22 }}>🔔</div>
      </div>

      {/* XP & Coins */}
      <div style={{
        margin:"12px 14px 0", background:"#fff", borderRadius:16, padding:"12px 20px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        boxShadow:"0 2px 12px rgba(0,0,0,.08)",
      }}>
        {[["⭐","XP",totalXP],["🪙","Coins",Math.floor(totalXP/2)]].map(([ico,lbl,val])=>(
          <div key={lbl} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:26 }}>{ico}</span>
            <div>
              <div style={{ fontSize:10, color:C.gray }}>{lbl}</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#1e293b" }}>{val}</div>
            </div>
          </div>
        ))}
        <div style={{ width:32, height:32, borderRadius:"50%", background:C.green,
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#fff", fontWeight:900, fontSize:20, cursor:"pointer" }}>+</div>
      </div>

      <div style={{ padding:"10px 14px 0" }}>
        <AdBanner slot="top" />
        <div style={{ fontSize:13, fontWeight:700, color:"#374151", margin:"6px 0 10px" }}>
          खेलें और सीखें / Play &amp; Learn
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {GAMES.map(g=>(
            <button key={g.id} onClick={()=>onGame(g.id)} style={{
              background:g.color, borderRadius:16, border:"none", cursor:"pointer",
              padding:"14px 10px", display:"flex", alignItems:"center", justifyContent:"center",
              gap:8, boxShadow:`0 4px 14px ${g.color}55`, transition:"transform .12s",
              position:"relative",
            }}
              onMouseDown={e=>e.currentTarget.style.transform="scale(.95)"}
              onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
            >
              {scores[g.id]>0 && (
                <div style={{ position:"absolute", top:6, right:8,
                  background:"rgba(255,255,255,.25)", borderRadius:8,
                  fontSize:9, fontWeight:700, color:"#fff", padding:"1px 6px" }}>
                  {scores[g.id]}pts
                </div>
              )}
              <span style={{ fontSize:26 }}>{g.icon}</span>
              <span style={{ color:"#fff", fontWeight:700, fontSize:12,
                whiteSpace:"pre-line", textAlign:"left", lineHeight:1.2 }}>
                {g.name.replace(" ","\n")}
              </span>
            </button>
          ))}
        </div>
        {/* daily challenge */}
        <div style={{
          marginTop:10, background:C.yellow, borderRadius:16,
          padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between",
          boxShadow:`0 4px 14px ${C.yellow}66`, cursor:"pointer",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:26 }}>🔥</span>
            <div>
              <div style={{ fontWeight:800, fontSize:14, color:"#7c2d12" }}>Daily Challenge</div>
              <div style={{ fontSize:11, color:"#92400e" }}>Play daily &amp; win big rewards!</div>
            </div>
          </div>
          <span style={{ fontSize:22, color:"#7c2d12" }}>›</span>
        </div>
        <AdBanner slot="banner" />
      </div>
    </div>
  );
}

/* ─── ALL GAMES PAGE ─── */
function GamesPage({ onGame }) {
  const cats = [...new Set(GAMES.map(g=>g.cat))];
  return (
    <div style={{ width:"100%", ...px() }}>
      <div style={{ background:C.purple, padding:"36px 16px 16px" }}>
        <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>🎮 All Games</div>
        <div style={{ color:"rgba(255,255,255,.75)", fontSize:12, marginTop:2 }}>8 games available</div>
      </div>
      <AdBanner slot="top" />
      <div style={{ padding:"12px 14px" }}>
        {cats.map(cat=>(
          <div key={cat} style={{ marginBottom:18 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.gray,
              letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>{cat}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {GAMES.filter(g=>g.cat===cat).map(g=>(
                <button key={g.id} onClick={()=>onGame(g.id)} style={{
                  background:"#fff", border:"none", borderRadius:14, cursor:"pointer",
                  padding:"14px 16px", display:"flex", alignItems:"center", gap:14,
                  boxShadow:"0 2px 10px rgba(0,0,0,.07)", textAlign:"left",
                }}>
                  <div style={{ width:46, height:46, borderRadius:14, background:g.color,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:24,
                    boxShadow:`0 4px 10px ${g.color}55`, flexShrink:0 }}>{g.icon}</div>
                  <div>
                    <div style={px({ fontWeight:700, fontSize:14, color:"#1e293b" })}>{g.name}</div>
                    <div style={px({ fontSize:11, color:C.gray, marginTop:2 })}>{g.cat} • Tap to play</div>
                  </div>
                  <span style={{ marginLeft:"auto", color:C.gray, fontSize:18 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── LEADERBOARD ─── */
const lbData = [
  { rank:1,  name:"Arjun S.",   avatar:"👦", xp:4820, badge:"🥇", color:C.yellow },
  { rank:2,  name:"Priya M.",   avatar:"👧", xp:4210, badge:"🥈", color:C.gray   },
  { rank:3,  name:"Rahul K.",   avatar:"🧑", xp:3890, badge:"🥉", color:C.orange },
  { rank:4,  name:"Sneha R.",   avatar:"👩", xp:3200, badge:"⭐", color:C.blue   },
  { rank:5,  name:"Amit T.",    avatar:"👦", xp:2900, badge:"⭐", color:C.blue   },
  { rank:6,  name:"Kavya P.",   avatar:"👧", xp:2600, badge:"⭐", color:C.blue   },
  { rank:7,  name:"Rohan V.",   avatar:"🧑", xp:2100, badge:"⭐", color:C.blue   },
  { rank:8,  name:"You (Gigi)", avatar:"🧒", xp:1200, badge:"🎮", color:C.purple, isMe:true },
  { rank:9,  name:"Dev N.",     avatar:"👦", xp:980,  badge:"⭐", color:C.blue   },
  { rank:10, name:"Tanya S.",   avatar:"👧", xp:760,  badge:"⭐", color:C.blue   },
];

function Leaderboard() {
  const [tab, setTab] = useState("global");
  const top3 = lbData.slice(0,3);
  const rest = lbData.slice(3);
  return (
    <div style={{ width:"100%", ...px() }}>
      <div style={{ background:C.yellow, padding:"36px 16px 16px" }}>
        <div style={{ color:"#7c2d12", fontWeight:800, fontSize:18 }}>🏆 Leaderboard</div>
        <div style={{ color:"#92400e", fontSize:12, marginTop:2 }}>Compete & Rise to the Top!</div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:"#fff", borderBottom:"2px solid #e2e8f0" }}>
        {["global","weekly","friends"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            flex:1, padding:"10px 0", border:"none", background:"transparent", cursor:"pointer",
            borderBottom: tab===t?`3px solid ${C.yellow}`:"3px solid transparent",
            color: tab===t?C.yellow:C.gray,
            ...px({ fontWeight:700, fontSize:12, textTransform:"capitalize" }),
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding:"14px" }}>
        {/* Top 3 podium */}
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:8, marginBottom:16 }}>
          {[top3[1], top3[0], top3[2]].map((p, i)=>{
            const heights = [90, 110, 80];
            const podiumColors = [C.gray, C.yellow, C.orange];
            return (
              <div key={p.rank} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                <div style={{ fontSize:30 }}>{p.avatar}</div>
                <div style={px({ fontSize:10, fontWeight:700, color:"#1e293b", marginTop:2, textAlign:"center" })}>{p.name}</div>
                <div style={px({ fontSize:10, color:C.gray })}>{p.xp} XP</div>
                <div style={{
                  width:"100%", height:heights[i], background:podiumColors[i],
                  borderRadius:"8px 8px 0 0", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:20, marginTop:4,
                  boxShadow:`0 4px 10px ${podiumColors[i]}66`,
                }}>{p.badge}</div>
              </div>
            );
          })}
        </div>

        <AdBanner slot="top" />

        {/* Rest */}
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:8 }}>
          {rest.map(p=>(
            <div key={p.rank} style={{
              background: p.isMe ? C.purple+"15" : "#fff",
              border: `2px solid ${p.isMe ? C.purple : "#e2e8f0"}`,
              borderRadius:14, padding:"12px 14px",
              display:"flex", alignItems:"center", gap:12,
              boxShadow:"0 2px 8px rgba(0,0,0,.06)",
            }}>
              <div style={px({ width:28, fontWeight:800, fontSize:14,
                color: p.isMe?C.purple:C.gray, textAlign:"center" })}>#{p.rank}</div>
              <div style={{ fontSize:28 }}>{p.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={px({ fontWeight:700, fontSize:13, color:"#1e293b" })}>
                  {p.name} {p.isMe&&<span style={{ color:C.purple }}>(You)</span>}
                </div>
                <div style={{ height:5, background:"#e2e8f0", borderRadius:3, marginTop:4 }}>
                  <div style={{ height:"100%", width:`${(p.xp/4820)*100}%`,
                    background: p.isMe?C.purple:C.blue, borderRadius:3 }}/>
                </div>
              </div>
              <div style={px({ fontWeight:800, fontSize:13, color: p.isMe?C.purple:C.gray })}>{p.xp} XP</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PROFILE ─── */
function Profile({ scores, darkMode, onToggleDark }) {
  const totalXP = Object.values(scores).reduce((a,b)=>a+b,0);
  const level = Math.min(100, Math.floor(totalXP/100)+1);
  const nextLevelXP = level*100;
  const progress = level>=100 ? 100 : (totalXP % 100);

  const [notif, setNotif] = useState(true);
  const [sound, setSound] = useState(true);
  const [lang, setLang] = useState("हिन्दी");
  const [modal, setModal] = useState(null); // "help" | "privacy" | null

  const achievements = [
    { icon:"🔥", name:"First Game",   desc:"Play your first game",   done:totalXP>0    },
    { icon:"⭐", name:"Score 50 XP",  desc:"Earn 50 XP total",       done:totalXP>=50  },
    { icon:"🏆", name:"Score 200 XP", desc:"Earn 200 XP total",      done:totalXP>=200 },
    { icon:"🎯", name:"All Games",    desc:"Play all 8 games",       done:Object.keys(scores).filter(k=>scores[k]>0).length>=8 },
    { icon:"💎", name:"Score 500 XP", desc:"Earn 500 XP total",      done:totalXP>=500 },
    { icon:"👑", name:"Level 5",      desc:"Reach Level 5",          done:level>=5     },
    { icon:"🌟", name:"Level 100",    desc:"Reach Max Level",        done:level>=100   },
  ];

  const stats = GAMES.map(g=>({ ...g, pts: scores[g.id]||0 })).sort((a,b)=>b.pts-a.pts);

  return (
    <div style={{ width:"100%", ...px() }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.blue},${C.purple})`, padding:"36px 16px 24px", textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"#dbeafe",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:40, margin:"0 auto 10px", border:"3px solid rgba(255,255,255,.4)" }}>🧒</div>
        <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>Gigi</div>
        <div style={{ color:"rgba(255,255,255,.8)", fontSize:12, marginBottom:10 }}>@giglife_player</div>
        <div style={{ display:"flex", justifyContent:"center", gap:12 }}>
          {[["Level",level,"🎮"],["XP",totalXP,"⭐"],["Coins",Math.floor(totalXP/2),"🪙"]].map(([lbl,val,ico])=>(
            <div key={lbl} style={{ background:"rgba(255,255,255,.15)", borderRadius:12, padding:"8px 14px", textAlign:"center" }}>
              <div style={{ fontSize:16 }}>{ico}</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:16 }}>{val}</div>
              <div style={{ color:"rgba(255,255,255,.7)", fontSize:10 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"14px" }}>
        {/* Level progress */}
        <div style={{ background:"#fff", borderRadius:16, padding:"14px 16px", marginBottom:12,
          boxShadow:"0 2px 10px rgba(0,0,0,.07)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={px({ fontWeight:700, fontSize:13 })}>Level {level} Progress</span>
            <span style={px({ fontSize:12, color:C.gray })}>{progress}/100 XP</span>
          </div>
          <div style={{ height:10, background:"#e2e8f0", borderRadius:5 }}>
            <div style={{ height:"100%", width:`${progress}%`,
              background:`linear-gradient(90deg,${C.blue},${C.purple})`, borderRadius:5,
              transition:"width .4s" }}/>
          </div>
          <div style={px({ fontSize:11, color:C.gray, marginTop:6 })}>
            {level>=100 ? "🏆 Max Level Reached!" : `${100-progress} XP to Level ${level+1}`}
          </div>
        </div>

        {/* Achievements */}
        <div style={px({ fontWeight:700, fontSize:14, marginBottom:10, color:"#1e293b" })}>
          🏅 Achievements
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
          {achievements.map(a=>(
            <div key={a.name} style={{
              background: a.done?"#fff":"#f8fafc",
              border:`2px solid ${a.done?C.yellow:"#e2e8f0"}`,
              borderRadius:14, padding:"12px", opacity: a.done?1:0.55,
              boxShadow: a.done?"0 2px 10px rgba(0,0,0,.08)":"none",
            }}>
              <div style={{ fontSize:26 }}>{a.icon}</div>
              <div style={px({ fontWeight:700, fontSize:12, color:"#1e293b", marginTop:4 })}>{a.name}</div>
              <div style={px({ fontSize:10, color:C.gray })}>{a.desc}</div>
              {a.done && <div style={{ fontSize:10, color:C.green, fontWeight:700, marginTop:4 }}>✅ Unlocked!</div>}
            </div>
          ))}
        </div>

        {/* Game stats */}
        <div style={px({ fontWeight:700, fontSize:14, marginBottom:10, color:"#1e293b" })}>
          📊 Game Stats
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
          {stats.map(g=>(
            <div key={g.id} style={{ background:"#fff", borderRadius:14, padding:"12px 14px",
              display:"flex", alignItems:"center", gap:12,
              boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
              <div style={{ width:38, height:38, borderRadius:10, background:g.color,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
                flexShrink:0 }}>{g.icon}</div>
              <div style={{ flex:1 }}>
                <div style={px({ fontWeight:700, fontSize:12 })}>{g.name}</div>
                <div style={{ height:4, background:"#e2e8f0", borderRadius:2, marginTop:5 }}>
                  <div style={{ height:"100%", borderRadius:2,
                    width:`${Math.min((g.pts/100)*100,100)}%`, background:g.color }}/>
                </div>
              </div>
              <div style={px({ fontWeight:800, fontSize:14, color:g.pts>0?g.color:C.gray })}>{g.pts} pts</div>
            </div>
          ))}
        </div>

        <AdBanner slot="banner" />

        {/* Settings */}
        <div style={px({ fontWeight:700, fontSize:14, margin:"14px 0 10px", color:"#1e293b" })}>
          ⚙️ Settings
        </div>
        {[
          ["🔔","Notifications", notif?"On":"Off", ()=>{setModal(null);setNotif(v=>!v);}],
          ["🌙","Dark Mode", darkMode?"On":"Off", ()=>{setModal(null);onToggleDark();}],
          ["🔊","Sound Effects", sound?"On":"Off", ()=>{setModal(null);setSound(v=>!v);}],
          ["🌐","Language", lang, ()=>{setModal(null);setLang(l=>l==="हिन्दी"?"English":"हिन्दी");}],
          ["❓","Help & Support", "", ()=>setModal(modal==="help"?null:"help")],
          ["📋","Privacy Policy", "", ()=>setModal(modal==="privacy"?null:"privacy")],
        ].map(([ico,lbl,val,handleClick])=>(
          <div key={lbl}>
            <div onClick={handleClick} style={{ background:"#fff", borderRadius:14, padding:"13px 16px", marginBottom:8,
              display:"flex", alignItems:"center", gap:12, cursor:"pointer",
              boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
              <span style={{ fontSize:20 }}>{ico}</span>
              <span style={px({ flex:1, fontWeight:600, fontSize:13, color:"#1e293b" })}>{lbl}</span>
              <span style={px({ fontSize:12, color: (lbl==="Help & Support"&&modal==="help")||(lbl==="Privacy Policy"&&modal==="privacy") ? C.blue : C.gray, fontWeight: ((lbl==="Help & Support"&&modal==="help")||(lbl==="Privacy Policy"&&modal==="privacy"))?700:400 })}>
                {val} {lbl==="Help & Support"?(modal==="help"?"▲":"▼"):lbl==="Privacy Policy"?(modal==="privacy"?"▲":"▼"):"›"}
              </span>
            </div>
            {lbl==="Help & Support" && modal==="help" && (
              <div style={{ background:"#eff6ff", border:`2px solid ${C.blue}33`, borderRadius:14,
                padding:"14px 16px", marginTop:-4, marginBottom:10, ...px() }}>
                <div style={{ fontSize:13, color:"#374151", lineHeight:1.6 }}>
                  Kisi bhi problem ke liye humein Telegram par contact karein: <b>@traderrahul1</b>.
                  <br/><br/>Hum jaldi se jaldi reply karne ki koshish karenge.
                </div>
              </div>
            )}
            {lbl==="Privacy Policy" && modal==="privacy" && (
              <div style={{ background:"#eff6ff", border:`2px solid ${C.blue}33`, borderRadius:14,
                padding:"14px 16px", marginTop:-4, marginBottom:10, ...px() }}>
                <div style={{ fontSize:13, color:"#374151", lineHeight:1.6 }}>
                  GigLife aapki kisi bhi personal jaankari ko third parties ke saath share nahi karta.
                  App ke andar ka data sirf aapke gameplay experience ko behtar banane ke liye use hota hai.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ GAME SCREENS ═══════════════ */

/* ─── TYPING BLASTER (GigLife v7 engine) ─── */
const WORD_BANK_TRADING = [
  "gold","scalp","entry","target","profit","candle","trend","ema","cross","angle",
  "support","resist","order","block","liquidity","grab","fvg","gap","rsi","bullish",
  "bearish","signal","setup","stoploss","breakout","reversal","momentum","volume",
  "pivot","zone","confirm","wait","patience","discipline","strategy","trade",
  "pattern","level","swing","scalper","xauusd","bitcoin","chart","buy","sell",
];
const WORD_BANK_ENGLISH = [
  "apple","brave","cloud","dream","flame","grace","heart","ideal","jolly","knife",
  "light","magic","noble","ocean","peace","queen","river","shine","truth","vivid",
  "water","youth","zebra","blend","crisp","dance","eagle","frost","globe","honey",
  "image","jewel","karma","lemon","mango","night","olive","power","quest","robin",
  "storm","tiger","unity","voice","winds","amber","beach","crane","delta","ember",
  "fable","giant","haven","joker","lunar","maple","nerve","orbit","piano","radar",
  "solar","table","vault","whole","extra","yield","smile","focus","learn","think",
  "grow","speak","write","listen","share","build","create","achieve","success",
];

function buildWaves(bank) {
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  const waves = []; let i = 0, wn = 1;
  while (i < shuffled.length) {
    const count = Math.min(4 + wn, 8, shuffled.length - i);
    waves.push({ num: wn, words: shuffled.slice(i, i + count) });
    i += count; wn++;
  }
  return waves;
}

function parseCustomText(text) {
  const words = text.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/).filter(w => w.length >= 2 && w.length <= 14);
  if (words.length < 4) return null;
  const waves = []; let i = 0, wn = 1;
  while (i < words.length) {
    const count = Math.min(4 + wn, 8, words.length - i);
    waves.push({ num: wn, words: words.slice(i, i + count) });
    i += count; wn++;
  }
  return waves;
}

const KEY_ROWS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m"],
];

const DIFFICULTIES = {
  easy:   { speed: 28, label: "Easy",   color: "#10B981" },
  normal: { speed: 48, label: "Normal", color: "#F59E0B" },
  hard:   { speed: 78, label: "Hard",   color: "#EF4444" },
};

const G = {
  bg:       "#0f1729",
  bgCard:   "#1a2540",
  bgDark:   "#0a1020",
  blue:     "#2563EB",
  green:    "#10B981",
  yellow:   "#F59E0B",
  purple:   "#8B5CF6",
  red:      "#EF4444",
  white:    "#FFFFFF",
  textDim:  "rgba(255,255,255,0.5)",
  textMid:  "rgba(255,255,255,0.75)",
  border:   "rgba(255,255,255,0.1)",
  accent:   "#00e5cc",
};

let tb_eid=0, tb_pid=0, tb_bid=0;

/* ── AUDIO (WebAudio SFX + optional bg music) ── */
function useAudio(volume, muted) {
  const ctxR  = useRef(null);
  const mastR = useRef(null);
  const audioR = useRef(null);
  const volR  = useRef(volume);
  const mutR  = useRef(muted);

  useEffect(() => { volR.current = volume; if (audioR.current) audioR.current.volume = muted ? 0 : Math.min(volume,1); }, [volume, muted]);
  useEffect(() => { mutR.current = muted; if (audioR.current) audioR.current.volume = muted ? 0 : Math.min(volR.current,1); }, [muted]);

  const getCtx = useCallback(() => {
    if (!ctxR.current) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctxR.current = new AC();
        mastR.current = ctxR.current.createGain();
        mastR.current.gain.value = 0.25;
        mastR.current.connect(ctxR.current.destination);
      } catch(e) { return null; }
    }
    try { if (ctxR.current.state === "suspended") ctxR.current.resume(); } catch(e) {}
    return ctxR.current;
  }, []);

  const tone = useCallback((freq, dur, type, g0, f1) => {
    if (mutR.current) return;
    try {
      const c = getCtx(); if (!c) return;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, c.currentTime);
      if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(f1,1), c.currentTime+dur);
      g.gain.setValueAtTime(g0||0.2, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime+dur);
      o.connect(g); g.connect(mastR.current);
      o.start(); o.stop(c.currentTime+dur);
    } catch(e) {}
  }, [getCtx]);

  const startMusic = useCallback(() => {
    try {
      if (audioR.current) return;
      const a = new Audio();
      a.src = "/Chill_Relaxing_Lofi_Hip_Hop_Instrumental_-_Starstruck_256k_.mp3";
      a.loop = true;
      a.preload = "none";
      a.volume = mutR.current ? 0 : Math.min(volR.current, 1);
      audioR.current = a;
      setTimeout(() => { try { a.play().catch(()=>{}); } catch(e){} }, 800);
    } catch(e) {}
  }, []);

  const stopMusic = useCallback(() => {
    try {
      if (audioR.current) {
        audioR.current.pause();
        audioR.current.currentTime = 0;
        audioR.current = null;
      }
    } catch(e) {}
  }, []);

  const sfx = {
    type:     useCallback(()=>tone(700,0.04,"square",0.08),[tone]),
    shoot:    useCallback(()=>tone(900,0.07,"sawtooth",0.07,420),[tone]),
    explode:  useCallback(()=>{tone(180,0.15,"triangle",0.18,38);setTimeout(()=>tone(88,0.09,"square",0.08,28),28);},[tone]),
    miss:     useCallback(()=>tone(140,0.25,"sawtooth",0.14,55),[tone]),
    wrong:    useCallback(()=>tone(210,0.06,"square",0.07,95),[tone]),
    waveClear:useCallback(()=>{tone(440,0.09,"sine",0.15);setTimeout(()=>tone(550,0.1,"sine",0.15),80);setTimeout(()=>tone(660,0.13,"sine",0.17),160);setTimeout(()=>tone(880,0.18,"sine",0.18),250);},[tone]),
    gameOver: useCallback(()=>{tone(260,0.17,"sawtooth",0.14,110);setTimeout(()=>tone(150,0.24,"sawtooth",0.14,50),130);setTimeout(()=>tone(75,0.38,"sawtooth",0.12,22),290);},[tone]),
  };

  return { sfx, startMusic, stopMusic, getCtx };
}

/* ── STARFIELD (scoped to its own container, not full browser viewport) ── */
function TBStarfield() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ctx = el.getContext("2d");
    const STARS = Array.from({length:140}, ()=>({x:Math.random(),y:Math.random(),z:Math.random(),pz:Math.random()}));
    let raf;
    const draw = () => {
      const w = el.clientWidth||300, h = el.clientHeight||400;
      if (el.width!==w) el.width=w;
      if (el.height!==h) el.height=h;
      ctx.fillStyle = "#0f1729"; ctx.fillRect(0,0,w,h);
      const cx=w/2, cy=h/2;
      STARS.forEach(s=>{
        s.pz=s.z; s.z-=0.003;
        if(s.z<=0){s.x=Math.random();s.y=Math.random();s.z=1;s.pz=1;}
        const sx=(s.x-0.5)/s.z*w+cx, sy=(s.y-0.5)/s.z*h+cy;
        const px=(s.x-0.5)/s.pz*w+cx, py=(s.y-0.5)/s.pz*h+cy;
        const sz=Math.max(0.3,(1-s.z)*2); const op=Math.min(1,(1-s.z)*1.4);
        ctx.beginPath(); ctx.strokeStyle=`rgba(148,180,255,${op*0.6})`; ctx.lineWidth=sz;
        ctx.moveTo(px,py); ctx.lineTo(sx,sy); ctx.stroke();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none"}}/>;
}

function TypingGame({ onBack, addScore }) {
  const [screen, setScreen]             = useState("gameselect"); // gameselect | loadtext | playing | waveclear | gameover
  const [gameMode, setGameMode]         = useState("english");
  const [difficulty, setDifficulty]     = useState("normal");
  const [customText, setCustomText]     = useState("");
  const [customError, setCustomError]   = useState("");
  const [waves, setWaves]               = useState([]);
  const [waveIdx, setWaveIdx]           = useState(0);
  const [enemies, setEnemies]           = useState([]);
  const [typed, setTyped]               = useState("");
  const [score, setScore]               = useState(0);
  const [lives, setLives]               = useState(3);
  const [particles, setParticles]       = useState([]);
  const [bullets, setBullets]           = useState([]);
  const [combo, setCombo]               = useState(0);
  const [bestCombo, setBestCombo]       = useState(0);
  const [shake, setShake]               = useState(false);
  const [muted, setMuted]               = useState(false);
  const [volume, setVolume]             = useState(0.8);
  const [activeKey, setActiveKey]       = useState(null);
  const [wrongFlash, setWrongFlash]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [wordHint, setWordHint]         = useState("");
  const [waveScore, setWaveScore]       = useState(0);

  const { sfx, startMusic, stopMusic, getCtx } = useAudio(volume, muted);

  const areaRef  = useRef(null);
  const rafRef   = useRef(null);
  const spawnQ   = useRef([]);
  const spawnT   = useRef(0);
  const lastT    = useRef(0);
  const W        = useRef(360);
  const H        = useRef(400);
  const speedR   = useRef(48);
  const missS    = useRef(0);
  const waveIdxR = useRef(0);
  const wavesR   = useRef([]);
  const scoreR   = useRef(0);

  useEffect(()=>{scoreR.current=score;},[score]);

  const measure = useCallback(()=>{
    if(areaRef.current){W.current=areaRef.current.clientWidth;H.current=areaRef.current.clientHeight;}
  },[]);
  useEffect(()=>{measure();window.addEventListener("resize",measure);return()=>window.removeEventListener("resize",measure);},[measure]);

  const startWave = useCallback((waveList, idx, diff) => {
    if(rafRef.current) cancelAnimationFrame(rafRef.current);
    tb_eid=0;tb_pid=0;tb_bid=0;
    setEnemies([]);setParticles([]);setBullets([]);
    setTyped("");setWordHint("");missS.current=0;
    speedR.current=DIFFICULTIES[diff].speed;
    spawnQ.current=[...waveList[idx].words];
    spawnT.current=0;lastT.current=performance.now();
    setScreen("playing");
  },[]);

  const launchGame = useCallback((mode, diff, customWaves) => {
    try { getCtx(); } catch(e) {}
    const bank = mode==="trading"?WORD_BANK_TRADING:WORD_BANK_ENGLISH;
    const waveList = customWaves || buildWaves(bank);
    wavesR.current=waveList; waveIdxR.current=0;
    setWaves(waveList); setWaveIdx(0);
    setScore(0); setLives(3); setCombo(0); setBestCombo(0); setWaveScore(0);
    setGameMode(mode); setDifficulty(diff);
    startMusic();
    startWave(waveList, 0, diff);
  },[getCtx,startMusic,startWave]);

  const exitGame = useCallback(()=>{
    stopMusic();
    if(rafRef.current) cancelAnimationFrame(rafRef.current);
    setEnemies([]);setParticles([]);setBullets([]);
    setTyped("");setShowSettings(false);setWordHint("");
    onBack();
  },[stopMusic,onBack]);

  const endGame = useCallback(()=>{
    sfx.gameOver(); stopMusic();
    addScore("typing", scoreR.current);
    setScreen("gameover");
  },[sfx,stopMusic,addScore]);

  const nextWave = useCallback(()=>{
    const nextIdx = waveIdxR.current+1;
    if(nextIdx>=wavesR.current.length){endGame();return;}
    waveIdxR.current=nextIdx; setWaveIdx(nextIdx); setWaveScore(0);
    startWave(wavesR.current, nextIdx, difficulty);
  },[difficulty,endGame,startWave]);

  const spawnFromQueue = useCallback(()=>{
    if(!spawnQ.current.length) return false;
    const word=spawnQ.current.shift();
    const margin=60;
    const x=margin+Math.random()*Math.max(1,W.current-margin*2);
    tb_eid++;
    setEnemies(prev=>[...prev,{id:tb_eid,word,x,y:-38,speed:speedR.current,hit:false}]);
    return true;
  },[]);

  useEffect(()=>{
    if(screen!=="playing") return;
    const loop=(time)=>{
      const dt=Math.min((time-lastT.current)/1000,0.05);
      lastT.current=time;
      spawnT.current-=dt;
      if(spawnT.current<=0&&spawnQ.current.length>0){
        spawnFromQueue();
        spawnT.current=0.9+Math.random()*0.5;
      }
      setEnemies(prev=>{
        const h=H.current||400;
        const next=[];let lost=0;
        for(const e of prev){
          if(e.hit) continue;
          const ny=e.y+e.speed*dt;
          if(ny>=h-52){lost++;continue;}
          next.push({...e,y:ny});
        }
        if(lost>0){
          sfx.miss();missS.current+=lost;
          if(missS.current>=2){speedR.current=Math.max(20,speedR.current-8);missS.current=0;}
          setLives(l=>{const nl=l-lost;if(nl<=0){setTimeout(()=>endGame(),0);return 0;}return nl;});
          setCombo(0);setTyped("");setWordHint("");
          setShake(true);setTimeout(()=>setShake(false),220);
        }
        if(spawnQ.current.length===0&&next.length===0&&prev.length>0){
          setTimeout(()=>{sfx.waveClear();setScreen("waveclear");},300);
        }
        return next;
      });
      setParticles(p=>p.map(x=>({...x,life:x.life-dt})).filter(x=>x.life>0));
      setBullets(p=>p.map(x=>({...x,life:x.life-dt*6})).filter(x=>x.life>0));
      rafRef.current=requestAnimationFrame(loop);
    };
    lastT.current=performance.now();
    rafRef.current=requestAnimationFrame(loop);
    return()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);};
  },[screen,spawnFromQueue,endGame,sfx]);

  const pressKey=useCallback((ch)=>{
    if(screen!=="playing") return;
    setActiveKey(ch);setTimeout(()=>setActiveKey(null),90);
    const next=typed+ch;
    setEnemies(prev=>{
      const cands=prev.filter(e=>e.word.startsWith(next));
      if(!cands.length){sfx.wrong();setWrongFlash(true);setTimeout(()=>setWrongFlash(false),130);return prev;}
      let tgt=cands[0];
      for(const c of cands){if(c.y>tgt.y)tgt=c;}
      const slowed=prev.map(e=>e.id===tgt.id?{...e,speed:Math.max(e.speed*0.5,8)}:e);
      tb_bid++;
      setBullets(bs=>[...bs,{id:tb_bid,fromX:W.current/2,fromY:H.current-52,toX:tgt.x,toY:tgt.y,life:1}]);
      sfx.shoot();
      if(tgt.word===next){
        sfx.explode();
        const pts=10+tgt.word.length*4+(waveIdxR.current+1)*3;
        setScore(s=>s+pts);setWaveScore(ws=>ws+pts);
        setCombo(c=>{const nc=c+1;setBestCombo(b=>Math.max(b,nc));return nc;});
        tb_pid++;
        setParticles(ps=>[...ps,{id:tb_pid,x:tgt.x,y:tgt.y,life:0.55,text:"+"+pts}]);
        setTyped("");setWordHint("");
        missS.current=0;speedR.current=Math.min(speedR.current+1.5,DIFFICULTIES[difficulty].speed*1.6);
        return slowed.map(e=>e.id===tgt.id?{...e,hit:true}:e);
      }
      if(gameMode==="english") setWordHint(tgt.word);
      setTyped(next);
      return slowed;
    });
  },[screen,typed,sfx,gameMode,difficulty]);

  const handleBS=useCallback(()=>setTyped(t=>t.slice(0,-1)),[]);
  const handleKey=useCallback((e)=>{
    if(screen==="waveclear"){if(e.key==="Enter"||e.key===" ")nextWave();return;}
    if(screen!=="playing") return;
    if(e.key==="Escape"){exitGame();return;}
    if(e.key==="Backspace"){handleBS();return;}
    if(!/^[a-zA-Z]$/.test(e.key)) return;
    pressKey(e.key.toLowerCase());
  },[screen,pressKey,handleBS,exitGame,nextWave]);

  useEffect(()=>{window.addEventListener("keydown",handleKey);return()=>window.removeEventListener("keydown",handleKey);},[handleKey]);
  useEffect(()=>{
    const hits=enemies.filter(e=>e.hit);if(!hits.length) return;
    const t=setTimeout(()=>setEnemies(p=>p.filter(e=>!e.hit)),160);
    return()=>clearTimeout(t);
  },[enemies]);

  const liveLetters=(()=>{const s=new Set();enemies.forEach(e=>{if(e.word.startsWith(typed)){const c=e.word[typed.length];if(c)s.add(c);}});return s;})();
  const indLetters=(()=>{const s=new Set();if(!typed.length)enemies.forEach(e=>s.add(e.word[0]));return s;})();
  const waveNum=String(waveIdx+1).padStart(3,"0");
  const scoreStr=String(score).padStart(6,"0");

  const SettingsPanel=()=>(
    <div style={{position:"absolute",inset:0,background:"rgba(10,16,32,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:30,gap:20,padding:24}}>
      <div style={{fontSize:18,fontWeight:700,color:G.white,marginBottom:4}}>⚙️ Settings</div>
      <div style={{width:"100%",maxWidth:320,background:G.bgCard,border:"1px solid "+G.border,borderRadius:16,padding:"20px 24px",display:"flex",flexDirection:"column",gap:18}}>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontSize:12,color:G.textMid,fontWeight:600}}>🔊 Volume</span>
            <span style={{fontSize:13,color:G.yellow,fontWeight:700}}>{Math.round(volume*100)}%</span>
          </div>
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e=>setVolume(parseFloat(e.target.value))} style={{width:"100%",accentColor:G.blue}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:G.textMid,fontWeight:600}}>Mute All</span>
          <button onClick={()=>setMuted(m=>!m)} style={{background:muted?"rgba(239,68,68,0.15)":"rgba(16,185,129,0.15)",border:"1px solid "+(muted?"#EF4444":"#10B981"),borderRadius:20,color:muted?"#EF4444":"#10B981",padding:"6px 24px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{muted?"OFF":"ON"}</button>
        </div>
      </div>
      <div style={{display:"flex",gap:12}}>
        <button onClick={()=>setShowSettings(false)} style={{background:G.blue,color:G.white,border:"none",padding:"10px 32px",fontSize:13,fontWeight:700,borderRadius:10,cursor:"pointer",fontFamily:"inherit"}}>Resume</button>
        <button onClick={exitGame} style={{background:"transparent",border:"1px solid "+G.border,borderRadius:10,color:G.textMid,padding:"10px 24px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Home</button>
      </div>
    </div>
  );

  return (
    <div style={{position:"relative",width:"100%",minHeight:"100vh",fontFamily:"'Poppins','Segoe UI',sans-serif",overflow:"hidden",userSelect:"none",background:G.bg,display:"flex",flexDirection:"column",outline:wrongFlash?"2px solid "+G.red:"none",transform:shake?"translate(3px,-2px)":"none",transition:"transform 0.04s"}}>
      <TBStarfield/>
      <div style={{position:"relative",zIndex:1,width:"100%",flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* HUD */}
        {(screen==="playing"||screen==="waveclear")&&(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 16px",background:"rgba(10,16,32,0.9)",borderBottom:"1px solid "+G.border,flexShrink:0,zIndex:10}}>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:G.textDim,letterSpacing:2}}>WAVE</span>
                <span style={{fontSize:16,color:G.yellow,fontWeight:700}}>{waveNum}</span>
              </div>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:G.textDim,letterSpacing:2}}>SCORE</span>
                <span style={{fontSize:16,color:G.white,fontWeight:700}}>{scoreStr}</span>
              </div>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:G.textDim,letterSpacing:2}}>COMBO</span>
                <span style={{fontSize:16,color:combo>4?G.yellow:G.white,fontWeight:700}}>×{combo}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{display:"flex",gap:4}}>
                {[0,1,2].map(i=><div key={i} style={{width:12,height:12,borderRadius:"50%",background:i<lives?G.yellow:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",transition:"all 0.3s",boxShadow:i<lives?"0 0 8px "+G.yellow:"none"}}/>)}
              </div>
              <button onClick={()=>setShowSettings(true)} style={{background:"rgba(255,255,255,0.08)",border:"1px solid "+G.border,borderRadius:8,color:G.textMid,fontSize:16,width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>⚙</button>
            </div>
          </div>
        )}

        {/* Game Area */}
        <div ref={areaRef} style={{flex:1,position:"relative",overflow:"hidden",minHeight:340}}>
          {showSettings&&screen==="playing"&&<SettingsPanel/>}

          {/* GAME SELECT */}
          {screen==="gameselect"&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 16px",overflowY:"auto"}}>
              <div style={{fontSize:18,fontWeight:700,color:G.white,marginBottom:20}}>⌨️ Typing Blaster</div>

              <div style={{width:"100%",maxWidth:360,marginBottom:16}}>
                <div style={{fontSize:10,color:G.textDim,letterSpacing:2,marginBottom:10}}>MODE</div>
                <div style={{display:"flex",gap:10}}>
                  {[{key:"english",label:"📚 English",desc:"Learn words"},{key:"trading",label:"📈 Trading",desc:"Trading terms"}].map(m=>(
                    <button key={m.key} onClick={()=>setGameMode(m.key)} style={{flex:1,padding:"10px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,border:"1px solid "+(gameMode===m.key?G.blue:G.border),background:gameMode===m.key?"rgba(37,99,235,0.15)":G.bgCard,color:gameMode===m.key?G.blue:G.textMid,transition:"all 0.2s"}}>
                      <div>{m.label}</div><div style={{fontSize:9,opacity:0.6,marginTop:3}}>{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{width:"100%",maxWidth:360,marginBottom:24}}>
                <div style={{fontSize:10,color:G.textDim,letterSpacing:2,marginBottom:10}}>DIFFICULTY</div>
                <div style={{display:"flex",gap:8}}>
                  {Object.entries(DIFFICULTIES).map(([key,val])=>(
                    <button key={key} onClick={()=>setDifficulty(key)} style={{flex:1,padding:"9px 8px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,border:"1px solid "+(difficulty===key?val.color:G.border),background:difficulty===key?val.color+"22":G.bgCard,color:difficulty===key?val.color:G.textMid,transition:"all 0.2s"}}>{val.label}</button>
                  ))}
                </div>
              </div>

              <div style={{display:"flex",gap:10,width:"100%",maxWidth:360}}>
                <button onClick={()=>launchGame(gameMode,difficulty,null)} style={{flex:1,background:"linear-gradient(135deg,"+G.blue+","+G.purple+")",color:G.white,border:"none",padding:"14px",fontSize:15,fontWeight:700,letterSpacing:2,borderRadius:12,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 0 20px rgba(37,99,235,0.3)"}}>START</button>
                <button onClick={()=>setScreen("loadtext")} style={{background:G.bgCard,border:"1px solid "+G.border,color:G.textMid,padding:"14px 16px",fontSize:12,fontWeight:600,borderRadius:12,cursor:"pointer",fontFamily:"inherit"}}>📝 Load Text</button>
              </div>

              <button onClick={onBack} style={{marginTop:16,background:"transparent",border:"none",color:G.textDim,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>← Back to Home</button>
            </div>
          )}

          {/* LOAD TEXT */}
          {screen==="loadtext"&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 16px",overflowY:"auto"}}>
              <div style={{fontSize:16,fontWeight:700,color:G.white,marginBottom:8}}>📝 Load Your Own Text</div>
              <div style={{fontSize:11,color:G.textDim,marginBottom:16,textAlign:"center",maxWidth:340,lineHeight:1.7}}>Paste any text — each word becomes an enemy!<br/>Perfect for students to practice their lessons.</div>
              <textarea value={customText} onChange={e=>{setCustomText(e.target.value);setCustomError("");}} placeholder="Paste your text here..." style={{width:"100%",maxWidth:400,height:150,background:G.bgCard,border:"1px solid "+G.border,borderRadius:12,color:G.white,fontSize:13,padding:"12px",fontFamily:"inherit",resize:"vertical",outline:"none",lineHeight:1.6}}/>
              {customError&&<div style={{color:G.red,fontSize:11,marginTop:8}}>{customError}</div>}
              <div style={{display:"flex",gap:10,marginTop:16}}>
                <button onClick={()=>{const w=parseCustomText(customText);if(!w){setCustomError("Too few words! Need at least 8 words.");return;}launchGame(gameMode,difficulty,w);}} style={{background:G.green,color:G.white,border:"none",padding:"11px 32px",fontSize:13,fontWeight:700,borderRadius:10,cursor:"pointer",fontFamily:"inherit"}}>Play!</button>
                <button onClick={()=>setScreen("gameselect")} style={{background:G.bgCard,border:"1px solid "+G.border,borderRadius:10,color:G.textMid,padding:"11px 20px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Back</button>
              </div>
            </div>
          )}

          {/* PLAYING */}
          {screen==="playing"&&(<>
            {enemies.map(e=>{
              const isTgt=e.word.startsWith(typed)&&typed.length>0;
              const isInd=!isTgt&&!typed.length&&indLetters.has(e.word[0]);
              const tp=isTgt?typed:"";const rp=isTgt?e.word.slice(typed.length):e.word;
              return(
                <div key={e.id} style={{position:"absolute",left:e.x,top:e.y,transform:`translate(-50%,-50%) scale(${e.hit?1.8:1})`,opacity:e.hit?0:1,transition:e.hit?"opacity 0.15s,transform 0.15s":"none",fontSize:15,fontWeight:700,padding:"5px 12px",borderRadius:6,background:isTgt?"rgba(37,99,235,0.2)":"rgba(10,16,32,0.88)",border:"1px solid "+(isTgt?G.blue:isInd?"rgba(37,99,235,0.35)":G.border),whiteSpace:"nowrap",pointerEvents:"none",boxShadow:isTgt?"0 0 16px rgba(37,99,235,0.3)":"none",letterSpacing:1}}>
                  {isInd&&<div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",width:4,height:4,borderRadius:"50%",background:G.blue,boxShadow:"0 0 6px "+G.blue}}/>}
                  <span style={{color:G.yellow}}>{tp}</span>
                  <span style={{color:isTgt?G.white:isInd?"rgba(37,99,235,0.7)":"rgba(148,180,255,0.4)"}}>{rp}</span>
                </div>
              );
            })}
            {particles.map(p=><div key={p.id} style={{position:"absolute",left:p.x,top:p.y,transform:"translate(-50%,-50%)",color:G.green,fontWeight:700,fontSize:14,opacity:Math.max(p.life*2,0),pointerEvents:"none",textShadow:"0 0 8px "+G.green}}>{p.text}</div>)}
            <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",overflow:"visible"}}>
              <defs><filter id="gl"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              {bullets.map(b=>{const t=1-Math.max(b.life,0);const prog=Math.min(t,1);const cx2=b.fromX+(b.toX-b.fromX)*prog;const cy2=b.fromY+(b.toY-b.fromY)*prog;const tx=b.fromX+(b.toX-b.fromX)*Math.max(prog-0.16,0);const ty=b.fromY+(b.toY-b.fromY)*Math.max(prog-0.16,0);return<line key={b.id} x1={tx} y1={ty} x2={cx2} y2={cy2} stroke={G.blue} strokeWidth={2} strokeLinecap="round" opacity={Math.min(b.life*1.5,1)} filter="url(#gl)"/>;})}
            </svg>
            <div style={{position:"absolute",left:"50%",bottom:10,transform:"translateX(-50%)",pointerEvents:"none",filter:"drop-shadow(0 0 12px rgba(37,99,235,0.8))"}}>
              <svg viewBox="0 0 60 60" width="36" height="36">
                <polygon points="30,2 44,42 30,32 16,42" fill={G.blue} stroke="#aaccff" strokeWidth="0.8"/>
                <polygon points="30,2 37,30 30,24 23,30" fill="#ffffff" opacity="0.9"/>
                <circle cx="30" cy="20" r="3.5" fill={G.bgDark} opacity="0.8"/>
                <polygon points="16,42 10,56 22,46" fill="#1a3a8a"/>
                <polygon points="44,42 50,56 38,46" fill="#1a3a8a"/>
              </svg>
            </div>
            <div style={{position:"absolute",left:0,right:0,bottom:50,height:1,background:"linear-gradient(90deg,transparent,rgba(239,68,68,0.5),transparent)"}}/>
          </>)}

          {/* WAVE CLEAR */}
          {screen==="waveclear"&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"center",padding:"0 28px"}}>
              <div style={{fontSize:11,color:G.yellow,letterSpacing:4,marginBottom:8}}>COMPLETED</div>
              <div style={{fontSize:36,fontWeight:900,color:G.white,marginBottom:4}}>WAVE {waveNum} CLEAR!</div>
              <div style={{fontSize:14,color:G.textDim,letterSpacing:2,marginBottom:28}}>+{waveScore} pts this wave</div>
              <button onClick={nextWave} style={{background:"linear-gradient(135deg,"+G.blue+","+G.purple+")",color:G.white,border:"none",padding:"12px 36px",fontSize:14,fontWeight:700,letterSpacing:2,borderRadius:12,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 0 20px rgba(37,99,235,0.3)"}}>
                {waveIdx+1<waves.length?"NEXT WAVE →":"FINISH"}
              </button>
            </div>
          )}

          {/* GAME OVER */}
          {screen==="gameover"&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:28,background:"rgba(10,16,32,0.94)"}}>
              <div style={{fontSize:11,letterSpacing:4,color:G.red,marginBottom:12}}>GAME OVER</div>
              <div style={{fontSize:52,fontWeight:900,color:G.white,marginBottom:4,letterSpacing:2}}>{scoreStr}</div>
              <div style={{fontSize:11,color:G.textDim,letterSpacing:3,marginBottom:24}}>FINAL SCORE</div>
              <div style={{display:"flex",gap:24,marginBottom:28,flexWrap:"wrap",justifyContent:"center"}}>
                {[{label:"BEST COMBO",val:"×"+bestCombo,color:G.yellow},{label:"WAVE",val:waveNum,color:G.white}].map(s=>(
                  <div key={s.label} style={{background:G.bgCard,border:"1px solid "+G.border,borderRadius:12,padding:"10px 16px"}}>
                    <div style={{fontSize:9,color:G.textDim,letterSpacing:2,marginBottom:4}}>{s.label}</div>
                    <div style={{fontSize:18,color:s.color,fontWeight:700}}>{s.val}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>launchGame(gameMode,difficulty,null)} style={{background:"linear-gradient(135deg,"+G.blue+","+G.purple+")",color:G.white,border:"none",padding:"12px 44px",fontSize:14,fontWeight:700,letterSpacing:2,borderRadius:12,cursor:"pointer",fontFamily:"inherit",marginBottom:12,boxShadow:"0 0 20px rgba(37,99,235,0.3)"}}>PLAY AGAIN</button>
              <button onClick={exitGame} style={{background:"transparent",border:"1px solid "+G.border,borderRadius:10,color:G.textDim,padding:"9px 28px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>🏠 Home</button>
            </div>
          )}
        </div>

        {/* TYPED DISPLAY */}
        {screen==="playing"&&(
          <div style={{padding:"6px 16px",background:"rgba(10,16,32,0.9)",borderTop:"1px solid "+G.border,minHeight:34,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <span style={{fontSize:17,letterSpacing:3,color:G.blue,fontWeight:700}}>
              {typed||"\u00A0"}<span style={{opacity:0.4,animation:"blink 1s infinite"}}>_</span>
            </span>
            {gameMode==="english"&&wordHint&&<span style={{fontSize:11,color:G.textDim}}>→ <span style={{color:"rgba(37,99,235,0.7)"}}>{wordHint}</span></span>}
          </div>
        )}

        {/* KEYBOARD */}
        {screen==="playing"&&(
          <div style={{padding:"8px 8px 12px",background:"rgba(10,16,32,0.95)",borderTop:"1px solid "+G.border,flexShrink:0}}>
            {KEY_ROWS.map((row,ri)=>(
              <div key={ri} style={{display:"flex",justifyContent:"center",gap:5,marginBottom:5,paddingLeft:ri===1?18:ri===2?36:0,paddingRight:ri===1?18:ri===2?36:0}}>
                {row.map(k=>{
                  const live=liveLetters.has(k),ind=!live&&indLetters.has(k),act=activeKey===k;
                  return(
                    <button key={k} onPointerDown={e=>{e.preventDefault();pressKey(k);}} style={{flex:1,maxWidth:42,minWidth:22,height:46,borderRadius:8,fontWeight:700,fontSize:14,textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",touchAction:"manipulation",transition:"all 0.06s",border:"1px solid "+(act||live?G.blue:ind?"rgba(37,99,235,0.3)":"rgba(255,255,255,0.08)"),background:act?G.blue:live?"rgba(37,99,235,0.2)":ind?"rgba(37,99,235,0.07)":"rgba(255,255,255,0.04)",color:act?G.white:live?G.blue:ind?"rgba(37,99,235,0.6)":"rgba(255,255,255,0.25)",boxShadow:act?"0 0 12px rgba(37,99,235,0.5)":live?"0 0 6px rgba(37,99,235,0.2)":"none"}}>{k}</button>
                  );
                })}
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"center",marginTop:4}}>
              <button onPointerDown={e=>{e.preventDefault();handleBS();}} style={{width:160,height:40,borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.3)",fontSize:12,fontWeight:700,letterSpacing:1,cursor:"pointer",fontFamily:"inherit",touchAction:"manipulation"}}>⌫ BACKSPACE</button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}`}</style>
    </div>
  );
}


/* ─── QUIZ ─── */
const QD=[
  {q:"India ki capital kya hai?",opts:["Mumbai","Delhi","Kolkata","Chennai"],ans:1,cat:"GK"},
  {q:"1 + 1 = ?",opts:["1","2","3","11"],ans:1,cat:"Math"},
  {q:"Sabse bada planet?",opts:["Earth","Mars","Jupiter","Saturn"],ans:2,cat:"Science"},
  {q:"'Happy' ka opposite?",opts:["Sad","Angry","Tired","Bored"],ans:0,cat:"English"},
  {q:"Surya kya hai?",opts:["Planet","Moon","Star","Galaxy"],ans:2,cat:"Science"},
  {q:"7 × 8 = ?",opts:["54","56","58","64"],ans:1,cat:"Math"},
  {q:"Water ka formula?",opts:["CO2","H2O","O2","NaCl"],ans:1,cat:"Science"},
  {q:"'Beautiful' ka synonym?",opts:["Ugly","Pretty","Loud","Fast"],ans:1,cat:"English"},
];
function QuizGame({ onBack, addScore }) {
  const shuffled=()=>[...QD].sort(()=>Math.random()-.5);
  const [pool,setPool]=useState(shuffled);
  const [qi,setQi]=useState(0);
  const [score,setScore]=useState(0);
  const [correct,setCorrect]=useState(0);
  const [sel,setSel]=useState(null);
  const level=Math.min(100,Math.floor(correct/2)+1);
  const curr=pool[qi%pool.length];
  const pick=(i)=>{ if(sel!==null)return; setSel(i);
    const right=i===curr.ans; const pts = right ? 10+Math.floor(level/10)*4 : 0;
    if(right){ setScore(s=>s+pts); setCorrect(c=>c+1); addScore("quiz",pts); }
    setTimeout(()=>{ setSel(null);
      setQi(q=>{ const nq=q+1; if(nq%pool.length===0) setPool(shuffled()); return nq; });
    },900);};
  return (
    <div style={{ ...px(), minHeight:"100vh", background:C.bg }}>
      <Header title="Quiz Arena" icon="❓" color={C.yellow} onBack={onBack} score={score}/>
      <div style={{ padding:18 }}>
        <AdBanner slot="top"/>
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          <div style={{ flex:1, background:C.yellow+"20", border:`2px solid ${C.yellow}`, borderRadius:12,
            padding:"7px 10px", textAlign:"center" }}>
            <div style={{ fontSize:9, color:"#92400e", fontWeight:700 }}>🎯 LEVEL</div>
            <div style={{ fontSize:16, fontWeight:900, color:"#92400e" }}>{level}/100</div>
          </div>
          <div style={{ flex:1, background:C.green+"18", border:`2px solid ${C.green}`, borderRadius:12,
            padding:"7px 10px", textAlign:"center" }}>
            <div style={{ fontSize:9, color:C.green, fontWeight:700 }}>✅ CORRECT</div>
            <div style={{ fontSize:16, fontWeight:900, color:C.green }}>{correct}</div>
          </div>
        </div>
        <div style={{ height:6, background:"#e2e8f0", borderRadius:3, marginBottom:14 }}>
          <div style={{ height:"100%", width:`${(correct%2)*50}%`, background:C.yellow, borderRadius:3, transition:"width .3s" }}/>
        </div>
        <div style={{ background:"#fff", borderRadius:20, padding:18,
          boxShadow:"0 4px 16px rgba(0,0,0,.08)", marginBottom:16 }}>
          <div style={{ display:"inline-block", background:C.yellow+"22", color:C.yellow,
            borderRadius:8, padding:"3px 10px", fontSize:10, fontWeight:700, marginBottom:8 }}>{curr.cat}</div>
          <div style={px({ fontSize:15,fontWeight:700,color:C.dark,lineHeight:1.5 })}>Q{qi+1}. {curr.q}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {curr.opts.map((opt,i)=>{
            let bg="#fff",border="#e2e8f0",col=C.dark;
            if(sel!==null){ if(i===curr.ans){bg=C.green+"22";border=C.green;col=C.green;}
              else if(i===sel&&sel!==curr.ans){bg=C.red+"22";border=C.red;col=C.red;}}
            return(
              <button key={i} onClick={()=>pick(i)} style={{
                background:bg,border:`2px solid ${border}`,borderRadius:14,
                padding:"13px 16px",textAlign:"left",cursor:"pointer",
                display:"flex",alignItems:"center",gap:12,transition:"all .2s",
                ...px({ fontWeight:600,fontSize:14,color:col }),
              }}>
                <span style={{ width:28,height:28,borderRadius:"50%",background:border==="#e2e8f0"?C.bg:border,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:border==="#e2e8f0"?C.gray:"#fff",fontSize:11,fontWeight:700,flexShrink:0 }}>
                  {sel!==null&&i===curr.ans?"✓":sel!==null&&i===sel&&sel!==curr.ans?"✗":["A","B","C","D"][i]}
                </span>{opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── MATH ─── */
const genMathProb=(level)=>{ const ops=["+","-","×","÷"]; const op=ops[Math.floor(Math.random()*4)];
  const scale=1+Math.floor(level/10);
  let a,b,ans;
  if(op==="+"){a=Math.floor(Math.random()*(30*scale))+1;b=Math.floor(Math.random()*(30*scale))+1;ans=a+b;}
  else if(op==="-"){a=Math.floor(Math.random()*(30*scale))+20;b=Math.floor(Math.random()*(20*scale))+1;ans=a-b;}
  else if(op==="×"){a=Math.floor(Math.random()*(8+scale*2))+1;b=Math.floor(Math.random()*(8+scale*2))+1;ans=a*b;}
  else{b=Math.floor(Math.random()*(6+scale))+1;ans=Math.floor(Math.random()*(6+scale))+1;a=ans*b;}
  const w=[ans+Math.ceil(Math.random()*5),ans-Math.ceil(Math.random()*4),ans+Math.ceil(Math.random()*9)];
  const opts=[ans,...w].sort(()=>Math.random()-.5);
  return{a,b,op,ans,opts};};
function MathGame({ onBack, addScore }) {
  const [correctTotal,setCorrectTotal]=useState(0);
  const level=Math.min(100,Math.floor(correctTotal/3)+1);
  const [prob,setProb]=useState(()=>genMathProb(1));
  const [score,setScore]=useState(0);
  const [streak,setStreak]=useState(0); const [sel,setSel]=useState(null); const [total,setTotal]=useState(0);
  const pick=(v)=>{ if(sel!==null)return; setSel(v); setTotal(t=>t+1);
    if(v===prob.ans){const pts=10+streak*2+Math.floor(level/10)*5;setScore(s=>s+pts);setStreak(s=>s+1);setCorrectTotal(c=>c+1);addScore("math",pts);}
    else setStreak(0);
    setTimeout(()=>{ setProb(genMathProb(level)); setSel(null); },800);};
  return (
    <div style={{ ...px(), minHeight:"100vh", background:C.bg }}>
      <Header title="Math Master" icon="➕" color={C.green} onBack={onBack} score={score}/>
      <div style={{ padding:18, display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
        <AdBanner slot="top"/>
        <div style={{ display:"flex", gap:8, width:"100%" }}>
          <div style={{ flex:1, background:C.green+"18", border:`2px solid ${C.green}`, borderRadius:12,
            padding:"7px 10px", textAlign:"center" }}>
            <div style={{ fontSize:9, color:C.green, fontWeight:700 }}>🎯 LEVEL</div>
            <div style={{ fontSize:16, fontWeight:900, color:C.green }}>{level}/100</div>
          </div>
          <div style={{ flex:1, background:C.bg, border:"2px solid #e2e8f0", borderRadius:12,
            padding:"7px 10px", textAlign:"center" }}>
            <div style={{ fontSize:9, color:C.gray, fontWeight:700 }}>ANSWERED</div>
            <div style={{ fontSize:16, fontWeight:900, color:C.dark }}>{total}</div>
          </div>
        </div>
        {streak>=3&&(
          <div style={{ background:C.orange+"22",border:`2px solid ${C.orange}`,borderRadius:12,
            padding:"8px 16px",color:C.orange,fontWeight:700,fontSize:13 }}>🔥 {streak} Streak! Bonus!</div>
        )}
        <div style={{ background:"#fff",borderRadius:24,padding:"30px 36px",
          boxShadow:"0 8px 24px rgba(0,0,0,.10)",textAlign:"center",width:"100%" }}>
          <div style={px({ fontSize:11,color:C.gray,marginBottom:6 })}>Solve this:</div>
          <div style={px({ fontSize:38,fontWeight:900,color:C.dark })}>{prob.a} {prob.op} {prob.b} = ?</div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%" }}>
          {prob.opts.map((opt,i)=>{
            let bg="#fff",border="#e2e8f0",col=C.dark;
            if(sel!==null){if(opt===prob.ans){bg=C.green+"22";border=C.green;col=C.green;}
              else if(opt===sel&&sel!==prob.ans){bg=C.red+"22";border=C.red;col=C.red;}}
            return(
              <button key={i} onClick={()=>pick(opt)} style={{
                background:bg,border:`2px solid ${border}`,borderRadius:16,
                padding:"18px",cursor:"pointer",transition:"all .2s",
                ...px({ fontWeight:800,fontSize:22,color:col }),
              }}>{opt}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── ENGLISH ─── */
const WD=[
  {word:"HAPPY",meaning:"Khush / प्रसन्न",syn:["Joyful","Glad"],ant:["Sad","Unhappy"]},
  {word:"BRAVE",meaning:"Nidar / बहादुर",syn:["Courageous","Bold"],ant:["Coward","Timid"]},
  {word:"FAST",meaning:"Tez / तेज़",syn:["Quick","Swift"],ant:["Slow","Sluggish"]},
  {word:"KIND",meaning:"Dayalu / दयालु",syn:["Gentle","Caring"],ant:["Cruel","Harsh"]},
  {word:"BRIGHT",meaning:"Chamakdar / चमकदार",syn:["Shining","Vivid"],ant:["Dull","Dark"]},
];
function EnglishGame({ onBack, addScore }) {
  const shuffled=()=>[...WD].sort(()=>Math.random()-.5);
  const [pool,setPool]=useState(shuffled);
  const [idx,setIdx]=useState(0); const [score,setScore]=useState(0); const [tab,setTab]=useState("meaning");
  const [learned,setLearned]=useState(0);
  const level=Math.min(100,Math.floor(learned/2)+1);
  const w=pool[idx%pool.length];
  const advance=(pts)=>{
    if(pts>0){ setScore(s=>s+pts); addScore("english",pts); setLearned(l=>l+1); }
    setIdx(i=>{ const ni=i+1; if(ni%pool.length===0) setPool(shuffled()); return ni; });
    setTab("meaning");
  };
  return (
    <div style={{ ...px(), minHeight:"100vh", background:C.bg }}>
      <Header title="English Words" icon="🔤" color={C.purple} onBack={onBack} score={score}/>
      <div style={{ padding:18 }}>
        <AdBanner slot="top"/>
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          <div style={{ flex:1, background:C.purple+"18", border:`2px solid ${C.purple}`, borderRadius:12,
            padding:"7px 10px", textAlign:"center" }}>
            <div style={{ fontSize:9, color:C.purple, fontWeight:700 }}>🎯 LEVEL</div>
            <div style={{ fontSize:16, fontWeight:900, color:C.purple }}>{level}/100</div>
          </div>
          <div style={{ flex:1, background:C.bg, border:"2px solid #e2e8f0", borderRadius:12,
            padding:"7px 10px", textAlign:"center" }}>
            <div style={{ fontSize:9, color:C.gray, fontWeight:700 }}>WORDS LEARNED</div>
            <div style={{ fontSize:16, fontWeight:900, color:C.dark }}>{learned}</div>
          </div>
        </div>
        <div style={{ background:`linear-gradient(135deg,${C.purple},${C.blue})`,
          borderRadius:24,padding:"26px 22px",textAlign:"center",color:"#fff",marginBottom:14,
          boxShadow:`0 8px 24px ${C.purple}55` }}>
          <div style={px({ fontSize:11,opacity:.8,letterSpacing:2,marginBottom:6 })}>WORD OF THE DAY</div>
          <div style={px({ fontSize:38,fontWeight:900,letterSpacing:4 })}>{w.word}</div>
          <div style={px({ fontSize:13,opacity:.9,marginTop:6 })}>{w.meaning}</div>
        </div>
        <div style={{ display:"flex",gap:8,marginBottom:14 }}>
          {["meaning","synonym","antonym"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              flex:1,padding:"8px",borderRadius:10,border:"2px solid",
              borderColor:tab===t?C.purple:"#e2e8f0",
              background:tab===t?C.purple:"#fff",
              color:tab===t?"#fff":C.gray,cursor:"pointer",
              ...px({ fontWeight:700,fontSize:11,textTransform:"capitalize" }),
            }}>{t}</button>
          ))}
        </div>
        <div style={{ background:"#fff",borderRadius:16,padding:16,boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
          {tab==="meaning"&&<div style={px({ fontSize:17,fontWeight:700,color:C.dark,textAlign:"center",padding:10 })}>📖 {w.meaning}</div>}
          {tab==="synonym"&&w.syn.map((s,i)=>(
            <div key={i} style={{ background:C.green+"15",border:`2px solid ${C.green}`,borderRadius:10,
              padding:"12px 16px",marginBottom:8,...px({ fontWeight:700,color:C.green,fontSize:15 }) }}>✅ {s}</div>
          ))}
          {tab==="antonym"&&w.ant.map((a,i)=>(
            <div key={i} style={{ background:C.red+"15",border:`2px solid ${C.red}`,borderRadius:10,
              padding:"12px 16px",marginBottom:8,...px({ fontWeight:700,color:C.red,fontSize:15 }) }}>❌ {a}</div>
          ))}
        </div>
        <div style={{ display:"flex",gap:10,marginTop:14 }}>
          <Btn color={C.green} style={{ flex:1 }} onClick={()=>advance(5+Math.floor(level/10)*2)}>✅ Got it! Next →</Btn>
          <Btn color={C.gray} style={{ flex:1 }} onClick={()=>advance(0)}>Skip →</Btn>
        </div>
      </div>
    </div>
  );
}

/* ─── SCIENCE ─── */
const SQ=[
  {q:"Photosynthesis ke liye kya chahiye?",opts:["Moonlight","Sunlight","Fire","Darkness"],ans:1,emoji:"🌱"},
  {q:"Sabse halka element?",opts:["Oxygen","Carbon","Hydrogen","Helium"],ans:2,emoji:"⚗️"},
  {q:"Dil ka kaam kya hai?",opts:["Breathe","Pump blood","Digest","Think"],ans:1,emoji:"❤️"},
  {q:"Earth ke kitne moons?",opts:["0","1","2","3"],ans:1,emoji:"🌙"},
  {q:"Pani ka boiling point?",opts:["50°C","75°C","100°C","150°C"],ans:2,emoji:"💧"},
];
function ScienceGame({ onBack, addScore }) {
  const shuffled=()=>[...SQ].sort(()=>Math.random()-.5);
  const [pool,setPool]=useState(shuffled);
  const [qi,setQi]=useState(0); const [score,setScore]=useState(0);
  const [sel,setSel]=useState(null); const [correct,setCorrect]=useState(0);
  const level=Math.min(100,Math.floor(correct/2)+1);
  const curr=pool[qi%pool.length];
  const pick=(i)=>{ if(sel!==null)return; setSel(i);
    const right=i===curr.ans; const pts= right ? 10+Math.floor(level/10)*4 : 0;
    if(right){ setScore(s=>s+pts); setCorrect(c=>c+1); addScore("science",pts); }
    setTimeout(()=>{ setSel(null);
      setQi(q=>{ const nq=q+1; if(nq%pool.length===0) setPool(shuffled()); return nq; });
    },900);};
  return (
    <div style={{ ...px(), minHeight:"100vh", background:C.bg }}>
      <Header title="Science Lab" icon="🔬" color={C.orange} onBack={onBack} score={score}/>
      <div style={{ padding:18 }}>
        <AdBanner slot="top"/>
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          <div style={{ flex:1, background:C.orange+"18", border:`2px solid ${C.orange}`, borderRadius:12,
            padding:"7px 10px", textAlign:"center" }}>
            <div style={{ fontSize:9, color:"#9a3412", fontWeight:700 }}>🎯 LEVEL</div>
            <div style={{ fontSize:16, fontWeight:900, color:"#9a3412" }}>{level}/100</div>
          </div>
          <div style={{ flex:1, background:C.green+"18", border:`2px solid ${C.green}`, borderRadius:12,
            padding:"7px 10px", textAlign:"center" }}>
            <div style={{ fontSize:9, color:C.green, fontWeight:700 }}>✅ CORRECT</div>
            <div style={{ fontSize:16, fontWeight:900, color:C.green }}>{correct}</div>
          </div>
        </div>
        <div style={{ background:"#fff",borderRadius:20,padding:20,
          boxShadow:"0 4px 16px rgba(0,0,0,.08)",marginBottom:14,textAlign:"center" }}>
          <div style={{ fontSize:48,marginBottom:8 }}>{curr.emoji}</div>
          <div style={px({ fontSize:15,fontWeight:700,color:C.dark })}>{curr.q}</div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
          {curr.opts.map((opt,i)=>{
            let bg="#fff",border="#e2e8f0",col=C.dark;
            if(sel!==null){if(i===curr.ans){bg=C.green+"22";border=C.green;col=C.green;}
              else if(i===sel&&sel!==curr.ans){bg=C.red+"22";border=C.red;col=C.red;}}
            return(
              <button key={i} onClick={()=>pick(i)} style={{
                background:bg,border:`2px solid ${border}`,borderRadius:14,
                padding:"13px 16px",cursor:"pointer",textAlign:"left",transition:"all .2s",
                ...px({ fontWeight:600,fontSize:14,color:col }),
              }}>
                {["🅐","🅑","🅒","🅓"][i]} {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── CHESS ENGINE (pure helpers) ─── */
const PIECES={wK:"♔",wQ:"♕",wR:"♖",wB:"♗",wN:"♘",wP:"♙",bK:"♚",bQ:"♛",bR:"♜",bB:"♝",bN:"♞",bP:"♟"};
const inBounds=(r,c)=>r>=0&&r<8&&c>=0&&c<8;

function pseudoMoves(board,row,col){
  const cell=board[row][col];
  if(!cell) return [];
  const {p,c:color}=cell;
  const opp=color==="w"?"b":"w";
  const moves=[];
  const slide=(dirs)=>dirs.forEach(([dr,dc])=>{
    let r=row+dr,c=col+dc;
    while(inBounds(r,c)){
      const t=board[r][c];
      if(!t){ moves.push([r,c]); }
      else { if(t.c===opp) moves.push([r,c]); break; }
      r+=dr;c+=dc;
    }
  });
  if(p==="R") slide([[1,0],[-1,0],[0,1],[0,-1]]);
  else if(p==="B") slide([[1,1],[1,-1],[-1,1],[-1,-1]]);
  else if(p==="Q") slide([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
  else if(p==="N") [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]].forEach(([dr,dc])=>{
    const r=row+dr,c=col+dc;
    if(inBounds(r,c)&&(!board[r][c]||board[r][c].c===opp)) moves.push([r,c]);
  });
  else if(p==="K") [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc])=>{
    const r=row+dr,c=col+dc;
    if(inBounds(r,c)&&(!board[r][c]||board[r][c].c===opp)) moves.push([r,c]);
  });
  else if(p==="P"){
    const dir=color==="w"?-1:1, startRow=color==="w"?6:1;
    if(inBounds(row+dir,col)&&!board[row+dir][col]){
      moves.push([row+dir,col]);
      if(row===startRow&&!board[row+2*dir][col]) moves.push([row+2*dir,col]);
    }
    [[dir,1],[dir,-1]].forEach(([dr,dc])=>{
      const r=row+dr,c=col+dc;
      if(inBounds(r,c)&&board[r][c]&&board[r][c].c===opp) moves.push([r,c]);
    });
  }
  return moves;
}
const findKing=(board,color)=>{
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]&&board[r][c].p==="K"&&board[r][c].c===color) return [r,c];
  return null;
};
const isAttacked=(board,row,col,byColor)=>{
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const cell=board[r][c];
    if(cell&&cell.c===byColor&&pseudoMoves(board,r,c).some(([mr,mc])=>mr===row&&mc===col)) return true;
  }
  return false;
};
const isInCheck=(board,color)=>{
  const k=findKing(board,color);
  return k ? isAttacked(board,k[0],k[1],color==="w"?"b":"w") : false;
};
const legalMoves=(board,row,col)=>{
  const cell=board[row][col];
  if(!cell) return [];
  return pseudoMoves(board,row,col).filter(([r,c])=>{
    const nb=board.map(rr=>[...rr]);
    nb[r][c]=nb[row][col]; nb[row][col]=null;
    return !isInCheck(nb,cell.c);
  });
};
const allLegalMoves=(board,color)=>{
  const res=[];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const cell=board[r][c];
    if(cell&&cell.c===color) legalMoves(board,r,c).forEach(m=>res.push({from:[r,c],to:m}));
  }
  return res;
};

function ChessGame({ onBack }) {
  const init=()=>{ const b=Array(8).fill(null).map(()=>Array(8).fill(null));
    ["R","N","B","Q","K","B","N","R"].forEach((p,i)=>{b[0][i]={p,c:"b"};b[7][i]={p,c:"w"};});
    for(let i=0;i<8;i++){b[1][i]={p:"P",c:"b"};b[6][i]={p:"P",c:"w"};}
    return b;};
  const [board,setBoard]=useState(init);
  const [sel,setSel]=useState(null);
  const [turn,setTurn]=useState("w");
  const [captured,setCaptured]=useState({w:[],b:[]});
  const [gameOver,setGameOver]=useState(null);

  const inCheck = isInCheck(board,turn);
  const legalForSel = sel ? legalMoves(board,sel[0],sel[1]) : [];

  useEffect(()=>{
    const hasMoves = allLegalMoves(board,turn).length>0;
    if(!hasMoves){
      setGameOver(inCheck ? { type:"checkmate", winner: turn==="w"?"b":"w" } : { type:"stalemate" });
    } else setGameOver(null);
  },[board,turn]);

  const click=(r,c)=>{
    if(gameOver) return;
    const cell=board[r][c];
    if(sel){
      const isLegal=legalForSel.some(([lr,lc])=>lr===r&&lc===c);
      if(isLegal){
        const nb=board.map(row=>[...row]);
        const moving=nb[sel[0]][sel[1]];
        const capturedPiece=nb[r][c];
        if(capturedPiece) setCaptured(cp=>({...cp,[capturedPiece.c]:[...cp[capturedPiece.c],capturedPiece.p]}));
        nb[r][c]= moving.p==="P"&&(r===0||r===7) ? {p:"Q",c:moving.c} : moving;
        nb[sel[0]][sel[1]]=null;
        setBoard(nb); setSel(null); setTurn(t=>t==="w"?"b":"w");
        return;
      }
      if(cell&&cell.c===turn){ setSel([r,c]); return; }
      setSel(null); return;
    }
    if(cell&&cell.c===turn) setSel([r,c]);
  };

  const reset=()=>{ setBoard(init()); setSel(null); setTurn("w"); setCaptured({w:[],b:[]}); setGameOver(null); };

  return (
    <div style={{ ...px(), minHeight:"100vh", background:"linear-gradient(180deg,#0f172a,#1e293b 60%,#111827)" }}>
      <Header title="Chess" icon="♟️" color={C.dark} onBack={onBack}/>
      <div style={{ padding:14,display:"flex",flexDirection:"column",alignItems:"center",gap:10 }}>
        <AdBanner slot="top"/>

        <div style={{ width:"100%", maxWidth:330, display:"flex", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:2, fontSize:17, minHeight:22 }}>
            {captured.b.map((p,i)=><span key={i} style={{filter:"drop-shadow(0 1px 1px #0006)"}}>{PIECES["b"+p]}</span>)}
          </div>
          <div style={{ display:"flex", gap:2, fontSize:17, minHeight:22 }}>
            {captured.w.map((p,i)=><span key={i} style={{filter:"drop-shadow(0 1px 1px #0006)"}}>{PIECES["w"+p]}</span>)}
          </div>
        </div>

        <div style={{ background:"#fff", borderRadius:12, padding:"8px 20px",
          fontWeight:700, fontSize:14,
          color: gameOver ? C.red : inCheck ? C.red : (turn==="w"?"#1e293b":C.blue),
          boxShadow:"0 2px 10px rgba(0,0,0,.25)" }}>
          {gameOver
            ? gameOver.type==="checkmate" ? `🏆 Checkmate! ${gameOver.winner==="w"?"White":"Black"} Wins` : "🤝 Stalemate — Draw"
            : inCheck ? `⚠️ ${turn==="w"?"White":"Black"} in Check!`
            : (turn==="w"?"⬜ White's Turn":"⬛ Black's Turn")}
        </div>

        <div style={{ borderRadius:10, padding:7,
          background:"linear-gradient(135deg,#4a3428,#1a1410)", boxShadow:"0 12px 32px rgba(0,0,0,.55)" }}>
          <div style={{ border:"2px solid #0f0a08", borderRadius:6, overflow:"hidden" }}>
            {board.map((row,r)=>(
              <div key={r} style={{ display:"flex" }}>
                {row.map((cell,c)=>{
                  const light=(r+c)%2===0;
                  const isSel=sel&&sel[0]===r&&sel[1]===c;
                  const isLegalTarget=legalForSel.some(([lr,lc])=>lr===r&&lc===c);
                  const isCapture=isLegalTarget&&cell;
                  const kingInCheck=cell&&cell.p==="K"&&cell.c===turn&&inCheck;
                  return(
                    <div key={c} onClick={()=>click(r,c)} style={{
                      width:38,height:38,position:"relative",
                      background: kingInCheck ? `radial-gradient(circle,${C.red}bb,${light?"#f0d9b5":"#b58863"})`
                        : isSel ? `radial-gradient(circle,${C.yellow}cc,${light?"#f0d9b5":"#b58863"})`
                        : light?"#f0d9b5":"#b58863",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:23,cursor:"pointer",userSelect:"none",transition:"background .12s",
                      textShadow: cell?"0 2px 3px rgba(0,0,0,.4)":"none",
                    }}>
                      {cell?PIECES[cell.c+cell.p]:""}
                      {isLegalTarget&&!isCapture&&(
                        <div style={{ position:"absolute", width:11,height:11,borderRadius:"50%",
                          background:"rgba(16,185,129,.7)", boxShadow:"0 0 6px rgba(16,185,129,.8)" }}/>
                      )}
                      {isCapture&&(
                        <div style={{ position:"absolute", inset:2, border:`3px solid ${C.red}dd`, borderRadius:6 }}/>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex",gap:10, alignItems:"center" }}>
          <Btn color={C.dark} sm onClick={reset}>🔄 New Game</Btn>
          <div style={{ background:"rgba(255,255,255,.12)",borderRadius:10,padding:"8px 14px",
            fontSize:11,color:"rgba(255,255,255,.85)",fontWeight:600 }}>Piece tap karo → legal moves dikhenge</div>
        </div>
      </div>
    </div>
  );
}

/* ─── TIC TAC TOE ─── */
function TicTacToe({ onBack, addScore }) {
  const E=Array(9).fill(null);
  const [board,setBoard]=useState(E); const [xTurn,setXT]=useState(true); const [scores,setSc]=useState({X:0,O:0});
  const WINS=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const chk=(b)=>WINS.find(([a,c,d])=>b[a]&&b[a]===b[c]&&b[a]===b[d]);
  const winner=chk(board); const full=board.every(Boolean);
  const click=(i)=>{
    if(board[i]||winner)return;
    const nb=[...board]; nb[i]=xTurn?"X":"O";
    setBoard(nb);
    const w=chk(nb);
    if(w){setSc(s=>({...s,[nb[w[0]]]:s[nb[w[0]]]+1}));addScore("ttt",20);}
    setXT(!xTurn);};
  const wLine=winner||null;
  return (
    <div style={{ ...px(), minHeight:"100vh", background:C.bg }}>
      <Header title="Tic Tac Toe" icon="⭕" color={C.red} onBack={onBack}/>
      <div style={{ padding:18,display:"flex",flexDirection:"column",alignItems:"center",gap:14 }}>
        <AdBanner slot="top"/>
        <div style={{ display:"flex",gap:14,width:"100%" }}>
          {[["X","🟦",C.blue],["O","🟥",C.red]].map(([p,ico,c])=>(
            <div key={p} style={{ flex:1,background:xTurn===(p==="X")&&!winner&&!full?c+"22":"#fff",
              border:`2px solid ${xTurn===(p==="X")&&!winner&&!full?c:"#e2e8f0"}`,
              borderRadius:14,padding:"12px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
              <div style={{ fontSize:22 }}>{ico}</div>
              <div style={px({ fontWeight:800,fontSize:24,color:c })}>{scores[p]}</div>
              <div style={px({ fontSize:12,color:C.gray })}>Player {p}</div>
            </div>
          ))}
        </div>
        <div style={px({ fontWeight:700,fontSize:15,color:winner?C.green:full?C.orange:C.dark,
          background:"#fff",borderRadius:12,padding:"10px 20px",boxShadow:"0 2px 8px rgba(0,0,0,.06)" })}>
          {winner?`🎉 Player ${board[winner[0]]} Wins!`:full?"🤝 Draw!":`Player ${xTurn?"X":"O"}'s Turn`}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
          {board.map((cell,i)=>(
            <button key={i} onClick={()=>click(i)} style={{
              width:78,height:78,borderRadius:16,
              background:wLine&&wLine.includes(i)?C.green+"33":"#fff",
              border:`3px solid ${wLine&&wLine.includes(i)?C.green:"#e2e8f0"}`,
              fontSize:34,fontWeight:900,cursor:"pointer",
              color:cell==="X"?C.blue:C.red,
              display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",
            }}>{cell}</button>
          ))}
        </div>
        <Btn color={C.red} onClick={()=>setBoard(E)}>🔄 New Game</Btn>
      </div>
    </div>
  );
}

/* ─── MEMORY ─── */
const EMOJIS=["🦁","🐯","🐘","🦊","🐼","🦋","🌟","🎯"];
function MemoryGame({ onBack, addScore }) {
  const make=()=>[...EMOJIS,...EMOJIS].sort(()=>Math.random()-.5).map((e,i)=>({id:i,val:e,flipped:false,matched:false}));
  const [cards,setCards]=useState(make); const [flipped,setFlipped]=useState([]);
  const [moves,setMoves]=useState(0); const [score,setScore]=useState(0);
  const done=cards.every(c=>c.matched);
  useEffect(()=>{ if(done) addScore("memory",score); },[done]);
  const flip=(id)=>{
    if(flipped.length===2)return;
    const card=cards.find(c=>c.id===id);
    if(!card||card.flipped||card.matched)return;
    const nf=[...flipped,id];
    setCards(p=>p.map(c=>c.id===id?{...c,flipped:true}:c));
    setFlipped(nf);
    if(nf.length===2){
      setMoves(m=>m+1);
      const [a,b]=nf.map(i=>cards.find(c=>c.id===i));
      if(a.val===b.val){
        setCards(p=>p.map(c=>nf.includes(c.id)?{...c,matched:true}:c));
        setScore(s=>s+20); setFlipped([]);
      } else {
        setTimeout(()=>{ setCards(p=>p.map(c=>nf.includes(c.id)?{...c,flipped:false}:c)); setFlipped([]); },800);
      }
    }};
  return (
    <div style={{ ...px(), minHeight:"100vh", background:C.bg }}>
      <Header title="Memory Match" icon="🧠" color={C.cyan} onBack={onBack} score={score}/>
      <div style={{ padding:18,display:"flex",flexDirection:"column",alignItems:"center",gap:14 }}>
        <AdBanner slot="top"/>
        <div style={{ display:"flex",gap:12 }}>
          {[["MOVES",moves,C.dark],["MATCHED",`${cards.filter(c=>c.matched).length/2}/${EMOJIS.length}`,C.green]].map(([l,v,c])=>(
            <div key={l} style={{ background:"#fff",borderRadius:12,padding:"8px 18px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
              <div style={px({ fontSize:9,color:C.gray })}>{l}</div>
              <div style={px({ fontSize:20,fontWeight:800,color:c })}>{v}</div>
            </div>
          ))}
        </div>
        {done?(
          <div style={{ textAlign:"center",padding:20 }}>
            <div style={{ fontSize:60 }}>🎉</div>
            <div style={px({ fontSize:22,fontWeight:900,color:C.dark })}>All Matched!</div>
            <div style={px({ color:C.gray,marginBottom:16 })}>{moves} moves • {score} pts</div>
            <Btn color={C.cyan} onClick={()=>{setCards(make());setFlipped([]);setMoves(0);setScore(0);}}>🔄 Play Again</Btn>
          </div>
        ):(
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8 }}>
            {cards.map(card=>(
              <button key={card.id} onClick={()=>flip(card.id)} style={{
                width:62,height:62,borderRadius:12,border:"none",cursor:"pointer",
                background:card.flipped||card.matched?card.matched?C.green+"33":"#fff":`linear-gradient(135deg,${C.cyan},${C.blue})`,
                fontSize:26,display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:"0 2px 8px rgba(0,0,0,.10)",transition:"all .2s",
                outline:card.matched?`2px solid ${C.green}`:"none",
              }}>{card.flipped||card.matched?card.val:""}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── BOTTOM NAV ─── */
const NAV=[["home","🏠","Home"],["games","🎮","Games"],["leaderboard","🏆","Leaderboard"],["profile","👤","Profile"]];
function BottomNav({ active, onTab }) {
  return (
    <div style={{ position:"sticky",bottom:0,background:"#fff",
      display:"flex",justifyContent:"space-around",padding:"8px 0 4px",
      borderTop:"1px solid #e2e8f0",zIndex:20 }}>
      {NAV.map(([id,ico,lbl])=>(
        <button key={id} onClick={()=>onTab(id)} style={{
          display:"flex",flexDirection:"column",alignItems:"center",gap:2,
          border:"none",background:"transparent",cursor:"pointer",padding:"4px 8px",
        }}>
          <span style={{ fontSize:22 }}>{ico}</span>
          <span style={px({ fontSize:9,fontWeight:700,color:active===id?C.blue:C.gray })}>{lbl}</span>
          {active===id&&<div style={{ width:16,height:3,background:C.blue,borderRadius:2 }}/>}
        </button>
      ))}
    </div>
  );
}

/* ─── ROOT APP ─── */
export default function App() {
  const [phase,setPhase]=useState("splash"); // splash | login | app
  const [tab,setTab]=useState("home");
  const [game,setGame]=useState(null);
  const [scores,setScores]=useState({typing:0,quiz:0,math:0,english:0,science:0,chess:0,ttt:0,memory:0});
  const [darkMode,setDarkMode]=useState(false);

  const addScore=(id,pts)=>setScores(s=>({...s,[id]:Math.max(s[id],(s[id]||0)+pts)}));

  const GAME_COMPS={typing:TypingGame,quiz:QuizGame,math:MathGame,english:EnglishGame,science:ScienceGame,chess:ChessGame,ttt:TicTacToe,memory:MemoryGame};

  return (
    <div style={{ maxWidth:430,margin:"0 auto",minHeight:"100vh",boxShadow:"0 0 40px rgba(0,0,0,.15)",overflow:"hidden",background:"#fff",
      filter: darkMode ? "invert(0.92) hue-rotate(180deg)" : "none", transition:"filter .2s" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      {phase==="splash" && <Splash onDone={()=>setPhase("login")}/>}
      {phase==="login" && <Login onLogin={()=>setPhase("app")}/>}
      {phase==="app" && (
        <div style={{ display:"flex",flexDirection:"column",minHeight:"100vh" }}>
          {game ? (
            (() => { const G=GAME_COMPS[game]; return <G onBack={()=>setGame(null)} addScore={addScore}/>; })()
          ) : (
            <div style={{ flex:1,overflowY:"auto" }}>
              {tab==="home"        && <Home onGame={(id)=>setGame(id)} scores={scores}/>}
              {tab==="games"       && <GamesPage onGame={(id)=>setGame(id)}/>}
              {tab==="leaderboard" && <Leaderboard/>}
              {tab==="profile"     && <Profile scores={scores} darkMode={darkMode} onToggleDark={()=>setDarkMode(d=>!d)}/>}
            </div>
          )}
          {!game && <BottomNav active={tab} onTab={setTab}/>}
        </div>
      )}
    </div>
  );
}

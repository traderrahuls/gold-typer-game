import { useState, useEffect, useRef } from "react";

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
          <span style={{ color:C.blue }}>Gi</span><span style={{ color:C.green }}>gi</span>
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
  return (
    <div style={{
      width:"100%", minHeight:"100vh", background:"#fff",
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"36px 20px 20px", ...px(),
    }}>
      <div style={{ fontSize:13, color:C.gray, marginBottom:6 }}>Welcome to</div>
      <div style={px({ fontSize:38, fontWeight:900, letterSpacing:-1 })}>
        <span style={{ color:C.blue }}>Gi</span><span style={{ color:C.green }}>gi</span>
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

      <button onClick={onLogin} style={{
        width:"100%", padding:"13px", marginTop:8,
        background:C.blue, color:"#fff", border:"none", borderRadius:14, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        ...px({ fontWeight:700, fontSize:15, boxShadow:`0 4px 12px ${C.blue}44` }),
      }}>
        <span style={{ fontSize:20 }}>🔵</span> Continue with Google
      </button>
      <button onClick={onLogin} style={{
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
              🎮 Level {Math.floor(totalXP/100)+1}
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
function Profile({ scores }) {
  const totalXP = Object.values(scores).reduce((a,b)=>a+b,0);
  const level = Math.floor(totalXP/100)+1;
  const nextLevelXP = level*100;
  const progress = (totalXP % 100);

  const achievements = [
    { icon:"🔥", name:"First Game",   desc:"Play your first game",   done:totalXP>0    },
    { icon:"⭐", name:"Score 50 XP",  desc:"Earn 50 XP total",       done:totalXP>=50  },
    { icon:"🏆", name:"Score 200 XP", desc:"Earn 200 XP total",      done:totalXP>=200 },
    { icon:"🎯", name:"All Games",    desc:"Play all 8 games",       done:Object.keys(scores).filter(k=>scores[k]>0).length>=8 },
    { icon:"💎", name:"Score 500 XP", desc:"Earn 500 XP total",      done:totalXP>=500 },
    { icon:"👑", name:"Level 5",      desc:"Reach Level 5",          done:level>=5     },
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
        <div style={{ color:"rgba(255,255,255,.8)", fontSize:12, marginBottom:10 }}>@gigilife_player</div>
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
            {100-progress} XP to Level {level+1}
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
        {[["🔔","Notifications","On"],["🌙","Dark Mode","Off"],["🔊","Sound Effects","On"],
          ["🌐","Language","हिन्दी"],["❓","Help & Support",""],["📋","Privacy Policy",""]].map(([ico,lbl,val])=>(
          <div key={lbl} style={{ background:"#fff", borderRadius:14, padding:"13px 16px", marginBottom:8,
            display:"flex", alignItems:"center", gap:12, cursor:"pointer",
            boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
            <span style={{ fontSize:20 }}>{ico}</span>
            <span style={px({ flex:1, fontWeight:600, fontSize:13, color:"#1e293b" })}>{lbl}</span>
            <span style={px({ fontSize:12, color:C.gray })}>{val} ›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ GAME SCREENS ═══════════════ */

/* ─── TYPING ─── */
const W_LIST = ["apple","brain","cloud","dream","earth","flame","grace","heart","India","lucky","magic","night","ocean","peace","quest","river","solar","tiger","ultra","vivid","world","young","zebra","alpha","brave","chess","daily","eagle","faith","grand"];
function TypingGame({ onBack, addScore }) {
  const [cur,setCur]=useState(0); const [inp,setInp]=useState(""); const [score,setScore]=useState(0);
  const [timer,setTimer]=useState(30); const [done,setDone]=useState(false); const [ok,setOk]=useState(false);
  useEffect(()=>{ if(done)return; const t=setInterval(()=>setTimer(p=>{ if(p<=1){setDone(true);return 0;} return p-1;}),1000); return()=>clearInterval(t);},[done]);
  const handleInp=(e)=>{ const v=e.target.value; setInp(v);
    if(v.toLowerCase()===W_LIST[cur%W_LIST.length].toLowerCase()){
      const pts=10; setScore(s=>s+pts); setOk(true);
      setTimeout(()=>{ setOk(false); setCur(c=>c+1); setInp(""); },280);
    }};
  useEffect(()=>{ if(done) addScore("typing",score); },[done]);
  const w=W_LIST[cur%W_LIST.length];
  return (
    <div style={{ ...px(), minHeight:"100vh", background:C.bg }}>
      <Header title="Typing Blaster" icon="⌨️" color={C.blue} onBack={onBack} score={score}/>
      <div style={{ padding:18, display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
        <AdBanner slot="top"/>
        <div style={{ width:"100%", background:"#fff", borderRadius:16, padding:"14px 18px",
          display:"flex", justifyContent:"space-between", boxShadow:"0 2px 12px rgba(0,0,0,.08)" }}>
          <div><div style={px({ fontSize:10,color:C.gray })}>Time Left</div>
            <div style={px({ fontSize:30,fontWeight:900,color:timer<10?C.red:C.blue })}>{timer}s</div></div>
          <div style={{ textAlign:"right" }}><div style={px({ fontSize:10,color:C.gray })}>Words</div>
            <div style={px({ fontSize:30,fontWeight:900,color:C.green })}>{cur}</div></div>
        </div>
        <div style={{ width:"100%", height:7, background:"#e2e8f0", borderRadius:4 }}>
          <div style={{ height:"100%", width:`${(timer/30)*100}%`, background:timer<10?C.red:C.blue, borderRadius:4, transition:"width 1s linear" }}/>
        </div>
        {done ? (
          <div style={{ textAlign:"center", padding:24 }}>
            <div style={{ fontSize:56 }}>🎉</div>
            <div style={px({ fontSize:22,fontWeight:900,color:C.blue })}>Time's Up!</div>
            <div style={px({ fontSize:14,color:C.gray,margin:"6px 0 18px" })}>Score: {score} pts • {cur} words</div>
            <Btn onClick={()=>{ setScore(0);setCur(0);setTimer(30);setDone(false);setInp(""); }}>🔄 Play Again</Btn>
          </div>
        ):(
          <>
            <div style={{ background:ok?C.green:"#fff", borderRadius:20, padding:"24px 36px",
              boxShadow:"0 8px 24px rgba(0,0,0,.10)", transition:"background .2s", textAlign:"center" }}>
              <div style={px({ fontSize:34,fontWeight:900,color:ok?"#fff":C.dark,letterSpacing:4 })}>{w.toUpperCase()}</div>
              <div style={px({ fontSize:11,color:ok?"rgba(255,255,255,.8)":C.gray,marginTop:4 })}>Type the word</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {[1,2,3].map(i=>(
                <div key={i} style={{ background:"#fff", borderRadius:8, padding:"5px 12px",
                  color:C.gray, fontSize:12, opacity:1-i*.25 }}>{W_LIST[(cur+i)%W_LIST.length]}</div>
              ))}
            </div>
            <input autoFocus value={inp} onChange={handleInp} placeholder="Type here…"
              style={{ width:"100%", padding:"13px 16px", fontSize:18, fontWeight:700,
                border:`3px solid ${inp?C.blue:"#e2e8f0"}`, borderRadius:14,
                outline:"none", fontFamily:"'Poppins',sans-serif", textAlign:"center", boxSizing:"border-box" }}/>
          </>
        )}
      </div>
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
  const [q,setQ]=useState(0); const [score,setScore]=useState(0);
  const [sel,setSel]=useState(null); const [done,setDone]=useState(false);
  const pick=(i)=>{ if(sel!==null)return; setSel(i); if(i===QD[q].ans) setScore(s=>s+10);
    setTimeout(()=>{ if(q+1>=QD.length){setDone(true);addScore("quiz",score+(i===QD[q].ans?10:0));}
      else{setQ(q+1);setSel(null);}},900);};
  const curr=QD[q];
  return (
    <div style={{ ...px(), minHeight:"100vh", background:C.bg }}>
      <Header title="Quiz Arena" icon="❓" color={C.yellow} onBack={onBack} score={score}/>
      <div style={{ padding:18 }}>
        <AdBanner slot="top"/>
        <div style={{ display:"flex", gap:4, marginBottom:14 }}>
          {QD.map((_,i)=>(
            <div key={i} style={{ flex:1, height:5, borderRadius:3,
              background:i<q?C.green:i===q?C.yellow:"#e2e8f0" }}/>
          ))}
        </div>
        {done?(
          <div style={{ textAlign:"center", padding:24 }}>
            <div style={{ fontSize:56 }}>🏆</div>
            <div style={px({ fontSize:22,fontWeight:900,color:C.dark })}>Quiz Complete!</div>
            <div style={px({ fontSize:14,color:C.gray,margin:"6px 0 18px" })}>{score}/{QD.length*10} points</div>
            <div style={{ fontSize:38, marginBottom:18 }}>{score>=60?"⭐⭐⭐":score>=40?"⭐⭐":"⭐"}</div>
            <Btn color={C.yellow} onClick={()=>{setQ(0);setScore(0);setSel(null);setDone(false);}}>🔄 Again</Btn>
          </div>
        ):(
          <>
            <div style={{ background:"#fff", borderRadius:20, padding:18,
              boxShadow:"0 4px 16px rgba(0,0,0,.08)", marginBottom:16 }}>
              <div style={{ display:"inline-block", background:C.yellow+"22", color:C.yellow,
                borderRadius:8, padding:"3px 10px", fontSize:10, fontWeight:700, marginBottom:8 }}>{curr.cat}</div>
              <div style={px({ fontSize:15,fontWeight:700,color:C.dark,lineHeight:1.5 })}>Q{q+1}. {curr.q}</div>
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
          </>
        )}
      </div>
    </div>
  );
}

/* ─── MATH ─── */
function MathGame({ onBack, addScore }) {
  const gen=()=>{ const ops=["+","-","×","÷"]; const op=ops[Math.floor(Math.random()*4)];
    let a,b,ans;
    if(op==="+"){a=Math.floor(Math.random()*50)+1;b=Math.floor(Math.random()*50)+1;ans=a+b;}
    else if(op==="-"){a=Math.floor(Math.random()*50)+20;b=Math.floor(Math.random()*20)+1;ans=a-b;}
    else if(op==="×"){a=Math.floor(Math.random()*12)+1;b=Math.floor(Math.random()*12)+1;ans=a*b;}
    else{b=Math.floor(Math.random()*10)+1;ans=Math.floor(Math.random()*10)+1;a=ans*b;}
    const w=[ans+Math.ceil(Math.random()*5),ans-Math.ceil(Math.random()*4),ans+Math.ceil(Math.random()*9)];
    const opts=[ans,...w].sort(()=>Math.random()-.5);
    return{a,b,op,ans,opts};};
  const [prob,setProb]=useState(gen); const [score,setScore]=useState(0);
  const [streak,setStreak]=useState(0); const [sel,setSel]=useState(null); const [total,setTotal]=useState(0);
  const pick=(v)=>{ if(sel!==null)return; setSel(v); setTotal(t=>t+1);
    if(v===prob.ans){const pts=10+streak*2;setScore(s=>s+pts);setStreak(s=>s+1);addScore("math",pts);}
    else setStreak(0);
    setTimeout(()=>{ setProb(gen()); setSel(null); },800);};
  return (
    <div style={{ ...px(), minHeight:"100vh", background:C.bg }}>
      <Header title="Math Master" icon="➕" color={C.green} onBack={onBack} score={score}/>
      <div style={{ padding:18, display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
        <AdBanner slot="top"/>
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
        <div style={px({ color:C.gray,fontSize:13 })}>Answered: {total} questions</div>
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
  const [idx,setIdx]=useState(0); const [score,setScore]=useState(0); const [tab,setTab]=useState("meaning");
  const w=WD[idx%WD.length];
  return (
    <div style={{ ...px(), minHeight:"100vh", background:C.bg }}>
      <Header title="English Words" icon="🔤" color={C.purple} onBack={onBack} score={score}/>
      <div style={{ padding:18 }}>
        <AdBanner slot="top"/>
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
          <Btn color={C.green} style={{ flex:1 }} onClick={()=>{ setScore(s=>s+5);addScore("english",5);setIdx(i=>i+1); }}>✅ Got it! Next →</Btn>
          <Btn color={C.gray} style={{ flex:1 }} onClick={()=>setIdx(i=>i+1)}>Skip →</Btn>
        </div>
        <div style={px({ textAlign:"center",color:C.gray,fontSize:12,marginTop:10 })}>Word {(idx%WD.length)+1} of {WD.length}</div>
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
  const [q,setQ]=useState(0); const [score,setScore]=useState(0);
  const [sel,setSel]=useState(null); const [done,setDone]=useState(false);
  const curr=SQ[q];
  const pick=(i)=>{ if(sel!==null)return; setSel(i);
    if(i===curr.ans) setScore(s=>s+10);
    setTimeout(()=>{ if(q+1>=SQ.length){setDone(true);addScore("science",score+(i===curr.ans?10:0));}
      else{setQ(q+1);setSel(null);}},900);};
  return (
    <div style={{ ...px(), minHeight:"100vh", background:C.bg }}>
      <Header title="Science Lab" icon="🔬" color={C.orange} onBack={onBack} score={score}/>
      <div style={{ padding:18 }}>
        <AdBanner slot="top"/>
        {done?(
          <div style={{ textAlign:"center",padding:32 }}>
            <div style={{ fontSize:60 }}>🔬</div>
            <div style={px({ fontSize:22,fontWeight:900,color:C.dark })}>Lab Complete!</div>
            <div style={px({ fontSize:14,color:C.gray,margin:"6px 0 18px" })}>{score}/{SQ.length*10} pts</div>
            <Btn color={C.orange} onClick={()=>{setQ(0);setScore(0);setSel(null);setDone(false);}}>🔄 Again</Btn>
          </div>
        ):(
          <>
            <div style={{ display:"flex",gap:4,marginBottom:14 }}>
              {SQ.map((_,i)=>(<div key={i} style={{ flex:1,height:5,borderRadius:3,background:i<q?C.orange:i===q?C.yellow:"#e2e8f0" }}/>))}
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
          </>
        )}
      </div>
    </div>
  );
}

/* ─── CHESS ─── */
const PIECES={wK:"♔",wQ:"♕",wR:"♖",wB:"♗",wN:"♘",wP:"♙",bK:"♚",bQ:"♛",bR:"♜",bB:"♝",bN:"♞",bP:"♟"};
function ChessGame({ onBack }) {
  const init=()=>{ const b=Array(8).fill(null).map(()=>Array(8).fill(null));
    ["R","N","B","Q","K","B","N","R"].forEach((p,i)=>{b[0][i]={p,c:"b"};b[7][i]={p,c:"w"};});
    for(let i=0;i<8;i++){b[1][i]={p:"P",c:"b"};b[6][i]={p:"P",c:"w"};}
    return b;};
  const [board,setBoard]=useState(init); const [sel,setSel]=useState(null); const [turn,setTurn]=useState("w");
  const click=(r,c)=>{
    const cell=board[r][c];
    if(!sel){ if(cell&&cell.c===turn) setSel([r,c]); }
    else{
      const [sr,sc]=sel;
      if(sr===r&&sc===c){setSel(null);return;}
      const nb=board.map(row=>[...row]);
      nb[r][c]=nb[sr][sc]; nb[sr][sc]=null;
      setBoard(nb); setSel(null); setTurn(t=>t==="w"?"b":"w");
    }};
  return (
    <div style={{ ...px(), minHeight:"100vh", background:C.bg }}>
      <Header title="Chess" icon="♟️" color={C.dark} onBack={onBack}/>
      <div style={{ padding:14,display:"flex",flexDirection:"column",alignItems:"center",gap:12 }}>
        <AdBanner slot="top"/>
        <div style={{ background:"#fff",borderRadius:12,padding:"8px 20px",
          fontWeight:700,fontSize:14,color:turn==="w"?C.dark:C.blue,
          boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
          {turn==="w"?"⬜ White's Turn":"⬛ Black's Turn"}
        </div>
        <div style={{ border:`3px solid #1e293b`,borderRadius:4,overflow:"hidden" }}>
          {board.map((row,r)=>(
            <div key={r} style={{ display:"flex" }}>
              {row.map((cell,c)=>{
                const light=(r+c)%2===0;
                const isSel=sel&&sel[0]===r&&sel[1]===c;
                return(
                  <div key={c} onClick={()=>click(r,c)} style={{
                    width:40,height:40,background:isSel?C.yellow:light?"#f0d9b5":"#b58863",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:24,cursor:"pointer",userSelect:"none",transition:"background .1s",
                  }}>{cell?PIECES[cell.c+cell.p]:""}</div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:10 }}>
          <Btn color={C.dark} sm onClick={()=>{setBoard(init());setSel(null);setTurn("w");}}>🔄 Reset</Btn>
          <div style={{ background:"#fff",borderRadius:10,padding:"8px 14px",
            fontSize:11,color:C.gray,fontWeight:600 }}>Tap piece → Tap destination</div>
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

  const addScore=(id,pts)=>setScores(s=>({...s,[id]:Math.max(s[id],(s[id]||0)+pts)}));

  const GAME_COMPS={typing:TypingGame,quiz:QuizGame,math:MathGame,english:EnglishGame,science:ScienceGame,chess:ChessGame,ttt:TicTacToe,memory:MemoryGame};

  return (
    <div style={{ maxWidth:430,margin:"0 auto",minHeight:"100vh",boxShadow:"0 0 40px rgba(0,0,0,.15)",overflow:"hidden",background:"#fff" }}>
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
              {tab==="profile"     && <Profile scores={scores}/>}
            </div>
          )}
          {!game && <BottomNav active={tab} onTab={setTab}/>}
        </div>
      )}
    </div>
  );
}

import React from 'react';

// FruitKnifeBlast — self-contained game (HTML/CSS/JS) rendered inside an iframe.
// Isolated from the host app's React tree (no dependency conflicts).
const GAME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>GigLife — Fruit Knife Blast</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --orange-1:#ffb547;
    --orange-2:#f4820f;
    --orange-3:#c9640a;
    --yellow:#f4e04d;
  }
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;}
  html,body{margin:0;padding:0;height:100%;overflow:hidden;font-family:'Poppins',sans-serif;background:#000;}
  #app{
    max-width:430px;margin:0 auto;height:100vh;position:relative;overflow:hidden;
    background:
      radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.05), transparent 60%),
      linear-gradient(180deg,#0f2b12 0%,#153819 35%,#0c2410 100%);
  }
  .bamboo{position:absolute;top:0;bottom:0;width:26px;background:repeating-linear-gradient(180deg,#1d4a22 0 26px,#173d1c 26px 30px);opacity:0.55;border-radius:12px;}

  .screen{position:absolute;inset:0;display:none;flex-direction:column;z-index:5;}
  .screen.active{display:flex;}

  .topbar{display:flex;align-items:center;gap:12px;padding:16px 18px 6px;position:relative;z-index:10;}
  .topbar-title{color:#fff;font-weight:700;font-size:19px;}

  /* ===================== MENU ===================== */
  #screen-menu{align-items:center;}
  .logo-wrap{margin-top:12vh;text-align:center;position:relative;z-index:2;}
  .logo-line1{
    font-family:'Baloo 2',sans-serif;font-weight:800;font-size:58px;letter-spacing:2px;
    background:linear-gradient(180deg,#ff8a3d,#e2451f);
    -webkit-background-clip:text;background-clip:text;color:transparent;
    -webkit-text-stroke:3px #7a1f0a;text-shadow:0 6px 0 rgba(0,0,0,0.35);
  }
  .logo-line2{
    font-family:'Baloo 2',sans-serif;font-weight:700;font-size:26px;letter-spacing:10px;color:#d8dce0;
    -webkit-text-stroke:1.5px #3a3f47;margin-top:-6px;
  }
  .logo-line3{
    font-family:'Baloo 2',sans-serif;font-weight:800;font-size:50px;letter-spacing:2px;
    background:linear-gradient(180deg,#5fd6f7,#7ee06b 55%,#e0455a);
    -webkit-background-clip:text;background-clip:text;color:transparent;
    -webkit-text-stroke:3px #123a1a;text-shadow:0 6px 0 rgba(0,0,0,0.35);margin-top:-8px;
  }

  .diff-row{display:flex;gap:10px;margin-top:34px;}
  .diff-chip{padding:10px 18px;border-radius:14px;border:2px solid rgba(255,255,255,0.18);color:#eafbe8;font-weight:700;font-size:13px;cursor:pointer;}
  .diff-chip.selected{background:var(--orange-2);border-color:var(--orange-1);}

  .play-btn{
    margin-top:32px;width:110px;height:110px;border-radius:26px;
    background:linear-gradient(180deg,#ffcd6e,var(--orange-2) 60%,var(--orange-3));
    border:4px solid #fff2d8;display:flex;align-items:center;justify-content:center;cursor:pointer;
    box-shadow:0 14px 0 rgba(0,0,0,0.3), 0 18px 30px -8px rgba(0,0,0,0.5);
  }
  .play-btn:active{transform:translateY(6px);box-shadow:0 8px 0 rgba(0,0,0,0.3);}

  .best-pill{margin-top:26px;background:rgba(0,0,0,0.32);border-radius:20px;padding:10px 22px;color:var(--yellow);font-weight:700;font-size:14px;letter-spacing:1px;}
  .bottom-icons{position:absolute;bottom:24px;left:0;right:0;display:flex;justify-content:space-between;padding:0 20px;}
  .sq-btn{width:52px;height:52px;border-radius:14px;background:linear-gradient(180deg,#ffcd6e,var(--orange-2));border:3px solid #fff2d8;display:flex;align-items:center;justify-content:center;color:#7a3a06;font-size:22px;box-shadow:0 6px 0 rgba(0,0,0,0.3);}

  /* ===================== GAME ===================== */
  .hud{display:flex;justify-content:space-between;align-items:center;padding:14px 16px 0;position:relative;z-index:10;}
  .score-pill{display:flex;align-items:center;gap:8px;background:linear-gradient(180deg,#ffcd6e,var(--orange-2));border:3px solid #fff2d8;border-radius:16px;padding:8px 18px 8px 10px;color:#5a2b04;font-weight:800;font-size:19px;box-shadow:0 5px 0 rgba(0,0,0,0.3);}
  .score-pill .bowl{font-size:22px;}
  .pause-btn{width:48px;height:48px;border-radius:14px;background:linear-gradient(180deg,#ffcd6e,var(--orange-2));border:3px solid #fff2d8;display:flex;align-items:center;justify-content:center;color:#5a2b04;font-size:20px;cursor:pointer;box-shadow:0 5px 0 rgba(0,0,0,0.3);}

  #gameCanvas{position:absolute;inset:0;z-index:3;touch-action:none;}

  .knife-stock{position:absolute;left:16px;bottom:26px;display:flex;flex-direction:column-reverse;gap:4px;z-index:10;}
  .knife-icon{width:34px;height:34px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.4));}

  .combo-toast{
    position:absolute;left:50%;top:34%;transform:translate(-50%,-50%) scale(0.8);
    color:var(--yellow);font-weight:800;font-size:24px;text-shadow:0 3px 6px rgba(0,0,0,0.6);
    opacity:0;pointer-events:none;transition:all .22s ease;z-index:12;
  }
  .combo-toast.show{opacity:1;transform:translate(-50%,-50%) scale(1);}

  /* ===================== PAUSE ===================== */
  .pause-overlay{position:absolute;inset:0;z-index:40;display:none;align-items:center;justify-content:center;background:rgba(5,15,5,0.7);}
  .pause-overlay.active{display:flex;}
  .pause-card{background:#173a1c;border:3px solid rgba(255,255,255,0.12);border-radius:22px;padding:28px 30px;text-align:center;width:78%;max-width:280px;}
  .pause-title{color:#fff;font-weight:800;font-size:22px;margin-bottom:20px;letter-spacing:1px;}
  .pause-btn-row{display:flex;flex-direction:column;gap:12px;}
  .pbtn{padding:13px;border-radius:14px;font-weight:700;font-size:15px;cursor:pointer;border:none;}
  .pbtn.resume{background:linear-gradient(180deg,#ffcd6e,var(--orange-2));color:#5a2b04;}
  .pbtn.restart{background:rgba(255,255,255,0.1);color:#fff;}
  .pbtn.exit{background:rgba(255,255,255,0.1);color:#fff;}

  /* ===================== GAME OVER (shareable) ===================== */
  #screen-over{align-items:center;justify-content:center;text-align:center;padding:20px;}
  .door-bg{position:absolute;inset:0;background:
      radial-gradient(ellipse at 50% 20%, rgba(255,210,120,0.10), transparent 60%),
      linear-gradient(180deg,#123016,#0c2410);
  }
  .share-card{
    position:relative;z-index:5;width:100%;max-width:320px;border-radius:28px;overflow:hidden;
    background:linear-gradient(160deg,#1c4a22,#0e2a13 60%);
    border:3px solid rgba(255,210,120,0.35);
    box-shadow:0 20px 50px -12px rgba(0,0,0,0.7);
    padding:26px 22px 22px;
  }
  .card-badge{
    display:inline-block;background:rgba(244,224,77,0.15);color:var(--yellow);font-weight:700;font-size:11px;
    letter-spacing:2px;padding:5px 14px;border-radius:20px;margin-bottom:12px;text-transform:uppercase;
  }
  .card-emojis{font-size:26px;margin-bottom:8px;letter-spacing:6px;}
  .over-title{font-family:'Baloo 2',sans-serif;font-weight:800;font-size:30px;color:#fff;text-shadow:0 3px 0 rgba(0,0,0,0.4);margin-bottom:14px;}
  .score-big{font-family:'Baloo 2',sans-serif;font-weight:800;font-size:64px;line-height:1;color:var(--yellow);text-shadow:0 4px 0 rgba(0,0,0,0.4);}
  .score-sub{color:#cfe8cf;font-size:13px;font-weight:600;margin-top:4px;margin-bottom:18px;}
  .best-row{
    display:flex;justify-content:center;align-items:center;gap:8px;background:rgba(0,0,0,0.25);border-radius:16px;
    padding:10px 16px;margin-bottom:20px;color:#fff;font-weight:700;font-size:14px;
  }
  .new-best-badge{
    background:linear-gradient(180deg,#ffcd6e,var(--orange-2));color:#5a2b04;font-weight:800;font-size:11px;
    padding:3px 10px;border-radius:10px;margin-left:6px;
  }
  .card-brand{color:rgba(255,255,255,0.4);font-size:11px;font-weight:600;letter-spacing:1px;margin-top:4px;}

  .over-actions{width:100%;max-width:320px;margin-top:18px;position:relative;z-index:5;}
  .share-btn{
    width:100%;display:flex;align-items:center;justify-content:center;gap:8px;
    background:linear-gradient(180deg,#ffcd6e,var(--orange-2));color:#5a2b04;font-weight:800;font-size:16px;
    border:none;border-radius:16px;padding:15px;cursor:pointer;box-shadow:0 8px 0 rgba(0,0,0,0.3);
  }
  .over-row2{display:flex;gap:10px;margin-top:12px;}
  .over-row2 button{
    flex:1;padding:13px;border-radius:14px;font-weight:700;font-size:14px;cursor:pointer;border:none;
    background:rgba(255,255,255,0.1);color:#fff;
  }
  .share-preview-link{display:none;}
</style>
</head>
<body>
<div id="app">
  <div class="bamboo" style="left:2%;"></div>
  <div class="bamboo" style="left:14%;"></div>
  <div class="bamboo" style="right:2%;"></div>
  <div class="bamboo" style="right:14%;"></div>

  <!-- ================= MENU ================= -->
  <div class="screen active" id="screen-menu">
    <div class="topbar"><span class="topbar-title" style="color:#eafbe8;">Play</span></div>
    <div class="logo-wrap">
      <div class="logo-line1">FRUIT</div>
      <div class="logo-line2">KNIFE</div>
      <div class="logo-line3">BLAST</div>
    </div>

    <div class="play-btn" onclick="startGame()" style="margin-top:44px;">
      <svg width="42" height="42" viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20" fill="#fff"/></svg>
    </div>

    <div class="best-pill">🏆 BEST: <span id="menu-best">0</span></div>

    <div class="bottom-icons">
      <div class="sq-btn">⤢</div>
      <div class="sq-btn" id="sound-btn" onclick="toggleSound()">🔊</div>
    </div>
  </div>

  <!-- ================= GAME ================= -->
  <div class="screen" id="screen-game">
    <canvas id="gameCanvas"></canvas>
    <div class="hud">
      <div class="score-pill"><span class="bowl">🧺</span><span id="score-display">0</span></div>
      <div class="pause-btn" onclick="pauseGame()">⏸</div>
    </div>
    <div class="combo-toast" id="combo-toast">SLICED!</div>

    <div class="pause-overlay" id="pause-overlay">
      <div class="pause-card">
        <div class="pause-title">Paused</div>
        <div class="pause-btn-row">
          <button class="pbtn resume" onclick="resumeGame()">Resume</button>
          <button class="pbtn restart" onclick="restartLevel()">Restart</button>
          <button class="pbtn exit" onclick="exitGame()">Exit</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ================= GAME OVER (shareable card) ================= -->
  <div class="screen" id="screen-over">
    <div class="door-bg"></div>
    <div class="share-card" id="share-card">
      <div class="card-badge">Game Over</div>
      <div class="card-emojis">🍉🥭🍍🍓🍋</div>
      <div class="over-title">Fruit Knife Blast</div>
      <div class="score-big" id="over-score">0</div>
      <div class="score-sub">FRUITS SLICED</div>
      <div class="best-row" id="best-row">🏆 Best Score: <span id="over-best">0</span></div>
      <div class="card-brand">GigLife · play.giglife.in</div>
    </div>

    <div class="over-actions">
      <button class="share-btn" id="share-btn" onclick="shareScore()">📤 Share Score</button>
      <div class="over-row2">
        <button onclick="startGame(true)">🔁 Play Again</button>
        <button onclick="goMenu()">🏠 Menu</button>
      </div>
    </div>
    <a class="share-preview-link" id="share-download" download="fruit-knife-blast-score.png"></a>
  </div>
</div>

<script>
/* =========================================================
   GigLife Fruit Knife Blast — arc-tossed fruits, slice anywhere
   you touch. Difficulty ramps up smoothly. Shareable game-over card.
   ========================================================= */
let canvas, ctx;
let W=360, H=640;
let DPR = Math.min(3, window.devicePixelRatio||1);

const FRUIT_EMOJIS = ['🥭','🍍','🍎','🍓','🍋','🍉','🍑','🥝'];
const FRUIT_COLOR = {'🥭':'#f4a53c','🍍':'#f0c419','🍎':'#e0453f','🍓':'#e0455a','🍋':'#f4e04d','🍉':'#3fae5c','🍑':'#f4a3a3','🥝':'#a8c93f'};

let fruits = [];        // {x,y,vx,vy,emoji,r,rot,rotSpeed,sliced,isBomb}
let juiceParticles = [];
let flyingKnives = [];  // {x,y,speed}
let explosionParticles = [];
let screenShake = 0;

let score = 0;
let best = window._gklBest || 0;
let spawnTimer = 0;
let baseSpawnInterval = 0.85;
let running = false, paused = false;
let lastTs = 0;
let elapsed = 0;
const GRAVITY = 620;

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

let soundOn = true;
function toggleSound(){ soundOn=!soundOn; document.getElementById('sound-btn').textContent = soundOn?'🔊':'🔇'; }

function fitCanvas(){
  const rect = document.getElementById('app').getBoundingClientRect();
  W = rect.width; H = rect.height;
  canvas.width = W*DPR; canvas.height = H*DPR;
  canvas.style.width = W+'px'; canvas.style.height = H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
}

/* ---------------- Setup ---------------- */
function setupGame(){
  fruits = [];
  juiceParticles = [];
  flyingKnives = [];
  explosionParticles = [];
  score = 0;
  elapsed = 0;
  spawnTimer = 0.3;
  screenShake = 0;
  updateScoreDisplay();
}

/* ---------------- Difficulty ramp ---------------- */
function speedFactor(){ return 1 + Math.min(0.45, elapsed*0.006); } // gently ramps up, caps at 1.45x
function currentSpawnInterval(){
  const t = Math.max(0.5, baseSpawnInterval - elapsed*0.004);
  return t;
}

/* ---------------- Spawning (toss arcs, drifting left<->right) ---------------- */
function spawnFruit(){
  const fromLeft = Math.random() < 0.5;
  const x = fromLeft ? W*(0.08+Math.random()*0.15) : W*(0.77+Math.random()*0.15);
  const dirSign = fromLeft ? 1 : -1;
  const sf = speedFactor();

  const peakHeight = H*(0.35+Math.random()*0.35);
  const vy = -Math.sqrt(2*GRAVITY*peakHeight) * sf;
  const vx = dirSign * (W*0.32 + Math.random()*W*0.18) * sf;

  const isBomb = elapsed > 3 && Math.random() < 0.16;

  fruits.push({
    x, y: H+30, vx, vy,
    emoji: isBomb ? '💣' : FRUIT_EMOJIS[Math.floor(Math.random()*FRUIT_EMOJIS.length)],
    r: W*(isBomb ? 0.078 : 0.075),
    rot: Math.random()*Math.PI*2,
    rotSpeed: (Math.random()-0.5)*4,
    sliced:false, isBomb
  });
}

/* ---------------- Game flow ---------------- */
function startGame(fromOver){
  showScreen('screen-game');
  fitCanvas();
  setupGame();
  running = true; paused = false;
  lastTs = performance.now();
  requestAnimationFrame(loop);
}

function restartLevel(){
  document.getElementById('pause-overlay').classList.remove('active');
  setupGame();
  paused = false;
}
function pauseGame(){ paused = true; document.getElementById('pause-overlay').classList.add('active'); }
function resumeGame(){ paused = false; document.getElementById('pause-overlay').classList.remove('active'); lastTs = performance.now(); }
function exitGame(){ running=false; paused=false; document.getElementById('pause-overlay').classList.remove('active'); showScreen('screen-menu'); document.getElementById('menu-best').textContent = best; }
function goMenu(){ document.getElementById('menu-best').textContent = best; showScreen('screen-menu'); }

function updateScoreDisplay(){ document.getElementById('score-display').textContent = score; }

function showCombo(text){
  const el = document.getElementById('combo-toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(()=>el.classList.remove('show'), 420);
}

/* ---------------- Touch = throw a knife upward from that x, at the bottom ---------------- */
function handleSlice(clientX, clientY){
  if(!running || paused) return;
  const rect = canvas.getBoundingClientRect();
  const x = clientX-rect.left;
  flyingKnives.push({ x, y: H-30, speed: H*1.7 });
}

/* ---------------- Bomb explosion -> game over ---------------- */
function triggerBombExplosion(f){
  screenShake = 0.35;
  for(let i=0;i<40;i++){
    const ang = Math.random()*Math.PI*2;
    const spd = 140+Math.random()*420;
    explosionParticles.push({
      x:f.x, y:f.y,
      vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd,
      life:1, r: 3+Math.random()*5,
      color: Math.random()<0.5 ? '#ff7a2e' : (Math.random()<0.5?'#ffd23f':'#e6e6e6')
    });
  }
  gameOver();
}

function gameOver(){
  running = false;
  const isNewBest = score>best;
  if(isNewBest){ best = score; window._gklBest = best; }
  document.getElementById('over-score').textContent = score;
  document.getElementById('over-best').textContent = best;
  document.getElementById('best-row').innerHTML = isNewBest
    ? '🏆 New Best Score! <span class="new-best-badge">BEST</span>'
    : '🏆 Best Score: <span id="over-best">'+best+'</span>';
  setTimeout(()=>showScreen('screen-over'), 420);
}

/* ---------------- Update ---------------- */
function update(dt){
  elapsed += dt;
  spawnTimer -= dt;
  if(spawnTimer<=0){
    spawnFruit();
    spawnTimer = currentSpawnInterval();
  }

  if(screenShake>0) screenShake = Math.max(0, screenShake-dt*1.6);

  for(let i=fruits.length-1;i>=0;i--){
    const f = fruits[i];
    if(f.sliced){ fruits.splice(i,1); continue; }
    f.vy += GRAVITY*dt;
    f.x += f.vx*dt;
    f.y += f.vy*dt;
    f.rot += f.rotSpeed*dt;
    if(f.y > H+f.r*2){
      fruits.splice(i,1); // missed fruit: no penalty, game just continues
    }
  }

  for(let i=flyingKnives.length-1;i>=0;i--){
    if(!running) break;
    const k = flyingKnives[i];
    k.y -= k.speed*dt;
    let hitCount = 0;
    for(const f of fruits){
      if(f.sliced) continue;
      const dx=f.x-k.x, dy=f.y-k.y;
      if(Math.sqrt(dx*dx+dy*dy) < f.r*1.05){
        f.sliced = true;
        if(f.isBomb){
          triggerBombExplosion(f);
          break;
        }
        hitCount++;
        score += 10;
        spawnJuice(f);
      }
    }
    if(!running) break;
    if(hitCount>0){
      updateScoreDisplay();
      showCombo(hitCount>1 ? hitCount+'x COMBO!' : 'SLICED!');
    }
    if(k.y < -40){ flyingKnives.splice(i,1); }
  }

  for(let i=juiceParticles.length-1;i>=0;i--){
    const p = juiceParticles[i];
    p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 500*dt; p.life -= dt*1.4;
    if(p.life<=0) juiceParticles.splice(i,1);
  }

  for(let i=explosionParticles.length-1;i>=0;i--){
    const p = explosionParticles[i];
    p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 380*dt; p.life -= dt*1.1;
    if(p.life<=0) explosionParticles.splice(i,1);
  }
}

function spawnJuice(f){
  for(let i=0;i<14;i++){
    juiceParticles.push({
      x:f.x, y:f.y,
      vx:(Math.random()-0.5)*280,
      vy:(Math.random()-1.1)*280,
      life:1, r: 3+Math.random()*3,
      color: FRUIT_COLOR[f.emoji]||'#f4a53c'
    });
  }
}

/* ---------------- Render ---------------- */
function drawFruits(){
  for(const f of fruits){
    ctx.save();
    ctx.translate(f.x,f.y);
    ctx.rotate(f.rot);

    if(f.isBomb){
      const pulse = 1 + Math.sin(elapsed*10)*0.06;
      ctx.save();
      ctx.scale(pulse,pulse);
      ctx.shadowColor = '#ff3b1f';
      ctx.shadowBlur = 26;
      ctx.font = (f.r*2)+'px serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('💣', 0, 0);
      ctx.restore();
      // fuse spark
      ctx.save();
      ctx.rotate(-f.rot);
      const sparkY = -f.r*1.05 - Math.sin(elapsed*22)*3;
      ctx.fillStyle = Math.sin(elapsed*30)>0 ? '#ffd23f' : '#ff7a2e';
      ctx.beginPath();
      ctx.arc(f.r*0.55, sparkY, 4.5, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 6;
      ctx.font = (f.r*2)+'px serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(f.emoji, 0, 0);
    }
    ctx.restore();
  }
}
function drawKnifeShape(){
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 8;
  const blade = ctx.createLinearGradient(-6,0,6,0);
  blade.addColorStop(0,'#aeb6c2');
  blade.addColorStop(0.5,'#f4f7fb');
  blade.addColorStop(1,'#aeb6c2');
  ctx.beginPath();
  ctx.moveTo(0,-24); ctx.lineTo(6,4); ctx.lineTo(-6,4); ctx.closePath();
  ctx.fillStyle = blade;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 0.6;
  ctx.stroke();
  ctx.shadowBlur = 0;
  const handle = ctx.createLinearGradient(-3,4,3,4);
  handle.addColorStop(0,'#6b431f');
  handle.addColorStop(0.5,'#a06a34');
  handle.addColorStop(1,'#6b431f');
  ctx.fillStyle = handle;
  ctx.fillRect(-3,4,6,12);
  ctx.fillStyle = '#4a2e14';
  ctx.fillRect(-4,15,8,4);
  ctx.restore();
}
function drawFlyingKnives(){
  for(const k of flyingKnives){
    ctx.save();
    ctx.translate(k.x,k.y);
    drawKnifeShape();
    ctx.restore();
  }
}
function drawJuice(){
  for(const p of juiceParticles){
    ctx.globalAlpha = Math.max(0,p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r||4,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function drawExplosion(){
  if(explosionParticles.length===0) return;
  for(const p of explosionParticles){
    ctx.globalAlpha = Math.max(0,p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function drawFlash(){
  if(screenShake<=0) return;
  ctx.fillStyle = 'rgba(255,140,60,'+(screenShake*0.5)+')';
  ctx.fillRect(0,0,W,H);
}

function render(){
  ctx.save();
  if(screenShake>0){
    const mag = screenShake*14;
    ctx.translate((Math.random()-0.5)*mag,(Math.random()-0.5)*mag);
  }
  ctx.clearRect(-20,-20,W+40,H+40);
  drawFruits();
  drawJuice();
  drawFlyingKnives();
  drawExplosion();
  drawFlash();
  ctx.restore();
}

/* ---------------- Main loop ---------------- */
function loop(ts){
  if(!running) return;
  if(paused){ lastTs = ts; requestAnimationFrame(loop); return; }
  const dt = Math.min(0.033, (ts-lastTs)/1000);
  lastTs = ts;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

/* ---------------- Share score as image ---------------- */
async function shareScore(){
  const btn = document.getElementById('share-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Preparing…';

  const cardCanvas = document.createElement('canvas');
  const cw = 1080, ch = 1350;
  cardCanvas.width = cw; cardCanvas.height = ch;
  const c = cardCanvas.getContext('2d');

  const grad = c.createLinearGradient(0,0,0,ch);
  grad.addColorStop(0,'#1c4a22');
  grad.addColorStop(1,'#0c2410');
  c.fillStyle = grad;
  c.fillRect(0,0,cw,ch);

  c.fillStyle = 'rgba(255,210,120,0.08)';
  c.beginPath(); c.arc(cw*0.85, ch*0.12, 220, 0, Math.PI*2); c.fill();
  c.beginPath(); c.arc(cw*0.1, ch*0.9, 260, 0, Math.PI*2); c.fill();

  c.textAlign = 'center';
  c.font = '600 34px sans-serif';
  c.fillStyle = '#f4e04d';
  c.fillText('GAME OVER', cw/2, 200);

  c.font = '64px serif';
  c.fillText('🍉 🥭 🍍 🍓 🍋', cw/2, 300);

  c.font = '800 64px sans-serif';
  c.fillStyle = '#ffffff';
  c.fillText('Fruit Knife Blast', cw/2, 420);

  c.font = '800 220px sans-serif';
  c.fillStyle = '#f4e04d';
  c.fillText(String(score), cw/2, 700);

  c.font = '600 34px sans-serif';
  c.fillStyle = '#cfe8cf';
  c.fillText('FRUITS SLICED', cw/2, 760);

  c.font = '700 40px sans-serif';
  c.fillStyle = '#ffffff';
  c.fillText('🏆 Best Score: '+best, cw/2, 880);

  c.font = '600 30px sans-serif';
  c.fillStyle = 'rgba(255,255,255,0.55)';
  c.fillText('Can you beat my score?', cw/2, 1080);

  c.font = '700 34px sans-serif';
  c.fillStyle = 'rgba(255,255,255,0.75)';
  c.fillText('GigLife · play.giglife.in', cw/2, 1250);

  cardCanvas.toBlob(async (blob)=>{
    btn.textContent = originalText;
    if(!blob) return;
    const file = new File([blob], 'fruit-knife-blast-score.png', {type:'image/png'});

    if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})){
      try{
        await navigator.share({
          files:[file],
          title:'Fruit Knife Blast',
          text:'I scored '+score+' in Fruit Knife Blast on GigLife! Can you beat it? 🍉🔪'
        });
        return;
      } catch(e){ /* user cancelled or unsupported, fall through to download */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.getElementById('share-download');
    a.href = url;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 4000);
  }, 'image/png');
}

/* ---------------- Init ---------------- */
window.addEventListener('DOMContentLoaded', ()=>{
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  fitCanvas();
  canvas.addEventListener('mousedown', (e)=>handleSlice(e.clientX,e.clientY));
  canvas.addEventListener('touchstart', (e)=>{ e.preventDefault(); const t=e.touches[0]; handleSlice(t.clientX,t.clientY); }, {passive:false});
  document.getElementById('menu-best').textContent = best;
});
window.addEventListener('resize', ()=>{ if(canvas) fitCanvas(); });
</script>
</body>
</html>
`;

export default function FruitKnifeBlast({ onBack }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#000', display: 'flex', flexDirection: 'column'
    }}>
      <button
        onClick={onBack}
        style={{
          position: 'absolute', top: 14, left: 14, zIndex: 10,
          width: 38, height: 38, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', color: '#fff',
          border: 'none', fontSize: 20, cursor: 'pointer'
        }}
      >
        ‹
      </button>
      <iframe
        title="FruitKnifeBlast"
        srcDoc={GAME_HTML}
        style={{ border: 'none', width: '100%', height: '100%', flex: 1 }}
        allow="autoplay"
      />
    </div>
  );
}

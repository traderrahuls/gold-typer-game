import React from 'react';

// ChessGame — self-contained game (HTML/CSS/JS) rendered inside an iframe.
// Isolated from the host app's React tree (no dependency conflicts).
const GAME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>GigLife Chess</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Cinzel+Decorative:wght@700;900&family=Marcellus&display=swap" rel="stylesheet">
<style>
  :root{
    --gold: #f0b90b;
    --gold-dim: #b98f0a;
    --maroon-1: #7a2020;
    --maroon-2: #4a1414;
    --parchment: #f3e7cd;
    --parchment-dim: #d8c9a3;
    --wood-1: #9a6a3a;
    --wood-2: #5c3a1e;
    --ink: #2b1c10;
    --board-light: #e9dfc6;
    --board-dark: #45454e;
    --bg-dark: #17140f;
  }
  *{box-sizing:border-box; -webkit-tap-highlight-color:transparent;}
  html,body{margin:0;padding:0;height:100%;overflow:hidden;background:var(--bg-dark);font-family:'Marcellus',serif;}
  #app{position:relative;width:100%;height:100%;max-width:520px;margin:0 auto;overflow:hidden;background:var(--bg-dark);}

  /* checkerboard backdrop */
  .checker-bg{
    position:absolute;inset:0;
    background-image:
      linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.15)),
      repeating-conic-gradient(var(--board-dark) 0% 25%, var(--board-light) 0% 50%);
    background-size: 100% 100%, 25% 25%;
  }
  .checker-bg::after{
    content:"";position:absolute;inset:0;
    background:radial-gradient(ellipse at 50% 20%, rgba(240,185,11,0.10), transparent 60%);
  }

  .topbar{
    position:absolute;top:0;left:0;right:0;height:56px;
    display:flex;align-items:center;padding:0 14px;z-index:20;
    background:linear-gradient(180deg, rgba(10,8,5,0.85), rgba(10,8,5,0));
  }
  .backbtn{
    width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    background:rgba(255,255,255,0.06);border:1px solid rgba(240,185,11,0.35);color:var(--parchment);
    font-size:20px;cursor:pointer;
  }
  .topbar-title{
    color:var(--parchment);font-family:'Cinzel',serif;font-weight:700;letter-spacing:2px;
    font-size:17px;margin-left:12px;text-transform:uppercase;
  }

  .screen{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;}
  .screen.active{display:flex;}

  /* ---------- SCROLL PANEL (shared component) ---------- */
  .scroll-wrap{
    position:relative;margin-top:130px;width:82%;max-width:360px;
    display:flex;flex-direction:column;align-items:center;
  }
  .rod{
    width:112%;height:26px;border-radius:14px;
    background:linear-gradient(180deg,#8a4a1e,#5c2f10 55%,#3c1e0a);
    box-shadow:0 3px 6px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.15);
    position:relative;z-index:3;
  }
  .rod::before,.rod::after{
    content:"";position:absolute;top:-4px;width:20px;height:34px;border-radius:10px;
    background:linear-gradient(180deg,#d8b98a,#8a6a3c);
    box-shadow:inset 0 0 4px rgba(0,0,0,0.4);
  }
  .rod::before{left:-16px;} .rod::after{right:-16px;}

  .knight-emblem{
    position:absolute;top:-58px;left:50%;transform:translateX(-50%);
    width:78px;height:78px;z-index:4;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.5));
  }

  .banner-ribbon{
    position:relative;z-index:2;margin-top:-6px;width:118%;
    background:var(--parchment);
    clip-path:polygon(4% 0%, 96% 0%, 100% 20%, 86% 42%, 100% 64%, 96% 100%, 4% 100%, 8% 64%, 0% 42%, 14% 20%);
    padding:26px 8% 34px;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 6px 14px rgba(0,0,0,0.4);
  }
  .banner-ribbon .banner-inner{
    border-top:2px dashed rgba(122,32,32,0.35);
    border-bottom:2px dashed rgba(122,32,32,0.35);
    padding:6px 4px;width:100%;text-align:center;
  }
  .banner-title{
    font-family:'Cinzel Decorative',serif;font-weight:700;
    font-size:38px;letter-spacing:3px;color:var(--gold-dim);
    -webkit-text-stroke:1px #7a5a0a;
    text-shadow:0 2px 0 #fff8e6, 0 4px 3px rgba(0,0,0,0.25);
    margin:0;
  }
  .banner-sub{
    font-family:'Cinzel',serif;font-size:11px;letter-spacing:4px;color:#8a5a1e;margin-top:2px;
  }

  .maroon-panel{
    position:relative;z-index:1;margin-top:-14px;width:100%;
    background:linear-gradient(180deg,var(--maroon-1),var(--maroon-2));
    border:3px solid var(--parchment-dim);border-top:none;
    padding:34px 22px 26px;
    clip-path: polygon(0 0,100% 0,100% 88%,50% 100%,0 88%);
    display:flex;flex-direction:column;align-items:center;gap:16px;
  }
  .maroon-panel::before{
    content:"";position:absolute;inset:6px;border:1px solid rgba(240,231,205,0.25);
    clip-path: polygon(0 0,100% 0,100% 86%,50% 98%,0 86%);pointer-events:none;
  }

  .wood-btn{
    width:100%;padding:15px 10px;border-radius:26px;
    background:linear-gradient(180deg,#c99356,#8a5a2b 45%,#6b4420);
    border:3px solid var(--parchment-dim);
    color:#fff6e2;font-family:'Cinzel',serif;font-weight:700;font-size:16px;letter-spacing:2px;
    text-align:center;text-transform:uppercase;cursor:pointer;
    box-shadow:0 4px 0 rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,255,255,0.25);
    text-shadow:0 2px 2px rgba(0,0,0,0.5);
    transition:transform .08s ease;
  }
  .wood-btn:active{transform:translateY(2px);box-shadow:0 2px 0 rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,255,255,0.25);}
  .wood-btn.small{font-size:14px;padding:12px 10px;}

  .brand-footer{
    margin-top:auto;margin-bottom:26px;display:flex;align-items:center;gap:8px;
    color:var(--gold);font-family:'Cinzel',serif;font-weight:700;letter-spacing:2px;font-size:15px;
    text-shadow:0 2px 4px rgba(0,0,0,0.6);
  }
  .brand-footer .crown{font-size:18px;}

  .divider{width:70%;text-align:center;color:var(--parchment-dim);opacity:.7;font-size:13px;letter-spacing:3px;}

  /* ---------- ABOUT ---------- */
  .about-body{
    color:var(--parchment);width:84%;max-width:360px;text-align:center;
    font-size:14.5px;line-height:1.7;
  }
  .about-body b{color:var(--gold);}

  /* ---------- GAME SCREEN ---------- */
  .game-screen{padding-top:60px;}
  .game-topcontrols{
    display:flex;justify-content:center;gap:18px;margin-bottom:6px;
  }
  .icon-btn{
    width:52px;height:52px;border-radius:50%;
    background:radial-gradient(circle at 35% 30%, #7a5228, #3c2610 70%);
    border:3px solid var(--parchment-dim);color:var(--parchment);
    display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;
    box-shadow:0 3px 0 rgba(0,0,0,0.4), inset 0 2px 3px rgba(255,255,255,0.15);
  }
  .status-strip{
    color:var(--parchment);font-family:'Cinzel',serif;letter-spacing:1.5px;font-size:13px;
    text-align:center;margin:8px 0 6px;min-height:18px;
  }
  .status-strip .turn-dot{
    display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;vertical-align:middle;
    box-shadow:0 0 4px rgba(0,0,0,0.6);
  }

  .board-wrap{
    display:flex;align-items:center;justify-content:center;gap:4px;padding:0 8px;
  }
  .rank-labels{display:flex;flex-direction:column;}
  .rank-labels div{
    width:14px;flex:1;display:flex;align-items:center;justify-content:center;
    font-size:10px;color:var(--parchment-dim);font-family:'Cinzel',serif;
  }
  .file-labels{display:flex;margin-left:14px;}
  .file-labels div{
    flex:1;text-align:center;font-size:10px;color:var(--parchment-dim);font-family:'Cinzel',serif;padding-top:2px;
  }

  #board{
    display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);
    width:min(88vw,392px);height:min(88vw,392px);
    border:4px solid var(--parchment-dim);border-radius:4px;
    box-shadow:0 8px 20px rgba(0,0,0,0.55);
  }
  .sq{position:relative;display:flex;align-items:center;justify-content:center;font-size:min(8vw,34px);cursor:pointer;user-select:none;}
  .sq.light{background:var(--board-light);}
  .sq.dark{background:#2f2f36;}
  .sq.selected{box-shadow:inset 0 0 0 3px var(--gold);}
  .sq.lastmove{background:rgba(240,185,11,0.35);}
  .sq .dot{width:22%;height:22%;border-radius:50%;background:rgba(20,20,20,0.4);position:absolute;}
  .sq .dot.capture{
    width:100%;height:100%;border-radius:0;background:transparent;
    box-shadow:inset 0 0 0 4px rgba(180,20,20,0.55);
  }
  .sq.check{box-shadow:inset 0 0 0 3px #e23b3b;}
  .piece{filter:drop-shadow(0 2px 2px rgba(0,0,0,0.5));}
  .piece.white{color:#fdf6e3;-webkit-text-stroke:0.6px #6b4a10;}
  .piece.black{color:#171310;-webkit-text-stroke:0.6px #d9c07a;}

  .captured-row{display:flex;gap:2px;min-height:22px;padding:0 10px;font-size:15px;color:var(--parchment-dim);flex-wrap:wrap;justify-content:center;}

  /* ---------- PAUSE OVERLAY ---------- */
  .pause-overlay{
    position:absolute;inset:0;z-index:30;display:none;flex-direction:column;align-items:center;
    background:rgba(8,6,4,0.55);backdrop-filter:blur(1px);
  }
  .pause-overlay.active{display:flex;}

  /* promotion modal */
  .promo-overlay{
    position:absolute;inset:0;z-index:40;display:none;align-items:center;justify-content:center;
    background:rgba(8,6,4,0.7);
  }
  .promo-overlay.active{display:flex;}
  .promo-box{
    background:var(--parchment);border:3px solid var(--gold-dim);border-radius:14px;
    padding:18px;display:flex;gap:12px;box-shadow:0 10px 30px rgba(0,0,0,0.6);
  }
  .promo-choice{
    width:56px;height:56px;border-radius:10px;background:#fff;border:2px solid var(--maroon-1);
    display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;
  }

  .toast{
    position:absolute;left:50%;bottom:30px;transform:translateX(-50%);
    background:var(--maroon-1);color:var(--parchment);padding:10px 20px;border-radius:20px;
    font-family:'Cinzel',serif;font-size:13px;letter-spacing:1px;border:1px solid var(--gold-dim);
    z-index:50;opacity:0;pointer-events:none;transition:opacity .25s ease;box-shadow:0 6px 16px rgba(0,0,0,0.5);
  }
  .toast.show{opacity:1;}

  .result-panel{margin-top:130px;}
  .result-title{font-family:'Cinzel Decorative',serif;font-size:30px;color:var(--gold);text-align:center;margin-bottom:2px;text-shadow:0 3px 6px rgba(0,0,0,0.6);}
  .result-sub{font-family:'Cinzel',serif;font-size:13px;color:var(--parchment-dim);text-align:center;letter-spacing:2px;margin-bottom:18px;}
</style>
</head>
<body>
<div id="app">
  <div class="checker-bg"></div>

  <!-- ================= MENU ================= -->
  <div class="screen active" id="screen-menu">
    <div class="topbar"><span class="topbar-title">Play</span></div>
    <div class="scroll-wrap">
      <svg class="knight-emblem" viewBox="0 0 100 100">
        <path d="M30 92 L30 78 Q26 66 34 58 Q28 50 32 38 Q36 24 52 18 Q70 12 78 26 Q84 36 76 44 Q84 48 82 58 Q80 66 72 68 L72 92 Z"
          fill="#8a5a2b" stroke="#5c3a1e" stroke-width="2"/>
        <circle cx="63" cy="34" r="3" fill="#3c2610"/>
      </svg>
      <div class="rod"></div>
      <div class="banner-ribbon">
        <div class="banner-inner">
          <p class="banner-title">CHESS</p>
          <div class="banner-sub">G I G L I F E</div>
        </div>
      </div>
      <div class="maroon-panel">
        <button class="wood-btn" onclick="goStart('single')">Single Player</button>
        <button class="wood-btn" onclick="goStart('multi')">Multi Player</button>
        <button class="wood-btn" onclick="showScreen('screen-about')">About</button>
      </div>
    </div>
    <div class="brand-footer"><span class="crown">♞</span> GIGLIFE</div>
  </div>

  <!-- ================= START ================= -->
  <div class="screen" id="screen-start">
    <div class="topbar"><span class="backbtn" onclick="showScreen('screen-menu')">‹</span><span class="topbar-title">Play</span></div>
    <div class="scroll-wrap">
      <svg class="knight-emblem" viewBox="0 0 100 100">
        <path d="M30 92 L30 78 Q26 66 34 58 Q28 50 32 38 Q36 24 52 18 Q70 12 78 26 Q84 36 76 44 Q84 48 82 58 Q80 66 72 68 L72 92 Z"
          fill="#8a5a2b" stroke="#5c3a1e" stroke-width="2"/>
        <circle cx="63" cy="34" r="3" fill="#3c2610"/>
      </svg>
      <div class="rod"></div>
      <div class="banner-ribbon">
        <div class="banner-inner">
          <p class="banner-title">CHESS</p>
          <div class="banner-sub" id="mode-label">SINGLE PLAYER</div>
        </div>
      </div>
      <div class="maroon-panel">
        <button class="wood-btn" onclick="startGame()">Start</button>
      </div>
    </div>
    <div class="brand-footer"><span class="crown">♞</span> GIGLIFE</div>
  </div>

  <!-- ================= ABOUT ================= -->
  <div class="screen" id="screen-about">
    <div class="topbar"><span class="backbtn" onclick="showScreen('screen-menu')">‹</span><span class="topbar-title">About</span></div>
    <div class="scroll-wrap" style="margin-top:110px;">
      <svg class="knight-emblem" viewBox="0 0 100 100">
        <path d="M30 92 L30 78 Q26 66 34 58 Q28 50 32 38 Q36 24 52 18 Q70 12 78 26 Q84 36 76 44 Q84 48 82 58 Q80 66 72 68 L72 92 Z"
          fill="#8a5a2b" stroke="#5c3a1e" stroke-width="2"/>
        <circle cx="63" cy="34" r="3" fill="#3c2610"/>
      </svg>
      <div class="rod"></div>
      <div class="banner-ribbon">
        <div class="banner-inner">
          <p class="banner-title" style="font-size:28px;">ABOUT</p>
        </div>
      </div>
      <div class="maroon-panel" style="padding-bottom:34px;">
        <p class="about-body">Full rules chess, built for <b>GigLife</b>.<br><br>
        Play solo against the computer, or pass the phone for two player local matches.<br><br>
        Castling, en passant aur pawn promotion &mdash; sab supported hai.</p>
      </div>
    </div>
    <div class="brand-footer"><span class="crown">♞</span> GIGLIFE</div>
  </div>

  <!-- ================= GAME ================= -->
  <div class="screen game-screen" id="screen-game">
    <div class="topbar">
      <span class="backbtn" onclick="confirmExit()">‹</span>
      <span class="topbar-title" id="game-title">Chess</span>
    </div>
    <div class="game-topcontrols">
      <div class="icon-btn" id="sound-btn" onclick="toggleSound()">🔊</div>
      <div class="icon-btn" onclick="pauseGame()">⏸</div>
    </div>
    <div class="status-strip" id="status-strip"></div>
    <div class="captured-row" id="captured-black"></div>
    <div class="board-wrap">
      <div class="rank-labels" id="rank-labels"></div>
      <div>
        <div id="board"></div>
        <div class="file-labels" id="file-labels"></div>
      </div>
    </div>
    <div class="captured-row" id="captured-white"></div>
  </div>

  <!-- ================= RESULT ================= -->
  <div class="screen" id="screen-result">
    <div class="topbar"><span class="topbar-title">Play</span></div>
    <div class="scroll-wrap result-panel">
      <div class="rod"></div>
      <div class="banner-ribbon">
        <div class="banner-inner">
          <p class="banner-title" id="result-title" style="font-size:26px;">CHECKMATE</p>
        </div>
      </div>
      <div class="maroon-panel">
        <div class="result-sub" id="result-sub">White wins</div>
        <button class="wood-btn" onclick="startGame()">Play Again</button>
        <button class="wood-btn small" onclick="showScreen('screen-menu')">Main Menu</button>
      </div>
    </div>
    <div class="brand-footer"><span class="crown">♞</span> GIGLIFE</div>
  </div>

  <!-- ================= PAUSE OVERLAY ================= -->
  <div class="pause-overlay" id="pause-overlay">
    <div class="topbar">
      <span class="backbtn" onclick="resumeGame()">‹</span>
      <span class="topbar-title">Play</span>
    </div>
    <div class="game-topcontrols">
      <div class="icon-btn" onclick="toggleSound()">🔊</div>
      <div class="icon-btn" style="background:radial-gradient(circle at 35% 30%,#a8801e,#5c4310 70%);">⏸</div>
    </div>
    <div class="scroll-wrap" style="margin-top:70px;">
      <div class="rod"></div>
      <div class="banner-ribbon">
        <div class="banner-inner">
          <p class="banner-title" style="font-size:30px;">PAUSED</p>
        </div>
      </div>
      <div class="maroon-panel">
        <button class="wood-btn" onclick="resumeGame()">Resume</button>
        <button class="wood-btn" onclick="restartGame()">Restart</button>
        <button class="wood-btn" onclick="exitToMenu()">Exit</button>
      </div>
    </div>
    <div class="brand-footer"><span class="crown">♞</span> GIGLIFE</div>
  </div>

  <!-- ================= PROMOTION ================= -->
  <div class="promo-overlay" id="promo-overlay">
    <div class="promo-box" id="promo-box"></div>
  </div>

  <div class="toast" id="toast"></div>
</div>

<script>
/* =========================================================
   GigLife Chess — full rules engine (vanilla JS)
   ========================================================= */
const FILES = ['a','b','c','d','e','f','g','h'];
const PIECE_GLYPH = {
  'K':'♔','Q':'♕','R':'♖','B':'♗','N':'♘','P':'♙',
  'k':'♚','q':'♛','r':'♜','b':'♝','n':'♞','p':'♟'
};
let soundOn = true;

function startingBoard(){
  const b = Array.from({length:8},()=>Array(8).fill(null));
  const back = ['R','N','B','Q','K','B','N','R'];
  for(let c=0;c<8;c++){
    b[0][c] = back[c].toLowerCase(); // rank8 - black
    b[1][c] = 'p';
    b[6][c] = 'P';
    b[7][c] = back[c]; // rank1 - white
  }
  return b;
}

let state = null;
function newState(mode){
  return {
    board: startingBoard(),
    turn:'w',
    mode: mode || 'single', // 'single' | 'multi'
    castling:{wK:true,wQ:true,bK:true,bQ:true},
    epTarget:null, // {r,c}
    history:[],
    captured:{w:[],b:[]}, // pieces captured BY white / BY black
    selected:null,
    legalTargets:[],
    lastMove:null,
    gameOver:false,
    pendingPromotion:null
  };
}

function isWhite(p){return p && p===p.toUpperCase();}
function isBlack(p){return p && p===p.toLowerCase() && p!==p.toUpperCase();}
function colorOf(p){ if(!p) return null; return isWhite(p)?'w':'b'; }
function inBounds(r,c){return r>=0&&r<8&&c>=0&&c<8;}
function cloneBoard(b){return b.map(row=>row.slice());}

function findKing(board,color){
  const target = color==='w'?'K':'k';
  for(let r=0;r<8;r++)for(let c=0;c<8;c++) if(board[r][c]===target) return {r,c};
  return null;
}

function pseudoMovesForSquare(st, r, c, board){
  board = board || st.board;
  const p = board[r][c];
  if(!p) return [];
  const color = colorOf(p);
  const dirColor = color==='w'?-1:1; // white moves up (row decreases)
  const type = p.toUpperCase();
  const moves = [];
  const enemy = (rr,cc)=> inBounds(rr,cc) && board[rr][cc] && colorOf(board[rr][cc])!==color;
  const empty = (rr,cc)=> inBounds(rr,cc) && !board[rr][cc];

  const addSlide = (deltas)=>{
    for(const [dr,dc] of deltas){
      let rr=r+dr, cc=c+dc;
      while(inBounds(rr,cc)){
        if(!board[rr][cc]){ moves.push({from:{r,c},to:{r:rr,c:cc}}); }
        else{ if(colorOf(board[rr][cc])!==color) moves.push({from:{r,c},to:{r:rr,c:cc},capture:true}); break; }
        rr+=dr; cc+=dc;
      }
    }
  };

  if(type==='P'){
    const startRow = color==='w'?6:1;
    const promoRow = color==='w'?0:7;
    if(empty(r+dirColor,c)){
      moves.push({from:{r,c},to:{r:r+dirColor,c},promotion:(r+dirColor===promoRow)});
      if(r===startRow && empty(r+2*dirColor,c)) moves.push({from:{r,c},to:{r:r+2*dirColor,c},double:true});
    }
    for(const dc of [-1,1]){
      const rr=r+dirColor, cc=c+dc;
      if(enemy(rr,cc)) moves.push({from:{r,c},to:{r:rr,c:cc},capture:true,promotion:(rr===promoRow)});
      if(st.epTarget && st.epTarget.r===rr && st.epTarget.c===cc && inBounds(rr,cc) && !board[rr][cc]){
        moves.push({from:{r,c},to:{r:rr,c:cc},capture:true,enpassant:true});
      }
    }
  } else if(type==='N'){
    const deltas=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for(const [dr,dc] of deltas){
      const rr=r+dr, cc=c+dc;
      if(!inBounds(rr,cc)) continue;
      if(!board[rr][cc]) moves.push({from:{r,c},to:{r:rr,c:cc}});
      else if(colorOf(board[rr][cc])!==color) moves.push({from:{r,c},to:{r:rr,c:cc},capture:true});
    }
  } else if(type==='B'){
    addSlide([[-1,-1],[-1,1],[1,-1],[1,1]]);
  } else if(type==='R'){
    addSlide([[-1,0],[1,0],[0,-1],[0,1]]);
  } else if(type==='Q'){
    addSlide([[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
  } else if(type==='K'){
    for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
      if(dr===0&&dc===0) continue;
      const rr=r+dr, cc=c+dc;
      if(!inBounds(rr,cc)) continue;
      if(!board[rr][cc]) moves.push({from:{r,c},to:{r:rr,c:cc}});
      else if(colorOf(board[rr][cc])!==color) moves.push({from:{r,c},to:{r:rr,c:cc},capture:true});
    }
    // castling
    const row = color==='w'?7:0;
    if(r===row && c===4){
      const kFlag = color==='w'?'wK':'bK';
      const qFlag = color==='w'?'wQ':'bQ';
      if(st.castling[kFlag] && !board[row][5] && !board[row][6] && board[row][7]===(color==='w'?'R':'r')){
        if(!isSquareAttacked(board,row,4,color) && !isSquareAttacked(board,row,5,color) && !isSquareAttacked(board,row,6,color)){
          moves.push({from:{r,c},to:{r:row,c:6},castle:'K'});
        }
      }
      if(st.castling[qFlag] && !board[row][1] && !board[row][2] && !board[row][3] && board[row][0]===(color==='w'?'R':'r')){
        if(!isSquareAttacked(board,row,4,color) && !isSquareAttacked(board,row,3,color) && !isSquareAttacked(board,row,2,color)){
          moves.push({from:{r,c},to:{r:row,c:2},castle:'Q'});
        }
      }
    }
  }
  return moves;
}

function isSquareAttacked(board, r, c, byColorIsVictimColor){
  // byColorIsVictimColor = color of the piece potentially standing there; we check if enemy attacks it
  const victim = byColorIsVictimColor;
  const attacker = victim==='w'?'b':'w';
  // knight
  const nDeltas=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  for(const [dr,dc] of nDeltas){
    const rr=r+dr, cc=c+dc;
    if(inBounds(rr,cc) && board[rr][cc] && colorOf(board[rr][cc])===attacker && board[rr][cc].toUpperCase()==='N') return true;
  }
  // king
  for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
    if(dr===0&&dc===0) continue;
    const rr=r+dr, cc=c+dc;
    if(inBounds(rr,cc) && board[rr][cc] && colorOf(board[rr][cc])===attacker && board[rr][cc].toUpperCase()==='K') return true;
  }
  // pawns
  const pawnDir = attacker==='w'?1:-1; // attacker pawn sits at r+pawnDir relative? white pawn attacks upward (r-1); so from victim square, attacker white pawn is at r+1
  for(const dc of [-1,1]){
    const rr = r + (attacker==='w'?1:-1);
    const cc = c+dc;
    if(inBounds(rr,cc) && board[rr][cc] && colorOf(board[rr][cc])===attacker && board[rr][cc].toUpperCase()==='P') return true;
  }
  // sliding: rook/queen
  const straight=[[-1,0],[1,0],[0,-1],[0,1]];
  for(const [dr,dc] of straight){
    let rr=r+dr, cc=c+dc;
    while(inBounds(rr,cc)){
      const pc = board[rr][cc];
      if(pc){
        if(colorOf(pc)===attacker && (pc.toUpperCase()==='R'||pc.toUpperCase()==='Q')) return true;
        break;
      }
      rr+=dr; cc+=dc;
    }
  }
  const diag=[[-1,-1],[-1,1],[1,-1],[1,1]];
  for(const [dr,dc] of diag){
    let rr=r+dr, cc=c+dc;
    while(inBounds(rr,cc)){
      const pc = board[rr][cc];
      if(pc){
        if(colorOf(pc)===attacker && (pc.toUpperCase()==='B'||pc.toUpperCase()==='Q')) return true;
        break;
      }
      rr+=dr; cc+=dc;
    }
  }
  return false;
}

function applyMove(st, move, board){
  board = board || st.board;
  const b = board;
  const piece = b[move.from.r][move.from.c];
  const color = colorOf(piece);
  let capturedPiece = b[move.to.r][move.to.c];

  // en passant capture
  if(move.enpassant){
    const capR = move.from.r; const capC = move.to.c;
    capturedPiece = b[capR][capC];
    b[capR][capC] = null;
  }

  b[move.to.r][move.to.c] = piece;
  b[move.from.r][move.from.c] = null;

  // promotion
  if(move.promotion){
    const promoPiece = move.promoteTo || (color==='w'?'Q':'q');
    b[move.to.r][move.to.c] = color==='w'?promoPiece.toUpperCase():promoPiece.toLowerCase();
  }

  // castle rook move
  if(move.castle==='K'){
    const row = move.to.r;
    b[row][5] = b[row][7]; b[row][7]=null;
  } else if(move.castle==='Q'){
    const row = move.to.r;
    b[row][3] = b[row][0]; b[row][0]=null;
  }

  return capturedPiece;
}

function updateCastlingRights(st, move, pieceMoved){
  const p = pieceMoved;
  if(p==='K'){ st.castling.wK=false; st.castling.wQ=false; }
  if(p==='k'){ st.castling.bK=false; st.castling.bQ=false; }
  if(move.from.r===7 && move.from.c===0) st.castling.wQ=false;
  if(move.from.r===7 && move.from.c===7) st.castling.wK=false;
  if(move.from.r===0 && move.from.c===0) st.castling.bQ=false;
  if(move.from.r===0 && move.from.c===7) st.castling.bK=false;
  if(move.to.r===7 && move.to.c===0) st.castling.wQ=false;
  if(move.to.r===7 && move.to.c===7) st.castling.wK=false;
  if(move.to.r===0 && move.to.c===0) st.castling.bQ=false;
  if(move.to.r===0 && move.to.c===7) st.castling.bK=false;
}

function legalMovesForColor(st, color, board){
  board = board || st.board;
  let all = [];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p = board[r][c];
    if(p && colorOf(p)===color){
      all = all.concat(pseudoMovesForSquare(st,r,c,board));
    }
  }
  // filter: simulate, king must not be in check afterwards
  const legal = [];
  for(const m of all){
    const testBoard = cloneBoard(board);
    const savedEp = st.epTarget;
    applyMove(st, m, testBoard);
    const kingPos = findKing(testBoard, color);
    if(kingPos && !isSquareAttacked(testBoard, kingPos.r, kingPos.c, color)){
      legal.push(m);
    }
  }
  return legal;
}

function isInCheck(st, color, board){
  board = board || st.board;
  const k = findKing(board,color);
  if(!k) return false;
  return isSquareAttacked(board,k.r,k.c,color);
}

/* ---------------- Simple AI (minimax + alpha-beta) ---------------- */
const VALUES = {P:100,N:320,B:330,R:500,Q:900,K:20000};
const PST_PAWN = [
  [0,0,0,0,0,0,0,0],
  [50,50,50,50,50,50,50,50],
  [10,10,20,30,30,20,10,10],
  [5,5,10,25,25,10,5,5],
  [0,0,0,20,20,0,0,0],
  [5,-5,-10,0,0,-10,-5,5],
  [5,10,10,-20,-20,10,10,5],
  [0,0,0,0,0,0,0,0]
];
function evaluateBoard(board){
  let score = 0;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p = board[r][c];
    if(!p) continue;
    const val = VALUES[p.toUpperCase()];
    let posBonus = 0;
    if(p.toUpperCase()==='P'){
      posBonus = isWhite(p) ? PST_PAWN[r][c] : PST_PAWN[7-r][c];
    } else {
      const centerDist = Math.abs(3.5-r)+Math.abs(3.5-c);
      posBonus = (7-centerDist)*2;
    }
    score += isWhite(p) ? (val+posBonus) : -(val+posBonus);
  }
  return score;
}

function minimax(st, board, depth, alpha, beta, color, epTargetSim){
  const savedEp = st.epTarget;
  st.epTarget = epTargetSim;
  const moves = legalMovesForColor(st, color, board);
  if(depth===0 || moves.length===0){
    let val;
    if(moves.length===0){
      const inCheck = isInCheck(st,color,board);
      val = inCheck ? (color==='w'? -99000+depth*10 : 99000-depth*10) : 0;
    } else {
      val = evaluateBoard(board);
    }
    st.epTarget = savedEp;
    return {score: val};
  }
  let best = null;
  const maximizing = color==='w';
  let bestScore = maximizing ? -Infinity : Infinity;
  for(const m of moves){
    const testBoard = cloneBoard(board);
    let newEp = null;
    const piece = testBoard[m.from.r][m.from.c];
    if(m.double){ newEp = {r:(m.from.r+m.to.r)/2, c:m.from.c}; }
    applyMove(st, m, testBoard);
    const res = minimax(st, testBoard, depth-1, alpha, beta, color==='w'?'b':'w', newEp);
    const score = res.score;
    if(maximizing){
      if(score>bestScore){bestScore=score; best=m;}
      alpha = Math.max(alpha,score);
    } else {
      if(score<bestScore){bestScore=score; best=m;}
      beta = Math.min(beta,score);
    }
    if(beta<=alpha) break;
  }
  st.epTarget = savedEp;
  return {score:bestScore, move:best};
}

function aiMove(st){
  const depth = 2; // solid strength, fast on mobile
  const savedEp = st.epTarget;
  const result = minimax(st, st.board, depth, -Infinity, Infinity, 'b', st.epTarget);
  st.epTarget = savedEp;
  if(result.move) return result.move;
  const legal = legalMovesForColor(st,'b');
  return legal[Math.floor(Math.random()*legal.length)];
}

/* ==================== UI wiring ==================== */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('pause-overlay').classList.remove('active');
}

let pendingMode = 'single';
function goStart(mode){
  pendingMode = mode;
  document.getElementById('mode-label').textContent = mode==='single' ? 'SINGLE PLAYER' : 'MULTI PLAYER';
  showScreen('screen-start');
}

function startGame(){
  state = newState(pendingMode);
  showScreen('screen-game');
  document.getElementById('game-title').textContent = pendingMode==='single' ? 'vs Computer' : 'Multiplayer';
  renderLabels();
  renderBoard();
  updateStatus();
}

function restartGame(){
  state = newState(state.mode);
  document.getElementById('pause-overlay').classList.remove('active');
  renderBoard();
  updateStatus();
}
function pauseGame(){ document.getElementById('pause-overlay').classList.add('active'); }
function resumeGame(){ document.getElementById('pause-overlay').classList.remove('active'); }
function exitToMenu(){ document.getElementById('pause-overlay').classList.remove('active'); showScreen('screen-menu'); }
function confirmExit(){ showScreen('screen-menu'); }
function toggleSound(){
  soundOn = !soundOn;
  document.querySelectorAll('#sound-btn').forEach(b=>b.textContent = soundOn?'🔊':'🔇');
}

function renderLabels(){
  const rankLabels = document.getElementById('rank-labels');
  const fileLabels = document.getElementById('file-labels');
  rankLabels.innerHTML=''; fileLabels.innerHTML='';
  for(let r=0;r<8;r++){
    const d = document.createElement('div'); d.textContent = 8-r; rankLabels.appendChild(d);
  }
  for(let c=0;c<8;c++){
    const d = document.createElement('div'); d.textContent = FILES[c]; fileLabels.appendChild(d);
  }
}

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove('show'), 1600);
}

function renderBoard(){
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  const inCheckColor = isInCheck(state, state.turn) ? state.turn : null;
  const kingPos = inCheckColor ? findKing(state.board, inCheckColor) : null;

  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const sq = document.createElement('div');
      sq.className = 'sq ' + ((r+c)%2===0 ? 'light':'dark');
      sq.dataset.r = r; sq.dataset.c = c;

      if(state.lastMove && ((state.lastMove.from.r===r&&state.lastMove.from.c===c)||(state.lastMove.to.r===r&&state.lastMove.to.c===c))){
        sq.classList.add('lastmove');
      }
      if(state.selected && state.selected.r===r && state.selected.c===c){
        sq.classList.add('selected');
      }
      if(kingPos && kingPos.r===r && kingPos.c===c){
        sq.classList.add('check');
      }

      const piece = state.board[r][c];
      if(piece){
        const span = document.createElement('span');
        span.className = 'piece ' + (isWhite(piece)?'white':'black');
        span.textContent = PIECE_GLYPH[piece];
        sq.appendChild(span);
      }

      const target = state.legalTargets.find(m=>m.to.r===r && m.to.c===c);
      if(target){
        const dot = document.createElement('div');
        dot.className = 'dot' + (target.capture||target.enpassant ? ' capture':'');
        sq.appendChild(dot);
      }

      sq.addEventListener('click', onSquareClick);
      boardEl.appendChild(sq);
    }
  }
  renderCaptured();
}

function renderCaptured(){
  const bEl = document.getElementById('captured-black');
  const wEl = document.getElementById('captured-white');
  bEl.innerHTML = state.captured.w.map(p=>PIECE_GLYPH[p]).join(' ');
  wEl.innerHTML = state.captured.b.map(p=>PIECE_GLYPH[p]).join(' ');
}

function updateStatus(){
  const el = document.getElementById('status-strip');
  const color = state.turn==='w' ? 'White' : 'Black';
  const dotColor = state.turn==='w' ? '#f3e7cd' : '#171310';
  const check = isInCheck(state, state.turn) ? ' — Check!' : '';
  el.innerHTML = \`<span class="turn-dot" style="background:\${dotColor};border:1px solid #f0b90b;"></span>\${color} to move\${check}\`;
}

function onSquareClick(e){
  if(state.gameOver) return;
  if(state.mode==='single' && state.turn==='b') return; // AI's turn
  const r = parseInt(e.currentTarget.dataset.r);
  const c = parseInt(e.currentTarget.dataset.c);
  const piece = state.board[r][c];

  // if a target square was clicked
  if(state.selected){
    const move = state.legalTargets.find(m=>m.to.r===r && m.to.c===c);
    if(move){
      makeMove(move);
      return;
    }
  }

  if(piece && colorOf(piece)===state.turn){
    state.selected = {r,c};
    state.legalTargets = legalMovesForColor(state, state.turn).filter(m=>m.from.r===r && m.from.c===c);
  } else {
    state.selected = null;
    state.legalTargets = [];
  }
  renderBoard();
}

function makeMove(move){
  const piece = state.board[move.from.r][move.from.c];
  const pieceType = piece.toUpperCase();
  const color = colorOf(piece);

  if(move.promotion && !move.promoteTo){
    // ask for promotion choice
    state.pendingPromotion = move;
    openPromotionModal(color);
    return;
  }

  const newEp = move.double ? {r:(move.from.r+move.to.r)/2, c:move.from.c} : null;
  const captured = applyMove(state, move, state.board);
  if(captured){
    if(colorOf(captured)==='w') state.captured.b.push(captured); else state.captured.w.push(captured);
  }
  updateCastlingRights(state, move, pieceType===('K')?piece:piece);
  state.epTarget = newEp;
  state.turn = state.turn==='w' ? 'b' : 'w';
  state.selected = null;
  state.legalTargets = [];
  state.lastMove = move;
  state.history.push(move);

  renderBoard();
  updateStatus();
  checkGameEnd();

  if(!state.gameOver && state.mode==='single' && state.turn==='b'){
    setTimeout(()=>{
      const m = aiMove(state);
      if(m){
        if(m.promotion) m.promoteTo = 'q';
        makeMove(m);
      }
    }, 350);
  }
}

function openPromotionModal(color){
  const box = document.getElementById('promo-box');
  box.innerHTML = '';
  const choices = color==='w' ? ['Q','R','B','N'] : ['q','r','b','n'];
  choices.forEach(ch=>{
    const d = document.createElement('div');
    d.className = 'promo-choice';
    d.textContent = PIECE_GLYPH[ch];
    d.style.color = color==='w' ? '#2b1c10' : '#2b1c10';
    d.onclick = ()=>{
      document.getElementById('promo-overlay').classList.remove('active');
      const move = state.pendingPromotion;
      move.promoteTo = ch;
      state.pendingPromotion = null;
      makeMove(move);
    };
    box.appendChild(d);
  });
  document.getElementById('promo-overlay').classList.add('active');
}

function checkGameEnd(){
  const legal = legalMovesForColor(state, state.turn);
  if(legal.length===0){
    state.gameOver = true;
    const inCheck = isInCheck(state, state.turn);
    const resultTitle = document.getElementById('result-title');
    const resultSub = document.getElementById('result-sub');
    if(inCheck){
      resultTitle.textContent = 'CHECKMATE';
      resultSub.textContent = (state.turn==='w' ? 'Black' : 'White') + ' wins';
    } else {
      resultTitle.textContent = 'STALEMATE';
      resultSub.textContent = 'Draw';
    }
    setTimeout(()=>showScreen('screen-result'), 700);
  }
}
</script>
</body>
</html>
`;

export default function ChessGame({ onBack }) {
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
        title="ChessGame"
        srcDoc={GAME_HTML}
        style={{ border: 'none', width: '100%', height: '100%', flex: 1 }}
        allow="autoplay"
      />
    </div>
  );
}

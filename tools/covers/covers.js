// Cover renderer, run by render.sh: reuses the game's globals (ctx, W, H, drawEros, drawNEAR, ...). ?cover=1..6
stage = 99; // stop the game loop from drawing
const F = (w,s) => `${w} ${s}px "Baloo 2", Nunito, sans-serif`;
function title(txt,x,y,size,align='left',col='#fff'){
  ctx.font=F(800,size); ctx.textAlign=align; ctx.textBaseline='alphabetic'; ctx.lineJoin='round';
  ctx.lineWidth=size*.16; ctx.strokeStyle='rgba(7,11,36,.9)'; ctx.strokeText(txt,x,y);
  ctx.fillStyle=col; ctx.fillText(txt,x,y);
}
function sub(txt,x,y,size,align='left',col='#d9e0ff'){
  ctx.font=F(700,size); ctx.textAlign=align; ctx.lineJoin='round';
  ctx.lineWidth=size*.22; ctx.strokeStyle='rgba(7,11,36,.85)'; ctx.strokeText(txt,x,y);
  ctx.fillStyle=col; ctx.fillText(txt,x,y);
}
function pill(txt,x,y,size=22,align='left'){
  ctx.font=F(700,size); const w=ctx.measureText(txt).width+size*1.4, h=size*1.75, x0=align==='center'?x-w/2:x;
  ctx.fillStyle='rgba(14,22,58,.88)'; ctx.strokeStyle='rgba(255,196,77,.85)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(x0,y-h/2,w,h,h/2); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#ffc44d'; ctx.textAlign='left'; ctx.textBaseline='middle'; ctx.fillText(txt,x0+size*.7,y+1); ctx.textBaseline='alphabetic';
}
function earth(ex,ey,er){
  const g=ctx.createRadialGradient(ex-er*.3,ey-er*.3,er*.1,ex,ey,er); g.addColorStop(0,'#8fd3ff'); g.addColorStop(.6,'#2b6fd6'); g.addColorStop(1,'#0b2a66');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(ex,ey,er,0,7); ctx.fill();
  ctx.fillStyle='rgba(80,180,90,.8)'; ctx.beginPath(); ctx.ellipse(ex-er*.2,ey-er*.1,er*.35,er*.22,.5,0,7); ctx.fill(); ctx.beginPath(); ctx.ellipse(ex+er*.35,ey+er*.25,er*.2,er*.3,-.3,0,7); ctx.fill();
  ctx.strokeStyle='rgba(140,200,255,.4)'; ctx.lineWidth=8; ctx.beginPath(); ctx.arc(ex,ey,er+5,0,7); ctx.stroke();
}
function sunGlow(x,y,r){
  const sg=ctx.createRadialGradient(x,y,0,x,y,r); sg.addColorStop(0,'rgba(255,240,200,.9)'); sg.addColorStop(.15,'rgba(255,220,150,.35)'); sg.addColorStop(1,'rgba(255,200,120,0)');
  ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);
}

const COVERS = [
  // 1 · Hero: Eros + NEAR in orbit, title on the left
  ()=>{
    bg(); drawStars(0,0); sunGlow(W*.95,H*.05,260);
    ctx.strokeStyle='rgba(94,224,255,.25)'; ctx.setLineDash([8,10]); ctx.lineWidth=2;
    ctx.beginPath(); ctx.ellipse(W*.7,H*.56,W*.3,H*.3,-.3,0,7); ctx.stroke(); ctx.setLineDash([]);
    drawEros(W*.7,H*.56,W*.26,-.35,true);
    drawNEAR(W*.47,H*.25,34,.5,0);
    pill('Real space mission · 1996–2001',64,110);
    title('Mission',60,250,128); title('to Eros',60,375,128,'left','#ffc44d');
    sub('Fly · Explore · Land on an asteroid',64,450,36);
  },
  // 2 · Launch: Delta II leaving the pad
  ()=>{
    paused=true; s1={intro:{t:0,beeps:4,puffs:[]}};
    for(let i=0;i<84;i++) updateIntro(s1,.05);
    drawIntro(0);
    title('Mission to Eros',W/2,118,104,'center');
    sub('3 · 2 · 1 · Liftoff!  A real NASA space adventure',W/2,172,32,'center','#fff');
  },
  // 3 · Landing: NEAR descending into the Himeros saddle
  ()=>{
    bg(); drawStars(0,0); sunGlow(W*.9,H*.12,300);
    drawEros(W*.5,H*1.25,W*1.1,0,true);
    const lx=W*.78, ly=338;
    ctx.strokeStyle='#5df29a'; ctx.lineWidth=3; ctx.setLineDash([10,8]); ctx.beginPath(); ctx.ellipse(lx,ly,90,16,0,0,7); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='rgba(93,242,154,.18)'; ctx.fill();
    drawNEAR(lx,190,46,0,1,'down');
    pill('Mission to Eros',64,96);
    title('Can you land',60,215,92); title('on an asteroid?',60,310,92,'left','#ffc44d');
    sub('NASA did it in 2001 — now it’s your turn',64,372,32);
  },
  // 4 · Journey: Earth → flasks → Eros
  ()=>{
    bg(); drawStars(0,0);
    earth(150,470,110);
    const P0=[220,400], C=[600,140], P1=[1000,400], at=t=>[(1-t)*(1-t)*P0[0]+2*(1-t)*t*C[0]+t*t*P1[0], (1-t)*(1-t)*P0[1]+2*(1-t)*t*C[1]+t*t*P1[1]];
    ctx.strokeStyle='rgba(255,196,77,.7)'; ctx.lineWidth=4; ctx.setLineDash([4,14]); ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(...P0); ctx.quadraticCurveTo(...C,...P1); ctx.stroke(); ctx.setLineDash([]);
    drawEros(1020,420,150,-.35,true);
    [[.22,0,-34],[.36,1,30],[.7,2,-30],[.82,3,34]].forEach(([t,s,dy])=>{ const [x,y]=at(t); drawFlask(x,y+dy,26,.3+s,s); });
    drawRock(470,470,22,1,5); drawRock(760,520,16,2,9);
    const [nx,ny]=at(.53), [mx,my]=at(.56); drawNEAR(nx,ny,32,Math.atan2(my-ny,mx-nx),1,'back');
    title('Mission to Eros',W/2,96,96,'center');
    sub('Fly from Earth to an asteroid — the real NASA journey',W/2,590,32,'center','#fff');
  },
  // 5 · Poster: giant Eros, big centred title
  ()=>{
    bg(); drawStars(0,0); sunGlow(W*.1,H*.1,320);
    drawEros(W*.55,H*.82,W*.62,-.18,true);
    const fade=ctx.createLinearGradient(0,0,0,H*.5); fade.addColorStop(0,'rgba(5,8,23,.85)'); fade.addColorStop(1,'rgba(5,8,23,0)');
    ctx.fillStyle=fade; ctx.fillRect(0,0,W,H*.5);
    drawNEAR(W*.82,H*.44,24,.4,0);
    sub('433 EROS · 34 KM OF SPACE ROCK',W/2,74,26,'center','#ffc44d');
    title('Mission to Eros',W/2,180,130,'center');
    sub('Fly it. Explore it. Land on it.',W/2,240,38,'center','#fff');
    pill('🚀 1996 Launch   ·   🛰️ 2000 Orbit   ·   🏅 2001 Landing',W/2,575,26,'center');
  },
  // 6 · Hero, mobile portrait (1080×1920)
  ()=>{
    bg(); drawStars(0,0); sunGlow(W*.95,H*.03,460);
    ctx.strokeStyle='rgba(94,224,255,.25)'; ctx.setLineDash([12,14]); ctx.lineWidth=3;
    ctx.beginPath(); ctx.ellipse(W*.5,H*.66,500,300,-1,0,7); ctx.stroke(); ctx.setLineDash([]);
    drawEros(W*.5,H*.66,440,-1,true);
    drawNEAR(W*.2,H*.52,56,.5,0);
    pill('Real space mission · 1996–2001',W/2,220,36,'center');
    title('Mission',W/2,450,200,'center'); title('to Eros',W/2,640,200,'center','#ffc44d');
    sub('Fly · Explore · Land on an asteroid',W/2,745,50,'center');
    sub('Play free in your browser',W/2,1810,46,'center','#ffc44d');
  }
];
const SIZES = {6:[1080,1920]};
// visible SI/AI disclosure required by the NASA Space Apps rules for generated images
function watermark(){
  const s=H>W?30:18, txt='🤖 Made with AI assistance';
  ctx.font=F(700,s); const w=ctx.measureText(txt).width+s*1.2, h=s*1.7, x=W-w-s, y=H-h-s;
  ctx.fillStyle='rgba(7,11,36,.75)'; ctx.beginPath(); ctx.roundRect(x,y,w,h,h/2); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.85)'; ctx.textAlign='left'; ctx.textBaseline='middle'; ctx.fillText(txt,x+s*.6,y+h/2+1); ctx.textBaseline='alphabetic';
}
(async()=>{
  await Promise.all([document.fonts.load(F(800,80)), document.fonts.load('800 80px Nunito')]);
  const n=+new URLSearchParams(location.search).get('cover')||1;
  [W,H]=SIZES[n]||[1200,630]; cv.width=W; cv.height=H; ctx.setTransform(1,0,0,1,0,0); // exact size, whatever the window is
  COVERS[n-1](); watermark();
  // freeze the result: a later resize() would clear the canvas
  const img=new Image(); img.src=cv.toDataURL('image/png');
  img.style.cssText=`position:fixed;left:0;top:0;width:${W}px;height:${H}px;z-index:9`;
  document.body.appendChild(img);
  document.title='ready';
})();

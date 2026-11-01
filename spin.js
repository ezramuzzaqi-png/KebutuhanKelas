/* ===== Roda ===== */
const cv=$('wheel'),ctx=cv.getContext('2d');
let pool=[...siswaAwal],angle=0,spinning=false,hist=[];
function size(){const r=cv.getBoundingClientRect(),d=window.devicePixelRatio||1;if(!r.width)return;cv.width=r.width*d;cv.height=r.height*d;draw()}
function lbl(t,x){ctx.lineJoin='round';ctx.lineWidth=cv.width/300;ctx.strokeStyle='rgba(0,0,0,.7)';ctx.strokeText(t,x,0);ctx.fillText(t,x,0)}
function draw(){
  const W=cv.width,c=W/2,R=c-4,n=pool.length;ctx.clearRect(0,0,W,W);$('hub').style.visibility=n?'visible':'hidden';
  if(!n){ctx.fillStyle='#888';ctx.font=`${W/16}px sans-serif`;ctx.textAlign='center';ctx.fillText('Semua sudah terpilih',c,c);return}
  const arc=2*Math.PI/n,pi=Math.floor(((((-Math.PI/2-angle)%(2*Math.PI))+2*Math.PI)%(2*Math.PI))/arc);
  if(spinning&&pool[pi])$('tick').textContent=pool[pi].absen+' – '+pool[pi].nama;
  for(let i=0;i<n;i++){
    const a=angle+i*arc;
    ctx.beginPath();ctx.moveTo(c,c);ctx.arc(c,c,R,a,a+arc);ctx.closePath();
    ctx.fillStyle=i===pi?'#d97706':`hsl(${(i*47)%360},72%,${i%2?32:42}%)`;ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1;ctx.stroke();
    ctx.save();ctx.translate(c,c);ctx.rotate(a+arc/2);
    ctx.fillStyle='#fff';ctx.textAlign='right';ctx.textBaseline='middle';
    if($('mode').value==='nama'){
      let t=pool[i].nama.split(' ')[0];ctx.font='bold 100px sans-serif';const w100=ctx.measureText(t).width,Rm=R-W/40,f=Math.min(W/16,.85*arc*Rm/(1+.85*arc*w100/100));ctx.font=`bold ${f}px sans-serif`;
      const mx=R*.9;
      while(ctx.measureText(t).width>mx&&t.length>4)t=t.slice(0,-2).trimEnd()+'…';
      lbl(t,R-W/40);
    }else{
      ctx.font=`bold ${Math.min(W/14,R*arc*.9)}px sans-serif`;
      lbl(pool[i].absen,R-W/40);
    }
    ctx.restore();
  }
  ctx.beginPath();ctx.arc(c,c,W/12,0,7);ctx.fillStyle='#fff';ctx.fill();
}
function spin(){
  if(spinning||!pool.length)return;spinning=true;$('hub').disabled=true;
  const n=pool.length,arc=2*Math.PI/n,idx=Math.floor(Math.random()*n);
  const jitter=(Math.random()-.5)*arc*.7;
  const tgt=-Math.PI/2-(idx+.5)*arc+jitter;
  const turns=Math.ceil((angle-tgt)/(2*Math.PI))+6;
  const end=tgt+turns*2*Math.PI,start=angle,dur=5000,t0=performance.now();
  (function f(t){
    const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,4);
    angle=start+(end-start)*e;draw();
    if(p<1)return requestAnimationFrame(f);
    spinning=false;$('hub').disabled=false;pick(idx);
  })(t0);
}
function pick(i){
  const s=pool[i];$('num').textContent=s.absen;$('nm').textContent=s.nama;$('tick').textContent='Terpilih: '+s.absen+' – '+s.nama;
  hist.unshift(s);
  if($('norep').checked){pool.splice(i,1);angle=0}
  draw();list();
}
function list(){
  $('hist').innerHTML=hist.map(s=>`<li><b>${s.absen}</b> – ${s.nama}</li>`).join('');
  $('left').textContent=`Sisa di roda: ${pool.length} dari ${siswaAwal.length}`;
}
$('hub').onclick=spin;
$('mode').onchange=()=>draw();
$('rst').onclick=()=>{pool=[...siswaAwal];hist=[];angle=0;$('num').textContent='–';$('nm').textContent='Putar rodanya';$('tick').textContent='Siap diputar';draw();list()};
addEventListener('resize',size);

size();list();
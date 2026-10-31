const siswaAwal=[
{absen:1,nama:"Abdul Azis Mahmudin"},{absen:2,nama:"Ahmad Daffa"},{absen:3,nama:"Akmal Maulana Nasir"},{absen:4,nama:"Allia Eka Fadilah"},{absen:5,nama:"Anisa Nur Febrianti"},{absen:6,nama:"Avicena Fathoni Fawwaz"},{absen:7,nama:"Azahra Syifa Alfiani"},{absen:8,nama:"Berly Muhammad Furqon"},{absen:9,nama:"Chindy Adyla"},{absen:10,nama:"Denikbar Priambada"},{absen:11,nama:"Dinda Rizkika Kholifatunnisa"},{absen:12,nama:"Edgar Dhamas Putra"},{absen:13,nama:"Ezra Muzaqi"},{absen:14,nama:"Fazril Rizki Akbar"},{absen:15,nama:"Filza Wiwahyu Abadan"},{absen:16,nama:"Firly Nur Asri Pratiwi"},{absen:17,nama:"Gibran Vargan Alfahrezi"},{absen:18,nama:"Hasbi Yusuf"},{absen:19,nama:"Hasna Fathiya Rahma"},{absen:20,nama:"Insan Kamil Kusuma Wijaya"},{absen:21,nama:"Intan Juliyanti"},{absen:22,nama:"Jihan Carlen Aurelia"},{absen:23,nama:"Kayla Rizky Ramadhanti Nurhamzah"},{absen:24,nama:"Maharani Sundari"},{absen:25,nama:"Mahendra Febrian"},{absen:26,nama:"Maula Ahmad Syahid"},{absen:27,nama:"Meylisa Handayani"},{absen:28,nama:"Mochamad Alviandi Ridwan"},{absen:29,nama:"Muhamad Rido Alfaregi"},{absen:30,nama:"M.Danish Alexa"},{absen:31,nama:"M.Hamzah Maulana"},{absen:32,nama:"M.Ozikri Lammasyum"},{absen:33,nama:"M.Rizki Akbar"},{absen:34,nama:"Novika Sari"},{absen:35,nama:"Rafli Andriandi"},{absen:36,nama:"Raissa Nadhifatul Azhar Hidayatulloh"},{absen:37,nama:"Rakean Fatanjala Drajat"},{absen:38,nama:"Ravasha Alsan Naufal"},{absen:39,nama:"Raykhan Ali"},{absen:40,nama:"Rezky Zamam Fasya"},{absen:41,nama:"Rizky Hadiansyah Ramadhan"},{absen:42,nama:"Sabiq Akma Fadillah"},{absen:43,nama:"Salma Nurhana Sabila"},{absen:44,nama:"Shiva Novita"},{absen:45,nama:"Syahdan Maulana Rafansyah"},{absen:46,nama:"Tasya Amalia Putri"},{absen:47,nama:"Willy Oktapian Mutaqin"},{absen:48,nama:"Wulan Khoirunnisa"},{absen:49,nama:"Zacky Putra Pratama Sopian"}];

const byAbsen=Object.fromEntries(siswaAwal.map(s=>[s.absen,s]));
const $=id=>document.getElementById(id);

/* ===== Halaman (tab) ===== */
const TUGAS={pagi:'Piket Pagi',mbg:'Petugas MBG',pulang:'Piket Pulang'};
function page(){
  const h=location.hash.slice(1),p=(h==='spin'||HARI.some(d=>d.toLowerCase()===h))?h:'spin';
  document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x.dataset.t===p));
  $('spin').classList.toggle('hidden',p!=='spin');
  $('piket').classList.toggle('hidden',p==='spin');
  if(p==='spin')size();else{cur=HARI.findIndex(d=>d.toLowerCase()===p);renderPiket()}
}
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{location.hash=b.dataset.t;page()});
addEventListener('hashchange',page);

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
  if(spinning||!pool.length)return;spinning=true;$('go').disabled=true;$('hub').disabled=true;
  const n=pool.length,arc=2*Math.PI/n,idx=Math.floor(Math.random()*n);
  const jitter=(Math.random()-.5)*arc*.7;
  const tgt=-Math.PI/2-(idx+.5)*arc+jitter;
  const turns=Math.ceil((angle-tgt)/(2*Math.PI))+6;
  const end=tgt+turns*2*Math.PI,start=angle,dur=5000,t0=performance.now();
  (function f(t){
    const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,4);
    angle=start+(end-start)*e;draw();
    if(p<1)return requestAnimationFrame(f);
    spinning=false;$('go').disabled=false;$('hub').disabled=false;pick(idx);
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
$('go').onclick=$('hub').onclick=spin;
$('mode').onchange=()=>draw();
$('rst').onclick=()=>{pool=[...siswaAwal];hist=[];angle=0;$('num').textContent='–';$('nm').textContent='Putar rodanya';$('tick').textContent='Siap diputar';draw();list()};
addEventListener('resize',size);

/* ===== Piket ===== */
const HARI=['Senin','Selasa','Rabu','Kamis'];
/* ===== NAMA PIKET TIAP HARI (isi dengan nomor absen) ===== */
const jadwalHari={
 Senin:[1,2,3,4,5,6,7,8,9,10,11,12],
 Selasa:[13,14,15,16,17,18,19,20,21,22,23,24],
 Rabu:[25,26,27,28,29,30,31,32,33,34,35,36],
 Kamis:[37,38,39,40,41,42,43,44,45,46,47,48,49]
};
let cur=0,grup=JSON.parse(JSON.stringify(jadwalHari)),cnt={};
HARI.forEach(h=>{const n=grup[h].length,b=Math.floor(n/3);cnt[h]={pagi:b,mbg:b,pulang:n-2*b}});
try{const d=JSON.parse(localStorage.getItem('piket2')||'null');if(d)HARI.forEach(h=>{if(d.grup&&d.grup[h]&&d.grup[h].length===grup[h].length)grup[h]=d.grup[h];if(d.cnt&&d.cnt[h])cnt[h]=d.cnt[h]})}catch(e){}
function save(){try{localStorage.setItem('piket2',JSON.stringify({cnt,grup}))}catch(e){}}
/* tiap hari punya kelompok tetap (jadwalHari); nama diambil berurutan untuk pagi, lalu MBG, lalu pulang; sisanya masuk Belum dapat tugas */
function renderPiket(){
  const h=HARI[cur],g=grup[h],c=cnt[h],per=c.pagi+c.mbg+c.pulang,now=HARI[new Date().getDay()-1];
  $('ptitle').textContent=h+(h===now?' · Hari ini':'');
  $('tot').textContent=`${g.length} orang piket hari ${h}.`+(per>g.length?' Jumlah tugas melebihi orang yang piket, tugas paling akhir akan kurang orang.':per<g.length?` ${g.length-per} orang belum dapat tugas.`:' Semua sudah dapat tugas.');
  const kartu=(judul,ids,k)=>`
   <div class="card">
     <div class="flex justify-between items-center gap-2 mb-3"><b class="text-lg">${judul}</b>${k?`<span class="flex items-center gap-2"><button class="btn2 st" data-k="${k}" data-d="-1">−</button><b class="w-6 text-center text-lg">${c[k]}</b><button class="btn2 st" data-k="${k}" data-d="1">+</button></span>`:''}</div>
     <ul class="space-y-2 text-base">${ids.map(a=>`<li class="flex gap-3"><b class="mu w-7 text-right shrink-0">${a}</b><span class="font-medium">${byAbsen[a].nama}</span></li>`).join('')||'<li class="mu">Belum ada petugas</li>'}</ul>
   </div>`;
  let p=0,html=Object.keys(TUGAS).map(k=>{const ids=g.slice(p,p+c[k]);p+=c[k];return kartu(TUGAS[k],ids,k)}).join('');
  if(p<g.length)html+=kartu('Belum dapat tugas',g.slice(p),'');
  $('days').innerHTML=html;
}
$('days').onclick=e=>{const b=e.target.closest('.st');if(!b)return;const c=cnt[HARI[cur]],k=b.dataset.k;c[k]=Math.max(0,Math.min(25,c[k]+ +b.dataset.d));save();renderPiket()};
{const t=HARI[new Date().getDay()-1];if(t)document.querySelector(`[data-t="${t.toLowerCase()}"]`).classList.add('td')}
$('shuf').onclick=()=>{const g=grup[HARI[cur]];for(let i=g.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[g[i],g[j]]=[g[j],g[i]]}save();renderPiket()};
$('def').onclick=()=>{grup[HARI[cur]].sort((a,b)=>a-b);save();renderPiket()};

page();list();

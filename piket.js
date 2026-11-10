/* ===== Piket ===== */
let cur=0,grup=JSON.parse(JSON.stringify(jadwalHari)),alok={};
/* alok[hari][tugas] = daftar absen yang bertugas. Siswa yang tidak ada di alok mana pun = pool (belum dapat tugas) */
function bagiUlang(h,n){const g=grup[h];let p=0;alok[h]={};Object.keys(TUGAS).forEach(k=>{alok[h][k]=g.slice(p,p+n[k]);p+=n[k]})}
HARI.forEach(h=>{const n=grup[h].length,b=Math.floor(n/3);bagiUlang(h,{pagi:b,mbg:b,pulang:n-2*b})});
try{const d=JSON.parse(localStorage.getItem('piket3')||'null');if(d)HARI.forEach(h=>{const a=d.alok&&d.alok[h],o=d.grup&&d.grup[h];if(a&&o&&o.length===grup[h].length&&Object.keys(TUGAS).every(k=>Array.isArray(a[k])&&a[k].every(x=>o.includes(x)))){grup[h]=o;alok[h]=a}})}catch(e){}
function save(){try{localStorage.setItem('piket3',JSON.stringify({grup,alok}))}catch(e){}}
/* pool = siswa hari itu yang belum dapat tugas apa pun */
function pool(h){const s=new Set(Object.values(alok[h]).flat());return grup[h].filter(a=>!s.has(a))}
/* d>0: tambah satu orang HANYA dari pool (pool kosong = berhenti, tidak mengambil dari tugas lain). d<0: orang terakhir di tugas itu kembali ke pool */
function ubah(h,k,d){
  if(d>0){const p=pool(h);if(!p.length)return false;alok[h][k].push(p[0])}
  else{if(!alok[h][k].length)return false;alok[h][k].pop()}
  return true;
}
/* acak/urut ulang kelompok hari itu, jumlah tiap tugas tetap */
function ulang(h,urut){const n={};Object.keys(TUGAS).forEach(k=>n[k]=alok[h][k].length);urut(grup[h]);bagiUlang(h,n)}
function renderPiket(){
  const h=HARI[cur],g=grup[h],A=alok[h],sisa=pool(h),now=HARI[new Date().getDay()-1];
  $('ptitle').textContent=h+(h===now?' · Hari ini':'');
  $('tot').textContent=`${g.length} orang piket hari ${h}.`+(sisa.length?` ${sisa.length} orang belum dapat tugas; tombol + mengambil dari mereka.`:' Semua sudah dapat tugas. Kurangi salah satu tugas dulu kalau mau menambah di tugas lain.')+' Seret nama (⋮⋮) untuk memindahkan antar tugas.';
  const kartu=(judul,ids,k)=>`
   <div class="card zn" data-z="${k||'pool'}">
     <div class="flex justify-between items-center gap-2 mb-3"><b class="text-lg">${judul}</b>${k?`<span class="flex items-center gap-2"><button class="btn2 st" data-k="${k}" data-d="-1"${A[k].length?'':' disabled'}>−</button><b class="w-6 text-center text-lg">${A[k].length}</b><button class="btn2 st" data-k="${k}" data-d="1"${sisa.length?'':' disabled'}>+</button></span>`:''}</div>
     <ul class="space-y-2 text-base">${ids.map(a=>`<li class="flex gap-3 dr" data-a="${a}"><span class="gp">⋮⋮</span><b class="mu w-7 text-right shrink-0">${a}</b><span class="font-medium">${byAbsen[a].nama}</span></li>`).join('')||'<li class="mu">'+(k?'Belum ada petugas':'Kosong. Seret nama ke sini untuk melepas tugas.')+'</li>'}</ul>
   </div>`;
  let html=Object.keys(TUGAS).map(k=>kartu(TUGAS[k],A[k],k)).join('');
  html+=kartu('Belum dapat tugas',sisa,'');
  $('days').innerHTML=html;
}
$('days').onclick=e=>{const b=e.target.closest('.st');if(!b||b.disabled||sp)return;if(ubah(HARI[cur],b.dataset.k,+b.dataset.d)){save();renderPiket()}};
/* acak dengan animasi: tiap tick mengacak ulang dan makin melambat, lalu berhenti di hasil akhir */
let sp=false;
const acak=g=>{for(let i=g.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[g[i],g[j]]=[g[j],g[i]]}};
$('shuf').onclick=()=>{
  if(sp)return;
  const h=HARI[cur],b=$('shuf'),t0=b.textContent;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){ulang(h,acak);save();renderPiket();return}
  sp=true;b.textContent='Mengacak…';b.disabled=$('def').disabled=true;$('days').classList.add('spin');
  let i=0;
  (function f(){
    ulang(h,acak);i++;
    const end=i>=20,d=$('days');
    if(end){sp=false;save();d.classList.replace('spin','fin');b.textContent=t0;b.disabled=$('def').disabled=false;setTimeout(()=>d.classList.remove('fin'),700)}
    renderPiket();
    if(!end)setTimeout(f,50+i*i*.6);
  })();
};
$('def').onclick=()=>{ulang(HARI[cur],g=>g.sort((a,b)=>a-b));save();renderPiket()};

/* ===== Salin tugas + petugas (siap tempel ke WhatsApp) ===== */
function teksPiket(h){
  const A=alok[h],sisa=pool(h);
  const blok=(j,ids)=>`*${j}*\n`+(ids.length?ids.map((a,i)=>`${i+1}. ${byAbsen[a].nama}`).join('\n'):'-');
  const b=Object.keys(TUGAS).map(k=>blok(TUGAS[k],A[k]));
  if(sisa.length)b.push(blok('Belum dapat tugas',sisa));
  return `📋 *Jadwal Piket Hari ${h}*\nKelas 11 RPL 2\n\n`+b.join('\n\n');
}
async function salin(t){
  try{await navigator.clipboard.writeText(t);return true}catch(e){}
  try{const x=document.createElement('textarea');x.value=t;x.style.cssText='position:fixed;opacity:0';document.body.appendChild(x);x.select();const ok=document.execCommand('copy');x.remove();return ok}catch(e){return false}
}
{
  const sb=document.createElement('button');
  sb.id='cpy';sb.className=$('shuf').className;sb.textContent='Salin tugas';
  $('shuf').insertAdjacentElement('afterend',sb);
  let tm;
  sb.onclick=async()=>{if(sp)return;
    const ok=await salin(teksPiket(HARI[cur]));
    sb.textContent=ok?'Tersalin ✓':'Gagal menyalin';
    clearTimeout(tm);tm=setTimeout(()=>sb.textContent='Salin tugas',2000);
  };
}

/* ===== Seret & lepas: pindah/urutkan nama antar tugas; lepas di "Belum dapat tugas" = lepas dari tugas ===== */
dnd($('days'),{item:'.dr',zone:'.zn',ok:()=>!sp,drop:(el,z,ref,after)=>{
  const h=HARI[cur],a=+el.dataset.a,k=z.dataset.z;
  Object.values(alok[h]).forEach(l=>{const i=l.indexOf(a);if(i>-1)l.splice(i,1)});
  if(k!=='pool'){const l=alok[h][k];let i=ref?l.indexOf(+ref.dataset.a):-1;i=i<0?l.length:i+(after?1:0);l.splice(i,0,a)}
  save();renderPiket();
}});

/* ===== Simpan ke riwayat ===== */
barSimpan($('tot'),()=>{if(sp)return null;const h=HARI[cur],A=alok[h],s=pool(h);return{tipe:'piket',ket:'Piket '+h,data:[...Object.keys(TUGAS).map(k=>({j:TUGAS[k],a:[...A[k]]})),...(s.length?[{j:'Belum dapat tugas',a:s}]:[])]}},'Piket minggu ke-1');

cur=HARI.indexOf(document.body.dataset.hari);renderPiket();
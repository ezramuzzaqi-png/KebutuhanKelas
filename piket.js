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
  $('tot').textContent=`${g.length} orang piket hari ${h}.`+(sisa.length?` ${sisa.length} orang belum dapat tugas; tombol + mengambil dari mereka.`:' Semua sudah dapat tugas. Kurangi salah satu tugas dulu kalau mau menambah di tugas lain.');
  const kartu=(judul,ids,k)=>`
   <div class="card">
     <div class="flex justify-between items-center gap-2 mb-3"><b class="text-lg">${judul}</b>${k?`<span class="flex items-center gap-2"><button class="btn2 st" data-k="${k}" data-d="-1"${A[k].length?'':' disabled'}>−</button><b class="w-6 text-center text-lg">${A[k].length}</b><button class="btn2 st" data-k="${k}" data-d="1"${sisa.length?'':' disabled'}>+</button></span>`:''}</div>
     <ul class="space-y-2 text-base">${ids.map(a=>`<li class="flex gap-3"><b class="mu w-7 text-right shrink-0">${a}</b><span class="font-medium">${byAbsen[a].nama}</span></li>`).join('')||'<li class="mu">Belum ada petugas</li>'}</ul>
   </div>`;
  let html=Object.keys(TUGAS).map(k=>kartu(TUGAS[k],A[k],k)).join('');
  if(sisa.length)html+=kartu('Belum dapat tugas',sisa,'');
  $('days').innerHTML=html;
}
$('days').onclick=e=>{const b=e.target.closest('.st');if(!b||b.disabled)return;if(ubah(HARI[cur],b.dataset.k,+b.dataset.d)){save();renderPiket()}};
$('shuf').onclick=()=>{ulang(HARI[cur],g=>{for(let i=g.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[g[i],g[j]]=[g[j],g[i]]}});save();renderPiket()};
$('def').onclick=()=>{ulang(HARI[cur],g=>g.sort((a,b)=>a-b));save();renderPiket()};

cur=HARI.indexOf(document.body.dataset.hari);renderPiket();

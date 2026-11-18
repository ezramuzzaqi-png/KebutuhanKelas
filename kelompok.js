/* ===== Spin Kelompok ===== */
let kN=5,absen=new Set(),hasil=[],kbusy=false;

/* ===== ATURAN TETAP (tidak tampil di halaman, berlaku di semua perangkat) =====
   Isi dengan nomor absen. Contoh: 13:[5,20] artinya nomor 13 tidak boleh sekelompok dengan nomor 5 dan nomor 20. */
const L=[1,2,5,8,14,19,20,21,22,23,25,27,28,31,33,35,36,40,41,43,44,46,47,48,49];
const JAUHKAN={
 13:L,
 32:L
};
const semua=()=>Object.entries(JAUHKAN).flatMap(([a,l])=>l.filter(b=>byAbsen[a]&&byAbsen[b]).map(b=>[+a,b]));
/* hitung aturan aktif (kedua siswa hadir) dan berapa yang dilanggar pada pembagian g */
function cek(g){
  const m={};g.forEach((k,i)=>k.forEach(s=>m[s.absen]=i));
  const ak=semua().filter(([a,b])=>a in m&&b in m);
  return{ak:ak.length,v:ak.filter(([a,b])=>m[a]===m[b]).length};
}

function chips(){
  $('kchips').innerHTML=siswaAwal.map(s=>`<button class="chip ${absen.has(s.absen)?'x':''}" data-a="${s.absen}">${s.absen}. ${s.nama.split(' ')[0]}</button>`).join('');
  $('kabs').textContent=absen.size;
}
function acak(arr,n){
  const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  const g=Array.from({length:n},()=>[]);a.forEach((s,i)=>g[i%n].push(s));return g;
}
/* ketat=true: ulangi pengacakan sampai semua aturan terpenuhi (maks. 3000 percobaan, ambil yang terbaik) */
function bagi(arr,n,ketat){
  let g=acak(arr,n);
  if(!ketat||!semua().length)return g;
  let b=cek(g).v,best=g;
  for(let t=0;t<3000&&b>0;t++){g=acak(arr,n);const v=cek(g).v;if(v<b){b=v;best=g}}
  return best;
}
function tampil(g){
  $('kres').innerHTML=g.map((m,i)=>`<div class="card zn" data-g="${i}"><div class="flex justify-between mb-2"><b class="text-lg">Kelompok ${i+1}</b><span class="text-xs mu">${m.length} orang</span></div><ul class="space-y-1">${m.map(s=>`<li class="flex gap-2 dr" data-a="${s.absen}"><span class="gp">⋮⋮</span><b class="mu w-7 text-right shrink-0">${s.absen}</b><span class="font-medium">${s.nama}</span></li>`).join('')||'<li class="mu text-sm">Kosong</li>'}</ul></div>`).join('');
}
function info(){
  const n=hasil.reduce((s,m)=>s+m.length,0),c=cek(hasil);
  $('kinfo').textContent=`${n} siswa hadir dibagi ke ${hasil.length} kelompok.`
    +(c.ak?(c.v?` ⚠ ${c.v} dari ${c.ak} aturan "jangan sekelompok" tidak terpenuhi.`:` Semua ${c.ak} aturan "jangan sekelompok" terpenuhi.`):'')
    +' Seret nama (⋮⋮) untuk memindahkan antar kelompok.';
}
function kspin(){
  const h=siswaAwal.filter(s=>!absen.has(s.absen));
  if(h.length<kN){$('kinfo').textContent='Jumlah kelompok lebih banyak dari siswa yang hadir.';return}
  $('kgo').disabled=true;kbusy=true;$('kres').style.opacity=.6;let t=0;
  const iv=setInterval(()=>{
    if(++t<18)return tampil(bagi(h,kN));
    clearInterval(iv);hasil=bagi(h,kN,true);tampil(hasil);$('kres').style.opacity=1;$('kgo').disabled=false;kbusy=false;
    info();
  },110);
}
$('kmin').onclick=()=>{kN=Math.max(2,kN-1);$('kn').textContent=kN};
$('kplus').onclick=()=>{kN=Math.min(25,kN+1);$('kn').textContent=kN};
$('kgo').onclick=kspin;
$('kchips').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;const a=+b.dataset.a;if(absen.has(a))absen.delete(a);else absen.add(a);chips()};
$('kcopy').onclick=()=>{
  if(!hasil.length)return;
  const t=hasil.map((m,i)=>`Kelompok ${i+1}\n`+m.map(s=>`${s.absen}. ${s.nama}`).join('\n')).join('\n\n');
  try{navigator.clipboard.writeText(t);$('kcopy').textContent='Tersalin!';setTimeout(()=>$('kcopy').textContent='Salin hasil',1500)}catch(e){}
};
/* ===== Seret & lepas antar kelompok (setelah spin selesai) ===== */
dnd($('kres'),{item:'.dr',zone:'.zn',ok:()=>hasil.length&&!kbusy,drop:(el,z,ref,after)=>{
  const a=+el.dataset.a;let s;
  hasil.forEach(m=>{const i=m.findIndex(x=>x.absen===a);if(i>-1)s=m.splice(i,1)[0]});
  const m=hasil[+z.dataset.g];let i=ref?m.findIndex(x=>x.absen===+ref.dataset.a):-1;i=i<0?m.length:i+(after?1:0);m.splice(i,0,s);
  tampil(hasil);info();
}});

/* ===== Simpan ke riwayat ===== */
barSimpan($('kinfo'),()=>!kbusy&&hasil.length?{tipe:'kelompok',ket:`${hasil.length} kelompok · ${hasil.reduce((n,m)=>n+m.length,0)} siswa`,data:hasil.map((m,i)=>({j:'Kelompok '+(i+1),a:m.map(s=>s.absen)}))}:null,'Nama mata pelajaran');
chips();
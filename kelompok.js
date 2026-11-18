let kN=5,absen=new Set(),hasil=[],kbusy=false;
const PS='pisah11rpl2';
let pisah=[];
try{pisah=JSON.parse(localStorage.getItem(PS)||'[]').filter(p=>byAbsen[p[0]]&&byAbsen[p[1]])}catch(e){}
const pisahSimpan=()=>{try{localStorage.setItem(PS,JSON.stringify(pisah))}catch(e){}};
const L=[1,2,5,8,14,19,20,21,22,23,25,27,28,31,33,35,36,40,41,43,44,46,47,48,49];
const JAUHKAN={
 13:L,
 32:L
};
const semua=()=>[...pisah,...Object.entries(JAUHKAN).flatMap(([a,l])=>l.filter(b=>byAbsen[a]&&byAbsen[b]).map(b=>[+a,b]))];
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

dnd($('kres'),{item:'.dr',zone:'.zn',ok:()=>hasil.length&&!kbusy,drop:(el,z,ref,after)=>{
  const a=+el.dataset.a;let s;
  hasil.forEach(m=>{const i=m.findIndex(x=>x.absen===a);if(i>-1)s=m.splice(i,1)[0]});
  const m=hasil[+z.dataset.g];let i=ref?m.findIndex(x=>x.absen===+ref.dataset.a):-1;i=i<0?m.length:i+(after?1:0);m.splice(i,0,s);
  tampil(hasil);info();
}});

(function(){
  const d=document.createElement('div');d.className='card mb-3';
  const op=siswaAwal.map(s=>`<option value="${s.absen}">${s.absen}. ${s.nama}</option>`).join('');
  const sl='style="background:var(--card);color:var(--tx);border:1px solid var(--bd);border-radius:8px;padding:6px 8px;flex:1;min-width:150px;max-width:100%"';
  d.innerHTML=`<details><summary class="cursor-pointer mu text-sm">⚙ Pengaturan "jangan sekelompok"</summary>
    <div class="mu text-xs my-2">Pilih dua siswa yang tidak boleh masuk kelompok yang sama. Aturan ini hanya tersimpan di browser ini.</div>
    <div class="flex flex-wrap items-center gap-2 mb-2"><select ${sl} id="pa">${op}</select><span class="mu">tidak dengan</span><select ${sl} id="pb">${op}</select><button class="btn2" id="padd">Tambah</button></div>
    <div id="plist" class="flex flex-wrap gap-2"></div></details>`;
  $('kres').insertAdjacentElement('beforebegin',d);
  const pa=d.querySelector('#pa'),pb=d.querySelector('#pb'),ad=d.querySelector('#padd'),ls=d.querySelector('#plist');let t;
  pb.selectedIndex=1;
  const nd=a=>byAbsen[a].nama.split(' ')[0];
  const tmpl=()=>{ls.innerHTML=pisah.map((p,i)=>`<button class="btn2 text-sm" style="padding:4px 10px" data-i="${i}" title="Hapus aturan ini">${p[0]}. ${nd(p[0])} ≠ ${p[1]}. ${nd(p[1])} ✕</button>`).join('')||'<span class="mu text-sm">Belum ada aturan.</span>'};
  const pesan=x=>{ad.textContent=x;clearTimeout(t);t=setTimeout(()=>ad.textContent='Tambah',2000)};
  ad.onclick=()=>{
    const a=+pa.value,b=+pb.value;
    if(a===b)return pesan('Pilih dua orang berbeda');
    if(pisah.some(p=>(p[0]===a&&p[1]===b)||(p[0]===b&&p[1]===a)))return pesan('Sudah ada');
    pisah.push([a,b]);pisahSimpan();tmpl();pesan('Ditambahkan ✓');
  };
  ls.onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;pisah.splice(+b.dataset.i,1);pisahSimpan();tmpl()};
  tmpl();
})();

barSimpan($('kinfo'),()=>!kbusy&&hasil.length?{tipe:'kelompok',ket:`${hasil.length} kelompok · ${hasil.reduce((n,m)=>n+m.length,0)} siswa`,data:hasil.map((m,i)=>({j:'Kelompok '+(i+1),a:m.map(s=>s.absen)}))}:null,'Nama mata pelajaran');
chips();
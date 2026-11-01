/* ===== Spin Kelompok ===== */
let kN=5,absen=new Set(),hasil=[];
function chips(){
  $('kchips').innerHTML=siswaAwal.map(s=>`<button class="chip ${absen.has(s.absen)?'x':''}" data-a="${s.absen}">${s.absen}. ${s.nama.split(' ')[0]}</button>`).join('');
  $('kabs').textContent=absen.size;
}
function bagi(arr,n){
  const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  const g=Array.from({length:n},()=>[]);a.forEach((s,i)=>g[i%n].push(s));return g;
}
function tampil(g){
  $('kres').innerHTML=g.map((m,i)=>`<div class="card"><div class="flex justify-between mb-2"><b class="text-lg">Kelompok ${i+1}</b><span class="text-xs mu">${m.length} orang</span></div><ul class="space-y-1">${m.map(s=>`<li class="flex gap-2"><b class="mu w-7 text-right shrink-0">${s.absen}</b><span class="font-medium">${s.nama}</span></li>`).join('')}</ul></div>`).join('');
}
function kspin(){
  const h=siswaAwal.filter(s=>!absen.has(s.absen));
  if(h.length<kN){$('kinfo').textContent='Jumlah kelompok lebih banyak dari siswa yang hadir.';return}
  $('kgo').disabled=true;$('kres').style.opacity=.6;let t=0;
  const iv=setInterval(()=>{
    if(++t<18)return tampil(bagi(h,kN));
    clearInterval(iv);hasil=bagi(h,kN);tampil(hasil);$('kres').style.opacity=1;$('kgo').disabled=false;
    $('kinfo').textContent=`${h.length} siswa hadir dibagi ke ${kN} kelompok.`;
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
chips();


/* ===== Riwayat tersimpan (di browser ini) ===== */
const buka=new Set();
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tgl=t=>new Date(t).toLocaleString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
async function salin(t){
  try{await navigator.clipboard.writeText(t);return true}catch(e){}
  try{const x=document.createElement('textarea');x.value=t;x.style.cssText='position:fixed;opacity:0';document.body.appendChild(x);x.select();const ok=document.execCommand('copy');x.remove();return ok}catch(e){return false}
}
const blok=b=>`<div class="card"><div class="flex justify-between mb-2"><b>${esc(b.j)}</b><span class="text-xs mu">${b.a.length} orang</span></div><ul class="space-y-1 text-sm">${b.a.map(x=>`<li class="flex gap-2"><b class="mu w-7 text-right shrink-0">${x}</b><span class="font-medium">${byAbsen[x].nama}</span></li>`).join('')||'<li class="mu">Kosong</li>'}</ul></div>`;
function render(){
  const a=rwGet();
  $('rinfo').textContent=a.length?`${a.length} catatan tersimpan di browser ini.`:'';
  $('rall').style.display=a.length?'':'none';
  $('rlist').innerHTML=a.length?a.map(r=>`<div class="card" data-id="${r.id}">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <div><b class="text-lg">${esc(r.nama)}</b><div class="mu text-sm">${esc(r.ket)} · ${tgl(r.waktu)}</div></div>
      <div class="flex gap-2"><button class="btn2" data-x="lihat">${buka.has(r.id)?'Tutup':'Lihat'}</button><button class="btn2" data-x="salin">Salin</button><button class="btn2" data-x="hapus">Hapus</button></div>
    </div>
    ${buka.has(r.id)?`<div class="rw-d on">${det(r)}</div>`:''}
  </div>`).join(''):'<div class="card mu">Belum ada riwayat. Simpan hasil spin kelompok atau pembagian piket, nanti muncul di sini.</div>';
}
const det=r=>`<div class="rw-in"><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3">${r.data.map(blok).join('')}</div></div>`;
$('rlist').onclick=e=>{
  const x=e.target.closest('[data-x]');if(!x)return;
  const id=+x.closest('[data-id]').dataset.id,a=rwGet(),r=a.find(v=>v.id===id);if(!r)return;
  if(x.dataset.x==='lihat'){
    const c=x.closest('[data-id]');let d=c.querySelector('.rw-d');
    if(buka.has(id)){buka.delete(id);x.textContent='Lihat';d.classList.remove('on');clearTimeout(d._t);d._t=setTimeout(()=>{if(!buka.has(id))d.remove()},450)}
    else{buka.add(id);x.textContent='Tutup';
      if(!d){d=document.createElement('div');d.className='rw-d';d.innerHTML=det(r);c.appendChild(d);d.offsetHeight}
      clearTimeout(d._t);d.classList.add('on')}
  }
  else if(x.dataset.x==='hapus'){
    if(x.dataset.y){rwPut(a.filter(v=>v.id!==id));buka.delete(id);render()}
    else{x.dataset.y=1;x.textContent='Yakin hapus?';x.classList.add('bhs');clearTimeout(x._t);x._t=setTimeout(()=>{x.dataset.y='';x.textContent='Hapus';x.classList.remove('bhs')},3000)}
  }
  else salin(rwText(r)).then(ok=>{x.textContent=ok?'Tersalin ✓':'Gagal menyalin';setTimeout(()=>x.textContent='Salin',1500)});
};
$('rall').onclick=e=>{
  const b=e.currentTarget,y=b.dataset.y;
  clearTimeout(b._t);b.dataset.y='';b.classList.remove('bhs');b.textContent='Hapus semua';
  if(y){rwPut([]);buka.clear();render();return}
  b.dataset.y=1;b.classList.add('bhs');b.textContent='Yakin hapus semua?';
  b._t=setTimeout(()=>{b.dataset.y='';b.classList.remove('bhs');b.textContent='Hapus semua'},3000);
};
render();

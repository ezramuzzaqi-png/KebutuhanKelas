/* DATA KELAS: daftar siswa, tugas piket, dan nama yang piket tiap hari (nomor absen) */
const siswaAwal=[
{absen:1,nama:"Abdul Azis Mahmudin"},{absen:2,nama:"Ahmad Daffa"},{absen:3,nama:"Akmal Maulana Nasir"},{absen:4,nama:"Allia Eka Fadilah"},{absen:5,nama:"Anisa Nur Febrianti"},{absen:6,nama:"Avicena Fathoni Fawwaz"},{absen:7,nama:"Azahra Syifa Alfiani"},{absen:8,nama:"Berly Muhammad Furqon"},{absen:9,nama:"Chindy Adyla"},{absen:10,nama:"Denikbar Priambada"},{absen:11,nama:"Dinda Rizkika Kholifatunnisa"},{absen:12,nama:"Edgar Dhamas Putra"},{absen:13,nama:"Ezra Muzaqi"},{absen:14,nama:"Fazril Rizki Akbar"},{absen:15,nama:"Filza Wiwahyu Abadan"},{absen:16,nama:"Firly Nur Asri Pratiwi"},{absen:17,nama:"Gibran Vargan Alfahrezi"},{absen:18,nama:"Hasbi Yusuf"},{absen:19,nama:"Hasna Fathiya Rahma"},{absen:20,nama:"Insan Kamil Kusuma Wijaya"},{absen:21,nama:"Intan Juliyanti"},{absen:22,nama:"Jihan Carlen Aurelia"},{absen:23,nama:"Kayla Rizky Ramadhanti Nurhamzah"},{absen:24,nama:"Maharani Sundari"},{absen:25,nama:"Mahendra Febrian"},{absen:26,nama:"Maula Ahmad Syahid"},{absen:27,nama:"Meylisa Handayani"},{absen:28,nama:"Mochamad Alviandi Ridwan"},{absen:29,nama:"Muhamad Rido Alfaregi"},{absen:30,nama:"M.Danish Alexa"},{absen:31,nama:"M.Hamzah Maulana"},{absen:32,nama:"M.Ozikri Lammasyum"},{absen:33,nama:"M.Rizki Akbar"},{absen:34,nama:"Novika Sari"},{absen:35,nama:"Rafli Andriandi"},{absen:36,nama:"Raissa Nadhifatul Azhar Hidayatulloh"},{absen:37,nama:"Rakean Fatanjala Drajat"},{absen:38,nama:"Ravasha Alsan Naufal"},{absen:39,nama:"Raykhan Ali"},{absen:40,nama:"Rezky Zamam Fasya"},{absen:41,nama:"Rizky Hadiansyah Ramadhan"},{absen:42,nama:"Sabiq Akma Fadillah"},{absen:43,nama:"Salma Nurhana Sabila"},{absen:44,nama:"Shiva Novita"},{absen:45,nama:"Syahdan Maulana Rafansyah"},{absen:46,nama:"Tasya Amalia Putri"},{absen:47,nama:"Willy Oktapian Mutaqin"},{absen:48,nama:"Wulan Khoirunnisa"},{absen:49,nama:"Zacky Putra Pratama Sopian"}];
const byAbsen=Object.fromEntries(siswaAwal.map(s=>[s.absen,s]));
const $=id=>document.getElementById(id);
const TUGAS={pagi:'Piket Pagi',mbg:'Petugas MBG',pulang:'Piket Pulang'};
const HARI=['Senin','Selasa','Rabu','Kamis'];
/* ===== NAMA PIKET TIAP HARI (isi dengan nomor absen) ===== */
const jadwalHari={
 Senin:[1,2,3,4,5,6,7,8,9,10,11,12],
 Selasa:[13,14,15,16,17,18,19,20,21,22,23,24],
 Rabu:[25,26,27,28,29,30,31,32,33,34,35,36],
 Kamis:[37,38,39,40,41,42,43,44,45,46,47,48,49]
};

/* ============ SERET & LEPAS (mouse + layar sentuh) ============
   dnd(wadah,{item,zone,ok,drop}). Di layar sentuh, tarik pegangan ⋮⋮ (.gp) supaya halaman tetap bisa di-scroll.
   drop(elemen,zona,elemenAcuan,setelahAcuan) dipanggil saat dilepas di zona yang valid. */
function dnd(root,o){
  let d=null,mk=[];
  const bersih=()=>{mk.forEach(x=>x.classList.remove('over','ib','ia'));mk=[]};
  const akhir=()=>{if(!d)return;bersih();if(d.g)d.g.remove();d.el.classList.remove('dragging');document.body.classList.remove('drg');d=null};
  root.addEventListener('pointerdown',e=>{
    const el=e.target.closest(o.item);
    if(!el||e.button>0||(e.pointerType!=='mouse'&&!e.target.closest('.gp'))||(o.ok&&!o.ok()))return;
    d={el,x:e.clientX,y:e.clientY,on:0};
  });
  addEventListener('pointermove',e=>{
    if(!d)return;
    if(!d.on){
      if(Math.hypot(e.clientX-d.x,e.clientY-d.y)<6)return;
      const q=d.el.getBoundingClientRect();
      d.on=1;d.ox=d.x-q.left;d.oy=d.y-q.top;
      d.g=d.el.cloneNode(true);d.g.classList.add('ghost');d.g.style.width=q.width+'px';
      document.body.appendChild(d.g);d.el.classList.add('dragging');document.body.classList.add('drg');
    }
    d.g.style.left=e.clientX-d.ox+'px';d.g.style.top=e.clientY-d.oy+'px';
    if(e.clientY<70)scrollBy(0,-14);else if(e.clientY>innerHeight-70)scrollBy(0,14);
    bersih();d.z=d.ref=null;
    const t=document.elementFromPoint(e.clientX,e.clientY),z=t&&t.closest(o.zone),r=t&&t.closest(o.item);
    if(!z||r===d.el)return;
    z.classList.add('over');mk.push(z);d.z=z;
    if(r&&z.contains(r)){const b=r.getBoundingClientRect();d.ref=r;d.after=e.clientY>b.top+b.height/2;r.classList.add(d.after?'ia':'ib');mk.push(r)}
  });
  addEventListener('pointerup',()=>{if(d&&d.on&&d.z)o.drop(d.el,d.z,d.ref,d.after);akhir()});
  addEventListener('pointercancel',akhir);
}

/* ============ RIWAYAT (tersimpan di browser ini lewat localStorage) ============
   tiap catatan: {id,tipe,ket,nama,waktu,data:[{j:judul,a:[nomor absen]}]} */
const RW='riwayat11rpl2';
const rwGet=()=>{try{return JSON.parse(localStorage.getItem(RW)||'[]')}catch(e){return[]}};
const rwPut=a=>{try{localStorage.setItem(RW,JSON.stringify(a));return true}catch(e){return false}};
const rwAdd=(tipe,ket,nama,data)=>rwPut([{id:Date.now(),tipe,ket,nama,waktu:Date.now(),data},...rwGet()]);
const rwText=r=>`📋 *${r.nama}*\n${r.ket} · Kelas 11 RPL 2\n\n`+r.data.map(b=>`*${b.j}*\n`+(b.a.length?b.a.map((a,i)=>`${i+1}. ${byAbsen[a].nama}`).join('\n'):'-')).join('\n\n');
/* kotak "nama + Simpan"; ambil() mengembalikan {tipe,ket,data} atau null kalau belum ada hasil */
function barSimpan(sesudah,ambil,ph){
  const d=document.createElement('div');d.className='card mb-3 flex flex-wrap items-center gap-2';
  d.innerHTML=`<input class="inp" style="flex:1;min-width:180px" maxlength="60" placeholder="${ph}"><button class="btn">Simpan ke riwayat</button><a class="mu text-sm underline" href="riwayat.html">Lihat riwayat</a>`;
  const i=d.querySelector('input'),b=d.querySelector('button');let t;
  b.onclick=()=>{
    const r=ambil(),tg=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
    const ok=!!r&&rwAdd(r.tipe,r.ket,i.value.trim()||r.ket+' – '+tg,r.data);
    b.textContent=!r?'Belum ada hasil':ok?'Tersimpan ✓':'Gagal menyimpan';if(ok)i.value='';
    clearTimeout(t);t=setTimeout(()=>b.textContent='Simpan ke riwayat',2000);
  };
  sesudah.insertAdjacentElement('afterend',d);
}

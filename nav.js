/* menu atas, dipakai semua halaman */
const MENU=[['index.html','Spin','spin'],['kelompok.html','Kelompok','kelompok'],...HARI.map(x=>[x.toLowerCase()+'.html',x,x.toLowerCase()]),['riwayat.html','Riwayat','riwayat']];
{const now=document.body.dataset.page,hr=HARI[new Date().getDay()-1];
$('nav').innerHTML=MENU.map(([f,t,k])=>`<a class="tab ${k===now?'on':''} ${t===hr?'td':''}" href="${f}">${t}</a>`).join('')}

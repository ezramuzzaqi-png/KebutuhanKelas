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

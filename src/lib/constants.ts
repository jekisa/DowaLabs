export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || "DowaLabs";

export const NAV_LINKS = [
  { href: "/#fitur", label: "Fitur" },
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/pricing", label: "Harga" },
  { href: "/demo", label: "Demo" },
  { href: "/faq", label: "FAQ" },
];

export const FAQ_ITEMS = [
  {
    q: "Apa itu DowaLabs?",
    a: "DowaLabs adalah AI Product Studio yang membantu seller, affiliate, dan UMKM membuat foto produk lebih menarik dan siap jual menggunakan bantuan AI Canvas.",
  },
  {
    q: "Bagaimana cara mulai menggunakan DowaLabs?",
    a: "Daftar akun, pilih paket Basic atau Pro, lakukan pembayaran via Lynk.id, lalu login ke dashboard dan klik tombol Buka DowaLabs AI Canvas.",
  },
  {
    q: "Apakah akses langsung aktif setelah bayar?",
    a: "Jika webhook pembayaran berhasil, akun akan aktif otomatis. Jika belum aktif dalam beberapa menit, kirim bukti pembayaran ke WhatsApp admin untuk aktivasi manual.",
  },
  {
    q: "Berapa lama masa aktif membership?",
    a: "Setiap pembayaran memberikan akses selama 30 hari. Kamu bisa memperpanjang kapan saja sebelum atau setelah masa aktif berakhir.",
  },
  {
    q: "Apa perbedaan paket Basic dan Pro?",
    a: "Basic memberikan akses dashboard, AI Canvas, dan tutorial dasar. Pro menambahkan akses prompt premium, template/preset tambahan, dan prioritas update.",
  },
  {
    q: "Metode pembayaran apa yang didukung?",
    a: "Saat ini pembayaran dilakukan melalui Lynk.id yang mendukung berbagai metode seperti transfer bank, e-wallet, dan QRIS.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Password kamu disimpan dalam bentuk hash (bcrypt) dan tidak pernah disimpan sebagai teks asli. Akses Canvas hanya diberikan kepada member aktif.",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Daftar akun DowaLabs",
    desc: "Buat akun gratis dengan email dan nomor WhatsApp kamu.",
  },
  {
    step: "02",
    title: "Pilih paket dan bayar",
    desc: "Pilih Basic atau Pro, lalu selesaikan pembayaran via Lynk.id.",
  },
  {
    step: "03",
    title: "Login ke dashboard",
    desc: "Setelah aktif, masuk ke dashboard member DowaLabs.",
  },
  {
    step: "04",
    title: "Buka AI Canvas",
    desc: "Klik tombol DowaLabs AI Canvas untuk mulai berkarya.",
  },
  {
    step: "05",
    title: "Buat foto produk siap jual",
    desc: "Hasilkan visual produk premium yang menarik pembeli.",
  },
];

export const BENEFITS = [
  {
    title: "Tampilan Lebih Profesional",
    desc: "Ubah foto produk biasa menjadi visual premium yang menaikkan kepercayaan pembeli.",
  },
  {
    title: "Tanpa Skill Desain",
    desc: "Tidak perlu mahir Photoshop. Cukup ikuti panduan dan biarkan AI bekerja.",
  },
  {
    title: "Cocok untuk Affiliate & UMKM",
    desc: "Dirancang untuk seller Shopee, affiliate marketer, dan pemilik UMKM.",
  },
  {
    title: "Hemat Waktu & Biaya",
    desc: "Tidak perlu sewa fotografer atau studio. Hasil cepat, langsung pakai.",
  },
  {
    title: "Prompt & Preset Premium",
    desc: "Paket Pro memberi akses prompt dan preset siap pakai untuk hasil maksimal.",
  },
  {
    title: "Akses Terkontrol & Aman",
    desc: "Akses Canvas hanya untuk member aktif, dikelola rapi lewat dashboard.",
  },
];

export const PROMPT_TIPS = [
  "Sebutkan jenis produk, material, dan warna secara spesifik agar hasil lebih akurat.",
  "Tambahkan suasana/background yang diinginkan, misal: meja kayu, studio minimalis, atau outdoor natural.",
  "Gunakan pencahayaan deskriptif seperti 'soft light', 'golden hour', atau 'studio lighting'.",
  "Sertakan target pasar, contoh: 'premium', 'minimalis', atau 'aesthetic Korea'.",
  "Lakukan beberapa variasi prompt lalu pilih hasil terbaik untuk konten jualan kamu.",
];

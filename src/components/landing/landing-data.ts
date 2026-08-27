export const PRO_PRICE_LABEL = "Rp99.000";
export const PRO_PRICE_STRIKE = "Rp200.000";

export const heroPricing = {
  id: {
    line: `Semua tool kreatif — ${PRO_PRICE_LABEL} untuk 30 hari`,
    cta: `Mulai Sekarang — ${PRO_PRICE_LABEL}`,
  },
  en: {
    line: `All creative tools — ${PRO_PRICE_LABEL} for 30 days`,
    cta: `Start Now — ${PRO_PRICE_LABEL}`,
  },
};

export const socialProof = {
  generatedImages: "",
  activeUsers: "",
  rating: "",
  logos: ["Shopee", "Tokopedia", "TikTok Shop", "Blibli"],
};

export const showcaseCategories = [
  {
    id: "fashion",
    label: "Fashion",
    labelEn: "Fashion",
    before: "/images/showcase/tshirt-before.jpg",
    after: "/images/showcase/tshirt-after1.jpg",
    alt: "Transformasi foto kaus menjadi visual fashion siap posting",
    // portrait source in a square frame: anchor top so the model's head survives
    focus: "center top",
  },
  {
    id: "skincare",
    label: "Snack",
    labelEn: "Snack",
    before: "/images/showcase/kacang-before.jpg",
    after: "/images/showcase/kacang-after2.jpg",
    alt: "Transformasi foto kemasan snack kacang menjadi visual campaign premium",
    // head and the whole pack span 1110px of a 768px-wide source, so they cannot
    // both fit a square frame. 14% keeps the head whole and lifts the pack from
    // ~12% to ~33%, far enough for "KACANG GARING" to read.
    focus: "center 14%",
  },
  {
    id: "food",
    label: "Food",
    labelEn: "Food",
    before: "/images/showcase/kopi-before.jpeg",
    after: "/images/showcase/kopi-after1.jpg",
    alt: "Transformasi foto kopi menjadi konten produk F&B",
  },
  {
    id: "furniture",
    label: "Kemasan",
    labelEn: "Packaging",
    before: "/images/showcase/snack-before.jpg",
    after: "/images/showcase/snack-after4.jpg",
    alt: "Transformasi foto kemasan basreng menjadi visual lifestyle",
    // same trade as skincare. 16% is the ceiling before the crown of the head
    // touches the top edge; it is also where "kylafood / Basreng" becomes legible.
    focus: "center 16%",
  },
  {
    id: "accessories",
    label: "Accessories",
    labelEn: "Accessories",
    before: "/images/showcase/watch-before.jpeg",
    after: "/images/showcase/watch-after1.jpg",
    alt: "Transformasi foto jam tangan menjadi visual premium",
  },
  {
    id: "electronics",
    label: "Electronics",
    labelEn: "Electronics",
    before: "/images/showcase/watch-before.jpeg",
    after: "/images/showcase/watch-after4.jpg",
    alt: "Transformasi foto elektronik menjadi visual marketplace",
  },
];

// the "Yang bisa dibuat" thumbnail panel was dropped from the page when the
// tools section gave its right column to the testimonials; kept here on purpose.
export const galleryFormats = [
  { label: "Marketplace", src: "/images/showcase/tshirt-after1.jpg" },
  { label: "Instagram Feed", src: "/images/showcase/kopi-after2.jpg" },
  { label: "Banner", src: "/images/showcase/watch-after4.jpg" },
  { label: "Poster", src: "/images/showcase/snack-after4.jpg" },
  { label: "Portrait", src: "/images/showcase/Character_1.jpg" },
  { label: "Lifestyle", src: "/images/showcase/tumbler-after1.jpg" },
  { label: "Shopee", src: "/images/showcase/kacang-after3.jpg" },
  { label: "TikTok Shop", src: "/images/showcase/watch-after2.jpg" },
];

export const heroResults = [
  { label: "Luxury", src: "/images/showcase/kopi-after1.jpg" },
  { label: "Cafe", src: "/images/showcase/kopi-after2.jpg" },
  { label: "Minimal", src: "/images/showcase/tshirt-after2.jpg" },
  { label: "Dark", src: "/images/showcase/watch-after1.jpg" },
  { label: "Outdoor", src: "/images/showcase/snack-after3.jpg" },
  { label: "Lifestyle", src: "/images/showcase/tshirt-after4.jpg" },
];

export const howItWorks = [
  {
    step: "01",
    title: "Upload Foto",
    description: "Pakai foto polos dari HP. Tidak perlu studio, model, atau setup lighting mahal.",
  },
  {
    step: "02",
    title: "AI Memproses",
    description: "AI menghapus background, memperbaiki lighting, dan membuat beberapa gaya visual premium.",
  },
  {
    step: "03",
    title: "Download Banyak Variasi",
    description: "Ambil hasil terbaik untuk Shopee, TikTok Shop, Instagram, katalog, atau materi affiliate.",
  },
];

export const pricingTiers = [
  {
    name: "Starter",
    price: "Rp0",
    originalPrice: "Gratis",
    period: "/ coba",
    description: "Untuk mencoba hasil AI sebelum upgrade ke paket berbayar.",
    cta: "Upload 3 Foto Gratis",
    href: "/signup",
    features: ["3 gambar gratis", "Tanpa kartu kredit", "Preview hasil sebelum upgrade", "Cocok untuk validasi cepat"],
  },
  {
    name: "Pro",
    price: "Rp99.000",
    originalPrice: PRO_PRICE_STRIKE,
    period: " untuk 30 hari",
    description: "Untuk seller yang butuh banyak variasi konten siap posting setiap minggu.",
    cta: "Aktifkan Pro Sekarang",
    href: "/payment",
    featured: true,
    features: [
      "Akses semua tool DowaLabs Canvas",
      "5.000 prompt produk siap pakai",
      "Template affiliate premium",
      "Style campaign untuk iklan dan katalog",
      "Tutorial penggunaan",
      "Prioritas update",
    ],
  },
  {
    name: "Business",
    price: "Rp99.000",
    originalPrice: PRO_PRICE_STRIKE,
    period: "/ bulan",
    description: "Untuk toko dengan banyak SKU dan kebutuhan konten rutin.",
    cta: "Pilih Business",
    href: "/signup",
    features: ["Workflow batch generation", "Multiple aspect ratio", "Prioritas support", "Preset campaign bulanan", "Cocok untuk tim kecil"],
  },
];

export const valueStack = [
  { label: "Jasa desain manual 10 konten", value: "Rp150rb - Rp500rb" },
  { label: "Foto ulang produk sederhana", value: "Rp300rb+" },
  { label: "DowaLabs Pro", value: "Rp99.000 untuk 30 hari" },
];

export const testimonials = [
  {
    quote: "Placeholder review: Foto produk saya jadi kelihatan lebih premium dan lebih gampang dipakai untuk posting harian.",
    name: "Rina",
    role: "Kirana Fashion Store",
    metric: "CTR naik 18%",
    placeholder: true,
  },
  {
    quote: "Placeholder review: Biasanya butuh waktu lama bikin visual affiliate. Sekarang tinggal pilih hasil yang paling cocok.",
    name: "Andi",
    role: "Affiliate TikTok Shop",
    metric: "Hemat 90% biaya",
    placeholder: true,
  },
  {
    quote: "Placeholder review: Cocok untuk UMKM kecil yang belum punya budget foto produk profesional setiap bulan.",
    name: "Maya",
    role: "Maya Snack House",
    metric: "Omzet naik 27%",
    placeholder: true,
  },
];

export const faqItems = [
  {
    question: "Apakah hasil menjadi milik saya?",
    answer: "Ya. Hasil gambar yang kamu generate bisa dipakai untuk kebutuhan jualan, katalog, iklan, dan konten toko kamu.",
  },
  {
    question: "Apakah foto aman?",
    answer: "Foto produk digunakan untuk proses generate visual. Jangan upload data pribadi atau dokumen sensitif.",
  },
  {
    question: "Berapa lama prosesnya?",
    answer: "Target workflow dibuat cepat untuk hasil dalam hitungan detik, tergantung ukuran gambar dan antrian proses.",
  },
  {
    question: "Apakah bisa dipakai jualan?",
    answer: "Bisa. Visual, template, dan prompt DowaLabs bisa dipakai untuk seller Shopee, TikTok Shop, Instagram, dan konten affiliate.",
  },
  {
    question: "Bagaimana jika saya tidak puas?",
    answer:
      "Untuk saat ini gunakan sebagai placeholder kebijakan: jika akses tidak aktif setelah pembayaran berhasil, hubungi support WhatsApp agar dibantu aktivasi atau pengembalian dana sesuai pengecekan transaksi.",
  },
];

export const featureCards = [
  "Background Removal",
  "Lighting Enhancement",
  "Marketplace Optimizer",
  "Auto Resize",
  "Batch Generation",
  "Multiple Aspect Ratio",
];

export const comparisonRows = [
  { label: "Cost", studio: "Rp300rb+", photoshop: "Waktu sendiri", designer: "Rp150rb+", dowa: "Mulai gratis" },
  { label: "Time", studio: "1-3 hari", photoshop: "2-6 jam", designer: "1-2 hari", dowa: "10 detik" },
  { label: "Difficulty", studio: "Briefing", photoshop: "Tinggi", designer: "Revisi", dowa: "Mudah" },
  { label: "Output", studio: "Terbatas", photoshop: "Manual", designer: "Sesuai brief", dowa: "Banyak variasi" },
  { label: "Automation", studio: "Tidak", photoshop: "Tidak", designer: "Tidak", dowa: "Ya" },
];

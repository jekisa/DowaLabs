# DowaLabs Membership

Aplikasi subscription SaaS berbasis Next.js dan MongoDB dengan pembayaran
manual melalui transfer bank. Aplikasi tidak memakai payment gateway atau
webhook pembayaran.

## Alur Pembayaran

1. User register atau login.
2. User mengaktifkan paket Pro.
3. Sistem membuat invoice dengan harga dan rekening tujuan yang disimpan
   sebagai snapshot.
4. User transfer ke rekening perusahaan.
5. User mengunggah bukti transfer dan nama pemilik rekening pengirim.
6. Admin memeriksa bukti, memilih durasi 1, 3, 6, atau 12 bulan, lalu
   menyetujui atau menolak pembayaran.
7. Approval admin mengaktifkan subscription sesuai durasi yang dipilih.
   Renewal sebelum masa aktif habis dihitung dari tanggal akhir yang berjalan.
8. Canvas hanya tersedia selama status user `active` dan tanggal akhir belum
   lewat.

## Stack

- Next.js App Router, React, dan TypeScript
- Tailwind CSS, shadcn/ui, Framer Motion, dan Lucide
- MongoDB Atlas dan Mongoose
- JWT dalam cookie `httpOnly`
- bcryptjs untuk password
- Zod untuk validasi input

Bukti transfer disimpan privat sebagai data biner di collection
`manualpayments`. File tidak berada di folder `public` dan hanya dapat dibaca
oleh pemilik invoice atau admin yang sedang login.

## Instalasi

```bash
npm install
Copy-Item .env.example .env.local
```

Isi `.env.local`:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/dowalabs
JWT_SECRET=gunakan-random-secret-yang-panjang
NEXT_PUBLIC_APP_URL=http://localhost:3000

DEFAULT_CANVAS_URL=https://contoh-canvas-url
DEFAULT_BACKGROUND_REMOVER_URL=
DEFAULT_COLOR_GRADING_URL=
DEFAULT_PORTRAIT_STYLE_URL=
DEFAULT_PROMPT_AI_URL=
DEFAULT_ADMIN_WHATSAPP=628123456789
DEFAULT_PRO_PRICE=30000

BANK_NAME=BCA
BANK_ACCOUNT_NUMBER=1234567890
BANK_ACCOUNT_HOLDER=PT DOWALABS INDONESIA

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password-admin-minimal-8-karakter
ADMIN_WHATSAPP=628123456789
```

Kelima Gemini Canvas link, rekening, dan harga dapat diubah tanpa deploy
melalui `/admin/settings`. `DEFAULT_CANVAS_URL` digunakan untuk Product Studio;
empat link lainnya boleh dikosongkan dan diisi kemudian. Nilai rekening
disalin ke invoice saat invoice dibuat sehingga invoice lama tetap konsisten.

Menu Gemini Canvas untuk member aktif:

- Product Studio
- Background Remover
- Color Grading
- Potrait Style
- 5000 Prompt AI

## Setup MongoDB Atlas

1. Buat cluster dan database user di MongoDB Atlas.
2. Izinkan IP development pada Network Access.
3. Tambahkan nama database `dowalabs` pada connection string.
4. Simpan connection string sebagai `MONGODB_URI`.
5. Gunakan Atlas atau replica set karena approval memakai transaction agar
   aktivasi user dan perubahan status invoice bersifat atomik.

Collection utama:

- `users`: akun dan masa aktif subscription
- `manualpayments`: invoice, bukti transfer, dan audit verifikasi
- `appsettings`: harga, rekening perusahaan, kontak, dan Canvas URL

## Seed Admin

```bash
npm run seed:admin
```

Seed bersifat idempotent dan memakai `ADMIN_EMAIL`, `ADMIN_PASSWORD`, serta
`ADMIN_WHATSAPP`.

Jika database berasal dari versi lama yang memiliki index unik pada field
legacy `users.id`, jalankan migration aman berikut (tidak menghapus user):

```bash
npm run db:fix-indexes
```

## Menjalankan Aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Pengujian Alur

### User

1. Daftar melalui `/signup` dan pilih paket.
2. Di `/payment`, klik **Buat Invoice**.
3. Pastikan invoice menampilkan nomor, nominal, rekening, dan batas waktu.
4. Upload PNG, JPG, WEBP, atau PDF maksimal 4 MB.
5. Pastikan status berubah menjadi **Menunggu Verifikasi** dan Canvas tetap
   terkunci.

### Admin

1. Login menggunakan akun admin.
2. Buka `/admin/payments`.
3. Periksa bukti transfer, identitas pengirim, dan nominal invoice.
4. Pilih durasi 1, 3, 6, atau 12 bulan.
5. Klik **Setujui & Aktifkan** atau **Tolak** dengan catatan.
6. Approval harus mengubah user menjadi `active` dan mengisi tanggal mulai
   serta tanggal akhir subscription.

### User Setelah Approval

1. Refresh `/dashboard`.
2. Pastikan paket dan masa aktif tampil benar.
3. Tombol Canvas hanya terbuka untuk subscription yang masih aktif.

## API

User:

- `GET /api/payments/manual` — riwayat invoice milik user
- `POST /api/payments/manual` — membuat invoice
- `POST /api/payments/manual/:id/proof` — upload atau ganti bukti
- `GET /api/payments/manual/:id/proof` — melihat bukti secara terproteksi

Admin:

- `GET /api/admin/payments` — daftar pembayaran manual
- `PATCH /api/admin/manual-payments/:id` — approve atau reject
- `GET/PATCH /api/admin/settings` — rekening, harga, dan pengaturan aplikasi

## Aturan Keamanan

- Password asli tidak disimpan; hanya hash bcrypt.
- Bukti diverifikasi dari magic bytes, bukan hanya ekstensi file.
- Format yang diterima: PNG, JPG, WEBP, dan PDF; maksimal 4 MB.
- User hanya dapat membaca bukti pada invoice miliknya.
- API verifikasi hanya dapat dipanggil role admin.
- Approval kedua pada invoice yang sama ditolak.
- Bukti transfer tidak otomatis mengaktifkan akses.
- Subscription tanpa tanggal akhir tidak dianggap aktif.

## Quality Checks

```bash
npx tsc --noEmit
npm run build
```

# PRD.md — DowaLabs Membership Website

## 1. Product Overview

**Product Name:** DowaLabs  
**Product Type:** SaaS Membership Website / Digital Access Gateway  
**Main Purpose:**  
Website ini dibuat untuk menarik calon pembeli agar signup, login, membeli akses membership, lalu masuk ke dashboard member untuk membuka aplikasi Google Canvas/Gemini Canvas milik DowaLabs.

Website tidak membuat fitur AI generator sendiri di tahap awal. Website hanya berfungsi sebagai:
- Landing page promosi
- Sistem signup/login
- Sistem membership
- Sistem pembayaran via Lynk.id
- Dashboard member
- Admin dashboard
- Gateway tombol ke Google Canvas

---

## 2. Problem Statement

Saat ini akses Google Canvas masih berupa link biasa. Jika link langsung dibagikan ke pembeli, akses sulit dikontrol, sulit mengetahui siapa yang aktif, siapa yang sudah expired, dan siapa yang sudah bayar.

DowaLabs membutuhkan website yang:
- Membuat produk terlihat profesional
- Membuat orang tertarik daftar dan beli
- Menyimpan data user di MongoDB
- Mengunci akses sebelum pembayaran aktif
- Mengaktifkan user setelah pembayaran berhasil
- Mengarahkan user aktif ke Google Canvas melalui tombol dashboard

---

## 3. Goals & Objectives

### Goals
1. Membuat website DowaLabs yang terlihat premium dan menarik.
2. Membuat sistem signup/login berbasis email.
3. Menyimpan user dan status membership di MongoDB.
4. Menyediakan halaman pembayaran yang mengarah ke Lynk.id.
5. Mendukung webhook Lynk untuk aktivasi otomatis.
6. Menyediakan dashboard member dengan tombol ke Google Canvas.
7. Menyediakan admin dashboard untuk kontrol user, pembayaran, dan link Canvas.

### Success Criteria
- User bisa daftar akun.
- User bisa login.
- User baru otomatis berstatus `pending`.
- User pending belum bisa membuka Google Canvas.
- User bisa klik tombol pembayaran via Lynk.
- Setelah pembayaran sukses, webhook Lynk bisa mengaktifkan user.
- Admin bisa mengaktifkan user manual jika webhook gagal.
- User aktif bisa klik tombol “Buka DowaLabs AI Canvas”.
- Admin bisa mengganti link Canvas tanpa deploy ulang.

---

## 4. Scope

### In Scope
- Landing page promosi
- Video demo section
- Animation section
- Before/after product photo section
- Pricing section
- FAQ section
- Signup
- Login
- Logout
- User dashboard
- Payment page
- Lynk payment redirect
- Lynk webhook endpoint
- MongoDB user database
- MongoDB payment log
- Admin dashboard
- User membership management
- Canvas URL setting
- Responsive design
- Vercel deployment support

### Out of Scope for Version 1
- Generate foto AI langsung di website
- Upload produk langsung di website
- Storage file user
- Payment gateway selain Lynk
- Mobile app native
- Subscription auto-renewal
- WhatsApp API otomatis
- Invoice otomatis PDF
- Multi-language
- Affiliate/referral system

---

## 5. Target Users

### Primary Users
- Seller Shopee
- Affiliate marketer
- Reseller produk fashion, mukena, skincare, parfum, dan produk digital
- Pemilik UMKM yang ingin membuat foto produk lebih menarik

### Admin
- Owner DowaLabs
- Tim support/payment checker

---

## 6. User Flow

### Flow 1 — Visitor to Signup
1. Visitor membuka landing page DowaLabs.
2. Visitor melihat video demo, animasi, contoh hasil, benefit, dan pricing.
3. Visitor klik tombol “Mulai Sekarang”.
4. Visitor masuk halaman signup.
5. Visitor membuat akun.
6. Sistem menyimpan data user ke MongoDB.
7. Status user default: `pending`.
8. User diarahkan ke halaman payment.

### Flow 2 — Payment via Lynk
1. User berada di halaman payment.
2. User memilih paket Basic/Pro.
3. User klik tombol “Bayar via Lynk”.
4. User diarahkan ke halaman Lynk.id.
5. User menyelesaikan pembayaran.
6. Lynk mengirim webhook ke endpoint DowaLabs.
7. Sistem menyimpan payload webhook ke MongoDB.
8. Sistem mencocokkan transaksi dengan user.
9. Jika valid, sistem mengubah status user menjadi `active`.
10. Sistem mengisi `membershipStart` dan `membershipEnd`.

### Flow 3 — Active Member Access
1. User login ke website.
2. User masuk dashboard.
3. Sistem cek status membership.
4. Jika status `active`, tombol “Buka DowaLabs AI Canvas” aktif.
5. User klik tombol.
6. User diarahkan ke Google Canvas/Gemini Canvas.

### Flow 4 — Pending / Expired User
1. User login.
2. Sistem cek status membership.
3. Jika status `pending`, `expired`, atau `blocked`, tombol Canvas terkunci.
4. User melihat pesan untuk melakukan pembayaran/perpanjangan.

### Flow 5 — Admin Manual Activation
1. Admin login.
2. Admin membuka halaman user management.
3. Admin mencari user.
4. Admin mengubah status user menjadi `active`.
5. Admin mengatur tanggal expired.
6. User bisa membuka Canvas.

---

## 7. User Roles

### User
- Bisa signup
- Bisa login/logout
- Bisa melihat dashboard
- Bisa melihat status membership
- Bisa membuka payment page
- Bisa membuka Canvas jika status active

### Admin
- Bisa login ke admin dashboard
- Bisa melihat semua user
- Bisa mengubah status membership
- Bisa mengatur tanggal mulai dan expired
- Bisa melihat payment logs
- Bisa mengganti Lynk payment URL
- Bisa mengganti Google Canvas URL
- Bisa block user

---

## 8. Membership Status

Gunakan enum:

```txt
pending
active
expired
blocked
```

### Status Behavior

| Status | Akses Dashboard | Akses Canvas | Keterangan |
|---|---:|---:|---|
| pending | Ya | Tidak | User sudah daftar tapi belum aktif |
| active | Ya | Ya | User aktif dan bisa membuka Canvas |
| expired | Ya | Tidak | Masa aktif habis |
| blocked | Tidak/terbatas | Tidak | User diblokir admin |

---

## 9. Pricing Plan

### Basic
- Harga awal: Rp19.000 / bulan
- Akses dashboard
- Akses Google Canvas
- Akses tutorial dasar

### Pro
- Harga awal: Rp35.000 / bulan
- Semua fitur Basic
- Akses prompt premium
- Akses template/preset tambahan
- Prioritas update

Harga harus bisa diubah dari admin dashboard atau environment/config.

---

## 10. Page Requirements

## 10.1 Landing Page

Route:

```txt
/
```

Sections:
1. Navbar
2. Hero section
3. Video demo section
4. Before/after animation section
5. How it works
6. Feature benefits
7. Product examples
8. Pricing section
9. FAQ
10. CTA footer

Hero copy:

```txt
DowaLabs AI Product Studio
Buat foto produk affiliate lebih menarik, premium, dan siap jual dengan bantuan AI.
```

CTA:
- “Mulai Sekarang”
- “Lihat Demo”
- “Login”

Design:
- Premium SaaS style
- Dark navy / white / gold accent
- Responsive mobile
- Smooth animation with Framer Motion
- Clean and high-converting layout

---

## 10.2 Signup Page

Route:

```txt
/signup
```

Fields:
- Full name
- Email
- WhatsApp number
- Password
- Confirm password

Rules:
- Email wajib unik
- Password minimal 8 karakter
- WhatsApp wajib diisi
- Setelah signup, status user = `pending`
- Redirect ke `/payment`

---

## 10.3 Login Page

Route:

```txt
/login
```

Fields:
- Email
- Password

Rules:
- Login memakai email
- Password diverifikasi dengan bcrypt
- Setelah login:
  - User biasa ke `/dashboard`
  - Admin ke `/admin`

---

## 10.4 Payment Page

Route:

```txt
/payment
```

Content:
- Status akun user
- Pilihan paket Basic/Pro
- Harga paket
- Tombol “Bayar via Lynk”
- Tombol “Kirim Bukti ke WhatsApp”
- Instruksi pembayaran

Rules:
- User harus login untuk membuka payment page
- Tombol Lynk memakai URL dari `AppSettings`
- Tombol WA membuka link WhatsApp admin
- User tetap pending sampai webhook/admin mengaktifkan

Example WhatsApp message:

```txt
Halo admin DowaLabs, saya sudah bayar.

Nama:
Email akun:
Nomor WhatsApp:
Paket:
Order ID Lynk:
Bukti pembayaran saya kirim di chat ini.
```

---

## 10.5 User Dashboard

Route:

```txt
/dashboard
```

Content:
- Welcome card
- Membership status badge
- Masa aktif membership
- Video tutorial
- Cara kerja singkat
- Prompt tips
- Tombol utama “Buka DowaLabs AI Canvas”
- Tombol “Perpanjang Akses” jika expired/pending

Rules:
- Hanya user login yang bisa masuk
- Jika status `active`, tombol Canvas aktif
- Jika status selain `active`, tombol Canvas terkunci
- Jika `membershipEnd` sudah lewat, sistem bisa menampilkan status expired

---

## 10.6 Admin Dashboard

Route:

```txt
/admin
```

Pages:
- `/admin` overview
- `/admin/users`
- `/admin/payments`
- `/admin/settings`

Admin Overview:
- Total users
- Active users
- Pending users
- Expired users
- Total payment logs

User Management:
- Table user
- Search by name/email/WhatsApp
- Filter by membership status
- Edit status
- Edit package
- Edit membership start/end
- Block user
- Manual activate

Payment Logs:
- List webhook payloads
- Payment status
- Order ID
- Transaction ID
- Amount
- User matched or not
- Processed or not
- Raw payload viewer

Settings:
- Google Canvas URL
- Lynk Basic payment URL
- Lynk Pro payment URL
- Admin WhatsApp number
- Basic price
- Pro price

---

## 11. Tech Stack

### Frontend
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React

### Backend
- Next.js API Routes / Route Handlers
- MongoDB Atlas
- Mongoose

### Auth
- Custom auth with email/password
- bcrypt for password hashing
- JWT/session cookie
- Middleware route protection

Alternative allowed:
- Auth.js with MongoDB adapter if easier

### Hosting
- Vercel

### Payment
- Lynk.id payment link
- Lynk.id webhook

---

## 12. Environment Variables

Create `.env.example`:

```env
MONGODB_URI=
JWT_SECRET=
NEXT_PUBLIC_APP_URL=
LYNK_WEBHOOK_SECRET=
ADMIN_EMAIL=
ADMIN_DEFAULT_PASSWORD=
```

Optional:

```env
NEXT_PUBLIC_BRAND_NAME=DowaLabs
```

---

## 13. MongoDB Data Models

## 13.1 User Model

```ts
{
  _id: ObjectId,
  name: string,
  email: string,
  whatsapp: string,
  passwordHash: string,
  role: "user" | "admin",
  membershipStatus: "pending" | "active" | "expired" | "blocked",
  packageName: "basic" | "pro" | null,
  membershipStart: Date | null,
  membershipEnd: Date | null,
  lastLoginAt: Date | null,
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:
- email unique
- whatsapp
- membershipStatus
- role

---

## 13.2 PaymentLog Model

```ts
{
  _id: ObjectId,
  provider: "lynk",
  userId: ObjectId | null,
  orderId: string | null,
  transactionId: string | null,
  email: string | null,
  whatsapp: string | null,
  amount: number | null,
  currency: "IDR",
  packageName: "basic" | "pro" | null,
  status: string,
  rawPayload: object,
  processed: boolean,
  processingError: string | null,
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:
- orderId unique sparse
- transactionId unique sparse
- userId
- processed
- status

---

## 13.3 AppSettings Model

```ts
{
  _id: ObjectId,
  canvasUrl: string,
  lynkBasicUrl: string,
  lynkProUrl: string,
  adminWhatsapp: string,
  basicPrice: number,
  proPrice: number,
  updatedAt: Date
}
```

Rules:
- Only admin can update settings
- User dashboard reads `canvasUrl`
- Payment page reads Lynk URLs and prices

---

## 14. API Routes

## 14.1 Auth

```txt
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Signup Payload

```json
{
  "name": "User Name",
  "email": "user@email.com",
  "whatsapp": "08123456789",
  "password": "password123"
}
```

### Signup Result
- Create user
- Hash password
- Set role = `user`
- Set membershipStatus = `pending`

---

## 14.2 User Dashboard

```txt
GET /api/me
GET /api/settings/public
```

`/api/settings/public` only returns:
- canvasUrl only if active user requests it
- Lynk payment URLs
- admin WhatsApp
- prices

---

## 14.3 Admin

```txt
GET    /api/admin/users
PATCH  /api/admin/users/:id
GET    /api/admin/payments
GET    /api/admin/settings
PATCH  /api/admin/settings
```

Admin-only rules:
- Middleware must check role = `admin`
- User cannot access admin APIs

---

## 14.4 Lynk Webhook

Route:

```txt
POST /api/webhook/lynk
```

Responsibilities:
1. Receive webhook payload from Lynk.
2. Save raw payload into `PaymentLog`.
3. Validate payload status.
4. Detect duplicate order/transaction.
5. Match payment to user.
6. Activate membership.
7. Return HTTP 200 quickly.

Pseudo flow:

```txt
Receive payload
→ Extract orderId, transactionId, email, whatsapp, amount, status, product/package
→ Save raw payload
→ If status is not success/paid/completed, mark processed false
→ Check duplicate orderId/transactionId
→ Find user by email or whatsapp
→ If user found:
    update user membershipStatus active
    set packageName
    set membershipStart now
    set membershipEnd now + 30 days
    mark PaymentLog processed true
→ If user not found:
    mark processed false
    store error "USER_NOT_FOUND"
→ Return success response
```

Accepted success statuses should be configurable because Lynk payload may use different naming:

```txt
paid
success
successful
completed
checkout_success
payment_success
```

Security:
- Use `LYNK_WEBHOOK_SECRET` if Lynk provides signature/secret
- If signature not available, still save payload but keep manual verification option
- Do not process duplicate transaction
- Do not expose webhook secret in frontend

---

## 15. Membership Expiry Logic

Rules:
- If `membershipEnd` < current date, user is expired.
- System can either:
  1. Update status to `expired` during login/dashboard request, or
  2. Display computed expired state without mutating database.

Recommended:
- On dashboard load, if active but expired date passed, update to `expired`.

Renewal:
- If expired user pays again, set:
  - membershipStatus = `active`
  - membershipStart = now
  - membershipEnd = now + 30 days

If active user renews before expiry:
- Extend from existing `membershipEnd`, not from today.

Example:
```txt
If active and membershipEnd is future:
newEnd = membershipEnd + 30 days
Else:
newEnd = now + 30 days
```

---

## 16. UI/UX Requirements

### Global Style
- Premium SaaS
- Clean
- Modern
- Mobile responsive
- Fast loading
- Smooth but not excessive animation

### Color Direction
- Dark navy
- White
- Gold/amber accent
- Soft gray
- Optional gradient background

### Components
Use shadcn/ui:
- Button
- Card
- Badge
- Dialog
- Table
- Input
- Label
- Dropdown
- Tabs
- Sheet/sidebar drawer
- Toast notification

### Animation
Use Framer Motion for:
- Hero entrance
- Cards fade-up
- Before/after visual
- Pricing hover
- Dashboard card transition

---

## 17. Dashboard Content

User dashboard should include:

### Main Card
Title:
```txt
Selamat datang di DowaLabs
```

Subtitle:
```txt
Akses tool AI Product Studio dan mulai buat foto produk affiliate yang siap jual.
```

### Status Card
Show:
- Status membership
- Package
- Expired date
- Remaining days

### Canvas Button
If active:
```txt
Buka DowaLabs AI Canvas
```

If not active:
```txt
Akses terkunci. Selesaikan pembayaran untuk membuka DowaLabs AI Canvas.
```

### Tutorial Section
- Embedded video placeholder
- Step-by-step short guide

### Prompt Tips Section
- 3–5 tips singkat untuk hasil foto produk lebih bagus

---

## 18. Validation Rules

Signup:
- Name required
- Email required and valid
- Email unique
- WhatsApp required
- Password required
- Password min 8 chars

Login:
- Email required
- Password required

Admin Settings:
- Canvas URL must be valid URL
- Lynk URLs must be valid URL
- WhatsApp must be valid Indonesian phone format or international format
- Price must be number >= 0

Webhook:
- Payload must be JSON
- Save raw payload even if incomplete
- Do not crash on unexpected payload shape
- Return 200 after safe handling to avoid repeated failures
- Log processing error clearly

---

## 19. Security Requirements

- Password must be hashed with bcrypt.
- JWT/session secret must be stored in env.
- Admin route must be protected.
- User route must be protected.
- User cannot access other user data.
- Canvas URL should be returned only to active members.
- Webhook endpoint must not expose internal errors.
- Payment webhook must be idempotent.
- Avoid storing plain password.
- Avoid exposing MongoDB URI.
- Avoid exposing JWT_SECRET.

---

## 20. Vercel Deployment Requirements

Project must run on Vercel.

Required:
- Works with serverless API routes
- MongoDB connection cached to avoid too many connections
- Environment variables documented
- Build without TypeScript errors
- README deployment steps

---

## 21. Folder Structure Recommendation

```txt
/src
  /app
    /(public)
      /page.tsx
      /login/page.tsx
      /signup/page.tsx
      /payment/page.tsx
    /(member)
      /dashboard/page.tsx
    /admin
      /page.tsx
      /users/page.tsx
      /payments/page.tsx
      /settings/page.tsx
    /api
      /auth
        /signup/route.ts
        /login/route.ts
        /logout/route.ts
        /me/route.ts
      /admin
        /users/route.ts
        /settings/route.ts
        /payments/route.ts
      /webhook
        /lynk/route.ts
  /components
    /landing
    /dashboard
    /admin
    /ui
  /lib
    mongodb.ts
    auth.ts
    session.ts
    validators.ts
    membership.ts
  /models
    User.ts
    PaymentLog.ts
    AppSettings.ts
  /middleware.ts
```

---

## 22. Content Copy

### Hero
```txt
DowaLabs AI Product Studio
Buat foto produk affiliate lebih menarik, premium, dan siap jual dengan bantuan AI.
```

### Benefit
```txt
Tidak perlu desain dari nol. DowaLabs membantu kamu membuat tampilan produk lebih profesional, cocok untuk seller, affiliate, dan UMKM.
```

### How It Works
```txt
1. Daftar akun DowaLabs
2. Pilih paket dan lakukan pembayaran
3. Login ke dashboard
4. Klik tombol DowaLabs AI Canvas
5. Mulai buat foto produk siap jual
```

### Locked Access Message
```txt
Akses kamu belum aktif. Selesaikan pembayaran atau hubungi admin untuk aktivasi akun.
```

### Expired Message
```txt
Masa aktif kamu sudah berakhir. Silakan perpanjang akses untuk membuka DowaLabs AI Canvas.
```

---

## 23. Testing Checklist

### Auth
- [ ] Signup berhasil
- [ ] Email duplicate ditolak
- [ ] Password di-hash
- [ ] Login berhasil
- [ ] Login salah ditolak
- [ ] Logout berhasil

### Membership
- [ ] User baru status pending
- [ ] Pending tidak bisa membuka Canvas
- [ ] Active bisa membuka Canvas
- [ ] Expired tidak bisa membuka Canvas
- [ ] Blocked tidak bisa membuka Canvas

### Payment
- [ ] Payment page tampil
- [ ] Tombol Lynk Basic benar
- [ ] Tombol Lynk Pro benar
- [ ] Tombol WhatsApp benar
- [ ] Webhook menyimpan payload
- [ ] Webhook sukses mengaktifkan user
- [ ] Duplicate webhook tidak memproses dua kali
- [ ] Payment tanpa user match tersimpan sebagai unprocessed

### Admin
- [ ] Admin bisa lihat user
- [ ] Admin bisa update status
- [ ] Admin bisa update expired date
- [ ] Admin bisa lihat payment logs
- [ ] Admin bisa update Canvas URL
- [ ] User biasa tidak bisa akses admin

### Deployment
- [ ] Build sukses di Vercel
- [ ] MongoDB konek di production
- [ ] Env lengkap
- [ ] Webhook URL bisa menerima POST

---

## 24. Development Prompt for Codex / Claude Code

Use this prompt to build the project:

```md
Build a full-stack SaaS membership website called DowaLabs.

Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- MongoDB Atlas
- Mongoose
- bcrypt
- JWT or secure cookie session
- Vercel-compatible API routes

Product goal:
DowaLabs is a membership website that attracts users with a premium landing page, lets them signup/login, pay via Lynk.id, and access a member dashboard. Active members can click a button that redirects them to the DowaLabs Google Canvas/Gemini Canvas link. Pending/expired/blocked users cannot access the Canvas link.

Create:
1. Landing page with hero, video demo placeholder, animation, before/after section, benefits, pricing, FAQ, CTA.
2. Signup page.
3. Login page.
4. Payment page with Lynk Basic/Pro payment buttons and WhatsApp confirmation button.
5. User dashboard with membership status, tutorial section, and Canvas access button.
6. Admin dashboard with user management, payment logs, and settings.
7. MongoDB models: User, PaymentLog, AppSettings.
8. API routes for auth, dashboard data, admin management, settings, and Lynk webhook.
9. Middleware to protect member/admin routes.
10. Webhook route POST /api/webhook/lynk that stores raw payload, checks payment success, prevents duplicate processing, matches user by email/whatsapp/orderId, and activates membership for 30 days.
11. README with setup and deployment steps.
12. .env.example.

Important rules:
- User signup default membershipStatus = pending.
- Passwords must be hashed.
- Canvas URL only available to active users.
- Admin can manually activate users.
- Admin can change Canvas URL and Lynk URLs.
- Webhook must be idempotent.
- Do not use Supabase.
- Do not use payment gateway other than Lynk.
- Make UI premium, responsive, and clean.
```

---

## 25. Version 1 Delivery Definition

Version 1 dianggap selesai jika:

- Website bisa dideploy ke Vercel.
- MongoDB tersambung.
- User bisa signup/login.
- User pending terkunci.
- Payment page mengarah ke Lynk.
- Webhook Lynk endpoint tersedia.
- Payment log tersimpan.
- Admin bisa mengaktifkan user manual.
- User active bisa membuka link Google Canvas.
- Admin bisa mengganti Canvas URL.
- UI landing page terlihat layak untuk jualan.

---

## 26. Future Improvements

- Auto email notification
- WhatsApp notification
- Referral system
- Coupon code
- Free trial system
- Upload bukti pembayaran
- Analytics dashboard
- Auto expiry cron
- Multiple Canvas links by package
- Preset prompt library inside dashboard
- Affiliate reseller dashboard
- Invoice download
- Renewal reminder

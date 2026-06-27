# DowaLabs Membership Website

SaaS membership website / digital access gateway for **DowaLabs AI Product Studio**.
Visitors land on a premium marketing page, sign up, pay via **Lynk.id**, and — once
their membership is active — open the DowaLabs **Google / Gemini Canvas** from their
member dashboard. Admins manage users, memberships, payment logs, and settings.

Built per [`PRD_dowa.md`](./PRD_dowa.md).

## ✨ Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**-style components
- **Framer Motion** animations
- **MongoDB Atlas** + **Mongoose**
- Custom **JWT** auth (httpOnly cookie) signed/verified with **jose**, passwords hashed with **bcryptjs**
- **Vercel** ready (cached serverless DB connection, edge middleware)

## 📁 Project Structure

```
src/
  app/
    (marketing)/            # public site: /, /pricing, /demo, /faq (shared navbar+footer)
    (auth)/                 # /login, /signup
    payment/                # /payment (auth required)
    dashboard/              # /dashboard (auth required)
    admin/                  # /admin, /admin/users, /admin/payments, /admin/settings (admin only)
    api/
      auth/                 # signup, login, logout, me
      me/                   # current user
      settings/public/      # public settings (+ canvasUrl for active members)
      admin/                # users, users/[id], payments, settings, stats
      webhook/lynk/         # POST Lynk webhook
  components/
    landing/ site/ auth/ payment/ dashboard/ admin/ motion/ ui/
  lib/
    mongodb.ts auth.ts jwt.ts server-auth.ts validators.ts membership.ts
    lynk.ts serialize.ts api.ts bootstrap.ts constants.ts utils.ts
  models/
    User.ts PaymentLog.ts AppSettings.ts
  middleware.ts             # route protection (JWT, edge runtime)
scripts/
  seed-admin.ts             # create / refresh the default admin
```

## 🚀 Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example file and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Long random string for signing session cookies (`openssl rand -base64 48`) |
| `NEXT_PUBLIC_APP_URL` | ✅ | App base URL (e.g. `http://localhost:3000`) |
| `LYNK_WEBHOOK_SECRET` | optional | Shared secret to verify Lynk webhook requests |
| `ADMIN_EMAIL` | ✅ | Default admin login email |
| `ADMIN_DEFAULT_PASSWORD` | ✅ | Default admin password (change after first login) |
| `DEFAULT_CANVAS_URL` | optional | Initial Google/Gemini Canvas link |
| `DEFAULT_ADMIN_WHATSAPP` | optional | Initial admin WhatsApp number |
| `DEFAULT_LYNK_BASIC_URL` / `DEFAULT_LYNK_PRO_URL` | optional | Initial Lynk payment links |
| `NEXT_PUBLIC_BRAND_NAME` | optional | Brand name (default `DowaLabs`) |

> `DEFAULT_*` values only seed the `AppSettings` document on first run. After that,
> change everything from **/admin/settings** — no redeploy needed.

### 3. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

### 4. Create the admin account

The default admin is **created automatically on the first login attempt** using
`ADMIN_EMAIL` / `ADMIN_DEFAULT_PASSWORD`. You can also seed it explicitly:

```bash
npm run seed:admin
```

Then log in at `/login` with those credentials — admins are redirected to `/admin`.

## 🗄️ MongoDB Atlas Setup

1. Create a free cluster at <https://www.mongodb.com/atlas>.
2. **Database Access** → add a database user (username + password).
3. **Network Access** → allow your IP, and add `0.0.0.0/0` so Vercel can connect.
4. **Connect → Drivers** → copy the connection string and put it in `MONGODB_URI`,
   e.g. `mongodb+srv://USER:PASS@cluster0.xxxx.mongodb.net/dowalabs?retryWrites=true&w=majority`
   (the `/dowalabs` segment is the database name).

Collections (`users`, `paymentlogs`, `appsettings`) and indexes are created
automatically by Mongoose on first use.

## ▲ Deploy to Vercel

1. Push this repo to GitHub/GitLab.
2. In Vercel, **New Project** → import the repo (framework auto-detected as Next.js).
3. **Settings → Environment Variables** → add every variable from `.env.example`
   (set `NEXT_PUBLIC_APP_URL` to your production URL, e.g. `https://yourapp.vercel.app`).
4. **Deploy**. The build runs `next build`; the MongoDB connection is cached across
   serverless invocations to avoid exhausting Atlas connections.
5. After the first deploy, hit `/login` once (or run `npm run seed:admin` locally
   against the same `MONGODB_URI`) to create the admin.

## 🔔 Lynk.id Webhook Setup

**Endpoint:** `POST https://<your-domain>/api/webhook/lynk`

1. In your Lynk.id dashboard, set the webhook/callback URL to the endpoint above.
2. (Optional) If Lynk lets you configure a secret/signature, put the same value in
   `LYNK_WEBHOOK_SECRET`. The webhook checks the `x-lynk-signature` /
   `x-webhook-secret` / `x-signature` / `Authorization: Bearer` header, or a
   `secret`/`signature`/`token` field in the payload. If no secret is configured,
   unsigned webhooks are accepted (and still logged) for manual verification.

What the webhook does (idempotent & crash-safe):

1. Saves the **raw payload** to `PaymentLog` (always, even if fields are missing).
2. Extracts `orderId`, `transactionId`, `email`, `whatsapp`, `amount`, `status`,
   `package` defensively from many possible key names / nesting.
3. Skips processing if the status isn't a success status
   (`paid`, `success`, `successful`, `completed`, `checkout_success`, …).
4. De-duplicates by `orderId` / `transactionId` (won't activate twice).
5. Matches a user by **email**, then **whatsapp**.
6. On match: sets `membershipStatus = active`, `membershipStart = now`,
   `membershipEnd = now + 30 days` (extends from the current end date for active
   renewals), and marks the log `processed = true`.
7. If no user matches, stores the log with `processed = false` and
   `processingError = "USER_NOT_FOUND"` for manual handling.
8. Always returns HTTP 200 after safe handling (except on an invalid signature → 401).

> A `GET` on the same URL returns a small JSON health check so you can verify the
> endpoint is reachable from a browser.

### Test the webhook locally

```bash
curl -X POST http://localhost:3000/api/webhook/lynk \
  -H "Content-Type: application/json" \
  -d '{"status":"paid","email":"user@email.com","order_id":"ORD-123","transaction_id":"TRX-123","amount":19000,"product":"Basic"}'
```

## 🔐 Membership Status

| Status | Dashboard | Canvas | Meaning |
|---|---|---|---|
| `pending` | ✅ | ❌ | Signed up, not paid yet |
| `active` | ✅ | ✅ | Paid & within 30 days |
| `expired` | ✅ | ❌ | Period ended (auto-flips on login/dashboard) |
| `blocked` | limited | ❌ | Blocked by admin |

Only **active** members receive the Canvas URL (returned from the server, never
exposed to non-active users).

## 🧑‍💼 Admin Features (`/admin`)

- **Overview** — user counts by status + payment log totals.
- **Users** — search/filter, edit status/package/role/dates, one-click activate
  (30 days), block.
- **Payment Logs** — every Lynk payload, processed state, raw payload viewer.
- **Settings** — Canvas URL, Lynk Basic/Pro URLs, admin WhatsApp, Basic/Pro prices.

## 🧪 Scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run start        # run production build
npm run lint         # eslint
npm run seed:admin   # create / refresh the default admin
```

## 🔒 Security Notes

- Passwords hashed with bcrypt (cost 12); the hash is `select: false` and never returned.
- Session is a signed JWT in an `httpOnly`, `sameSite=lax`, `secure` (in prod) cookie.
- `middleware.ts` guards `/dashboard`, `/payment` (auth) and `/admin` (admin role);
  admin API routes & layout re-check the role server-side (defense in depth).
- The webhook never leaks internal errors and is idempotent.
- Secrets (`MONGODB_URI`, `JWT_SECRET`, `LYNK_WEBHOOK_SECRET`) stay server-side only.

---

© DowaLabs. Built from `PRD_dowa.md`.

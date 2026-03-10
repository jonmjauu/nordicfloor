# NordicFloor Ecommerce (Next.js + Stripe + Drizzle)

Production-oriented ecommerce starter for a flooring company, built with:

- Next.js App Router + TypeScript
- Tailwind CSS
- Drizzle ORM + PostgreSQL (Neon/Supabase-compatible)
- Stripe Checkout + webhook
- Simple protected admin area

## Features

- Scandinavian-style homepage with:
  - Hero
  - Product collections
  - Benefits section
  - Calculator teaser
  - Inspiration grid
  - FAQ accordion
  - Contact/offer form
- Product detail pages
- Client-side cart (localStorage)
- Checkout flow with Stripe Checkout
- Order persistence in DB (`pending` → `paid` via webhook)
- Customer auth + account area:
  - Registration/login/logout
  - Customer dashboard (`/kunde`) with order history
  - Refund request flow
  - Support ticket system with message replies
- Admin dashboard (`/admin`):
  - Overview cards
  - Orders list + detail + status update
  - Products list + create/edit/delete
- Calculator page (`/kalkulator`) with wastage and package calculation

## Project Structure

```txt
app/
  page.tsx
  kalkulator/page.tsx
  produkter/[slug]/page.tsx
  cart/page.tsx
  checkout/page.tsx
  success/page.tsx
  cancel/page.tsx
  admin/page.tsx
  admin/orders/page.tsx
  admin/orders/[id]/page.tsx
  admin/products/page.tsx
  admin/products/new/page.tsx
  admin/products/[id]/page.tsx
  api/products/...
  api/orders/...
  api/admin/login/route.ts
  api/admin/logout/route.ts
  api/customer/register/route.ts
  api/customer/login/route.ts
  api/customer/logout/route.ts
  api/customer/me/route.ts
  api/customer/refunds/route.ts
  api/customer/tickets/route.ts
  api/customer/tickets/[id]/messages/route.ts
  api/stripe/checkout/route.ts
  api/stripe/webhook/route.ts
components/
lib/
  db/
scripts/seed.ts
```

## Setup

1. Install dependencies

```bash
npm install
```

2. Copy env file

```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

4. Push database schema

```bash
npm run db:push
```

5. Seed demo data

```bash
npm run db:seed
```

6. Run development server

```bash
npm run dev
```

## Stripe Webhook Setup

Use Stripe CLI locally:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the generated webhook secret into `STRIPE_WEBHOOK_SECRET`.

## Deploy to Vercel

1. Push repository to Git provider.
2. Import project in Vercel.
3. Add all environment variables.
4. Deploy.
5. Create Stripe webhook endpoint:
   - `https://YOUR_DOMAIN/api/stripe/webhook`
   - Event: `checkout.session.completed`

## Cloudflare Notes

- This app uses Next.js route handlers (no Express).
- Keep Stripe and DB routes in Node runtime (`runtime = "nodejs"`) for compatibility.
- For Cloudflare Pages/Workers with Next, use the official Next-on-Cloudflare adapter workflow.
- Ensure secrets are configured in Cloudflare project environment variables.

## Customer Access

- Visit `/kunde/register` to create a customer account
- Visit `/kunde/login` to sign in
- Dashboard at `/kunde` includes:
  - order history
  - refund requests
  - support tickets/messages

Demo seeded customer (after `npm run db:seed`):
- Email: `kunde@example.com`
- Password: `demo12345`

## Admin Access

- Visit `/admin`
- Authenticate with `ADMIN_PASSWORD`
- Session stored in signed HttpOnly cookie

## Future Improvements

- Product filtering (category, color, wear layer)
- Search + sorting
- Multi-language support (NO/EN)
- Real shipping/tax calculation
- Inventory reservations and low-stock alerts
- Real transactional email provider integration

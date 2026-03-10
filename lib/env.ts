import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(8),
  ADMIN_SESSION_SECRET: z.string().min(16)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn("Environment validation warning:", parsed.error.flatten().fieldErrors);
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "",
  ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET ?? ""
};

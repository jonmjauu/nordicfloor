import { z } from "zod";

export const productInputSchema = z.object({
  name: z.string().min(2).max(160),
  slug: z.string().min(2).max(160).regex(/^[a-z0-9-]+$/),
  categoryId: z.number().int().positive(),
  description: z.string().min(10),
  price: z.number().int().nonnegative(),
  dimensions: z.string().min(3).max(120),
  sqmPerPackage: z.number().positive(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).min(1),
  featured: z.boolean().default(false),
  active: z.boolean().default(true)
});

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    address: z.string().min(5),
    postalCode: z.string().min(2),
    city: z.string().min(2),
    country: z.string().min(2),
    customerId: z.number().int().positive().optional()
  }),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive()
      })
    )
    .min(1)
});

export const adminLoginSchema = z.object({
  password: z.string().min(1)
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "cancelled", "refunded"]),
  note: z.string().min(2).max(280).optional()
});

export const customerRegisterSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  password: z.string().min(8).max(120)
});

export const customerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const refundRequestSchema = z.object({
  orderId: z.number().int().positive(),
  reason: z.string().min(8).max(1000)
});

export const ticketCreateSchema = z.object({
  orderId: z.number().int().positive().optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(5).max(2000)
});

export const ticketReplySchema = z.object({
  message: z.string().min(2).max(2000)
});

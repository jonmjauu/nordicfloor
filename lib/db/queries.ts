import { and, desc, eq, gte, inArray, or, sql } from "drizzle-orm";
import { db } from "./client";
import { categories, customers, orderItems, orders, products, refundRequests, supportTickets, ticketMessages } from "./schema";
import type { CartCheckoutItem, OrderStatus, ProductInput, StatusHistoryItem } from "@/lib/types";

export async function getCategories() {
  return db.select().from(categories).orderBy(categories.name);
}

export async function getActiveProducts() {
  return db.query.products.findMany({
    where: eq(products.active, true),
    with: { category: true },
    orderBy: [products.name]
  });
}

export async function getFeaturedProducts(limit = 8) {
  return db.query.products.findMany({
    where: and(eq(products.active, true), eq(products.featured, true)),
    with: { category: true },
    orderBy: [products.name],
    limit
  });
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: { category: true }
  });
}

export async function getProductById(id: number) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: { category: true }
  });
}

export async function getProductsForAdmin() {
  return db.query.products.findMany({
    with: { category: true },
    orderBy: [desc(products.createdAt)]
  });
}

export async function createProduct(input: ProductInput) {
  const [created] = await db
    .insert(products)
    .values({
      ...input,
      sqmPerPackage: input.sqmPerPackage.toFixed(2)
    })
    .returning();

  return created;
}

export async function updateProduct(id: number, input: ProductInput) {
  const [updated] = await db
    .update(products)
    .set({
      ...input,
      sqmPerPackage: input.sqmPerPackage.toFixed(2),
      updatedAt: new Date()
    })
    .where(eq(products.id, id))
    .returning();

  return updated;
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id));
}

export async function createPendingOrder(payload: {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    customerId?: number;
  };
  items: CartCheckoutItem[];
}) {
  const productIds = payload.items.map((item) => item.productId);
  const dbProducts = await db.query.products.findMany({
    where: inArray(products.id, productIds)
  });

  const lineItems = payload.items.map((item) => {
    const product = dbProducts.find((p) => p.id === item.productId);

    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    const unitPrice = Math.round(product.price * Number(product.sqmPerPackage));

    return {
      product,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity
    };
  });

  const subtotal = lineItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const statusHistory: StatusHistoryItem[] = [
    {
      status: "pending",
      at: new Date().toISOString(),
      note: "Order created"
    }
  ];

  const [order] = await db
    .insert(orders)
    .values({
      customerId: payload.customer.customerId,
      status: "pending",
      customerName: payload.customer.name,
      customerEmail: payload.customer.email,
      customerPhone: payload.customer.phone,
      address: payload.customer.address,
      postalCode: payload.customer.postalCode,
      city: payload.customer.city,
      country: payload.customer.country,
      subtotal,
      shipping,
      total,
      statusHistory
    })
    .returning();

  await db.insert(orderItems).values(
    lineItems.map((item) => ({
      orderId: order.id,
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal
    }))
  );

  return { order, lineItems };
}

export async function attachStripeSession(orderId: number, sessionId: string) {
  const [updated] = await db
    .update(orders)
    .set({
      stripeSessionId: sessionId,
      updatedAt: new Date()
    })
    .where(eq(orders.id, orderId))
    .returning();

  return updated;
}

export async function getOrderById(orderId: number) {
  return db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      items: true
    }
  });
}

export async function getOrderByStripeSession(sessionId: string) {
  return db.query.orders.findFirst({
    where: eq(orders.stripeSessionId, sessionId),
    with: {
      items: true
    }
  });
}

export async function listOrders() {
  return db.query.orders.findMany({
    with: {
      items: true
    },
    orderBy: [desc(orders.createdAt)]
  });
}

export async function updateOrderStatus(orderId: number, status: OrderStatus, note: string, stripePaymentId?: string) {
  const current = await db.query.orders.findFirst({
    where: eq(orders.id, orderId)
  });

  if (!current) {
    throw new Error("Order not found");
  }

  const history: StatusHistoryItem[] = [
    ...(current.statusHistory as StatusHistoryItem[]),
    {
      status,
      at: new Date().toISOString(),
      note
    }
  ];

  const [updated] = await db
    .update(orders)
    .set({
      status,
      statusHistory: history,
      stripePaymentId: stripePaymentId ?? current.stripePaymentId,
      updatedAt: new Date()
    })
    .where(eq(orders.id, orderId))
    .returning();

  return updated;
}

export async function getAdminSummary(lastDays = 30) {
  const since = new Date(Date.now() - lastDays * 24 * 60 * 60 * 1000);

  const [counts] = await db
    .select({
      totalOrders: sql<number>`count(*)::int`,
      paidOrders: sql<number>`count(*) filter (where status = 'paid')::int`,
      unpaidOrders: sql<number>`count(*) filter (where status = 'pending')::int`,
      revenue: sql<number>`coalesce(sum(total) filter (where status = 'paid'), 0)::int`
    })
    .from(orders)
    .where(gte(orders.createdAt, since));

  return counts;
}

export async function setOrderStripePaymentIntent(orderId: number, paymentIntentId: string) {
  const [updated] = await db
    .update(orders)
    .set({
      stripePaymentIntentId: paymentIntentId,
      updatedAt: new Date()
    })
    .where(eq(orders.id, orderId))
    .returning();

  return updated;
}

export async function getCustomerByEmail(email: string) {
  return db.query.customers.findFirst({ where: eq(customers.email, email) });
}

export async function getCustomerById(id: number) {
  return db.query.customers.findFirst({ where: eq(customers.id, id) });
}

export async function createCustomer(input: { name: string; email: string; passwordHash: string }) {
  const [created] = await db
    .insert(customers)
    .values({
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash
    })
    .returning();

  return created;
}

export async function listOrdersByCustomer(customerId: number, email: string) {
  return db.query.orders.findMany({
    where: or(eq(orders.customerId, customerId), eq(orders.customerEmail, email)),
    with: {
      items: true
    },
    orderBy: [desc(orders.createdAt)]
  });
}

export async function createRefundRequest(input: { customerId: number; orderId: number; reason: string }) {
  const [created] = await db
    .insert(refundRequests)
    .values({
      customerId: input.customerId,
      orderId: input.orderId,
      reason: input.reason,
      status: "requested"
    })
    .returning();

  return created;
}

export async function listRefundRequestsByCustomer(customerId: number) {
  return db.query.refundRequests.findMany({
    where: eq(refundRequests.customerId, customerId),
    with: {
      order: true
    },
    orderBy: [desc(refundRequests.createdAt)]
  });
}

export async function createSupportTicket(input: {
  customerId: number;
  orderId?: number;
  subject: string;
  message: string;
}) {
  const [ticket] = await db
    .insert(supportTickets)
    .values({
      customerId: input.customerId,
      orderId: input.orderId,
      subject: input.subject,
      status: "open"
    })
    .returning();

  await db.insert(ticketMessages).values({
    ticketId: ticket.id,
    authorRole: "customer",
    message: input.message
  });

  return ticket;
}

export async function listSupportTicketsByCustomer(customerId: number) {
  return db.query.supportTickets.findMany({
    where: eq(supportTickets.customerId, customerId),
    with: {
      messages: true,
      order: true
    },
    orderBy: [desc(supportTickets.updatedAt)]
  });
}

export async function getSupportTicketForCustomer(ticketId: number, customerId: number) {
  return db.query.supportTickets.findFirst({
    where: and(eq(supportTickets.id, ticketId), eq(supportTickets.customerId, customerId)),
    with: {
      messages: true,
      order: true
    }
  });
}

export async function addTicketMessage(input: {
  ticketId: number;
  customerId: number;
  authorRole: "customer" | "admin";
  message: string;
}) {
  const ticket = await db.query.supportTickets.findFirst({
    where: and(eq(supportTickets.id, input.ticketId), eq(supportTickets.customerId, input.customerId))
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const [created] = await db
    .insert(ticketMessages)
    .values({
      ticketId: input.ticketId,
      authorRole: input.authorRole,
      message: input.message
    })
    .returning();

  await db
    .update(supportTickets)
    .set({
      updatedAt: new Date(),
      status: ticket.status === "closed" ? "open" : ticket.status
    })
    .where(eq(supportTickets.id, input.ticketId));

  return created;
}

export async function listSupportTicketsForAdmin() {
  return db.query.supportTickets.findMany({
    with: {
      customer: true,
      order: true,
      messages: true
    },
    orderBy: [desc(supportTickets.updatedAt)]
  });
}

export async function getSupportTicketByIdForAdmin(ticketId: number) {
  return db.query.supportTickets.findFirst({
    where: eq(supportTickets.id, ticketId),
    with: {
      customer: true,
      order: true,
      messages: true
    }
  });
}

export async function addAdminTicketMessage(ticketId: number, message: string) {
  const ticket = await db.query.supportTickets.findFirst({
    where: eq(supportTickets.id, ticketId)
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const [created] = await db
    .insert(ticketMessages)
    .values({
      ticketId,
      authorRole: "admin",
      message
    })
    .returning();

  await db
    .update(supportTickets)
    .set({
      updatedAt: new Date(),
      status: ticket.status === "closed" ? "open" : ticket.status
    })
    .where(eq(supportTickets.id, ticketId));

  return created;
}

export async function updateSupportTicketStatus(ticketId: number, status: "open" | "pending" | "closed") {
  const [updated] = await db
    .update(supportTickets)
    .set({
      status,
      updatedAt: new Date()
    })
    .where(eq(supportTickets.id, ticketId))
    .returning();

  return updated;
}

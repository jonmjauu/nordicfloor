import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

export const ADMIN_COOKIE_NAME = "nf_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function toBase64Url(data: Uint8Array) {
  let binary = "";
  for (const byte of data) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

async function sign(data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.ADMIN_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toBase64Url(new Uint8Array(signature));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

export async function createAdminSessionValue() {
  const payload = {
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };

  const encodedPayload = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionValue(value: string | undefined) {
  if (!value) {
    return false;
  }

  const [encodedPayload, signature] = value.split(".");
  if (!encodedPayload || !signature) {
    return false;
  }

  const expected = await sign(encodedPayload);
  if (!safeEqual(signature, expected)) {
    return false;
  }

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload))) as {
      role: string;
      exp: number;
    };

    return payload.role === "admin" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionValue(token);
}

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    redirect("/admin");
  }
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS
};

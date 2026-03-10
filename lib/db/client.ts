import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL is not set. Database-backed routes will fail until configured.");
}

const sql = databaseUrl ? neon(databaseUrl) : null;

export const db = sql
  ? drizzle(sql, { schema })
  : (new Proxy(
      {},
      {
        get() {
          throw new Error("DATABASE_URL is not set");
        }
      }
    ) as ReturnType<typeof drizzle<typeof schema>>);

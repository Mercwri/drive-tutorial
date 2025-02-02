import { drizzle } from "drizzle-orm/singlestore";
import { createPool, type Pool } from "mysql2/promise";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn = 
  globalForDb.conn ??
  createPool({
    host: env.SINGLESTORE_HOST,
    port: parseInt(env.SINGLESTORE_PORT),
    user: env.SINGLESTORE_PWD,
    password: env.SINGLESTORE_PWD,
    database: env.SINGLESTORE_DB,
    ssl: {},
    maxIdle: 0,
  });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

conn.addListener("error",(err) => {
  console.error("DB Conn Err:", err);
});
// export const client =
//   globalForDb.client ?? createClient({ url: env.DATABASE_URL });
// if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(conn, { schema });

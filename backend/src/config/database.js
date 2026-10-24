import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL tidak ditemukan pada file .env!");
}

const { Pool } = pg;

const isLocal =
  process.env.DATABASE_URL.includes("localhost") ||
  process.env.DATABASE_URL.includes("127.0.0.1");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

export default pool;

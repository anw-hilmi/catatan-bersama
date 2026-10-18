import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Buat opsi SSL otomatis aktif hanya jika terhubung ke Supabase/Remote DB
const isLocal =
  process.env.DATABASE_URL?.includes("localhost") ||
  process.env.DATABASE_URL?.includes("127.0.0.1");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

export default pool;

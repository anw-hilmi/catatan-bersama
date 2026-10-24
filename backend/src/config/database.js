import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL tidak ditemukan pada environment variable!");
}

const { Pool } = pg;
const isLocal =
  databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;

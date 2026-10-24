import pool from "../src/config/database.js";

const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS peraturan (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tugas_utama (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tugas_harian (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS acara (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS doa (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS doa_pdfs (
    id SERIAL PRIMARY KEY,
    doa_id VARCHAR(50) REFERENCES doa(id) ON DELETE CASCADE,
    pdf_path TEXT NOT NULL
);

  CREATE TABLE IF NOT EXISTS admin (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  );
`;

const runMigration = async () => {
  try {
    await pool.query(createTablesQuery);
    console.log("Migration berhasil disesuaikan!");
  } catch (error) {
    console.error("Migration gagal:", error);
  } finally {
    await pool.end();
  }
};

runMigration();

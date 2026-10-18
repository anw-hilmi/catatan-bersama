import pool from "../../../config/database.js";

export const getAllacara = async (search = "") => {
  const query = `
    SELECT id, title, body, created_at
    FROM acara
    WHERE title ILIKE $1 
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [`%${search}%`]);
  return result.rows;
};

export const getacaraById = async (id) => {
  const query =
    "SELECT id, title, body, created_at, username, password FROM acara WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Tambahkan id di sini dan sesuaikan query INSERT
export const createacara = async ({ id, username, password, title, body }) => {
  const query =
    "INSERT INTO acara (id, username, password, title, body) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, body, created_at";
  const result = await pool.query(query, [id, username, password, title, body]);
  return result.rows[0];
};

export const updateacara = async (id, { username, password, title, body }) => {
  const query =
    "UPDATE acara SET username = $1, password = $2, title = $3, body = $4, created_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, title, body, created_at";
  const result = await pool.query(query, [username, password, title, body, id]);
  return result.rows[0];
};

export const deleteacara = async (id) => {
  const query = "DELETE FROM acara WHERE id = $1 RETURNING id";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

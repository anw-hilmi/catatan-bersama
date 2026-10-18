import pool from "../../../config/database.js";

export const getAlldoa = async (search = "") => {
  const query = `
    SELECT id, title, body, created_at
    FROM doa
    WHERE title ILIKE $1 
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [`%${search}%`]);
  return result.rows;
};

export const getdoaById = async (id) => {
  const query =
    "SELECT id, title, body, created_at, username, password FROM doa WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const createdoa = async ({ id, username, password, title, body }) => {
  const query =
    "INSERT INTO doa (id, username, password, title, body) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, body, created_at";
  const result = await pool.query(query, [id, username, password, title, body]);
  return result.rows[0];
};

export const updatedoa = async (id, { username, password, title, body }) => {
  const query =
    "UPDATE doa SET username = $1, password = $2, title = $3, body = $4, created_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, title, body, created_at";
  const result = await pool.query(query, [username, password, title, body, id]);
  return result.rows[0];
};

export const deletedoa = async (id) => {
  const query = "DELETE FROM doa WHERE id = $1 RETURNING id";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

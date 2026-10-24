import pool from "../../../config/database.js";

export const createRepository = (tableName) => ({
  getAll: async (search = "") => {
    const query = `
      SELECT id, title, body, created_at
      FROM ${tableName}
      WHERE title ILIKE $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    return result.rows;
  },

  getById: async (id) => {
    const query = `SELECT id, title, body, created_at, username, password FROM ${tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  create: async ({ id, username, password, title, body }) => {
    const query = `INSERT INTO ${tableName} (id, username, password, title, body) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, body, created_at`;
    const result = await pool.query(query, [
      id,
      username,
      password,
      title,
      body,
    ]);
    return result.rows[0];
  },

  update: async (id, { username, password, title, body }) => {
    const query = `UPDATE ${tableName} SET username = $1, password = $2, title = $3, body = $4, created_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, title, body, created_at`;
    const result = await pool.query(query, [
      username,
      password,
      title,
      body,
      id,
    ]);
    return result.rows[0];
  },

  delete: async (id) => {
    const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
});

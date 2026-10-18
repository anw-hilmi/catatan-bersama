import pool from "../../../config/database.js";

export const getAllCredentials = async () => {
  const tables = [
    "peraturan",
    "tugas_utama",
    "tugas_harian",
    "acara",
    "doa",
    "admin",
  ];
  const results = {};

  for (const table of tables) {
    // Jika tabel admin, jangan pilih kolom title
    const query =
      table === "admin"
        ? `SELECT id, username, password FROM ${table}`
        : `SELECT id, title, username, password FROM ${table}`;

    const res = await pool.query(query);
    results[table] = res.rows;
  }

  return results;
};

export const updateCredential = async (tableName, id, username, password) => {
  const query = `UPDATE ${tableName} SET username = $1, password = $2 WHERE id = $3 RETURNING id, username`;
  const result = await pool.query(query, [username, password, id]);
  return result.rows[0];
};

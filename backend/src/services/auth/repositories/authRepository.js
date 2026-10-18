import pool from "../../../config/database.js";

export const findAdminByUsername = async (username) => {
  const query = "SELECT * FROM admin WHERE username = $1";
  const result = await pool.query(query, [username]);
  return result.rows[0];
};

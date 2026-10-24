import pool from "../../../config/database.js";

export const getAlldoa = async (search = "") => {
  const query = `
    SELECT 
      d.id, 
      d.title, 
      d.created_at,
      COALESCE(
        JSON_AGG(p.pdf_path) FILTER (WHERE p.pdf_path IS NOT NULL), 
        '[]'::json
      ) AS pdf_paths
    FROM doa d
    LEFT JOIN doa_pdfs p ON d.id = p.doa_id
    WHERE d.title ILIKE $1
    GROUP BY d.id
    ORDER BY d.created_at DESC
  `;
  const result = await pool.query(query, [`%${search}%`]);
  return result.rows;
};

export const getdoaById = async (id) => {
  const query = `
    SELECT 
      d.id, 
      d.title, 
      d.created_at, 
      d.username, 
      d.password,
      COALESCE(
        JSON_AGG(p.pdf_path) FILTER (WHERE p.pdf_path IS NOT NULL), 
        '[]'::json
      ) AS pdf_paths
    FROM doa d
    LEFT JOIN doa_pdfs p ON d.id = p.doa_id
    WHERE d.id = $1
    GROUP BY d.id
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const createdoa = async ({
  id,
  username,
  password,
  title,
  pdf_paths = [], // Menerima Array berisi URL/path PDF
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Insert ke tabel doa
    const doaQuery = `
      INSERT INTO doa (id, username, password, title) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, title, created_at
    `;
    const doaResult = await client.query(doaQuery, [
      id,
      username,
      password,
      title,
    ]);
    const createdDoa = doaResult.rows[0];

    // 2. Insert array PDF ke tabel doa_pdfs
    if (pdf_paths.length > 0) {
      const pdfQuery = `
        INSERT INTO doa_pdfs (doa_id, pdf_path)
        SELECT $1, unnest($2::text[])
      `;
      await client.query(pdfQuery, [id, pdf_paths]);
    }

    await client.query("COMMIT");
    return { ...createdDoa, pdf_paths };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updatedoa = async (
  id,
  { username, password, title, pdf_paths = [] },
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Update tabel doa
    const updateQuery = `
      UPDATE doa 
      SET username = $1, password = $2, title = $3, created_at = CURRENT_TIMESTAMP 
      WHERE id = $4 
      RETURNING id, title, created_at
    `;
    const result = await client.query(updateQuery, [
      username,
      password,
      title,
      id,
    ]);

    // 2. Jika ada file baru, hapus PDF lama lalu simpan PDF baru
    if (pdf_paths.length > 0) {
      await client.query("DELETE FROM doa_pdfs WHERE doa_id = $1", [id]);

      const pdfQuery = `
        INSERT INTO doa_pdfs (doa_id, pdf_path)
        SELECT $1, unnest($2::text[])
      `;
      await client.query(pdfQuery, [id, pdf_paths]);
    }

    await client.query("COMMIT");
    return { ...result.rows[0], pdf_paths };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deletedoa = async (id) => {
  const query = "DELETE FROM doa WHERE id = $1 RETURNING id";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

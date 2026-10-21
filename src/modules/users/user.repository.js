import { pool } from "../../config/database.js";

export const findAll = async () => {
  const [rows] = await pool.query("SELECT id, name, email FROM users");
  return rows;
};

export const create = async ({ name, email }) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
  );

  return { id: result.insertId, name, email };
};

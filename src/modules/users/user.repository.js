import { pool } from "../../config/database.js";

export const findAll = async () => {
  const [rows] = await pool.query("SELECT id, name, email FROM users");
  return rows;
};

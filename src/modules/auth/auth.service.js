import bcrypt from "bcrypt";
import { create } from "../users/users.repository.js";

const SALT_ROUNDS = 10;

export const registerUser = async ({ name, email, password }) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return create({ name, email, passwordHash });
};

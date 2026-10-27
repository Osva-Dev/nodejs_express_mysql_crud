import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { create, findByEmail } from "../users/users.repository.js";

const SALT_ROUNDS = 10;

export const registerUser = async ({ name, email, password }) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return create({ name, email, passwordHash });
};

export const loginUser = async ({ email, password }) => {
  const user = await findByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return null;
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

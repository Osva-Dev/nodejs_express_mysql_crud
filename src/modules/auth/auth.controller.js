import { registerUser } from "./auth.service.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await registerUser({ name, email, password });

  res.status(201).json(user);
};

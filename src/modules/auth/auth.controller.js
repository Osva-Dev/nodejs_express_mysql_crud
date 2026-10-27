import { loginUser, registerUser } from "./auth.service.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await registerUser({ name, email, password });

  res.status(201).json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });

  if (!result) {
    return res.status(401).json({ message: "Credenciales invalidas" });
  }
  res.json(result);
};

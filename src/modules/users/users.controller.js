import { findAll, create, update, remove } from "./user.repository.js";

export const getUsers = async (req, res) => {
  const allUsers = await findAll();
  res.json(allUsers);
};

export const createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "name y email son obligatorios" });
  }

  const newUser = await create({ name, email });

  res.status(201).json(newUser);
};

export const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "name y email son obligatorios" });
  }

  const id = Number(req.params.id);
  const updated = await update(id, { name, email });

  if (!updated) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json({ id, name, email });
};

export const deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  const removed = await remove(id);

  if (!removed) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json({ message: "Usuario eliminado." });
};

export const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json(user);
};

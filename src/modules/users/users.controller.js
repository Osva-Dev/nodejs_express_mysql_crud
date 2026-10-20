const users = [
  { id: 1, name: "Ana López", email: "ana@mail.com" },
  { id: 2, name: "Carlos Ruiz", email: "carlos@mail.com" },
];

export const getUsers = (req, res) => {
  res.json(users);
};

export const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json(user);
};

export const createUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "name y email son obligatorios" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "name y email son obligatorios" });
  }

  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  user.name = name;
  user.email = email;

  res.json(user);
};

export const deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((user) => user.id === id);

  if (users.id === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  users.splice(index, 1);

  res.status(204).send();

  return res.status(200).json({ message: "Usuario Eliminado" });
};

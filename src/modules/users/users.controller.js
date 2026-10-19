const users = [
  { id: 1, name: "Ana López", email: "ana@mail.com" },
  { id: 2, name: "Carlos Ruiz", email: "carlos@mail.com" },
];

export const getUsers = (req, res) => {
  res.json(users);
};

export const createUser = (req, res) => {
  const { name, email } = req.body;

  const newUser = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json(newUser);
};

export const deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((user) => user.id === id);

  if (users.id === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  users.splice(index, 1);

  res.status(204).send();
};

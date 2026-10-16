const users = [
  { id: 1, name: "Ana López", email: "ana@mail.com" },
  { id: 2, name: "Carlos Ruiz", email: "carlos@mail.com" },
];

export const getUsers = (req, res) => {
  res.json(users);
};

export const errorHandler = (err, req, res, next) => {
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "El email ya está registrado" });
  }

  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
};

export const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ message: "El cuerpo de la petición no es un JSON válido" });
  }

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "El email ya está registrado" });
  }

  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
};

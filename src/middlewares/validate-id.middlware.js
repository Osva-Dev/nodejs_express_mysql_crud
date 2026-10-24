export const validateId = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json({ message: "El id debe de ser número entero positivo" });
  }

  next();
};

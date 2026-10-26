export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateUser = (req, res, next) => {
  const { name, email } = req.body ?? {};

  if (!name || !email) {
    return res.status(400).json({ message: "name y email son obligatorios" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res
      .status(400)
      .json({ message: "El formato del email no es válido" });
  }

  next();
};

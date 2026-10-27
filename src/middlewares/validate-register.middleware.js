import { EMAIL_REGEX } from "./validate-user.middleware.js";

const MIN_PASSWORD_LENGTH = 8;

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email y password son obligatorios" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res
      .status(400)
      .json({ message: "El formato del email no es válido" });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
    });
  }

  next();
};

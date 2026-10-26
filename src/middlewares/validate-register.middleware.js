import { EMAIL_REGEX } from "./validate-user.middleware.js";

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "el nombre, email y password son obligatorios." });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res
      .status(400)
      .json({ message: "el formato del email no es valido." });
  }

  if (password < 8) {
    return res
      .status(400)
      .json({ message: `La contraseña debe tener al menos 9 caracteres` });
  }

  next();
};

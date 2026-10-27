import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { validateRegister } from "../../middlewares/validate-register.middleware.js";
import { validateLogin } from "../../middlewares/validate-login.middleware.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

export default router;

import { Router } from "express";
import { register } from "./auth.controller.js";
import { validateRegister } from "../../middlewares/validate-register.middleware.js";

const router = Router();

router.post("/register", validateRegister, register);

export default router;

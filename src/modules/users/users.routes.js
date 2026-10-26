import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./users.controller.js";
import { validateId } from "../../middlewares/validate-id.middlware.js";
import { validateUser } from "../../middlewares/validate-user.middleware.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", validateId, getUserById);
router.put("/:id", validateUser, validateId, updateUser);
router.delete("/:id", validateId, deleteUser);

export default router;

import { Router } from "express";
import {
  getProfile,
  updateUser,
  deleteUser,
  getAllUsers,
  adminUpdateUser,
} from "../controllers/auth/user";
import { adminCreateUser, changePassword } from "../controllers/auth/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";
import { validate } from "../middleware/joiMiddleware";
import {
  changePasswordSchema,
  createUserSchema,
  idParamSchema,
  updateProfileSchema,
  updateUserSchema,
} from "../validation";

const router = Router();

/* ================= USER (login required) ================= */
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, validate(updateProfileSchema), updateUser);
router.put("/me/password", authMiddleware, validate(changePasswordSchema), changePassword);
router.delete("/me", authMiddleware, deleteUser);

/* ================= ADMIN ONLY ================= */
router.get("/", authMiddleware, allowRoles("ADMIN"), getAllUsers);
router.post("/", authMiddleware, allowRoles("ADMIN"), validate(createUserSchema), adminCreateUser);
router.put("/:id", authMiddleware, allowRoles("ADMIN"), validate(idParamSchema, "params"), validate(updateUserSchema), adminUpdateUser);

export default router;

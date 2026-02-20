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

const router = Router();

/* ================= USER (login required) ================= */
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateUser);
router.put("/me/password", authMiddleware, changePassword);
router.delete("/me", authMiddleware, deleteUser);

/* ================= ADMIN ONLY ================= */
router.get("/", authMiddleware, allowRoles("ADMIN"), getAllUsers);
router.post("/", authMiddleware, allowRoles("ADMIN"), adminCreateUser);
router.put("/:id", authMiddleware, allowRoles("ADMIN"), adminUpdateUser);

export default router;

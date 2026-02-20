import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getActiveCategoriesForDropdown,
} from "../controllers/category/index";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All category routes require authentication
router.use(authMiddleware);

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/dropdown", getActiveCategoriesForDropdown);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;

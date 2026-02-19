import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById
,
} from "../controllers/Product/index";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware)

router.post("/", createProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.get("/:id", getProductById);

router.delete("/:id", deleteProduct);

export default router;

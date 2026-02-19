import { Router } from "express";
import {
  createCompany,
  getAllCompanies,
  getSingleCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/company";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// ================= CREATE =================
router.post(
  "/",
  authMiddleware,
  upload.single("logo"),   // ✅ allow logo upload
  createCompany
);

router.get(
  "/",
  authMiddleware,
  getAllCompanies
);

router.get(
  "/:id",
  authMiddleware,
  getSingleCompany
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("logo"), 
  updateCompany
);

router.delete(
  "/:id",
  authMiddleware,
  deleteCompany
);

export default router;

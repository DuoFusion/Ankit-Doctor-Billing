import { Router } from "express";
import {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
} from "../controllers/bill";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

router.post("/", createBill);
router.get("/", getAllBills);
router.get("/:id", getBillById);
router.put("/:id", updateBill);
router.delete("/:id", deleteBill);

export default router;

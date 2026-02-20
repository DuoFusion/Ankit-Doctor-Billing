import { Router } from "express";
import{login,verifyOtp,getMe,logout, forgotPassword, resetPassword} from "../controllers/auth/index"
import { authMiddleware } from "../middleware/auth.middleware";

const router=Router()
router.post("/login",login)
router.post("/verify-otp",verifyOtp)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.get("/me",authMiddleware, getMe);
router.post("/logout",authMiddleware,logout)



export default router
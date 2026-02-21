import { Router } from "express";
import{login,verifyOtp,getMe,logout, forgotPassword, resetPassword} from "../controllers/auth/index"
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/joiMiddleware";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, verifyOtpSchema } from "../validation";

const router=Router()
router.post("/login", validate(loginSchema), login)
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp)
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword)
router.post("/reset-password", validate(resetPasswordSchema), resetPassword)
router.get("/me",authMiddleware, getMe);
router.post("/logout",authMiddleware,logout)



export default router

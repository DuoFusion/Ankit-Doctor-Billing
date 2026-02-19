import { Router } from "express";
import{signup,login,verifyOtp,getMe,logout} from "../controllers/auth/index"
import { authMiddleware } from "../middleware/auth.middleware";

const router=Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/verify-otp",verifyOtp)
router.get("/me",authMiddleware, getMe);
router.post("/logout",authMiddleware,logout)



export default router
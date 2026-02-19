import User from "../../database/models/auth.model";
import Otp from "../../database/models/otp.model";
import { Request, Response } from "express";
import { email_verification_mail } from "../../helper";
import { StatusCode } from "../../common";
import { responseMessage } from "../../helper/";
import { generateToken } from "../../helper/jwt";
import bcrypt from "bcryptjs";
import {AuthRequest} from "../../middleware/auth.middleware"



/* ================= SIGNUP ================= */
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: responseMessage.dataAlreadyExist("User"),
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    return res.status(StatusCode.CREATED).json({
      message: responseMessage.signupSuccess,
    });
  } catch {
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: responseMessage.internalServerError,
    });
  }
};

/* ================= LOGIN ================= */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: responseMessage.invalidUserPasswordEmail,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: responseMessage.invalidUserPasswordEmail,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });
    await Otp.create({
      email,
      otp,
      expireAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    email_verification_mail(user.email, otp)
      .catch(err => console.error("Email failed:", err));

    return res.status(StatusCode.OK).json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: responseMessage.internalServerError,
    });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await Otp.findOne({ email: normalizedEmail, otp });
    if (!otpRecord || otpRecord.expireAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await Otp.deleteMany({ email: normalizedEmail });

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔥 FIXED TOKEN STRUCTURE
    const token = generateToken({
      _id: user._id.toString(),
      role: user.role,
    });

    return res.status(200).json({
      message: "Login success",
      token,
      user: {
        _id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGOUT ================= */
export const logout = (_req: Request, res: Response) => {
  return res.status(200).json({
    message: "Logged out",
  });
};

/* ================= GET ME ================= */
export const getMe = (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    _id: req.user._id,
    role: req.user.role,
  });
};

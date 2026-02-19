import User from "../../database/models/auth.model";
import { Request, Response } from "express";
import { StatusCode } from "../../common";
import {AuthRequest} from "../../middleware/auth.middleware"
/* ===================== USER ===================== */

// GET PROFILE (USER + ADMIN)
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: "User not found",
      });
    }

    return res.status(StatusCode.OK).json({ user });
  } catch (error) {
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: "Server error",
    });
  }
};

// UPDATE OWN PROFILE
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: "User not found",
      });
    }

    return res.status(StatusCode.OK).json({
      message: "User updated successfully",
      user,
    });
  } catch {
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: "Server error",
    });
  }
};

// DELETE OWN ACCOUNT
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: "User not found",
      });
    }

    return res.status(StatusCode.OK).json({
      message: "Account deleted successfully",
    });
  } catch {
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: "Server error",
    });
  }
};


/* ===================== ADMIN ===================== */

// ADMIN → GET ALL USERS
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
    } = req.query;

    const filter: any = {};

    // 🔍 Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      User.countDocuments(filter),
    ]);

    return res.status(StatusCode.OK).json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: "Server error",
    });
  }
};


// ADMIN → UPDATE ANY USER
export const adminUpdateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: "User not found",
      });
    }

    return res.status(StatusCode.OK).json({
      message: "User updated successfully",
      user,
    });
  } catch {
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: "Server error",
    });
  }
};

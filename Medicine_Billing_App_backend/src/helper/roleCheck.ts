import {Request, Response, NextFunction } from "express";
import { StatusCode } from "../common";

export const roleCheck = (allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      // Check if user exists
      if (!req.user) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          message: "Unauthorized. Please login first.",
        });
      }

      // Check if role allowed
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(StatusCode.FORBIDDEN).json({
          message: "Access denied. You do not have permission.",
        });
      }

      next();
    } catch (error) {
      return res.status(StatusCode.INTERNAL_ERROR).json({
        message: "Internal server error",
      });
    }
  };
};

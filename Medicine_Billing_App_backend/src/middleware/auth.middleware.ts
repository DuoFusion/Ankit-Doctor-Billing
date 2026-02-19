import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET as string
    ) as {
      _id: string;
      role: string;
    };

    req.user = {
      _id: decoded._id,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

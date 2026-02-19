import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../common";

export const validate =
  (schema: any, property: "body" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
    });

    if (error) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }

    next();
  };
  
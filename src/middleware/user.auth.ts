import jwt from "jsonwebtoken";
import type {Request, Response, NextFunction} from "express";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

declare global {
  namespace Express {
    interface Request {
      email?: string;
    }
  }
}

export async function userAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: {
        code: 401,
        message: "Authorization token is not of kind Bearer or is missing",
      },
      message: {
        error: "Unauthorized",
      },
    });
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: {
          code: 401,
          message: "Authorization token is not of kind Bearer or is missing",
        },
        message: {
          error: "Unauthorized",
        },
      });
    }
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET!) as {
        email: string;
      };
      req.email = decodedToken.email;
      next();
    } catch (error) {
      return res.status(401).json({
        status: {
          code: 401,
          message: "Invalid token",
        },
        message: {
          error: "Unauthorized",
        },
      });
    }
  }
}

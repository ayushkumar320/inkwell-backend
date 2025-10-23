// @ts-ignore: allow importing JS modules without type declarations
import jwt from "jsonwebtoken";
// @ts-ignore: local JS file without types
import User from "../models/user.model.js";
// @ts-ignore: local JS file without types
import connectDB from "../db/connectDB.js";

const userAuth = async (req: any, res: any, next: any) => {
    try {
        // Ensure database connection
        await connectDB();

        const authHeader = req.header("Authorization") || "";
        const parts = authHeader.trim().split(/\s+/);
        if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
            return res.status(401).json({ message: "Authorization header malformed" });
        }

        const token = parts[1];
        let decoded: any;
        try {
            // jwt.verify can throw — ensure JWT_SECRET is provided
            const secret = (globalThis as any).process?.env?.JWT_SECRET;
            if (!secret) {
                console.error("JWT_SECRET is not set");
                return res.status(500).json({ message: "Server misconfiguration" });
            }
            decoded = jwt.verify(token, secret as string);
            console.log("Decoded token:", decoded);
        } catch (e: any) {
            return res.status(401).json({ message: e && e.name === "TokenExpiredError" ? "Token expired" : "Invalid token" });
        }

        const email = decoded && (decoded.email || decoded?.user?.email);
        if (!email || typeof email !== "string") {
            return res.status(401).json({ message: "Token does not contain an email" });
        }

        // Find user by email (not by id)
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        console.error("Authentication error:", err);
        return res.status(401).json({ message: "Please authenticate" });
    }
};

export default userAuth;
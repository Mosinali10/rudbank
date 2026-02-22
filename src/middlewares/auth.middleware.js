import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

        console.log("JWT Verification - Token present:", !!token);

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        // 1. Verify token existence and validity in database
        const tokenQuery = await pool.query(
            "SELECT * FROM usertoken WHERE token = $1 AND expiry > NOW()",
            [token]
        );

        if (tokenQuery.rows.length === 0) {
            console.log("Token not found or expired in database");
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }

        // 2. Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded successfully, uid:", decoded.uid);

        // 3. Attach user info to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
        return res.status(401).json({ success: false, message: "Authentication failed" });
    }
};

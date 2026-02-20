import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        // 1. Verify token existence and validity in database
        const tokenQuery = await pool.query(
            "SELECT * FROM UserToken WHERE token = $1 AND expiry > NOW()",
            [token]
        );

        if (tokenQuery.rows.length === 0) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // 2. Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach user info to request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed" });
    }
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = async (req, res) => {
    const { username, email, password, phone } = req.body;

    try {
        // Validation
        if (!username || !email || !password || !phone) {
            return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
        }

        // 1. Check if username already exists
        const userCheck = await pool.query("SELECT * FROM \"KodUser\" WHERE username = $1", [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json(new ApiResponse(400, null, "Username already exists"));
        }

        // 2. Check if email already exists
        const emailCheck = await pool.query("SELECT * FROM \"KodUser\" WHERE email = $1", [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json(new ApiResponse(400, null, "Email already exists"));
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insert into KodUser
        await pool.query(
            "INSERT INTO \"KodUser\" (username, email, password, phone, role, balance) VALUES ($1, $2, $3, $4, $5, $6)",
            [username, email, hashedPassword, phone, 'customer', 100000]
        );

        return res.status(201).json(new ApiResponse(201, null, "User registered successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validation
        if (!username || !password) {
            return res.status(400).json(new ApiResponse(400, null, "Username and password are required"));
        }

        // 1. Find user by username
        const userQuery = await pool.query(
            "SELECT * FROM \"KodUser\" WHERE username = $1",
            [username]
        );

        if (userQuery.rows.length === 0) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid credentials"));
        }

        const user = userQuery.rows[0];

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid credentials"));
        }

        // 3. Generate JWT
        const token = jwt.sign(
            { uid: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 4. Insert into UserToken table
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        await pool.query(
            "INSERT INTO \"UserToken\" (token, uid, expiry) VALUES ($1, $2, $3)",
            [token, user.id, expiryDate]
        );

        // 5. Secure token as HttpOnly cookie
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000 // 1 hour
        };

        return res.status(200)
            .cookie("token", token, options)
            .json(new ApiResponse(200, { token }, "Login successful"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

export const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

        if (token) {
            // Remove token from database
            await pool.query("DELETE FROM \"UserToken\" WHERE token = $1", [token]);
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        return res.status(200)
            .clearCookie("token", options)
            .json(new ApiResponse(200, null, "Logged out successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

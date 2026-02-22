import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import pool from "../config/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ---------------- REGISTER ---------------- */
export const registerUser = async (req, res) => {
    const { username, email, password, phone } = req.body;

    try {
        if (!username || !email || !password || !phone) {
            return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
        }

        const userCheck = await pool.query(
            "SELECT * FROM koduser WHERE username = $1",
            [username]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json(new ApiResponse(400, null, "Username already exists"));
        }

        const emailCheck = await pool.query(
            "SELECT * FROM koduser WHERE email = $1",
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(400).json(new ApiResponse(400, null, "Email already exists"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO koduser (username, email, password, phone, role, balance) VALUES ($1, $2, $3, $4, $5, $6)",
            [username, email, hashedPassword, phone, "customer", 100000]
        );

        return res
            .status(201)
            .json(new ApiResponse(201, null, "User registered successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

/* ---------------- LOGIN ---------------- */
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("Login attempt for username:", username);

        if (!username || !password) {
            console.log("Missing credentials");
            return res
                .status(400)
                .json(new ApiResponse(400, null, "Username and password are required"));
        }

        const userQuery = await pool.query(
            "SELECT * FROM koduser WHERE username = $1",
            [username]
        );

        if (userQuery.rows.length === 0) {
            console.log("User not found:", username);
            return res
                .status(400)
                .json(new ApiResponse(400, null, "Invalid credentials"));
        }

        const user = userQuery.rows[0];
        console.log("User found, uid:", user.uid);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch for user:", username);
            return res
                .status(400)
                .json(new ApiResponse(400, null, "Invalid credentials"));
        }

        const userId = user.uid;
        console.log("Using user ID:", userId);

        const token = jwt.sign(
            {
                uid: userId,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        await pool.query(
            "INSERT INTO usertoken (token, uid, expiry) VALUES ($1, $2, $3)",
            [token, userId, expiryDate]
        );

        console.log("Login successful for user:", username, "with ID:", userId);

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 3600000
            })
            .json(new ApiResponse(200, { token }, "Login successful"));
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

/* ---------------- GOOGLE LOGIN ---------------- */
export const googleLogin = async (req, res) => {
    const { idToken } = req.body;

    try {
        if (!idToken) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "Google ID Token is required"));
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let userResult = await pool.query(
            "SELECT * FROM koduser WHERE email = $1",
            [email]
        );

        let user;

        if (userResult.rows.length === 0) {
            const newUser = await pool.query(
                "INSERT INTO koduser (username, email, profile_image, role, balance, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [name, email, picture, "customer", 100000, "google-oauth-user"]
            );
            user = newUser.rows[0];
        } else {
            await pool.query(
                "UPDATE koduser SET profile_image = $1 WHERE email = $2",
                [picture, email]
            );
            user = userResult.rows[0];
        }

        const userId = user.uid;
        console.log("Google login - Using user ID:", userId);

        const token = jwt.sign(
            {
                uid: userId,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        await pool.query(
            "INSERT INTO usertoken (token, uid, expiry) VALUES ($1, $2, $3)",
            [token, userId, expiryDate]
        );

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 3600000
            })
            .json(new ApiResponse(200, { user }, "Google login successful"));
    } catch (error) {
        console.error("GOOGLE LOGIN ERROR:", error);
        return res
            .status(401)
            .json(new ApiResponse(401, null, "Invalid Google Token"));
    }
};

/* ---------------- LOGOUT ---------------- */
export const logoutUser = async (req, res) => {
    try {
        const token =
            req.cookies?.token ||
            req.headers.authorization?.replace("Bearer ", "");

        if (token) {
            await pool.query(
                "DELETE FROM usertoken WHERE token = $1",
                [token]
            );
        }

        return res
            .status(200)
            .clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })
            .json(new ApiResponse(200, null, "Logged out successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

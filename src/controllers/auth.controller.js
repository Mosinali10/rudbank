import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const registerUser = async (req, res) => {
    const { username, email, password, phone } = req.body;

    try {
        // 1. Check if username already exists
        const userCheck = await pool.query("SELECT * FROM KodUser WHERE username = $1", [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // 2. Check if email already exists
        const emailCheck = await pool.query("SELECT * FROM KodUser WHERE email = $2", [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insert into KodUser
        await pool.query(
            "INSERT INTO KodUser (username, email, password, phone, role, balance) VALUES ($1, $2, $3, $4, $5, $6)",
            [username, email, hashedPassword, phone, 'customer', 100000]
        );

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Find user by username
        const userQuery = await pool.query(
            "SELECT * FROM KodUser WHERE username = $1",
            [username]
        );

        if (userQuery.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = userQuery.rows[0];

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
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
            "INSERT INTO UserToken (token, uid, expiry) VALUES ($1, $2, $3)",
            [token, user.id, expiryDate]
        );

        // 5. Return success with token
        res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

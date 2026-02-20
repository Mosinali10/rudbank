import bcrypt from "bcrypt";
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
        const emailCheck = await pool.query("SELECT * FROM KodUser WHERE email = $1", [email]);
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

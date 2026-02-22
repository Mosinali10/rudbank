import pool from "../config/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getBalance = async (req, res) => {
    try {
        const { uid } = req.user;
        console.log("Fetching balance for uid:", uid);

        // Try both 'id' and 'uid' column names
        const balanceQuery = await pool.query(
            "SELECT balance FROM koduser WHERE id = $1 OR uid = $1",
            [uid]
        );

        if (balanceQuery.rows.length === 0) {
            console.log("User not found for uid:", uid);
            return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }

        console.log("Balance fetched successfully");
        return res.status(200).json(new ApiResponse(200, { balance: balanceQuery.rows[0].balance }));
    } catch (error) {
        console.error("Balance fetch error:", error);
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

export const creditAmount = async (req, res) => {
    try {
        const { uid } = req.user;
        const { amount } = req.body;

        // Validation
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid or negative amount"));
        }

        // Try both 'id' and 'uid' column names
        const updateResult = await pool.query(
            "UPDATE koduser SET balance = balance + $1 WHERE id = $2 OR uid = $2 RETURNING balance",
            [parseFloat(amount), uid]
        );

        if (updateResult.rows.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "User not found for update"));
        }

        // Log transaction
        await pool.query(
            "INSERT INTO transactions (uid, type, amount, description, category) VALUES ($1, $2, $3, $4, $5)",
            [uid, 'credit', parseFloat(amount), 'Account Credit', 'Income']
        );

        return res.status(200).json(new ApiResponse(200, { newBalance: updateResult.rows[0].balance }, "Amount credited successfully"));
    } catch (error) {
        console.error("Credit error:", error);
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

export const debitAmount = async (req, res) => {
    try {
        const { uid } = req.user;
        const { amount } = req.body;

        // Validation
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid or negative amount"));
        }

        // Check sufficient funds - try both column names
        const userQuery = await pool.query("SELECT balance FROM koduser WHERE id = $1 OR uid = $1", [uid]);
        if (userQuery.rows.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }
        const currentBalance = userQuery.rows[0].balance;

        if (parseFloat(currentBalance) < parseFloat(amount)) {
            return res.status(400).json(new ApiResponse(400, null, "Insufficient balance"));
        }

        const updateResult = await pool.query(
            "UPDATE koduser SET balance = balance - $1 WHERE id = $2 OR uid = $2 RETURNING balance",
            [parseFloat(amount), uid]
        );

        if (updateResult.rows.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "User not found for update"));
        }

        // Log transaction
        await pool.query(
            "INSERT INTO transactions (uid, type, amount, description, category) VALUES ($1, $2, $3, $4, $5)",
            [uid, 'debit', parseFloat(amount), 'Account Debit', 'Expense']
        );

        return res.status(200).json(new ApiResponse(200, { newBalance: updateResult.rows[0].balance }, "Amount debited successfully"));
    } catch (error) {
        console.error("Debit error:", error);
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

export const getTransactions = async (req, res) => {
    try {
        const { uid } = req.user;
        const result = await pool.query(
            "SELECT * FROM transactions WHERE uid = $1 ORDER BY created_at DESC LIMIT 10",
            [uid]
        );
        return res.status(200).json(new ApiResponse(200, result.rows, "Transactions retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

export const getProfile = async (req, res) => {
    try {
        console.log("=== GET PROFILE START ===");
        console.log("req.user:", req.user);
        
        if (!req.user || !req.user.uid) {
            console.error("No user in request!");
            return res.status(401).json(new ApiResponse(401, null, "Unauthorized - no user data"));
        }

        const { uid } = req.user;
        console.log("Fetching profile for uid:", uid);

        // Try both 'id' and 'uid' column names
        const userQuery = await pool.query(
            "SELECT username, email, role, balance, profile_image FROM koduser WHERE id = $1 OR uid = $1",
            [uid]
        );

        console.log("Query result rows:", userQuery.rows.length);

        if (userQuery.rows.length === 0) {
            console.log("User not found for uid:", uid);
            return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }

        console.log("Profile fetched successfully for uid:", uid);
        return res.status(200).json(new ApiResponse(200, userQuery.rows[0], "Profile retrieved successfully"));
    } catch (error) {
        console.error("=== PROFILE ERROR ===");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

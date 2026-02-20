import pool from "../config/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getBalance = async (req, res) => {
    try {
        const { uid } = req.user;

        const balanceQuery = await pool.query(
            "SELECT balance FROM koduser WHERE id = $1",
            [uid]
        );

        if (balanceQuery.rows.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }

        return res.status(200).json(new ApiResponse(200, { balance: balanceQuery.rows[0].balance }));
    } catch (error) {
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

        const updateResult = await pool.query(
            "UPDATE koduser SET balance = balance + $1 WHERE id = $2 RETURNING balance",
            [parseFloat(amount), uid]
        );

        return res.status(200).json(new ApiResponse(200, { newBalance: updateResult.rows[0].balance }, "Amount credited successfully"));
    } catch (error) {
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

        // Check sufficient funds
        const userQuery = await pool.query("SELECT balance FROM koduser WHERE id = $1", [uid]);
        const currentBalance = userQuery.rows[0].balance;

        if (parseFloat(currentBalance) < parseFloat(amount)) {
            return res.status(400).json(new ApiResponse(400, null, "Insufficient balance"));
        }

        const updateResult = await pool.query(
            "UPDATE koduser SET balance = balance - $1 WHERE id = $2 RETURNING balance",
            [parseFloat(amount), uid]
        );

        return res.status(200).json(new ApiResponse(200, { newBalance: updateResult.rows[0].balance }, "Amount debited successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

export const getProfile = async (req, res) => {
    try {
        const { uid } = req.user;

        const userQuery = await pool.query(
            "SELECT username, email, role, balance FROM koduser WHERE id = $1",
            [uid]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }

        return res.status(200).json(new ApiResponse(200, userQuery.rows[0], "Profile retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

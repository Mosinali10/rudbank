import pool from "../config/db.js";

export const getBalance = async (req, res) => {
    try {
        const { uid } = req.user;

        const balanceQuery = await pool.query(
            "SELECT balance FROM KodUser WHERE id = $1",
            [uid]
        );

        if (balanceQuery.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            balance: balanceQuery.rows[0].balance
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const creditAmount = async (req, res) => {
    try {
        const { uid } = req.user;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const updateResult = await pool.query(
            "UPDATE KodUser SET balance = balance + $1 WHERE id = $2 RETURNING balance",
            [amount, uid]
        );

        res.status(200).json({
            message: "Amount credited successfully",
            newBalance: updateResult.rows[0].balance
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const debitAmount = async (req, res) => {
    try {
        const { uid } = req.user;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // Check sufficient funds
        const userQuery = await pool.query("SELECT balance FROM KodUser WHERE id = $1", [uid]);
        const currentBalance = userQuery.rows[0].balance;

        if (currentBalance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const updateResult = await pool.query(
            "UPDATE KodUser SET balance = balance - $1 WHERE id = $2 RETURNING balance",
            [amount, uid]
        );

        res.status(200).json({
            message: "Amount debited successfully",
            newBalance: updateResult.rows[0].balance
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

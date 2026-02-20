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

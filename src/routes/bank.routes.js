import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getBalance, creditAmount, debitAmount, getProfile, getTransactions, updateProfile } from "../controllers/bank.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/profile", getProfile);
router.put("/update-profile", updateProfile);
router.get("/balance", getBalance);
router.get("/transactions", getTransactions);
router.post("/credit", creditAmount);
router.post("/debit", debitAmount);

router.get("/test", (req, res) => {
    res.json({ message: "Authenticated bank API working" });
});

export default router;

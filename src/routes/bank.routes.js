import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getBalance, creditAmount, debitAmount } from "../controllers/bank.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/balance", getBalance);
router.post("/credit", creditAmount);
router.post("/debit", debitAmount);

router.get("/test", (req, res) => {
    res.json({ message: "Authenticated bank API working" });
});

export default router;

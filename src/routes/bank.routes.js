import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getBalance } from "../controllers/bank.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/balance", getBalance);

router.get("/test", (req, res) => {
    res.json({ message: "Authenticated bank API working" });
});

export default router;

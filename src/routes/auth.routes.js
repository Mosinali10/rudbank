import express from "express";
import { registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);

router.get("/test", (req, res) => {
    res.json({ message: "API working" });
});

export default router;

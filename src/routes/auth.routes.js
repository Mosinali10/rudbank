import express from "express";
import { registerUser, loginUser, logoutUser, googleLogin, changePassword } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.post("/logout", logoutUser);
router.put("/change-password", verifyJWT, changePassword);

router.get("/test", (req, res) => {
    res.json({ message: "API working" });
});

export default router;

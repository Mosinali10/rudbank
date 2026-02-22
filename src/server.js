import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import bankRoutes from "./routes/bank.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middlewares/error.middleware.js";
import pool from "./config/db.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- SECURITY HEADERS ---------------- */
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
    );
    next();
});

/* ---------------- CORS CONFIG ---------------- */
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,  // MUST match frontend domain exactly
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/bank", bankRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true, message: "RudBank API running" });
});

/* ---------------- ERROR HANDLER ---------------- */
app.use(errorHandler);

/* ---------------- TOKEN CLEANUP ---------------- */
const cleanupExpiredTokens = async () => {
    try {
        await pool.query("DELETE FROM usertoken WHERE expiry < NOW()");
        console.log("Expired tokens cleaned up");
    } catch (error) {
        console.error("Token cleanup error:", error.message);
    }
};

/* ---------------- SERVER START (LOCAL ONLY) ---------------- */
const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
        await cleanupExpiredTokens();
    });
}

export default app;

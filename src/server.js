import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import bankRoutes from "./routes/bank.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Security Headers Middleware
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    // Allow external assets
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; ");
    next();
});

// Middleware
const allowedOrigin = process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN;
app.use(cors({
    origin: allowedOrigin || true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bank", bankRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true, message: "RudBank API running" });
});

// Global Error Handler
import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Token Expiry Cleanup Logic
import pool from "./config/db.js";
const cleanupExpiredTokens = async () => {
    try {
        await pool.query("DELETE FROM usertoken WHERE expiry < NOW()");
        console.log("Expired tokens cleaned up");
    } catch (error) {
        console.error("Token cleanup error:", error.message);
    }
};

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
        await cleanupExpiredTokens();
    });
}

export default app;

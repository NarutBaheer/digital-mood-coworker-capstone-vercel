const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
// NOTE: Put ONLY origins here (no trailing slash, no path).
// Example: https://your-frontend.vercel.app
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_ALT, // optional second Vercel domain (recommended)
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl/postman, server-to-server, etc.)
      if (!origin) return callback(null, true);

      // Allow if the exact origin is in the list
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Block others without throwing (cleaner than raising an error)
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/wellness_journal";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));

// Models (ok to keep even if unused)
require("./models/User");
require("./models/Entry");

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/entries", require("./routes/entries"));

// Health check
app.get("/", (req, res) => {
  res.send("digital-mood-backend is running");
});

// Basic error handler (helps debugging)
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Use the port provided by the environment or 4000 locally
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server started on", PORT));

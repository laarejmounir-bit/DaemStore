import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import path from "path";

// Import Vercel API Handlers to maintain 100% parity
import healthHandler from "./api/health.js";
import checkoutHandler from "./api/checkout.js";
import checkoutIdHandler from "./api/checkout/[id].js";
import tiktokUserHandler from "./api/tiktok/user.js";
import tiktokTrackHandler from "./api/tiktok/track.js";
import proxyImageHandler from "./api/proxy-image.js";
import webhookOrderHandler from "./api/webhook/order.js";
import webhookRefillHandler from "./api/webhook/refill.js";
import paymentSuccessHandler from "./api/payment-success.js";
import paymentCancelHandler from "./api/payment-cancel.js";

dotenv.config();

const app = express();
app.set('trust proxy', true);
const PORT = 3000;

// CORS Configuration - Strict for development and production
const allowedOrigins = [
  "https://daemstore.com",
  "https://www.daemstore.com",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.includes('vercel.app') ||
      origin.includes('daemstore.com') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev proxy
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-rapidapi-key", "x-rapidapi-host", "X-AccountNo", "X-SecretKey"],
  credentials: true
}));

app.use(express.json());

// API Routes mounted cleanly to the same handlers as Vercel Functions
app.all("/api/health", (req, res) => healthHandler(req, res));
app.all("/api/payment-success", (req, res) => paymentSuccessHandler(req, res));
app.all("/api/payment-cancel", (req, res) => paymentCancelHandler(req, res));

app.all("/api/checkout/:id", (req, res) => {
  req.query = { ...req.query, id: req.params.id };
  return checkoutIdHandler(req, res);
});
app.all("/api/checkout", (req, res) => checkoutHandler(req, res));

app.all("/api/tiktok/user", (req, res) => tiktokUserHandler(req, res));
app.all("/api/tiktok/track", (req, res) => tiktokTrackHandler(req, res));
app.all("/api/proxy-image", (req, res) => proxyImageHandler(req, res));

app.all("/api/webhook/order", (req, res) => webhookOrderHandler(req, res));
app.all("/api/webhook/refill", (req, res) => webhookRefillHandler(req, res));

app.all("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Development server running on port ${PORT}`);
  });
}

startServer();

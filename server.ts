import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import path from "path";
import { rateLimit } from "express-rate-limit";
import validator from "validator";
import crypto from "crypto";

import { getTikTokUserInfo, cleanTikTokUrl } from "./api/_utils.js";

dotenv.config();

console.log('Token Loaded:', !!process.env.TIKTOK_ACCESS_TOKEN);

const app = express();
app.set('trust proxy', true);
const PORT = 3000;

// CORS Configuration - Strict for production & Vercel
const allowedOrigins = [
  "https://daemstore.com",
  "https://www.daemstore.com",
  "https://ais-dev-yd45tmitnmz4i3uznm2lex-594526045281.europe-west2.run.app",
  "https://ais-pre-yd45tmitnmz4i3uznm2lex-594526045281.europe-west2.run.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (
      allowedOrigins.includes(origin) ||
      origin.includes('vercel.app') ||
      origin.includes('daemstore.com')
    ) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-rapidapi-key", "x-rapidapi-host"],
  credentials: true
}));

app.use(express.json());

// Content Security Policy (CSP)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com https://www.google.com https://static.cloudflareinsights.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.tiktok.com https://*.tiktokw.us; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https://picsum.photos https://*.google.com https://*.gstatic.com https://*.payzaty.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.tiktok.com https://*.tiktokcdn.com https://*.tiktokcdn-eu.com https://*.tiktokcdn-us.com https://*.tiktok.com https://ui-avatars.com; " +
    "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.firebaseapp.com https://api.payzaty.com https://*.rapidapi.com https://www.googletagmanager.com https://*.google-analytics.com https://analytics.tiktok.com https://*.payzaty.com https://*.tiktokw.us; " +
    "frame-src 'self' https://*.payzaty.com https://*.google.com https://www.googletagmanager.com;"
  );
  next();
});

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." }
});
app.use(globalLimiter);

// Specific Rate Limiter for Checkout and TikTok Lookup
const checkoutLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Increased limit further to avoid issues during testing
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many checkout/lookup attempts, please try again later." }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PAYZATY_API_URL = process.env.PAYZATY_ENV === "sandbox" 
  ? "https://api.sandbox.payzaty.com" 
  : "https://api.payzaty.com";

const getHeaders = () => {
  const accountNo = process.env.PAYZATY_ACCOUNT_NO || "";
  const secretKey = process.env.PAYZATY_SECRET_KEY || "";
  
  return {
    "X-AccountNo": accountNo,
    "X-SecretKey": secretKey,
    "Content-Type": "application/json",
  };
};

app.get("/api/payment-success", (req, res) => {
  res.send(`
    <html>
      <body>
        <script>
          if (window.parent) {
            window.parent.postMessage({ type: 'PAYMENT_SUCCESS' }, '*');
          }
        </script>
        <p>جاري معالجة الدفع... يمكنك إغلاق هذه النافذة إذا لم تغلق تلقائياً.</p>
      </body>
    </html>
  `);
});

app.get("/api/payment-cancel", (req, res) => {
  res.send(`
    <html>
      <body>
        <script>
          if (window.parent) {
            window.parent.postMessage({ type: 'PAYMENT_CANCEL' }, '*');
          }
        </script>
        <p>تم إلغاء الدفع.</p>
      </body>
    </html>
  `);
});

app.post("/api/checkout", checkoutLimiter, async (req, res) => {
  try {
    let { amount, currency, reference, customer, response_url, cancel_url } = req.body;

    // Input Sanitization
    if (customer) {
      if (customer.name) customer.name = validator.escape(validator.trim(customer.name));
      if (customer.email) customer.email = validator.normalizeEmail(validator.trim(customer.email)) || customer.email;
      if (customer.phone) customer.phone = validator.escape(validator.trim(customer.phone));
    }
    if (reference) reference = validator.escape(validator.trim(reference));

    const accountNo = process.env.PAYZATY_ACCOUNT_NO;
    const secretKey = process.env.PAYZATY_SECRET_KEY;

    console.log("Checkout request received. AccountNo present:", !!accountNo, "SecretKey present:", !!secretKey);

    if (!accountNo || !secretKey) {
      console.error("Payzaty keys missing in environment");
      return res.status(400).json({ 
        error: "يرجى إضافة مفاتيح Payzaty في إعدادات Secrets.",
        details: "PAYZATY_ACCOUNT_NO or PAYZATY_SECRET_KEY is missing" 
      });
    }

    const response = await fetch(`${PAYZATY_API_URL}/checkout`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        amount,
        currency,
        language: "ar",
        reference,
        customer,
        response_url,
        cancel_url,
      }),
    });

    console.log("Payzaty response status:", response.status);

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("Failed to parse Payzaty response:", text);
      data = { message: text };
    }

    if (!response.ok) {
      if (response.status === 401) {
        return res.status(401).json({ error: "مفاتيح Payzaty غير صالحة." });
      }
      if (Object.keys(data).length === 0) {
        data = { error: `Payzaty API Error: ${response.status} ${response.statusText}` };
      }
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) });
  }
});

app.get("/api/checkout/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sanitizedId = validator.escape(validator.trim(id));

    const response = await fetch(`${PAYZATY_API_URL}/checkout/${sanitizedId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Get checkout error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/webhook/order", async (req, res) => {
  try {
    const response = await fetch('https://hook.eu1.make.com/2iw6maihkmex3wctudhoeefjf65iddkh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Webhook proxy error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/webhook/refill", async (req, res) => {
  try {
    const response = await fetch('https://hook.eu1.make.com/rcxhporlbs7w1bop6m2xffintwurgdj6', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Refill proxy error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/tiktok/user", checkoutLimiter, async (req, res) => {
  try {
    const { uniqueId } = req.query;
    if (!uniqueId || typeof uniqueId !== 'string') {
      return res.status(400).json({ statusCode: 400, error: "uniqueId is required" });
    }

    const data = await getTikTokUserInfo(uniqueId);
    if (data.statusCode === 429) {
      return res.status(429).json(data);
    }
    res.json(data);
  } catch (error) {
    console.error("TikTok API error:", error);
    res.status(500).json({ statusCode: 500, error: "Internal Server Error" });
  }
});

app.get("/api/proxy-image", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).send("URL is required");
    }

    const cleanedUrl = cleanTikTokUrl(url);

    const response = await fetch(cleanedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.1',
        'Referer': 'https://www.tiktok.com/',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      return res.redirect(cleanedUrl);
    }

    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Cache for 24 hours
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Proxy image error:", error);
    if (typeof req.query?.url === 'string') {
      return res.redirect(cleanTikTokUrl(req.query.url));
    }
    res.status(500).send("Error proxying image");
  }
});

// TikTok CAPI Proxy
app.post("/api/tiktok/track", async (req, res) => {
  try {
    const referer = req.headers.referer || "";
    if (referer.includes('/bomba') || referer.includes('/refill')) {
      console.log('TikTok Tracking ABORTED on server for Admin/Refill path.');
      return res.status(204).end();
    }

    const { event, event_id, user, properties } = req.body;
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const pixelId = "D6JRT6BC77UEPBE531G0"; // Exact ID from request

    if (!accessToken) {
      console.warn("TikTok CAPI access token missing");
      return res.status(500).json({ error: "TikTok CAPI not configured" });
    }

    // 1. Stop Fake IP: Use real public IP
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress;
    
    // 2. Fix Timestamp (The Core Issue): 10 digits Unix timestamp
    const eventTime = Math.floor(Date.now() / 1000);

    // 5. Logging: Log clientIp and event_time before sending
    console.log("TikTok Tracking Attempt:", { clientIp, eventTime, event: event || "PageView" });
    
    if (clientIp === "8.8.8.8" || clientIp === "127.0.0.1" || clientIp === "::1") {
      console.warn("TikTok Warning: Event may FAIL due to non-public IP:", clientIp);
    }

    // Hash PII if present
    const hash = (val: string) => crypto.createHash('sha256').update(val.toLowerCase().trim()).digest('hex');
    
    const hashedUser = {
      external_id: user?.external_id ? hash(user.external_id) : undefined,
      email: user?.email ? hash(user.email) : undefined,
      phone_number: user?.phone ? hash(user.phone) : undefined,
    };

    // 3 & 4. Final Object Structure (v1.3 Strict)
    const tiktokPayload = {
      "event_source": "web",
      "event_source_id": pixelId,
      "data": [{
        "event": event || "PageView",
        "event_time": eventTime,
        "event_id": event_id || "event_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
        "user": {
          "client_ip_address": clientIp,
          "client_user_agent": req.headers['user-agent'],
          ...hashedUser
        },
        "page": { 
          "url": "https://daemstore.com" + (req.originalUrl || "")
        },
        ...(properties ? { properties } : {})
      }]
    };

    console.log("TikTok Payload:", JSON.stringify(tiktokPayload, null, 2));

    const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: {
        "Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tiktokPayload),
    });

    const data = await response.json();
    
    console.log('TikTok API Status:', response.status);
    console.log('TikTok API Response:', JSON.stringify(data, null, 2));

    res.status(response.status).json(data);
  } catch (error) {
    console.error("TikTok CAPI Proxy Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Catch-all for API routes to ensure they always return JSON
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.daemstore.com/</loc><priority>1.0</priority></url>
  <url><loc>https://www.daemstore.com/about</loc><priority>0.8</priority></url>
  <url><loc>https://www.daemstore.com/contact</loc><priority>0.8</priority></url>
  <url><loc>https://www.daemstore.com/shipping</loc><priority>0.8</priority></url>
  <url><loc>https://www.daemstore.com/returns</loc><priority>0.8</priority></url>
  <url><loc>https://www.daemstore.com/terms</loc><priority>0.8</priority></url>
  <url><loc>https://www.daemstore.com/privacy-policy</loc><priority>0.8</priority></url>
  <url><loc>https://www.daemstore.com/cookie-policy</loc><priority>0.8</priority></url>
  <url><loc>https://www.daemstore.com/refill</loc><priority>0.8</priority></url>
</urlset>`);
});

app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send('User-agent: *\nAllow: /\nDisallow: /bomba\nDisallow: /api/\n\nSitemap: https://www.daemstore.com/sitemap.xml');
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

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Hardcoded AddToCart test on startup
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const pixelId = "D6JRT6BC77UEPBE531G0";
    if (accessToken) {
      console.log('Sending hardcoded AddToCart test to TikTok...');
      try {
        const eventTime = Math.floor(Date.now() / 1000);
        const testPayload = {
          "event_source": "web",
          "event_source_id": pixelId,
          "data": [
            {
              "event": "AddToCart",
              "event_time": eventTime,
              "event_id": "startup_test_" + Date.now(),
              "user": {
                "client_ip_address": "1.1.1.1", // Using a real public IP to avoid filters
                "client_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "external_id": crypto.createHash('sha256').update("test_user_" + Date.now()).digest('hex')
              },
              "page": { "url": "https://daemstore.com/startup-test" }
            }
          ]
        };
        console.log("TikTok Payload (Startup Test):", JSON.stringify(testPayload, null, 2));
        const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
          method: "POST",
          headers: {
            "Access-Token": accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testPayload),
        });
        const data = await response.json();
        console.log('Startup Test TikTok API Status:', response.status);
        console.log('Startup Test TikTok API Response:', JSON.stringify(data, null, 2));
      } catch (err) {
        console.error('Startup Test TikTok API Error:', err);
      }
    }
  });
}

startServer();

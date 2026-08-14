import crypto from 'crypto';
import { setCorsHeaders } from '../_utils';

export default async function handler(req: any, res: any) {
  if (setCorsHeaders(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const referer = req.headers?.referer || "";
    if (referer.includes('/bomba') || referer.includes('/refill')) {
      return res.status(204).end();
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: "Invalid JSON payload" });
      }
    }

    const { event, event_id, user, properties } = body || {};
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const pixelId = process.env.TIKTOK_PIXEL_ID;

    if (!accessToken || !pixelId) {
      console.warn("TikTok CAPI Warning: Missing required environment variable: TIKTOK_ACCESS_TOKEN or TIKTOK_PIXEL_ID");
      return res.status(500).json({ error: "Missing required environment variable: TIKTOK_ACCESS_TOKEN or TIKTOK_PIXEL_ID" });
    }

    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket?.remoteAddress || '1.1.1.1';
    const eventTime = Math.floor(Date.now() / 1000);

    const hash = (val: string) => crypto.createHash('sha256').update(val.toLowerCase().trim()).digest('hex');
    
    const hashedUser = {
      external_id: user?.external_id ? hash(user.external_id) : undefined,
      email: user?.email ? hash(user.email) : undefined,
      phone_number: user?.phone ? hash(user.phone) : undefined,
    };

    const host = req.headers?.host || "daemstore.com";

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
          "url": `https://${host}` + (req.url || "")
        },
        ...(properties ? { properties } : {})
      }]
    };

    const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: {
        "Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tiktokPayload),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("TikTok CAPI Proxy Error:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

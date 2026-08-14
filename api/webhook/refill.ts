import { setCorsHeaders } from '../_utils';

export default async function handler(req: any, res: any) {
  if (setCorsHeaders(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.REFILL_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("Refill Webhook Error: Missing REFILL_WEBHOOK_URL in environment");
    return res.status(500).json({ error: "Missing required environment variable: REFILL_WEBHOOK_URL" });
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {}
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.text();
    return res.status(response.status).send(data);
  } catch (error) {
    console.error("Refill webhook forwarding error:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

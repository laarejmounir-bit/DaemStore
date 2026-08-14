import { setCorsHeaders, getPayzatyConfig } from '../_utils';

export default async function handler(req: any, res: any) {
  if (setCorsHeaders(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payzaty = getPayzatyConfig();

  if (!payzaty.isConfigured) {
    console.error("Payzaty Error: Missing PAYZATY_ACCOUNT_NO or PAYZATY_SECRET_KEY in server environment");
    return res.status(500).json({ error: "Missing required environment variable: PAYZATY_ACCOUNT_NO or PAYZATY_SECRET_KEY" });
  }

  try {
    const { id } = req.query || {};
    const urlId = req.url ? req.url.split('?')[0].split('/').pop() : '';
    const checkoutId = id || urlId;

    if (!checkoutId || checkoutId === '[id]') {
      return res.status(400).json({ error: "Checkout ID is required" });
    }

    const response = await fetch(`${payzaty.apiUrl}/checkout/${encodeURIComponent(checkoutId)}`, {
      method: "GET",
      headers: payzaty.headers,
    });

    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: text };
    }

    if (!response.ok) {
      console.error("Payzaty retrieve checkout failed:", {
        status: response.status,
        statusText: response.statusText,
        response: data
      });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Get checkout ID error:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

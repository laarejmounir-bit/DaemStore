import { setCorsHeaders, getPayzatyConfig } from './_utils';

export default async function handler(req: any, res: any) {
  if (setCorsHeaders(req, res)) return;

  const payzaty = getPayzatyConfig();

  if (req.method === 'GET') {
    try {
      if (!payzaty.isConfigured) {
        console.error("Payzaty Error: Missing PAYZATY_ACCOUNT_NO or PAYZATY_SECRET_KEY in server environment");
        return res.status(500).json({ error: "Missing required environment variable: PAYZATY_ACCOUNT_NO or PAYZATY_SECRET_KEY" });
      }

      const id = req.query?.id || req.query?.slug || req.url?.split('?')[0].split('/').pop();
      if (!id) {
        return res.status(400).json({ error: "Checkout ID is required" });
      }

      const response = await fetch(`${payzaty.apiUrl}/checkout/${encodeURIComponent(id)}`, {
        method: "GET",
        headers: payzaty.headers,
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      console.error("Get checkout error:", error instanceof Error ? error.message : "Unknown error");
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === 'POST') {
    try {
      if (!payzaty.isConfigured) {
        console.error("Payzaty Error: Missing PAYZATY_ACCOUNT_NO or PAYZATY_SECRET_KEY in server environment");
        return res.status(500).json({ error: "Missing required environment variable: PAYZATY_ACCOUNT_NO or PAYZATY_SECRET_KEY" });
      }

      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          return res.status(400).json({ error: "Invalid JSON payload" });
        }
      }
      
      let { amount, currency, reference, customer, response_url, cancel_url } = body || {};

      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        return res.status(400).json({ error: "Invalid or missing payment amount" });
      }

      if (customer) {
        if (!customer.name) customer.name = "عميل داعم";
        if (!customer.email || !customer.email.includes('@')) customer.email = "guest@daemstore.com";
        if (customer.phone) {
          let p = String(customer.phone).replace(/\D/g, '');
          if (p.startsWith('966')) p = p.slice(3);
          if (p.startsWith('0')) p = p.slice(1);
          customer.phone = `+966${p || '500000000'}`;
        } else {
          customer.phone = "+966500000000";
        }
      } else {
        customer = {
          name: "عميل داعم",
          email: "guest@daemstore.com",
          phone: "+966500000000"
        };
      }

      const defaultDomain = "https://www.daemstore.com";
      if (!response_url || response_url.includes("localhost") || response_url.includes("127.0.0.1")) {
        response_url = `${defaultDomain}/thankyou?payment_return=true`;
      }
      if (!cancel_url || cancel_url.includes("localhost") || cancel_url.includes("127.0.0.1")) {
        cancel_url = `${defaultDomain}/thankyou?payment_cancel=true`;
      }

      const response = await fetch(`${payzaty.apiUrl}/checkout`, {
        method: "POST",
        headers: payzaty.headers,
        body: JSON.stringify({
          amount: Number(amount),
          currency: currency || "SAR",
          language: "ar",
          reference: reference || `REF-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
          customer,
          response_url,
          cancel_url,
        }),
      });

      const text = await response.text();
      let data: any;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { message: text };
      }

      if (!response.ok) {
        console.error("Payzaty checkout creation failed:", {
          status: response.status,
          statusText: response.statusText,
          response: data
        });
      }

      return res.status(response.status).json(data);
    } catch (error) {
      console.error("Checkout error:", error instanceof Error ? error.message : "Unknown error");
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

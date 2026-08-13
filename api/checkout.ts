import { setCorsHeaders } from './_utils';

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

export default async function handler(req: any, res: any) {
  if (setCorsHeaders(req, res)) return;

  if (req.method === 'GET') {
    try {
      const id = req.query.id || req.query.slug || req.url.split('/').pop();
      if (!id) {
        return res.status(400).json({ error: "Checkout ID required" });
      }

      const response = await fetch(`${PAYZATY_API_URL}/checkout/${id}`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      console.error("Get checkout error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === 'POST') {
    try {
      let { amount, currency, reference, customer, response_url, cancel_url } = req.body || {};

      const accountNo = process.env.PAYZATY_ACCOUNT_NO;
      const secretKey = process.env.PAYZATY_SECRET_KEY;

      if (!accountNo || !secretKey) {
        return res.status(400).json({ 
          error: "يرجى إضافة مفاتيح Payzaty في إعدادات البيئة (Environment Variables).",
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

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { message: text };
      }

      return res.status(response.status).json(data);
    } catch (error) {
      console.error("Checkout error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

import { setCorsHeaders } from './_utils';

const PAYZATY_API_URL = process.env.PAYZATY_ENV === "sandbox" 
  ? "https://api.sandbox.payzaty.com" 
  : "https://api.payzaty.com";

const getHeaders = () => {
  const accountNo = process.env.PAYZATY_ACCOUNT_NO || "134221";
  const secretKey = process.env.PAYZATY_SECRET_KEY || "sk_111d55e9e3f0434fa0ed1495e5f3ea12";
  
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
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {}
      }
      let { amount, currency, reference, customer, response_url, cancel_url } = body || {};

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

      const accountNo = process.env.PAYZATY_ACCOUNT_NO || "134221";
      const secretKey = process.env.PAYZATY_SECRET_KEY || "sk_111d55e9e3f0434fa0ed1495e5f3ea12";

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

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

      // Amount validation (Min 1 SAR according to Payzaty docs)
      let cleanAmount = parseFloat(amount);
      if (isNaN(cleanAmount) || cleanAmount < 1) {
        cleanAmount = 1;
      }

      // Customer Name sanitization
      let rawName = customer && customer.name ? String(customer.name).trim() : '';
      let customerName = rawName || 'عميل متجر دعم';

      // Customer Email sanitization
      let rawEmail = customer && customer.email ? String(customer.email).trim() : '';
      let customerEmail = 'guest@daemstore.com';
      if (rawEmail && rawEmail.includes('@')) {
        customerEmail = rawEmail;
      }

      // Customer Phone sanitization
      let rawPhone = customer && customer.phone ? String(customer.phone) : '';
      let phoneDigits = rawPhone.replace(/\D/g, '').replace(/^0+/, '');
      let customerPhone = phoneDigits ? `+966${phoneDigits}` : '+966500000000';

      const cleanCustomer = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone
      };

      const cleanReference = reference 
        ? String(reference).trim() 
        : `SMM-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

      const accountNo = process.env.PAYZATY_ACCOUNT_NO;
      const secretKey = process.env.PAYZATY_SECRET_KEY;

      if (!accountNo || !secretKey) {
        return res.status(400).json({ 
          error: "يرجى إضافة مفاتيح Payzaty (PAYZATY_ACCOUNT_NO و PAYZATY_SECRET_KEY) في إعدادات البيئة.",
          details: "PAYZATY_ACCOUNT_NO or PAYZATY_SECRET_KEY is missing" 
        });
      }

      const payzatyPayload = {
        amount: cleanAmount,
        currency: currency || "SAR",
        language: "ar",
        reference: cleanReference,
        customer: cleanCustomer,
        response_url: response_url || "https://daemstore.com/thankyou?payment_return=true",
        cancel_url: cancel_url || "https://daemstore.com/thankyou?payment_cancel=true",
      };

      const response = await fetch(`${PAYZATY_API_URL}/checkout`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payzatyPayload),
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { error: "استجابة غير صالحة من بوابة الدفع", message: text };
      }

      if (!response.ok) {
        if (response.status === 401) {
          return res.status(401).json({ error: "مفاتيح Payzaty غير صالحة أو منتهية الصلاحية." });
        }
        const errorText = data.error_text || data.error || data.message || `خطأ في بوابة الدفع (${response.status})`;
        return res.status(response.status).json({ error: errorText, details: data });
      }

      const checkout_id = data.checkout_id || data.id;
      const checkout_url = data.checkout_url || (checkout_id ? `https://pay.payzaty.com/payment/pay/${checkout_id}` : null);

      return res.status(200).json({
        ...data,
        checkout_id,
        checkout_url
      });
    } catch (error) {
      console.error("Checkout error:", error);
      return res.status(500).json({ error: "حدث خطأ في الخادم أثناء إنشاء رابط الدفع" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

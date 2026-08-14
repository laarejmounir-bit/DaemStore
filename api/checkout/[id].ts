import { setCorsHeaders } from '../_utils';

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

  try {
    const { id } = req.query || {};
    const checkoutId = id || req.url.split('/').pop();

    if (!checkoutId) {
      return res.status(400).json({ error: "Checkout ID required" });
    }

    const response = await fetch(`${PAYZATY_API_URL}/checkout/${checkoutId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Get checkout ID error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

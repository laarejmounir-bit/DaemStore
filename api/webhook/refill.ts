import { setCorsHeaders } from '../_utils';

export default async function handler(req: any, res: any) {
  if (setCorsHeaders(req, res)) return;
  try {
    const response = await fetch('https://hook.eu1.make.com/rcxhporlbs7w1bop6m2xffintwurgdj6', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.text();
    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

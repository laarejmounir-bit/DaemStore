import { setCorsHeaders } from './_utils';

export default async function handler(req: any, res: any) {
  if (setCorsHeaders(req, res)) return;
  return res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
}

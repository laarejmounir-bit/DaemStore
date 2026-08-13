import { setCorsHeaders, getTikTokUserInfo } from '../_utils';

export default async function handler(req: any, res: any) {
  if (setCorsHeaders(req, res)) return;

  try {
    const { uniqueId } = req.query || {};
    if (!uniqueId || typeof uniqueId !== 'string') {
      return res.status(400).json({ statusCode: 400, error: "uniqueId is required" });
    }

    const result = await getTikTokUserInfo(uniqueId);
    
    if (result.statusCode === 429) {
      return res.status(429).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("TikTok user API error:", error);
    return res.status(500).json({ statusCode: 500, error: "Internal Server Error" });
  }
}

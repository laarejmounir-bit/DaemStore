import { setCorsHeaders, getTikTokUserInfo } from '../_utils';

export default async function handler(req: any, res: any) {
  if (setCorsHeaders(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ statusCode: 405, error: "Method not allowed" });
  }

  try {
    const { uniqueId } = req.query || {};
    if (!uniqueId || typeof uniqueId !== 'string') {
      return res.status(400).json({ statusCode: 400, error: "اسم المستخدم مطلوب" });
    }

    const result = await getTikTokUserInfo(uniqueId);
    
    const httpStatus = result.statusCode === 0 ? 200 : (result.statusCode || 400);
    return res.status(httpStatus).json(result);
  } catch (error) {
    console.error("TikTok user API error:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ statusCode: 500, error: "Internal Server Error" });
  }
}

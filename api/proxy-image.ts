import { setCorsHeaders, cleanTikTokUrl } from './_utils';

export default async function handler(req: any, res: any) {
  if (setCorsHeaders(req, res)) return;

  try {
    const { url } = req.query || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).send("URL is required");
    }

    const cleanedUrl = cleanTikTokUrl(url);
    if (!cleanedUrl || !cleanedUrl.startsWith('http')) {
      return res.status(400).send("Invalid image URL");
    }

    const uas = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    ];

    let imageRes: Response | null = null;
    for (const ua of uas) {
      try {
        const response = await fetch(cleanedUrl, {
          headers: {
            'User-Agent': ua,
            'Referer': 'https://www.tiktok.com/',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
          }
        });
        if (response.ok) {
          imageRes = response;
          break;
        }
      } catch (e) {}
    }

    if (!imageRes || !imageRes.ok) {
      const fallbackName = encodeURIComponent("TikTok");
      const fallbackRes = await fetch(`https://ui-avatars.com/api/?name=${fallbackName}&background=10b981&color=fff`);
      res.setHeader('Content-Type', 'image/png');
      const buf = await fallbackRes.arrayBuffer();
      return res.status(200).send(Buffer.from(buf));
    }

    const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

    const buffer = await imageRes.arrayBuffer();
    return res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error("Proxy image error:", error);
    return res.status(500).send("Error proxying image");
  }
}

import { setCorsHeaders, cleanTikTokUrl } from './_utils';

export default async function handler(req: any, res: any) {
  if (setCorsHeaders(req, res)) return;

  try {
    const { url } = req.query || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).send("URL is required");
    }

    const cleanUrl = cleanTikTokUrl(url);

    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.tiktok.com/',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      // Redirect to direct URL as browser fallback
      return res.redirect(302, cleanUrl);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

    const buffer = await response.arrayBuffer();
    return res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error("Proxy image error:", error);
    const rawUrl = req.query?.url;
    if (rawUrl) {
      return res.redirect(302, cleanTikTokUrl(String(rawUrl)));
    }
    return res.status(500).send("Error proxying image");
  }
}


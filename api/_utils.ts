import crypto from 'crypto';

export function setCorsHeaders(req: any, res: any) {
  const origin = req.headers?.origin || req.headers?.referer || '';
  
  const allowedOrigins = [
    "https://daemstore.com",
    "https://www.daemstore.com",
    "https://saudismm.com",
    "https://www.saudismm.com",
    "https://ais-dev-yd45tmitnmz4i3uznm2lex-594526045281.europe-west2.run.app",
    "https://ais-pre-yd45tmitnmz4i3uznm2lex-594526045281.europe-west2.run.app"
  ];

  let allowOrigin = '*';
  if (origin) {
    const isAllowed = allowedOrigins.some(o => origin.startsWith(o)) ||
      origin.includes('vercel.app') ||
      origin.includes('daemstore.com') ||
      origin.includes('saudismm.com');

    if (isAllowed) {
      allowOrigin = origin;
    }
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-rapidapi-key, x-rapidapi-host, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

export async function resolveTikTokUsername(input: string): Promise<string> {
  let cleaned = input.trim();
  if (!cleaned) return '';

  if (cleaned.includes('tiktok.com')) {
    const match = cleaned.match(/@([^/?#]+)/);
    if (match) return match[1];

    try {
      const res = await fetch(cleaned, { method: 'HEAD', redirect: 'follow' });
      const finalUrl = res.url;
      const match2 = finalUrl.match(/@([^/?#]+)/);
      if (match2) return match2[1];
    } catch (e) {
      console.warn("Failed to resolve TikTok redirect link:", e);
    }
  }

  return cleaned.replace(/^@/, '');
}

export async function getTikTokUserInfo(uniqueId: string) {
  const sanitizedUniqueId = await resolveTikTokUsername(uniqueId);
  if (!sanitizedUniqueId) {
    return { statusCode: 400, error: "uniqueId is required" };
  }

  // Strategy 1: Direct TikTok Web Scraping (No API key required)
  try {
    const webRes = await fetch(`https://www.tiktok.com/@${encodeURIComponent(sanitizedUniqueId)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Cache-Control': 'no-cache'
      }
    });

    if (webRes.ok) {
      const html = await webRes.text();

      // Pattern 1: __UNIVERSAL_DATA_FOR_REHYDRATION__
      const match1 = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/s);
      if (match1 && match1[1]) {
        try {
          const parsed = JSON.parse(match1[1]);
          const userInfo = parsed['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.userInfo;
          if (userInfo && userInfo.user) {
            return { statusCode: 0, userInfo };
          }
        } catch (e) {
          console.warn("Parse error for __UNIVERSAL_DATA_FOR_REHYDRATION__:", e);
        }
      }

      // Pattern 2: SIGI_STATE
      const match2 = html.match(/<script id="SIGI_STATE" type="application\/json">(.*?)<\/script>/s);
      if (match2 && match2[1]) {
        try {
          const parsed = JSON.parse(match2[1]);
          const UserModule = parsed.UserModule || {};
          const users = UserModule.users || {};
          const stats = UserModule.stats || {};
          const userObj = users[sanitizedUniqueId] || Object.values(users)[0];
          const statsObj = stats[sanitizedUniqueId] || Object.values(stats)[0];
          if (userObj) {
            return {
              statusCode: 0,
              userInfo: {
                user: userObj,
                stats: statsObj || {}
              }
            };
          }
        } catch (e) {
          console.warn("Parse error for SIGI_STATE:", e);
        }
      }

      // Pattern 3: __FRONTEND_DATA__
      const match3 = html.match(/<script id="__FRONTEND_DATA__" type="application\/json">(.*?)<\/script>/s);
      if (match3 && match3[1]) {
        try {
          const parsed = JSON.parse(match3[1]);
          if (parsed.userInfo && parsed.userInfo.user) {
            return { statusCode: 0, userInfo: parsed.userInfo };
          }
        } catch (e) {
          console.warn("Parse error for __FRONTEND_DATA__:", e);
        }
      }
    }
  } catch (err) {
    console.warn("Direct TikTok web scraping failed:", err);
  }

  // Strategy 2: TikTok Public Web API
  try {
    const apiRes = await fetch(`https://www.tiktok.com/api/user/detail/?uniqueId=${encodeURIComponent(sanitizedUniqueId)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.tiktok.com/'
      }
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.userInfo && data.userInfo.user) {
        return { statusCode: 0, userInfo: data.userInfo };
      }
    }
  } catch (err) {
    console.warn("TikTok public API failed:", err);
  }

  // Strategy 3: RapidAPI (if RAPIDAPI_KEY is configured in env)
  const apiKey = process.env.RAPIDAPI_KEY;
  if (apiKey) {
    try {
      const rapidRes = await fetch(`https://tiktok-api23.p.rapidapi.com/api/user/info?uniqueId=${encodeURIComponent(sanitizedUniqueId)}`, {
        method: "GET",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "tiktok-api23.p.rapidapi.com",
        },
      });

      if (rapidRes.status === 429) {
        return { statusCode: 429, error: "Quota exceeded" };
      }

      if (rapidRes.ok) {
        const data = await rapidRes.json();
        if (data && data.userInfo) {
          return data;
        }
      }
    } catch (err) {
      console.warn("RapidAPI lookup failed:", err);
    }
  }

  return { statusCode: 404, message: "لم يتم العثور على الحساب، تأكد من اسم المستخدم" };
}

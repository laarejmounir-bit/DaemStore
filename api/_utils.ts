import crypto from 'crypto';

export function setCorsHeaders(req: any, res: any) {
  const reqOrigin = req.headers?.origin || req.headers?.referer || '';
  let allowOrigin = "https://www.daemstore.com";

  if (reqOrigin) {
    try {
      if (reqOrigin.startsWith('http')) {
        const parsed = new URL(reqOrigin);
        allowOrigin = parsed.origin;
      }
    } catch (e) {
      allowOrigin = reqOrigin;
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

export function getPayzatyConfig() {
  const accountNo = process.env.PAYZATY_ACCOUNT_NO;
  const secretKey = process.env.PAYZATY_SECRET_KEY;
  const apiUrl = process.env.PAYZATY_ENV === "sandbox" 
    ? "https://api.sandbox.payzaty.com" 
    : "https://api.payzaty.com";

  if (!accountNo || !secretKey) {
    return {
      isConfigured: false,
      accountNo: '',
      secretKey: '',
      apiUrl,
      headers: { "Content-Type": "application/json" }
    };
  }

  return {
    isConfigured: true,
    accountNo,
    secretKey,
    apiUrl,
    headers: {
      "X-AccountNo": accountNo,
      "X-SecretKey": secretKey,
      "Content-Type": "application/json",
    }
  };
}

export function cleanTikTokUrl(url: string): string {
  if (!url) return '';
  let cleaned = String(url).trim();
  
  // Clean unicode escapes, slashes, and HTML entities
  cleaned = cleaned
    .replace(/\\u002f/gi, '/')
    .replace(/\\u0026/gi, '&')
    .replace(/\\u003d/gi, '=')
    .replace(/\\u003f/gi, '?')
    .replace(/\\/g, '')
    .replace(/&amp;/g, '&');

  if (cleaned.startsWith('//')) {
    cleaned = 'https:' + cleaned;
  }
  return cleaned;
}

export async function resolveTikTokUsername(input: string): Promise<string> {
  let cleaned = input.trim();
  if (!cleaned) return '';

  const atMatch = cleaned.match(/@([a-zA-Z0-9_.-]+)/);
  if (atMatch && atMatch[1] && atMatch[1] !== 'video') {
    return atMatch[1];
  }

  if (cleaned.includes('tiktok.com')) {
    try {
      const res = await fetch(cleaned, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15'
        },
        redirect: 'follow'
      });
      const finalUrl = res.url;
      const match2 = finalUrl.match(/@([a-zA-Z0-9_.-]+)/);
      if (match2 && match2[1] && match2[1] !== 'video') {
        return match2[1];
      }
    } catch (e) {
      console.warn("Failed to resolve TikTok redirect link:", e);
    }
  }

  return cleaned.replace(/^@/, '');
}

export async function getTikTokUserInfo(uniqueId: string) {
  const sanitizedUniqueId = await resolveTikTokUsername(uniqueId);
  if (!sanitizedUniqueId) {
    return { statusCode: 400, error: "اسم المستخدم مطلوب" };
  }

  // Strategy 1: RapidAPI (Fastest & Most Reliable on Vercel Datacenter IPs)
  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST || "tiktok-api23.p.rapidapi.com";
  if (apiKey) {
    try {
      const rapidRes = await fetch(`https://${apiHost}/api/user/info?uniqueId=${encodeURIComponent(sanitizedUniqueId)}`, {
        method: "GET",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": apiHost,
        },
      });

      if (rapidRes.status === 401) {
        console.error("[RapidAPI Error 401] Unauthorized: Invalid RAPIDAPI_KEY configured");
      } else if (rapidRes.status === 403) {
        console.error("[RapidAPI Error 403] Forbidden: Check RAPIDAPI subscription or host permissions");
      } else if (rapidRes.status === 404) {
        console.warn(`[RapidAPI 404] Endpoint not found or user '@${sanitizedUniqueId}' not found`);
      } else if (rapidRes.status === 429) {
        console.warn("[RapidAPI Warning 429] Rate limit/quota exceeded, initiating fallback strategies");
      } else if (!rapidRes.ok) {
        console.error(`[RapidAPI Error ${rapidRes.status}] ${rapidRes.statusText}`);
      } else {
        const text = await rapidRes.text();
        if (text && text.startsWith('{')) {
          const data = JSON.parse(text);
          if (data && data.userInfo && data.userInfo.user) {
            if (data.userInfo.user.avatarThumb) data.userInfo.user.avatarThumb = cleanTikTokUrl(data.userInfo.user.avatarThumb);
            if (data.userInfo.user.avatarLarger) data.userInfo.user.avatarLarger = cleanTikTokUrl(data.userInfo.user.avatarLarger);
            return { statusCode: 0, userInfo: data.userInfo };
          }
        }
      }
    } catch (err) {
      console.error("[RapidAPI Fetch Error]:", err instanceof Error ? err.message : "Network error");
    }
  } else {
    console.warn("[RapidAPI Warning] RAPIDAPI_KEY environment variable is not defined");
  }

  // Strategy 2: TikTok Embed Page Scraping
  try {
    const embedRes = await fetch(`https://www.tiktok.com/embed/@${encodeURIComponent(sanitizedUniqueId)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (embedRes.ok) {
      const html = await embedRes.text();
      const avtMatch = html.match(/"(https:\/\/[^"]*avt[^"]*)"/) || 
                       html.match(/"avatarLarger":"([^"]+)"/) || 
                       html.match(/"avatarThumb":"([^"]+)"/);

      const nicknameMatch = html.match(/"nickname":"([^"]+)"/) || html.match(/"author_name":"([^"]+)"/);
      const followerMatch = html.match(/"followerCount":(\d+)/) || html.match(/"followers":(\d+)/);
      const heartMatch = html.match(/"heartCount":(\d+)/) || html.match(/"heart":(\d+)/) || html.match(/"likes":(\d+)/);

      if (nicknameMatch || avtMatch || followerMatch) {
        const rawAvatar = avtMatch ? avtMatch[1] : '';
        const avatarUrl = rawAvatar ? cleanTikTokUrl(rawAvatar) : '';
        const nickname = nicknameMatch ? nicknameMatch[1] : sanitizedUniqueId;
        const followerCount = followerMatch ? parseInt(followerMatch[1], 10) : null;
        const heartCount = heartMatch ? parseInt(heartMatch[1], 10) : null;

        return {
          statusCode: 0,
          userInfo: {
            user: {
              uniqueId: sanitizedUniqueId,
              nickname,
              avatarThumb: avatarUrl,
              avatarLarger: avatarUrl,
              avatarMedium: avatarUrl,
              verified: false
            },
            stats: {
              followerCount,
              heartCount
            }
          }
        };
      }
    }
  } catch (err) {
    console.warn("TikTok embed scraping failed:", err);
  }

  // Strategy 3: TikTok oEmbed Check
  try {
    const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${encodeURIComponent(sanitizedUniqueId)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });
    if (oembedRes.ok) {
      const odata = await oembedRes.json();
      if (odata && odata.author_name) {
        return {
          statusCode: 0,
          userInfo: {
            user: {
              uniqueId: sanitizedUniqueId,
              nickname: odata.author_name,
              avatarThumb: '',
              avatarLarger: '',
              avatarMedium: '',
              verified: false
            },
            stats: {
              followerCount: null,
              heartCount: null
            }
          }
        };
      }
    }
  } catch (err) {
    console.warn("TikTok oEmbed check failed:", err);
  }

  return { statusCode: 404, error: "لم يتم العثور على الحساب، تأكد من اسم المستخدم" };
}


import crypto from 'crypto';

export function setCorsHeaders(req: any, res: any) {
  const origin = req.headers?.origin || req.headers?.referer || '';
  
  const allowedOrigins = [
    "https://daemstore.com",
    "https://www.daemstore.com",
    "https://ais-dev-yd45tmitnmz4i3uznm2lex-594526045281.europe-west2.run.app",
    "https://ais-pre-yd45tmitnmz4i3uznm2lex-594526045281.europe-west2.run.app"
  ];

  let allowOrigin = '*';
  if (origin) {
    const isAllowed = allowedOrigins.some(o => origin.startsWith(o)) ||
      origin.includes('vercel.app') ||
      origin.includes('daemstore.com');

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
    return { statusCode: 400, error: "اسم المستخدم مطلوب" };
  }

  // Strategy 1: Direct TikTok Web Scraping with User-Agent Fallbacks
  const userAgents = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  ];

  for (const ua of userAgents) {
    try {
      const webRes = await fetch(`https://www.tiktok.com/@${encodeURIComponent(sanitizedUniqueId)}`, {
        headers: {
          'User-Agent': ua,
          'Accept-Language': 'ar-SA,ar;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'no-cache'
        }
      });

      if (webRes.ok && !webRes.url.includes('/login')) {
        const html = await webRes.text();
        let userInfo: any = null;

        // Pattern 1: __UNIVERSAL_DATA_FOR_REHYDRATION__
        const match1 = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/s);
        if (match1 && match1[1]) {
          try {
            const parsed = JSON.parse(match1[1]);
            const scope = parsed['__DEFAULT_SCOPE__'] || {};
            userInfo = scope['webapp.user-detail']?.userInfo || scope['page.user-detail']?.userInfo;
          } catch (e) {
            console.warn("Parse error for __UNIVERSAL_DATA_FOR_REHYDRATION__:", e);
          }
        }

        // Pattern 2: SIGI_STATE
        if (!userInfo || !userInfo.user) {
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
                userInfo = { user: userObj, stats: statsObj || {} };
              }
            } catch (e) {
              console.warn("Parse error for SIGI_STATE:", e);
            }
          }
        }

        // Pattern 3: Direct Regex Fallback on HTML
        if (!userInfo || !userInfo.user) {
          const avatarMatch = html.match(/"avatarLarger":"([^"]+)"/) || html.match(/"avatarThumb":"([^"]+)"/) || html.match(/"avatarMedium":"([^"]+)"/);
          const nicknameMatch = html.match(/"nickname":"([^"]+)"/);
          const followerMatch = html.match(/"followerCount":(\d+)/);
          const heartMatch = html.match(/"heartCount":(\d+)/) || html.match(/"heart":(\d+)/);
          const verifiedMatch = html.match(/"verified":(true|false)/);

          if (avatarMatch || followerMatch || nicknameMatch) {
            userInfo = {
              user: {
                uniqueId: sanitizedUniqueId,
                nickname: nicknameMatch ? nicknameMatch[1] : sanitizedUniqueId,
                avatarThumb: avatarMatch ? avatarMatch[1] : '',
                avatarLarger: avatarMatch ? avatarMatch[1] : '',
                verified: verifiedMatch ? verifiedMatch[1] === 'true' : false
              },
              stats: {
                followerCount: followerMatch ? parseInt(followerMatch[1], 10) : null,
                heartCount: heartMatch ? parseInt(heartMatch[1], 10) : null
              }
            };
          }
        }

        if (userInfo && userInfo.user) {
          if (userInfo.user.avatarThumb) userInfo.user.avatarThumb = cleanTikTokUrl(userInfo.user.avatarThumb);
          if (userInfo.user.avatarLarger) userInfo.user.avatarLarger = cleanTikTokUrl(userInfo.user.avatarLarger);
          if (userInfo.user.avatarMedium) userInfo.user.avatarMedium = cleanTikTokUrl(userInfo.user.avatarMedium);

          if (userInfo.stats) {
            const s = userInfo.stats;
            const s2 = userInfo.statsV2 || {};

            if (s2.followerCount) s.followerCount = parseInt(s2.followerCount, 10);
            else if (typeof s.followerCount === 'number' && s.followerCount < 0) s.followerCount += 4294967296;

            if (s2.heartCount) s.heartCount = parseInt(s2.heartCount, 10);
            else if (s2.heart) s.heartCount = parseInt(s2.heart, 10);
            else if (typeof s.heartCount === 'number' && s.heartCount < 0) s.heartCount += 4294967296;
            else if (typeof s.heart === 'number' && s.heart < 0) s.heartCount = s.heart + 4294967296;
            else if (s.heart && !s.heartCount) s.heartCount = s.heart;
          }

          return { statusCode: 0, userInfo };
        }
      }
    } catch (err) {
      console.warn(`TikTok web scraping with UA failed:`, err);
    }
  }

  // Strategy 2: TikTok Public Web API
  try {
    const apiRes = await fetch(`https://www.tiktok.com/api/user/detail/?uniqueId=${encodeURIComponent(sanitizedUniqueId)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
        'Referer': `https://www.tiktok.com/@${encodeURIComponent(sanitizedUniqueId)}`,
        'Accept': 'application/json, text/plain, */*'
      }
    });

    if (apiRes.ok) {
      const text = await apiRes.text();
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
    console.warn("TikTok public API failed:", err);
  }

  // Strategy 3: TikTok oEmbed Check for Profile Verification
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

  // Strategy 4: RapidAPI (if RAPIDAPI_KEY is configured in env)
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
          if (data.userInfo.user?.avatarThumb) data.userInfo.user.avatarThumb = cleanTikTokUrl(data.userInfo.user.avatarThumb);
          if (data.userInfo.user?.avatarLarger) data.userInfo.user.avatarLarger = cleanTikTokUrl(data.userInfo.user.avatarLarger);
          return data;
        }
      }
    } catch (err) {
      console.warn("RapidAPI lookup failed:", err);
    }
  }

  return { statusCode: 404, error: "لم يتم العثور على الحساب، تأكد من اسم المستخدم" };
}

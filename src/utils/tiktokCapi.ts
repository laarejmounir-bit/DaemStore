/**
 * Utility to send events to TikTok Conversions API (CAPI) via server-side proxy
 */

interface TikTokUser {
  email?: string;
  phone?: string;
  external_id?: string;
}

interface TikTokProperties {
  content_type?: string;
  contents?: Array<{
    content_id: string;
    content_name: string;
    quantity: number;
    price: number;
  }>;
  currency?: string;
  value?: number;
  query?: string;
  description?: string;
  [key: string]: any;
}

interface TikTokEventParams {
  event: 'PageView' | 'CompletePayment' | 'AddToCart' | 'InitiateCheckout' | 'Search' | 'Contact' | 'Purchase' | 'ViewContent';
  event_id?: string;
  user?: TikTokUser;
  properties?: TikTokProperties;
}

export const trackTikTokEvent = async ({ event, event_id, user, properties }: TikTokEventParams) => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path.includes('/bomba') || path.includes('/refill')) {
      console.log('TikTok Tracking ABORTED for Admin/Refill path.');
      return; // STOP HERE
    }
  }

  try {
    const response = await fetch('/api/tiktok/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        event_id: event_id || `ev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        event_time: Math.floor(Date.now() / 1000),
        user,
        properties,
        page: {
          url: window.location.href,
          referrer: document.referrer,
        },
        // Capture ttclid from URL if present for attribution
        ttclid: new URLSearchParams(window.location.search).get('ttclid'),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.warn(`TikTok CAPI [${event}] failed:`, errorData);
    } else if (process.env.NODE_ENV !== 'production') {
      const data = await response.json();
      console.log(`TikTok CAPI [${event}] success:`, data);
    }
  } catch (error) {
    console.error(`TikTok CAPI [${event}] error:`, error);
  }
};

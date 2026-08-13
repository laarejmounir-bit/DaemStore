import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackTikTokEvent } from '../utils/tiktokCapi';

/**
 * Component to handle TikTok CAPI PageView tracking on route changes.
 * Place this inside the BrowserRouter in App.tsx.
 */
export const TikTokTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track PageView on every route change (pathname)
    trackTikTokEvent({
      event: 'PageView',
      event_id: `pv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });
  }, [location.pathname]); // Only pathname to avoid duplicates on search param changes

  return null;
};

'use client';

import { useEffect, useRef } from 'react';

export default function PopAdsScript() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'popads-loaded') {
        console.log('PopAds script loaded successfully');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="/popads.html"
      style={{ display: 'none', width: 0, height: 0, border: 0 }}
      title="PopAds Script Container"
      // Removed sandbox to allow full script functionality
    />
  );
}


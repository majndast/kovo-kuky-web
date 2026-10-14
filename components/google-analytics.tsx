"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useConsent } from "@/lib/consent";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

/**
 * Google Analytics is not requested at all until the visitor allows it.
 * If consent is withdrawn later, tracking is switched off and GA cookies are removed.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const { consent } = useConsent();
  const granted = consent === "all";

  useEffect(() => {
    if (!gaId || consent === undefined) return;
    window[`ga-disable-${gaId}`] = !granted;
    if (!granted) {
      const host = window.location.hostname;
      const domains = [host, `.${host}`, `.${host.replace(/^www\./, "")}`];
      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        if (name === "_ga" || name.startsWith("_ga_") || name === "_gid") {
          domains.forEach((d) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
          });
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      });
    }
  }, [gaId, granted, consent]);

  if (!gaId || !granted) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
          });
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

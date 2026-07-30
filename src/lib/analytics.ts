// Plausible + Google Ads (gtag) esemény-hurok.

type PrimitiveProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: PrimitiveProps }) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function env(name: string): string | undefined {
  if (typeof process === "undefined") return undefined;
  return (
    process.env[name] ||
    process.env[`NEXT_PUBLIC_${name.replace(/^VITE_/, "")}`] ||
    undefined
  )?.trim();
}

const ADS_ID = env("NEXT_PUBLIC_GOOGLE_ADS_ID") || env("VITE_GOOGLE_ADS_ID");

const CONVERSION_LABELS: Record<string, string | undefined> = {
  quote_submitted: env("NEXT_PUBLIC_GOOGLE_ADS_LABEL_QUOTE") || env("VITE_GOOGLE_ADS_LABEL_QUOTE"),
  cta_quote_click_oktatas: env("NEXT_PUBLIC_GOOGLE_ADS_LABEL_CTA") || env("VITE_GOOGLE_ADS_LABEL_CTA"),
};

export function trackEvent(event: string, props?: PrimitiveProps) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* soha ne dobjon a mérés */
  }
  if (ADS_ID && typeof window.gtag === "function") {
    try {
      window.gtag("event", event, props ?? {});
    } catch {
      /* ignore */
    }
  }
  const label = CONVERSION_LABELS[event];
  if (ADS_ID && label && typeof window.gtag === "function") {
    try {
      window.gtag("event", "conversion", {
        send_to: `${ADS_ID}/${label}`,
        value: typeof props?.value === "number" ? props.value : undefined,
        currency: (props?.currency as string | undefined) ?? "HUF",
      });
    } catch {
      /* ignore */
    }
  }
}

export function trackConversion(event: string, value: number, currency: string = "HUF") {
  trackEvent(event, { value, currency });
}

export const isGoogleAdsConfigured = () => Boolean(ADS_ID);

export {};

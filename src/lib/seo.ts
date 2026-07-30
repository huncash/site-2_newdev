export const SITE_URL = "https://projektorlampacsere.hu";

export const canonical = (path: string) => ({
  rel: "canonical" as const,
  href: `${SITE_URL}${path}`,
});
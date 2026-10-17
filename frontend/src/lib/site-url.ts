export const DEFAULT_SITE_URL = 'http://localhost:3000';

/**
 * Public origin the app is deployed at, used for metadataBase, canonical and
 * Open Graph URLs. Set NEXT_PUBLIC_SITE_URL per environment; local dev falls
 * back to localhost.
 */
export function getSiteUrl(value = process.env.NEXT_PUBLIC_SITE_URL): URL {
  const raw = value?.trim();
  if (!raw) return new URL(DEFAULT_SITE_URL);

  try {
    return new URL(raw);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be an absolute URL (e.g. https://app.example.com), got "${raw}"`,
    );
  }
}

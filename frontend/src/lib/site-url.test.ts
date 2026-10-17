import { describe, expect, it } from 'vitest';
import { DEFAULT_SITE_URL, getSiteUrl } from './site-url';

describe('getSiteUrl', () => {
  it('uses NEXT_PUBLIC_SITE_URL when set', () => {
    expect(getSiteUrl('https://app.pulsar.example').origin).toBe(
      'https://app.pulsar.example',
    );
  });

  it('falls back to localhost when unset or blank', () => {
    expect(getSiteUrl(undefined).href).toBe(`${DEFAULT_SITE_URL}/`);
    expect(getSiteUrl('  ').href).toBe(`${DEFAULT_SITE_URL}/`);
  });

  it('rejects a value that is not an absolute URL', () => {
    expect(() => getSiteUrl('app.pulsar.example')).toThrow(
      /NEXT_PUBLIC_SITE_URL must be an absolute URL/,
    );
  });
});

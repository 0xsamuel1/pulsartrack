import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/font/google', () => {
  const font = () => ({ variable: '' });
  return { Geist: font, Geist_Mono: font, Instrument_Serif: font };
});
vi.mock('next/headers', () => ({ headers: vi.fn() }));
vi.mock('@/components/providers', () => ({ Providers: () => null }));
vi.mock('@/components/header', () => ({ Header: () => null }));
vi.mock('@/components/ErrorBoundary', () => ({ ErrorBoundary: () => null }));

async function loadMetadata() {
  vi.resetModules();
  return (await import('./layout')).metadata;
}

describe('root layout metadata', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('resolves metadataBase from NEXT_PUBLIC_SITE_URL', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://app.pulsar.example');
    const metadata = await loadMetadata();

    expect(String(metadata.metadataBase)).toBe('https://app.pulsar.example/');
    expect(metadata.openGraph?.url).toBe('/');
  });

  it('defaults to localhost when NEXT_PUBLIC_SITE_URL is unset', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    const metadata = await loadMetadata();

    expect(String(metadata.metadataBase)).toBe('http://localhost:3000/');
  });
});

import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const captureException = vi.fn();

vi.mock('@sentry/nextjs', () => ({
  captureException: (...args: unknown[]) => captureException(...args),
}));

vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn() },
}));

import ErrorPage from './error';

const SECRET = 'fetch failed: https://internal.example/api?token=abc';

function renderWithError() {
  const error = Object.assign(new Error(SECRET), { digest: 'digest-123' });
  render(<ErrorPage error={error} reset={vi.fn()} />);
  return error;
}

describe('route error boundary', () => {
  beforeEach(() => {
    captureException.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('hides the raw error message in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    renderWithError();

    expect(screen.queryByText(SECRET)).not.toBeInTheDocument();
    expect(screen.getByText(/Please try again/)).toBeInTheDocument();
    expect(screen.getByText('Error ID: digest-123')).toBeInTheDocument();
  });

  it('shows the raw error message in development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    renderWithError();

    expect(screen.getByText(SECRET)).toBeInTheDocument();
  });

  it.each(['production', 'development'])(
    'reports the full error to Sentry in %s',
    (env) => {
      vi.stubEnv('NODE_ENV', env);
      const error = renderWithError();

      expect(captureException).toHaveBeenCalledWith(error);
    },
  );
});

import { describe, expect, it } from 'vitest';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getFrontendBuildArgs } = require('../../../scripts/validate-docker-env-vars.js');

const compose = `
services:
  backend:
    build:
      args:
        NEXT_PUBLIC_NOT_FRONTEND: x
    container_name: backend
  frontend:
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_API_URL: http://localhost:3001
        NEXT_PUBLIC_SENTRY_DSN: \${NEXT_PUBLIC_SENTRY_DSN:-}
        NEXT_PUBLIC_CONTRACT_AD_REGISTRY: \${CONTRACT_AD_REGISTRY:-PLACEHOLDER}
    container_name: frontend
`;

describe('getFrontendBuildArgs', () => {
  it('returns each frontend build arg once, ignoring names inside values', () => {
    expect(getFrontendBuildArgs(compose)).toEqual([
      'NEXT_PUBLIC_API_URL',
      'NEXT_PUBLIC_SENTRY_DSN',
      'NEXT_PUBLIC_CONTRACT_AD_REGISTRY',
    ]);
  });

  it('supports the list form of build args', () => {
    const listForm = `
services:
  frontend:
    build:
      args:
        - NEXT_PUBLIC_API_URL=http://localhost:3001
        - NEXT_PUBLIC_SENTRY_DSN
`;
    expect(getFrontendBuildArgs(listForm)).toEqual([
      'NEXT_PUBLIC_API_URL',
      'NEXT_PUBLIC_SENTRY_DSN',
    ]);
  });

  it('returns null when the frontend service has no build args', () => {
    expect(getFrontendBuildArgs('services:\n  frontend:\n    image: x\n')).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { DEFAULT_SCHEMA } from './default-schema';
import {
  remapBrokenPetstorePath,
  repairBrokenDemoSchema,
  resolvePetstoreBaseUrl,
  WORKING_PETSTORE_BASE,
} from './demo-schema';

describe('demo-schema', () => {
  it('replaces schemas that still use petstore3', () => {
    const broken = 'servers:\n  - url: https://petstore3.swagger.io/api/v3\n';
    expect(repairBrokenDemoSchema(broken)).toBe(DEFAULT_SCHEMA);
  });

  it('leaves unrelated schemas unchanged', () => {
    const custom = 'openapi: 3.0.3\nservers:\n  - url: https://api.example.com\n';
    expect(repairBrokenDemoSchema(custom)).toBe(custom);
  });

  it('rewrites petstore3 base url for requests', () => {
    expect(resolvePetstoreBaseUrl('https://petstore3.swagger.io/api/v3')).toBe(
      WORKING_PETSTORE_BASE,
    );
    expect(resolvePetstoreBaseUrl('https://api.example.com')).toBe(
      'https://api.example.com',
    );
  });

  it('remaps GET /pet to findByStatus', () => {
    expect(remapBrokenPetstorePath('GET', '/pet')).toBe('/pet/findByStatus');
    expect(remapBrokenPetstorePath('POST', '/pet')).toBe('/pet');
  });
});

import { describe, it, expect } from 'vitest';
import { validateOpenAPISpec } from '@/lib/openapi/validator';

const validYaml = `
openapi: 3.0.3
info:
  title: Test API
  version: 1.0.0
paths:
  /items:
    get:
      responses:
        '200':
          description: OK
`;

const invalidYaml = `
openapi: 3.0.3
info:
  title: Test
paths:
  /items:
    get:
      responses: {}
`;

describe('validateOpenAPISpec', () => {
  it('validates a correct spec', async () => {
    const result = await validateOpenAPISpec(validYaml);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.spec?.title).toBe('Test API');
    expect(result.spec?.endpoints).toHaveLength(1);
  });

  it('rejects invalid spec', async () => {
    const result = await validateOpenAPISpec(invalidYaml);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects empty content', async () => {
    const result = await validateOpenAPISpec('');
    expect(result.valid).toBe(false);
  });

  it('validates JSON format', async () => {
    const json = JSON.stringify({
      openapi: '3.0.3',
      info: { title: 'JSON API', version: '1.0.0' },
      paths: {
        '/test': {
          get: { responses: { '200': { description: 'OK' } } },
        },
      },
    });
    const result = await validateOpenAPISpec(json);
    expect(result.valid).toBe(true);
    expect(result.spec?.title).toBe('JSON API');
  });
});

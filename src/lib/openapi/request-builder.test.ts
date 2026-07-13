import { describe, it, expect } from 'vitest';
import type { OpenAPIEndpoint, OpenAPIParameter } from './types';
import {
  buildRequestUrl,
  buildRequestHeaders,
  getMissingRequiredParams,
  getRequestBodyExample,
  resolveEndpointBaseUrl,
} from './request-builder';

const params: OpenAPIParameter[] = [
  { name: 'petId', in: 'path', required: true },
  { name: 'verbose', in: 'query' },
  { name: 'X-Api-Key', in: 'header' },
  { name: 'session', in: 'cookie' },
];

describe('request-builder', () => {
  it('builds url with path and query params', () => {
    const url = buildRequestUrl(
      '/pets/{petId}',
      params,
      { petId: '42', verbose: 'true' },
      'https://api.example.com/',
    );
    expect(url).toBe('https://api.example.com/pets/42?verbose=true');
  });

  it('builds headers including Cookie', () => {
    const headers = buildRequestHeaders(params, {
      'X-Api-Key': 'secret',
      session: 'abc',
    });
    expect(headers['Content-Type']).toBe('application/json');
    expect(headers['X-Api-Key']).toBe('secret');
    expect(headers.Cookie).toBe('session=abc');
  });

  it('finds missing required params', () => {
    const missing = getMissingRequiredParams(params, { verbose: '1' });
    expect(missing.map((p) => p.name)).toEqual(['petId']);
  });

  it('extracts request body example', () => {
    const endpoint: OpenAPIEndpoint = {
      id: '1',
      method: 'POST',
      path: '/pets',
      parameters: [],
      responses: [],
      requestBody: {
        content: {
          'application/json': { example: { name: 'Rex' } },
        },
      },
    };
    expect(getRequestBodyExample(endpoint)).toContain('Rex');
  });

  it('resolves base url from endpoint servers', () => {
    const endpoint: OpenAPIEndpoint = {
      id: '1',
      method: 'GET',
      path: '/pets',
      parameters: [],
      responses: [],
      servers: ['https://pets.example.com'],
    };
    expect(resolveEndpointBaseUrl(endpoint, 'https://fallback')).toBe(
      'https://pets.example.com',
    );
  });
});

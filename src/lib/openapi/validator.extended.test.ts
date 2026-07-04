import { describe, it, expect } from 'vitest';
import { validateOpenAPISpec } from '@/lib/openapi/validator';

const fullSpec = `
openapi: 3.0.3
info:
  title: Full API
  version: 2.0.0
  description: Test API description
servers:
  - url: https://api.example.com/v1
paths:
  /users/{id}:
    get:
      summary: Get user
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
        - name: fields
          in: query
          schema:
            type: string
        - name: X-Request-ID
          in: header
          schema:
            type: string
        - name: session
          in: cookie
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
              example:
                id: "1"
        '404':
          description: Not found
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
            example:
              name: John
      responses:
        '201':
          description: Created
`;

describe('validateOpenAPISpec - endpoint extraction', () => {
  it('extracts endpoints with all parameter types', async () => {
    const result = await validateOpenAPISpec(fullSpec);
    expect(result.valid).toBe(true);
    expect(result.spec?.endpoints).toHaveLength(2);

    const getEndpoint = result.spec?.endpoints.find((e) => e.method === 'GET');
    expect(getEndpoint?.parameters).toHaveLength(4);
    expect(getEndpoint?.parameters.map((p) => p.in)).toEqual(
      expect.arrayContaining(['path', 'query', 'header', 'cookie']),
    );
    expect(getEndpoint?.responses).toHaveLength(2);
  });

  it('extracts request body and responses', async () => {
    const result = await validateOpenAPISpec(fullSpec);
    const postEndpoint = result.spec?.endpoints.find((e) => e.method === 'POST');
    expect(postEndpoint?.requestBody).toBeDefined();
    expect(postEndpoint?.responses[0].statusCode).toBe('201');
  });

  it('sets API metadata', async () => {
    const result = await validateOpenAPISpec(fullSpec);
    expect(result.spec?.title).toBe('Full API');
    expect(result.spec?.version).toBe('2.0.0');
    expect(result.spec?.baseUrl).toBe('https://api.example.com/v1');
    expect(result.spec?.description).toBe('Test API description');
  });
});

describe('validateOpenAPISpec - error cases', () => {
  it('returns error for unparseable content', async () => {
    const result = await validateOpenAPISpec('not: valid: yaml: [[[[');
    expect(result.valid).toBe(false);
  });

  it('returns error for undetectable format', async () => {
    const result = await validateOpenAPISpec('plain text without structure');
    expect(result.valid).toBe(false);
  });
});

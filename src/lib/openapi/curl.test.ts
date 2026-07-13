import { describe, it, expect } from 'vitest';
import { generateCurl, estimateSize } from '@/lib/openapi/curl';

describe('generateCurl', () => {
  it('generates basic GET curl', () => {
    const curl = generateCurl({ url: 'https://api.example.com/users', method: 'GET' });
    expect(curl).toContain('curl -X GET');
    expect(curl).toContain('https://api.example.com/users');
  });

  it('includes headers', () => {
    const curl = generateCurl({
      url: 'https://api.example.com/users',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
      body: '{"name": "test"}',
    });
    expect(curl).toContain("Content-Type: application/json");
    expect(curl).toContain('Authorization: Bearer token');
    expect(curl).toContain('-d');
  });

  it('omits body for GET requests', () => {
    const curl = generateCurl({
      url: 'https://api.example.com/users',
      method: 'GET',
      body: 'should not appear',
    });
    expect(curl).not.toContain('-d');
  });
});

describe('estimateSize', () => {
  it('returns 0 for undefined', () => {
    expect(estimateSize(undefined)).toBe(0);
  });

  it('returns byte length', () => {
    expect(estimateSize('hello')).toBe(5);
  });
});

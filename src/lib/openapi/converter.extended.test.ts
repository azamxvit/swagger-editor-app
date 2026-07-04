import { describe, it, expect } from 'vitest';
import { detectFormat } from '@/lib/openapi/converter';

describe('detectFormat edge cases', () => {
  it('detects JSON array', () => {
    expect(detectFormat('[1, 2, 3]')).toBe('json');
  });

  it('detects YAML with leading whitespace', () => {
    expect(detectFormat('  \n  openapi: 3.0.0')).toBe('yaml');
  });

  it('detects JSON with leading whitespace', () => {
    expect(detectFormat('  {"key": "value"}')).toBe('json');
  });
});

describe('convertFormat roundtrip', () => {
  const complexYaml = `
openapi: 3.0.3
info:
  title: Roundtrip
  version: 1.0.0
paths: {}
`;

  it('preserves data through YAML -> JSON -> YAML', async () => {
    const { convertFormat, parseContent } = await import('@/lib/openapi/converter');
    const json = convertFormat(complexYaml, 'yaml', 'json');
    const backToYaml = convertFormat(json, 'json', 'yaml');
    const parsed = parseContent(backToYaml, 'yaml') as Record<string, Record<string, string>>;
    expect(parsed.info.title).toBe('Roundtrip');
  });
});

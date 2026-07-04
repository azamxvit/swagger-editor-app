import { describe, it, expect } from 'vitest';
import { detectFormat, convertFormat, parseContent } from '@/lib/openapi/converter';

describe('detectFormat', () => {
  it('detects JSON format', () => {
    expect(detectFormat('{"openapi": "3.0.0"}')).toBe('json');
  });

  it('detects YAML format', () => {
    expect(detectFormat('openapi: 3.0.0')).toBe('yaml');
  });

  it('returns null for empty content', () => {
    expect(detectFormat('')).toBeNull();
    expect(detectFormat('   ')).toBeNull();
  });
});

describe('convertFormat', () => {
  const yamlSpec = 'openapi: 3.0.0\ninfo:\n  title: Test\n  version: 1.0.0';

  it('converts YAML to JSON', () => {
    const json = convertFormat(yamlSpec, 'yaml', 'json');
    const parsed = JSON.parse(json);
    expect(parsed.openapi).toBe('3.0.0');
    expect(parsed.info.title).toBe('Test');
  });

  it('converts JSON to YAML', () => {
    const json = convertFormat(yamlSpec, 'yaml', 'json');
    const yaml = convertFormat(json, 'json', 'yaml');
    const parsed = parseContent(yaml, 'yaml') as Record<string, unknown>;
    expect(parsed.openapi).toBe('3.0.0');
  });

  it('returns same content when formats match', () => {
    expect(convertFormat(yamlSpec, 'yaml', 'yaml')).toBe(yamlSpec);
  });
});

describe('parseContent', () => {
  it('parses valid JSON', () => {
    const result = parseContent('{"key": "value"}', 'json');
    expect(result).toEqual({ key: 'value' });
  });

  it('parses valid YAML', () => {
    const result = parseContent('key: value', 'yaml');
    expect(result).toEqual({ key: 'value' });
  });

  it('throws on invalid JSON', () => {
    expect(() => parseContent('{invalid}', 'json')).toThrow();
  });
});

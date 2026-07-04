import { load, dump } from 'js-yaml';
import type { SchemaFormat } from './types';

export function detectFormat(content: string): SchemaFormat | null {
  const trimmed = content.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
  return 'yaml';
}

export function parseContent(content: string, format?: SchemaFormat): unknown {
  const detected = format ?? detectFormat(content);
  if (!detected) throw new Error('Unable to detect format');
  if (detected === 'json') return JSON.parse(content);
  return load(content);
}

export function toJson(content: string, fromFormat: SchemaFormat): string {
  const parsed = parseContent(content, fromFormat);
  return JSON.stringify(parsed, null, 2);
}

export function toYaml(content: string, fromFormat: SchemaFormat): string {
  const parsed = parseContent(content, fromFormat);
  return dump(parsed, { lineWidth: -1, noRefs: true });
}

export function convertFormat(content: string, from: SchemaFormat, to: SchemaFormat): string {
  if (from === to) return content;
  return to === 'json' ? toJson(content, from) : toYaml(content, from);
}

import type { ProxyRequest } from './types';

export function generateCurl(request: ProxyRequest): string {
  const parts = [`curl -X ${request.method.toUpperCase()}`];

  if (request.headers) {
    for (const [key, value] of Object.entries(request.headers)) {
      if (value) parts.push(`-H '${key}: ${value.replace(/'/g, "'\\''")}'`);
    }
  }

  if (request.body && !['GET', 'HEAD'].includes(request.method.toUpperCase())) {
    const escaped = request.body.replace(/'/g, "'\\''");
    parts.push(`-d '${escaped}'`);
  }

  parts.push(`'${request.url}'`);
  return parts.join(' \\\n  ');
}

export function estimateSize(value: string | undefined): number {
  if (!value) return 0;
  return new TextEncoder().encode(value).length;
}

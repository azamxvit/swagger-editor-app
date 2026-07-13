import type { OpenAPIEndpoint, OpenAPIParameter } from './types';

export function buildRequestUrl(
  path: string,
  parameters: OpenAPIParameter[],
  paramValues: Record<string, string>,
  baseUrl = '',
): string {
  const base = baseUrl.replace(/\/$/, '');
  let resolvedPath = path;

  for (const param of parameters) {
    if (param.in === 'path' && paramValues[param.name]) {
      resolvedPath = resolvedPath.replace(
        `{${param.name}}`,
        encodeURIComponent(paramValues[param.name]),
      );
    }
  }

  const query = parameters
    .filter((p) => p.in === 'query' && paramValues[p.name])
    .map(
      (p) =>
        `${encodeURIComponent(p.name)}=${encodeURIComponent(paramValues[p.name])}`,
    )
    .join('&');

  if (query) resolvedPath += `?${query}`;
  return `${base}${resolvedPath}`;
}

export function buildRequestHeaders(
  parameters: OpenAPIParameter[],
  paramValues: Record<string, string>,
  options?: { includeContentType?: boolean },
): Record<string, string> {
  const headers: Record<string, string> = {};

  if (options?.includeContentType !== false) {
    headers['Content-Type'] = 'application/json';
  }

  for (const param of parameters) {
    if (param.in === 'header' && paramValues[param.name]) {
      headers[param.name] = paramValues[param.name];
    }
  }

  const cookies = parameters
    .filter((p) => p.in === 'cookie' && paramValues[p.name])
    .map((p) => `${p.name}=${paramValues[p.name]}`);

  if (cookies.length > 0) {
    headers.Cookie = cookies.join('; ');
  }

  return headers;
}

export function getMissingRequiredParams(
  parameters: OpenAPIParameter[],
  paramValues: Record<string, string>,
): OpenAPIParameter[] {
  return parameters.filter(
    (param) => param.required && !paramValues[param.name]?.trim(),
  );
}

export function getRequestBodyExample(endpoint: OpenAPIEndpoint): string {
  if (!endpoint.requestBody) return '';
  const first = Object.values(endpoint.requestBody.content)[0];
  const value = first?.example ?? first?.schema ?? {};
  return JSON.stringify(value, null, 2);
}

export function resolveEndpointBaseUrl(
  endpoint: OpenAPIEndpoint,
  fallback?: string,
): string {
  return endpoint.servers?.[0] ?? fallback ?? '';
}

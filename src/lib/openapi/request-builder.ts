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

/** Prefer real example/default/enum over the schema type name ("string"). */
export function getParamExample(param: OpenAPIParameter): string {
  if (param.example !== undefined && param.example !== null) {
    return String(param.example);
  }
  const schema = param.schema ?? {};
  if (schema.default !== undefined && schema.default !== null) {
    return String(schema.default);
  }
  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return String(schema.enum[0]);
  }
  if (schema.type === 'integer' || schema.type === 'number') return '1';
  if (schema.type === 'boolean') return 'true';
  return '';
}

export function resolveEndpointBaseUrl(
  endpoint: OpenAPIEndpoint,
  fallback?: string,
): string {
  return endpoint.servers?.[0] ?? fallback ?? '';
}

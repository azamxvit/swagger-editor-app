import { DEFAULT_SCHEMA } from './default-schema';

export const WORKING_PETSTORE_BASE = 'https://petstore.swagger.io/v2';

export function repairBrokenDemoSchema(content: string): string {
  if (content.includes('petstore3.swagger.io')) {
    return DEFAULT_SCHEMA;
  }
  return content;
}

export function resolvePetstoreBaseUrl(url: string): string {
  if (url.includes('petstore3.swagger.io')) {
    return WORKING_PETSTORE_BASE;
  }
  return url;
}

export function remapBrokenPetstorePath(method: string, path: string): string {
  if (method.toUpperCase() === 'GET' && path === '/pet') {
    return '/pet/findByStatus';
  }
  return path;
}

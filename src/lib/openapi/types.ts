export type SchemaFormat = 'json' | 'yaml';

export interface OpenAPIParameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required?: boolean;
  description?: string;
  schema?: Record<string, unknown>;
  example?: unknown;
}

export interface OpenAPIResponse {
  statusCode: string;
  description?: string;
  schema?: Record<string, unknown>;
  example?: unknown;
}

export interface OpenAPIEndpoint {
  id: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  parameters: OpenAPIParameter[];
  requestBody?: {
    required?: boolean;
    content: Record<string, { schema?: Record<string, unknown>; example?: unknown }>;
  };
  responses: OpenAPIResponse[];
  servers?: string[];
}

export interface ParsedOpenAPISpec {
  title: string;
  version: string;
  description?: string;
  baseUrl?: string;
  endpoints: OpenAPIEndpoint[];
  raw: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  spec?: ParsedOpenAPISpec;
}

export interface ProxyRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
  endpoint?: string;
}

export interface ProxyResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  durationMs: number;
  requestSize: number;
  responseSize: number;
  error?: string;
}

export interface RequestHistoryEntry {
  id: string;
  method: string;
  url: string;
  endpoint: string | null;
  request_size: number;
  response_size: number;
  status_code: number | null;
  duration_ms: number;
  error_details: string | null;
  created_at: string;
}

export interface RequestHistoryDetail extends RequestHistoryEntry {
  request_headers: Record<string, string>;
  request_body: string | null;
  response_headers: Record<string, string>;
  response_body: string | null;
}

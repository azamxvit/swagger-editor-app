import SwaggerParser from '@apidevtools/swagger-parser';
import type { OpenAPIEndpoint, ParsedOpenAPISpec, ValidationResult } from './types';
import { detectFormat, parseContent } from './converter';

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'];

function extractEndpoints(spec: Record<string, unknown>): OpenAPIEndpoint[] {
  const endpoints: OpenAPIEndpoint[] = [];
  const paths = (spec.paths as Record<string, Record<string, unknown>>) ?? {};
  const globalServers = (spec.servers as { url: string }[]) ?? [];

  for (const [path, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== 'object') continue;

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method] as Record<string, unknown> | undefined;
      if (!operation) continue;

      const opServers = (operation.servers as { url: string }[]) ?? globalServers;
      const parameters = [
        ...((pathItem.parameters as OpenAPIEndpoint['parameters']) ?? []),
        ...((operation.parameters as OpenAPIEndpoint['parameters']) ?? []),
      ];

      const requestBody = operation.requestBody as OpenAPIEndpoint['requestBody'];
      const responses = operation.responses as Record<string, Record<string, unknown>>;

      endpoints.push({
        id: `${method.toUpperCase()}-${path}`,
        method: method.toUpperCase(),
        path,
        summary: operation.summary as string | undefined,
        description: operation.description as string | undefined,
        parameters,
        requestBody,
        responses: Object.entries(responses ?? {}).map(([statusCode, response]) => ({
          statusCode,
          description: response.description as string | undefined,
          schema: (response.content as Record<string, { schema?: Record<string, unknown> }>)
            ? Object.values(response.content as Record<string, { schema?: Record<string, unknown> }>)[0]
                ?.schema
            : undefined,
          example: (response.content as Record<string, { example?: unknown }>)
            ? Object.values(response.content as Record<string, { example?: unknown }>)[0]?.example
            : undefined,
        })),
        servers: opServers.map((s) => s.url),
      });
    }
  }

  return endpoints.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
}

export async function validateOpenAPISpec(content: string): Promise<ValidationResult> {
  if (!content.trim()) {
    return { valid: false, errors: ['Schema is empty'] };
  }

  const format = detectFormat(content);
  if (!format) {
    return { valid: false, errors: ['Unable to detect JSON or YAML format'] };
  }

  try {
    const parsed = parseContent(content, format);
    const validated = (await SwaggerParser.validate(
      parsed as never,
    )) as unknown as Record<string, unknown>;
    const info = (validated.info as Record<string, string>) ?? {};

    const servers = (validated.servers as { url: string }[]) ?? [];
    const spec: ParsedOpenAPISpec = {
      title: info.title ?? 'Untitled API',
      version: info.version ?? '1.0.0',
      description: info.description,
      baseUrl: servers[0]?.url,
      endpoints: extractEndpoints(validated),
      raw: validated,
    };

    return { valid: true, errors: [], spec };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown validation error';
    return { valid: false, errors: [message] };
  }
}

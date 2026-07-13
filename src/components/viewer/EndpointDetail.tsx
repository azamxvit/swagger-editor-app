'use client';

import { useTranslations } from 'next-intl';
import type { OpenAPIEndpoint } from '@/lib/openapi/types';
import { getRequestBodyExample } from '@/lib/openapi/request-builder';
import { ParametersTable } from './ParametersTable';
import { TryItOut } from './TryItOut';

interface EndpointDetailProps {
  endpoint: OpenAPIEndpoint;
  baseUrl?: string;
}

export function EndpointDetail({ endpoint, baseUrl }: EndpointDetailProps) {
  const t = useTranslations('viewer');
  const requestBodyExample = getRequestBodyExample(endpoint);

  return (
    <div className="space-y-4 p-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-[var(--primary)]/20 px-2 py-0.5 font-mono text-sm font-bold text-[var(--primary)]">
            {endpoint.method}
          </span>
          <span className="font-mono text-sm">{endpoint.path}</span>
        </div>
        {endpoint.summary && <p className="mt-1 text-sm">{endpoint.summary}</p>}
        {endpoint.description && (
          <p className="mt-1 text-xs text-[var(--muted)]">{endpoint.description}</p>
        )}
      </div>

      <section>
        <h3 className="mb-2 text-sm font-semibold">{t('parameters')}</h3>
        <ParametersTable parameters={endpoint.parameters} />
      </section>

      {endpoint.requestBody && (
        <section>
          <h3 className="mb-2 text-sm font-semibold">{t('requestBody')}</h3>
          <details className="rounded border border-[var(--border)]">
            <summary className="cursor-pointer px-3 py-2 text-xs text-[var(--muted)]">
              {t('schema')}
            </summary>
            <pre className="overflow-x-auto px-3 pb-3 text-xs">
              {requestBodyExample}
            </pre>
          </details>
        </section>
      )}

      <section>
        <h3 className="mb-2 text-sm font-semibold">{t('responses')}</h3>
        <div className="space-y-2">
          {endpoint.responses.map((resp) => (
            <div key={resp.statusCode} className="rounded border border-[var(--border)] p-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-mono font-bold">{resp.statusCode}</span>
                <span className="text-[var(--muted)]">{resp.description}</span>
              </div>
              {resp.schema && (
                <pre className="mt-1 overflow-x-auto text-xs text-[var(--muted)]">
                  {JSON.stringify(resp.schema, null, 2)}
                </pre>
              )}
              {resp.example !== undefined && (
                <pre className="mt-1 overflow-x-auto text-xs text-[var(--muted)]">
                  {JSON.stringify(resp.example, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </section>

      <TryItOut endpoint={endpoint} baseUrl={baseUrl} />
    </div>
  );
}

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
    <article className="space-y-4 p-4">
      <header>
        <div className="flex items-center gap-2">
          <span className="rounded bg-[var(--primary)]/20 px-2 py-0.5 font-mono text-sm font-bold text-[var(--primary)]">
            {endpoint.method}
          </span>
          <h3 className="font-mono text-sm font-normal">{endpoint.path}</h3>
        </div>
        {endpoint.summary && <p className="mt-1 text-sm">{endpoint.summary}</p>}
        {endpoint.description && (
          <p className="mt-1 text-xs text-[var(--muted)]">{endpoint.description}</p>
        )}
      </header>

      <section aria-labelledby="params-heading">
        <h3 id="params-heading" className="mb-2 text-sm font-semibold">
          {t('parameters')}
        </h3>
        <ParametersTable parameters={endpoint.parameters} />
      </section>

      {endpoint.requestBody && (
        <section aria-labelledby="request-body-heading">
          <h3 id="request-body-heading" className="mb-2 text-sm font-semibold">
            {t('requestBody')}
          </h3>
          <details className="rounded border border-[var(--border)]">
            <summary className="cursor-pointer px-3 py-2 text-xs text-[var(--muted)]">
              {t('schema')}
            </summary>
            <pre className="overflow-x-auto px-3 pb-3 text-xs">{requestBodyExample}</pre>
          </details>
        </section>
      )}

      <section aria-labelledby="responses-heading">
        <h3 id="responses-heading" className="mb-2 text-sm font-semibold">
          {t('responses')}
        </h3>
        <ul className="m-0 list-none space-y-2 p-0">
          {endpoint.responses.map((resp) => (
            <li key={resp.statusCode} className="rounded border border-[var(--border)] p-2">
              <p className="m-0 flex items-center gap-2 text-sm">
                <strong className="font-mono">{resp.statusCode}</strong>
                <span className="text-[var(--muted)]">{resp.description}</span>
              </p>
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
            </li>
          ))}
        </ul>
      </section>

      <TryItOut endpoint={endpoint} baseUrl={baseUrl} />
    </article>
  );
}

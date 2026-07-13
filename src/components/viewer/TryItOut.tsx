'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import type { OpenAPIEndpoint } from '@/lib/openapi/types';
import {
  buildRequestHeaders,
  buildRequestUrl,
  getMissingRequiredParams,
  getParamExample,
  getRequestBodyExample,
  resolveEndpointBaseUrl,
} from '@/lib/openapi/request-builder';
import { CurlPanel } from './CurlPanel';
import { ResponseResult } from './ResponseResult';

interface TryItOutProps {
  endpoint: OpenAPIEndpoint;
  baseUrl?: string;
}

interface ExecuteResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  durationMs: number;
}

export function TryItOut({ endpoint, baseUrl }: TryItOutProps) {
  const t = useTranslations('viewer');
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const example = useMemo(() => getRequestBodyExample(endpoint), [endpoint]);
  const [body, setBody] = useState(example);
  const [bodyError, setBodyError] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);
  const [response, setResponse] = useState<ExecuteResponse | null>(null);
  const [executing, setExecuting] = useState(false);

  const hasBody = ['POST', 'PUT', 'PATCH'].includes(endpoint.method.toUpperCase());
  const resolvedBase = resolveEndpointBaseUrl(endpoint, baseUrl);
  const requestUrl = buildRequestUrl(
    endpoint.path,
    endpoint.parameters,
    paramValues,
    resolvedBase,
  );
  const requestHeaders = buildRequestHeaders(endpoint.parameters, paramValues, {
    includeContentType: hasBody && body.trim().length > 0,
  });

  const paramTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      path: t('path'),
      query: t('query'),
      header: t('header'),
      cookie: t('cookie'),
    };
    return map[type] ?? type;
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
    if (!value.trim()) {
      setBodyError(null);
      return;
    }
    try {
      JSON.parse(value);
      setBodyError(null);
    } catch {
      setBodyError(t('invalidJson'));
    }
  };

  const handleExecute = async () => {
    const missing = getMissingRequiredParams(endpoint.parameters, paramValues);
    if (missing.length > 0) {
      toast.error(
        `${t('fillRequired')}: ${missing.map((p) => p.name).join(', ')}`,
      );
      return;
    }

    if (hasBody && body.trim() && bodyError) {
      toast.error(t('invalidJson'));
      return;
    }

    setExecuting(true);
    setResponse(null);
    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: requestUrl,
          method: endpoint.method,
          headers: requestHeaders,
          body: hasBody && body.trim() ? body : undefined,
          endpoint: `${endpoint.method} ${endpoint.path}`,
        }),
      });
      const data = await res.json();
      setResponse({
        status: data.status ?? 0,
        statusText: data.statusText ?? '',
        headers: data.headers ?? {},
        body: typeof data.body === 'string' ? data.body : JSON.stringify(data.body, null, 2),
        durationMs: data.durationMs ?? data.duration ?? 0,
      });
    } catch {
      toast.error(t('requestFailed'));
    } finally {
      setExecuting(false);
    }
  };

  return (
    <section className="space-y-3 rounded border border-[var(--border)] bg-[var(--surface)] p-3" aria-labelledby="try-it-out-title">
      <h3 id="try-it-out-title" className="text-sm font-semibold">
        {t('tryItOut')}
      </h3>

      {endpoint.parameters.length === 0 ? (
        <p className="text-xs text-[var(--muted)]">{t('noParameters')}</p>
      ) : (
        <fieldset className="m-0 space-y-2 border-0 p-0">
          <legend className="sr-only">{t('parameters')}</legend>
          {endpoint.parameters.map((param) => (
            <p
              key={`${param.in}-${param.name}`}
              className="m-0 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3"
            >
              <label className="min-w-28 text-xs" htmlFor={`param-${param.in}-${param.name}`}>
                <span className="font-mono">{param.name}</span>
                <span className="ml-2 text-[var(--muted)]">
                  ({paramTypeLabel(param.in)}
                  {param.required ? `, ${t('required')}` : ''})
                </span>
              </label>
              <input
                id={`param-${param.in}-${param.name}`}
                className="input flex-1 text-xs"
                placeholder={
                  param.in === 'path'
                    ? getParamExample(param) || `{${param.name}}`
                    : getParamExample(param) || param.name
                }
                value={paramValues[param.name] ?? ''}
                onChange={(e) =>
                  setParamValues((prev) => ({ ...prev, [param.name]: e.target.value }))
                }
              />
            </p>
          ))}
        </fieldset>
      )}

      {hasBody && endpoint.requestBody && (
        <fieldset className="m-0 space-y-2 border-0 p-0">
          <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            {t('requestBody')}
          </legend>
          {example && example !== '{}' && (
            <div>
              <button
                type="button"
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                onClick={() => setShowExample((prev) => !prev)}
                aria-expanded={showExample}
              >
                {showExample ? `▼ ${t('hideExample')}` : `▶ ${t('exampleFromSpec')}`}
              </button>
              {showExample && (
                <pre className="mt-1 max-h-40 overflow-auto rounded bg-[var(--background)] p-2 font-mono text-xs">
                  {example}
                </pre>
              )}
            </div>
          )}
          <textarea
            className="input min-h-[100px] font-mono text-xs"
            value={body}
            onChange={(e) => handleBodyChange(e.target.value)}
            placeholder={t('enterJsonBody')}
            spellCheck={false}
            aria-invalid={Boolean(bodyError)}
            aria-describedby={bodyError ? 'body-error' : undefined}
          />
          {bodyError && (
            <strong id="body-error" className="block text-xs font-normal text-red-400">
              {bodyError}
            </strong>
          )}
        </fieldset>
      )}

      {requestUrl && (
        <aside className="rounded border border-[var(--border)] bg-[var(--background)] p-2" aria-label={t('requestUrl')}>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {t('requestUrl')}
          </p>
          <code className="block break-all font-mono text-xs text-[var(--primary)]">
            {requestUrl}
          </code>
        </aside>
      )}

      <menu className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        <li>
          <button
            type="button"
            onClick={handleExecute}
            disabled={executing}
            className="btn-primary text-sm"
          >
            {executing ? t('executing') : t('execute')}
          </button>
        </li>
        <li>
          <CurlPanel
            method={endpoint.method}
            url={requestUrl}
            headers={requestHeaders}
            body={hasBody ? body : undefined}
          />
        </li>
      </menu>

      {response && (
        <ResponseResult
          status={response.status}
          statusText={response.statusText}
          durationMs={response.durationMs}
          headers={response.headers}
          body={response.body}
        />
      )}
    </section>
  );
}

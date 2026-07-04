'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import type { OpenAPIEndpoint } from '@/lib/openapi/types';
import { generateCurl } from '@/lib/openapi/curl';

interface EndpointDetailProps {
  endpoint: OpenAPIEndpoint;
  baseUrl?: string;
}

export function EndpointDetail({ endpoint, baseUrl }: EndpointDetailProps) {
  const t = useTranslations('viewer');
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    durationMs: number;
  } | null>(null);
  const [curl, setCurl] = useState('');
  const [executing, setExecuting] = useState(false);

  const buildUrl = () => {
    const base = (endpoint.servers?.[0] ?? baseUrl ?? '').replace(/\/$/, '');
    let path = endpoint.path;

    for (const param of endpoint.parameters) {
      if (param.in === 'path' && paramValues[param.name]) {
        path = path.replace(`{${param.name}}`, encodeURIComponent(paramValues[param.name]));
      }
    }

    const queryParams = endpoint.parameters
      .filter((p) => p.in === 'query' && paramValues[p.name])
      .map((p) => `${encodeURIComponent(p.name)}=${encodeURIComponent(paramValues[p.name])}`)
      .join('&');

    if (queryParams) path += `?${queryParams}`;
    return `${base}${path}`;
  };

  const buildHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    for (const param of endpoint.parameters) {
      if (param.in === 'header' && paramValues[param.name]) {
        headers[param.name] = paramValues[param.name];
      }
    }
    return headers;
  };

  const handleExecute = async () => {
    setExecuting(true);
    setResponse(null);
    try {
      const url = buildUrl();
      const headers = buildHeaders();
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          method: endpoint.method,
          headers,
          body: body || undefined,
          endpoint: `${endpoint.method} ${endpoint.path}`,
        }),
      });
      const data = await res.json();
      setResponse(data);
    } catch {
      toast.error('Failed to execute request');
    } finally {
      setExecuting(false);
    }
  };

  const handleGenerateCurl = () => {
    const cmd = generateCurl({
      url: buildUrl(),
      method: endpoint.method,
      headers: buildHeaders(),
      body: body || undefined,
    });
    setCurl(cmd);
  };

  const handleCopyCurl = async () => {
    if (!curl) handleGenerateCurl();
    const text = curl || generateCurl({
      url: buildUrl(),
      method: endpoint.method,
      headers: buildHeaders(),
      body: body || undefined,
    });
    await navigator.clipboard.writeText(text);
    toast.success(t('curlCopied'));
  };

  const paramTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      path: t('path'),
      query: t('query'),
      header: t('header'),
      cookie: t('cookie'),
    };
    return map[type] ?? type;
  };

  const requestBodyExample = endpoint.requestBody
    ? JSON.stringify(
        Object.values(endpoint.requestBody.content)[0]?.example ??
          Object.values(endpoint.requestBody.content)[0]?.schema ??
          {},
        null,
        2,
      )
    : '';

  return (
    <div className="p-4 space-y-4">
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
        {endpoint.parameters.length === 0 ? (
          <p className="text-xs text-[var(--muted)]">{t('noParameters')}</p>
        ) : (
          <div className="space-y-2">
            {endpoint.parameters.map((param) => (
              <div key={`${param.in}-${param.name}`} className="flex flex-col gap-1">
                <label className="text-xs">
                  <span className="font-mono">{param.name}</span>
                  <span className="ml-2 text-[var(--muted)]">
                    ({paramTypeLabel(param.in)}
                    {param.required ? `, ${t('required')}` : ''})
                  </span>
                </label>
                <input
                  className="input text-xs"
                  placeholder={param.example?.toString() ?? ''}
                  value={paramValues[param.name] ?? ''}
                  onChange={(e) =>
                    setParamValues((prev) => ({ ...prev, [param.name]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {endpoint.requestBody && (
        <section>
          <h3 className="mb-2 text-sm font-semibold">{t('requestBody')}</h3>
          <textarea
            className="input font-mono text-xs min-h-[100px]"
            placeholder={requestBodyExample}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <details className="mt-1">
            <summary className="cursor-pointer text-xs text-[var(--muted)]">{t('schema')}</summary>
            <pre className="mt-1 overflow-x-auto rounded bg-[var(--surface)] p-2 text-xs">
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
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-2">
        <button type="button" onClick={handleExecute} disabled={executing} className="btn-primary text-sm">
          {executing ? t('executing') : t('execute')}
        </button>
        <button type="button" onClick={handleGenerateCurl} className="btn-secondary text-sm">
          {t('generateCurl')}
        </button>
        <button type="button" onClick={handleCopyCurl} className="btn-secondary text-sm">
          {t('copyCurl')}
        </button>
      </div>

      {curl && (
        <pre className="overflow-x-auto rounded border border-[var(--border)] bg-[var(--surface)] p-3 text-xs font-mono">
          {curl}
        </pre>
      )}

      {response && (
        <section className="rounded border border-[var(--border)]">
          <div className="border-b border-[var(--border)] px-3 py-2 text-sm font-semibold">
            {t('response')}
          </div>
          <div className="space-y-2 p-3 text-xs">
            <div>
              <span className="text-[var(--muted)]">{t('status')}: </span>
              <span
                className={
                  response.status >= 400 ? 'text-red-400' : 'text-emerald-400'
                }
              >
                {response.status} {response.statusText}
              </span>
              <span className="ml-3 text-[var(--muted)]">
                {t('duration')}: {response.durationMs}ms
              </span>
            </div>
            <details>
              <summary className="cursor-pointer text-[var(--muted)]">{t('headers')}</summary>
              <pre className="mt-1 overflow-x-auto">{JSON.stringify(response.headers, null, 2)}</pre>
            </details>
            <div>
              <span className="text-[var(--muted)]">{t('body')}:</span>
              <pre className="mt-1 max-h-60 overflow-auto rounded bg-[var(--surface)] p-2 font-mono">
                {response.body}
              </pre>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

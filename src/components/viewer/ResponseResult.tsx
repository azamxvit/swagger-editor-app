'use client';

import { useTranslations } from 'next-intl';

interface ResponseResultProps {
  status: number;
  statusText: string;
  durationMs?: number;
  headers?: Record<string, string>;
  body: string;
}

export function ResponseResult({
  status,
  statusText,
  durationMs,
  headers,
  body,
}: ResponseResultProps) {
  const t = useTranslations('viewer');
  const statusClass = status >= 400 || status === 0 ? 'text-red-400' : 'text-emerald-400';

  return (
    <section className="rounded border border-[var(--border)]">
      <div className="border-b border-[var(--border)] px-3 py-2 text-sm font-semibold">
        {t('response')}
      </div>
      <div className="space-y-2 p-3 text-xs">
        <div>
          <span className="text-[var(--muted)]">{t('status')}: </span>
          <span className={statusClass}>
            {status} {statusText}
          </span>
          {durationMs !== undefined && (
            <span className="ml-3 text-[var(--muted)]">
              {t('duration')}: {durationMs}ms
            </span>
          )}
        </div>
        {headers && Object.keys(headers).length > 0 && (
          <details open>
            <summary className="cursor-pointer text-[var(--muted)]">{t('headers')}</summary>
            <pre className="mt-1 overflow-x-auto">{JSON.stringify(headers, null, 2)}</pre>
          </details>
        )}
        <div>
          <span className="text-[var(--muted)]">{t('body')}:</span>
          <pre className="mt-1 max-h-60 overflow-auto rounded bg-[var(--surface)] p-2 font-mono">
            {body}
          </pre>
        </div>
      </div>
    </section>
  );
}

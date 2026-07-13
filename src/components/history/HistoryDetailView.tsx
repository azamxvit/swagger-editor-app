'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { RequestHistoryDetail } from '@/lib/openapi/types';

interface HistoryDetailViewProps {
  entry: RequestHistoryDetail;
}

export function HistoryDetailView({ entry }: HistoryDetailViewProps) {
  const t = useTranslations('history');

  return (
    <div className="space-y-6">
      <Link href="/history" className="text-sm text-[var(--primary)] hover:underline">
        ← {t('back')}
      </Link>

      <h1 className="text-2xl font-bold">{t('details')}</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label={t('method')} value={entry.method} />
        <StatCard label={t('status')} value={String(entry.status_code ?? '—')} />
        <StatCard label={t('duration')} value={`${entry.duration_ms}ms`} />
        <StatCard label={t('timestamp')} value={new Date(entry.created_at).toLocaleString()} />
        <StatCard label={t('requestSize')} value={`${entry.request_size} B`} />
        <StatCard label={t('responseSize')} value={`${entry.response_size} B`} />
      </div>

      <div>
        <h2 className="mb-2 font-semibold">{t('endpoint')}</h2>
        <p className="font-mono text-sm break-all">{entry.endpoint ?? entry.url}</p>
      </div>

      <div>
        <h2 className="mb-2 font-semibold">{t('url')}</h2>
        <p className="font-mono text-sm break-all">{entry.url}</p>
      </div>

      {entry.error_details && (
        <div>
          <h2 className="mb-2 font-semibold text-red-400">{t('error')}</h2>
          <p className="text-sm text-red-400">{entry.error_details}</p>
        </div>
      )}

      <details className="rounded border border-[var(--border)]">
        <summary className="cursor-pointer px-4 py-3 font-semibold">Request Headers</summary>
        <pre className="overflow-x-auto px-4 pb-4 text-xs">
          {JSON.stringify(entry.request_headers, null, 2)}
        </pre>
      </details>

      {entry.request_body && (
        <details className="rounded border border-[var(--border)]">
          <summary className="cursor-pointer px-4 py-3 font-semibold">Request Body</summary>
          <pre className="overflow-x-auto px-4 pb-4 text-xs">{entry.request_body}</pre>
        </details>
      )}

      <details className="rounded border border-[var(--border)]">
        <summary className="cursor-pointer px-4 py-3 font-semibold">Response Headers</summary>
        <pre className="overflow-x-auto px-4 pb-4 text-xs">
          {JSON.stringify(entry.response_headers, null, 2)}
        </pre>
      </details>

      {entry.response_body && (
        <details className="rounded border border-[var(--border)]" open>
          <summary className="cursor-pointer px-4 py-3 font-semibold">Response Body</summary>
          <pre className="max-h-96 overflow-auto px-4 pb-4 text-xs">{entry.response_body}</pre>
        </details>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

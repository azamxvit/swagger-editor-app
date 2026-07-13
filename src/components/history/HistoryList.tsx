'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { RequestHistoryEntry } from '@/lib/openapi/types';

interface HistoryListProps {
  entries: RequestHistoryEntry[];
}

export function HistoryList({ entries }: HistoryListProps) {
  const t = useTranslations('history');

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-[var(--muted)]">{t('empty')}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{t('emptyHint')}</p>
        <Link href="/" className="btn-primary mt-6">
          {t('goToEditor')}
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
            <th className="px-4 py-3">{t('timestamp')}</th>
            <th className="px-4 py-3">{t('method')}</th>
            <th className="px-4 py-3">{t('endpoint')}</th>
            <th className="px-4 py-3">{t('status')}</th>
            <th className="px-4 py-3">{t('duration')}</th>
            <th className="px-4 py-3">{t('requestSize')}</th>
            <th className="px-4 py-3">{t('responseSize')}</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-hover)]">
              <td className="px-4 py-3 whitespace-nowrap">
                {new Date(entry.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-3 font-mono font-bold">{entry.method}</td>
              <td className="px-4 py-3 font-mono text-xs max-w-xs truncate">
                {entry.endpoint ?? entry.url}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    entry.status_code && entry.status_code >= 400
                      ? 'text-red-400'
                      : 'text-emerald-400'
                  }
                >
                  {entry.status_code ?? '—'}
                </span>
              </td>
              <td className="px-4 py-3">{entry.duration_ms}ms</td>
              <td className="px-4 py-3">{formatBytes(entry.request_size)}</td>
              <td className="px-4 py-3">{formatBytes(entry.response_size)}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/history/${entry.id}`}
                  className="text-[var(--primary)] hover:underline"
                >
                  {t('details')}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

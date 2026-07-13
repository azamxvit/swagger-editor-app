'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Link, useRouter } from '@/i18n/routing';
import type { RequestHistoryEntry } from '@/lib/openapi/types';

interface HistoryListProps {
  entries: RequestHistoryEntry[];
}

export function HistoryList({ entries }: HistoryListProps) {
  const t = useTranslations('history');
  const router = useRouter();
  const [items, setItems] = useState(entries);
  const [clearing, setClearing] = useState(false);

  async function handleClear() {
    if (!window.confirm(t('clearConfirm'))) return;

    setClearing(true);
    try {
      const res = await fetch('/api/history', { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to clear');
      setItems([]);
      toast.success(t('clearSuccess'));
      router.refresh();
    } catch {
      toast.error(t('clearError'));
    } finally {
      setClearing(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center py-16 text-center" aria-live="polite">
        <p className="text-lg text-[var(--muted)]">{t('empty')}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{t('emptyHint')}</p>
        <Link href="/" className="btn-primary mt-6">
          {t('goToEditor')}
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4" aria-label={t('title')}>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleClear}
          disabled={clearing}
          className="btn-secondary text-sm text-red-400 hover:text-red-300"
        >
          {t('clear')}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">{t('title')}</caption>
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
              <th scope="col" className="px-4 py-3">
                {t('timestamp')}
              </th>
              <th scope="col" className="px-4 py-3">
                {t('method')}
              </th>
              <th scope="col" className="px-4 py-3">
                {t('endpoint')}
              </th>
              <th scope="col" className="px-4 py-3">
                {t('status')}
              </th>
              <th scope="col" className="px-4 py-3">
                {t('duration')}
              </th>
              <th scope="col" className="px-4 py-3">
                {t('requestSize')}
              </th>
              <th scope="col" className="px-4 py-3">
                {t('responseSize')}
              </th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">{t('details')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((entry) => (
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
    </section>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

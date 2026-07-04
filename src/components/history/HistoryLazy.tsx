'use client';

import dynamic from 'next/dynamic';

const HistoryListClient = dynamic(
  () => import('@/components/history/HistoryList').then((m) => m.HistoryList),
  {
    loading: () => (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 rounded bg-[var(--surface)]" />
        ))}
      </div>
    ),
    ssr: true,
  },
);

export { HistoryListClient };

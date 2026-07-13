'use client';

import dynamic from 'next/dynamic';

function HistorySkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 rounded bg-[var(--surface)]" />
      ))}
    </div>
  );
}

const HistoryListClient = dynamic(
  () => import('@/components/history/HistoryList').then((m) => m.HistoryList),
  {
    loading: () => <HistorySkeleton />,
    ssr: false,
  },
);

const HistoryDetailLazy = dynamic(
  () => import('@/components/history/HistoryDetailView').then((m) => m.HistoryDetailView),
  {
    loading: () => <HistorySkeleton />,
    ssr: false,
  },
);

export { HistoryListClient, HistoryDetailLazy };

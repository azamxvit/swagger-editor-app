'use client';

import dynamic from 'next/dynamic';
import { HistorySkeleton } from '@/components/ui/Skeleton';

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

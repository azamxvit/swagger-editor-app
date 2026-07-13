import { setRequestLocale, getTranslations } from 'next-intl/server';
import { unauthorized, notFound } from 'next/navigation';
import { getUser, createClient } from '@/lib/supabase/server';
import { HistoryListClient } from '@/components/history/HistoryLazy';
import type { RequestHistoryEntry } from '@/lib/openapi/types';

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'history' });

  const user = await getUser();
  if (!user) {
    unauthorized();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('request_history')
    .select(
      'id, method, url, endpoint, request_size, response_size, status_code, duration_ms, error_details, created_at',
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) notFound();

  const entries = (data ?? []) as RequestHistoryEntry[];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      <HistoryListClient entries={entries} />
    </div>
  );
}

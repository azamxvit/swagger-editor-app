import { setRequestLocale } from 'next-intl/server';
import { redirect, notFound } from 'next/navigation';
import { getUser, createClient } from '@/lib/supabase/server';
import { HistoryDetailView } from '@/components/history/HistoryDetailView';
import type { RequestHistoryDetail } from '@/lib/openapi/types';

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const user = await getUser();
  if (!user) {
    redirect(`/${locale}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('request_history')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) notFound();

  return <HistoryDetailView entry={data as RequestHistoryDetail} />;
}

import { setRequestLocale } from 'next-intl/server';
import { MainPageContent } from '@/components/editor/EditorViewerSplit';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MainPageContent />;
}

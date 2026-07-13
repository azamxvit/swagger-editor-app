'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSchema } from '@/components/providers/SchemaProvider';
import type { OpenAPIEndpoint } from '@/lib/openapi/types';
import { EndpointDetail } from './EndpointDetail';
import { ViewerSkeleton } from '@/components/ui/Skeleton';

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  PATCH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function SwaggerViewerPanel() {
  const t = useTranslations('viewer');
  const { spec, isValidating, isLoading } = useSchema();
  const [selected, setSelected] = useState<OpenAPIEndpoint | null>(null);

  if (isLoading || (isValidating && !spec)) {
    return <ViewerSkeleton />;
  }

  if (!spec) {
    return (
      <section className="flex h-full items-center justify-center p-6 text-center text-[var(--muted)]">
        <p>{t('noSpec')}</p>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col" aria-labelledby="viewer-title">
      <header className="border-b border-[var(--border)] px-4 py-2">
        <h2 id="viewer-title" className="font-semibold">
          {spec.title}
        </h2>
        <p className="text-xs text-[var(--muted)]">
          v{spec.version}
          {spec.baseUrl && ` · ${spec.baseUrl}`}
        </p>
      </header>

      <div className="flex min-h-0 flex-1">
        <nav
          aria-label={t('title')}
          className="w-1/3 min-w-[200px] overflow-y-auto border-r border-[var(--border)]"
        >
          <ul className="m-0 list-none p-0">
            {spec.endpoints.map((endpoint) => (
              <li key={endpoint.id}>
                <button
                  type="button"
                  onClick={() => setSelected(endpoint)}
                  aria-current={selected?.id === endpoint.id ? 'true' : undefined}
                  className={`flex w-full items-center gap-2 border-b border-[var(--border)] px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--surface-hover)] ${
                    selected?.id === endpoint.id ? 'bg-[var(--surface-hover)]' : ''
                  }`}
                >
                  <span
                    className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-xs font-bold ${
                      METHOD_COLORS[endpoint.method] ?? 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <span className="truncate font-mono text-xs">{endpoint.path}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <article className="flex-1 overflow-y-auto">
          {selected ? (
            <EndpointDetail endpoint={selected} baseUrl={spec.baseUrl} />
          ) : (
            <p className="flex h-full items-center justify-center text-[var(--muted)]">
              {t('selectEndpoint')}
            </p>
          )}
        </article>
      </div>
    </section>
  );
}

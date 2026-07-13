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
      <div className="flex h-full items-center justify-center p-6 text-center text-[var(--muted)]">
        {t('noSpec')}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--border)] px-4 py-2">
        <h2 className="font-semibold">{spec.title}</h2>
        <p className="text-xs text-[var(--muted)]">
          v{spec.version}
          {spec.baseUrl && ` · ${spec.baseUrl}`}
        </p>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-1/3 min-w-[200px] overflow-y-auto border-r border-[var(--border)]">
          {spec.endpoints.map((endpoint) => (
            <button
              key={endpoint.id}
              type="button"
              onClick={() => setSelected(endpoint)}
              className={`flex w-full items-center gap-2 border-b border-[var(--border)] px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)] transition-colors ${
                selected?.id === endpoint.id ? 'bg-[var(--surface-hover)]' : ''
              }`}
            >
              <span
                className={`shrink-0 rounded border px-1.5 py-0.5 text-xs font-mono font-bold ${
                  METHOD_COLORS[endpoint.method] ?? 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {endpoint.method}
              </span>
              <span className="truncate font-mono text-xs">{endpoint.path}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {selected ? (
            <EndpointDetail endpoint={selected} baseUrl={spec.baseUrl} />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--muted)]">
              {t('selectEndpoint')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

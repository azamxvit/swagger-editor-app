'use client';

import { useTranslations } from 'next-intl';
import type { OpenAPIParameter } from '@/lib/openapi/types';
import { getParamExample } from '@/lib/openapi/request-builder';

interface ParametersTableProps {
  parameters: OpenAPIParameter[];
}

export function ParametersTable({ parameters }: ParametersTableProps) {
  const t = useTranslations('viewer');

  if (parameters.length === 0) {
    return <p className="text-xs text-[var(--muted)]">{t('noParameters')}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
            <th className="py-1.5 pr-3 font-semibold">{t('name')}</th>
            <th className="py-1.5 pr-3 font-semibold">{t('in')}</th>
            <th className="py-1.5 pr-3 font-semibold">{t('required')}</th>
            <th className="py-1.5 font-semibold">{t('example')}</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param) => (
            <tr
              key={`${param.in}-${param.name}`}
              className="border-b border-[var(--border)]/60 last:border-0"
            >
              <td className="py-1.5 pr-3 font-mono">{param.name}</td>
              <td className="py-1.5 pr-3 text-[var(--muted)]">{param.in}</td>
              <td className="py-1.5 pr-3">
                {param.required ? (
                  <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-400">
                    {t('required')}
                  </span>
                ) : (
                  <span className="text-[var(--muted)]">{t('optional')}</span>
                )}
              </td>
              <td className="py-1.5 font-mono text-[var(--muted)]">
                {getParamExample(param) || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

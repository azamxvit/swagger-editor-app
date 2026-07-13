'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { useSchema } from '@/components/providers/SchemaProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { convertFormat } from '@/lib/openapi/converter';
import type { SchemaFormat } from '@/lib/openapi/types';
import { EditorSkeleton } from '@/components/ui/Skeleton';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

export function SwaggerEditorPanel() {
  const t = useTranslations('editor');
  const { user } = useAuth();
  const {
    content,
    format,
    errors,
    isValid,
    isValidating,
    isLoading,
    setContent,
    setFormat,
    saveSchema,
  } = useSchema();

  const handleFormatToggle = (newFormat: SchemaFormat) => {
    if (newFormat === format) return;
    try {
      const converted = convertFormat(content, format, newFormat);
      setContent(converted);
      setFormat(newFormat);
    } catch {
      toast.error('Failed to convert format');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    const success = await saveSchema();
    if (success) toast.success(t('saveSuccess'));
    else toast.error(t('saveError'));
  };

  if (isLoading) {
    return <EditorSkeleton />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
        <h2 className="font-semibold">{t('title')}</h2>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-[var(--border)] text-xs">
            <button
              type="button"
              onClick={() => handleFormatToggle('json')}
              className={`px-3 py-1 ${format === 'json' ? 'bg-[var(--primary)] text-white' : ''}`}
            >
              {t('json')}
            </button>
            <button
              type="button"
              onClick={() => handleFormatToggle('yaml')}
              className={`px-3 py-1 ${format === 'yaml' ? 'bg-[var(--primary)] text-white' : ''}`}
            >
              {t('yaml')}
            </button>
          </div>
          {user && (
            <button type="button" onClick={handleSave} disabled={!isValid} className="btn-primary text-xs">
              {t('save')}
            </button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <MonacoEditor
          height="100%"
          language={format === 'json' ? 'json' : 'yaml'}
          theme="vs-dark"
          value={content}
          onChange={(value) => setContent(value ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="border-t border-[var(--border)] px-4 py-2 text-xs">
        {isValidating ? (
          <span className="text-[var(--muted)]">{t('validating')}</span>
        ) : isValid ? (
          <span className="text-emerald-500">{t('valid')}</span>
        ) : (
          <div className="text-red-400">
            <span>{t('invalid')}</span>
            {errors.map((err) => (
              <p key={err} className="mt-1 truncate">
                {err}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

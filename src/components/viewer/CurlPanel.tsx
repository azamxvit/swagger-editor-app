'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { generateCurl } from '@/lib/openapi/curl';

interface CurlPanelProps {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export function CurlPanel({ method, url, headers, body }: CurlPanelProps) {
  const t = useTranslations('viewer');
  const [open, setOpen] = useState(false);

  const command = generateCurl({ url, method, headers, body });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    toast.success(t('curlCopied'));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="btn-secondary text-sm"
        >
          {open ? t('hideCurl') : t('generateCurl')}
        </button>
        {open && (
          <button type="button" onClick={handleCopy} className="btn-secondary text-sm">
            {t('copyCurl')}
          </button>
        )}
      </div>
      {open && (
        <pre className="overflow-x-auto rounded border border-[var(--border)] bg-[var(--surface)] p-3 text-xs font-mono whitespace-pre-wrap break-all">
          {command}
        </pre>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { SchemaProvider } from '@/components/providers/SchemaProvider';
import { SwaggerEditorPanel } from '@/components/editor/SwaggerEditorPanel';
import { SwaggerViewerPanel } from '@/components/viewer/SwaggerViewerPanel';

export function EditorViewerSplit() {
  const [isLandscape, setIsLandscape] = useState(true);

  useEffect(() => {
    const update = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <section
      aria-label="Editor and viewer"
      className={`flex min-h-0 flex-1 gap-0 overflow-hidden rounded-lg border border-[var(--border)] ${
        isLandscape ? 'flex-row' : 'flex-col'
      }`}
      style={{ minHeight: 'calc(100vh - 12rem)' }}
    >
      <section className={`${isLandscape ? 'w-1/2' : 'h-1/2'} min-h-0 min-w-0`} aria-label="Editor">
        <SwaggerEditorPanel />
      </section>
      <div
        className={`${isLandscape ? 'w-px' : 'h-px'} shrink-0 bg-[var(--border)]`}
        role="separator"
        aria-orientation={isLandscape ? 'vertical' : 'horizontal'}
      />
      <section className={`${isLandscape ? 'w-1/2' : 'h-1/2'} min-h-0 min-w-0`} aria-label="Viewer">
        <SwaggerViewerPanel />
      </section>
    </section>
  );
}

export function MainPageContent() {
  return (
    <SchemaProviderWrapper>
      <EditorViewerSplit />
    </SchemaProviderWrapper>
  );
}

function SchemaProviderWrapper({ children }: { children: React.ReactNode }) {
  return <SchemaProvider>{children}</SchemaProvider>;
}

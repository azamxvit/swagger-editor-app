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
    <div
      className={`flex flex-1 min-h-0 gap-0 border border-[var(--border)] rounded-lg overflow-hidden ${
        isLandscape ? 'flex-row' : 'flex-col'
      }`}
      style={{ minHeight: 'calc(100vh - 12rem)' }}
    >
      <div className={`${isLandscape ? 'w-1/2' : 'h-1/2'} min-h-0 min-w-0`}>
        <SwaggerEditorPanel />
      </div>
      <div
        className={`${isLandscape ? 'w-px' : 'h-px'} bg-[var(--border)] shrink-0`}
      />
      <div className={`${isLandscape ? 'w-1/2' : 'h-1/2'} min-h-0 min-w-0`}>
        <SwaggerViewerPanel />
      </div>
    </div>
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

'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ParsedOpenAPISpec, SchemaFormat } from '@/lib/openapi/types';
import { DEFAULT_SCHEMA } from '@/lib/openapi/default-schema';
import { repairBrokenDemoSchema } from '@/lib/openapi/demo-schema';
import { detectFormat } from '@/lib/openapi/converter';
import { validateOpenAPISpec } from '@/lib/openapi/validator';
import { useAuth } from './AuthProvider';

interface SchemaContextValue {
  content: string;
  format: SchemaFormat;
  errors: string[];
  spec: ParsedOpenAPISpec | null;
  isValid: boolean;
  isValidating: boolean;
  isLoading: boolean;
  setContent: (content: string) => void;
  setFormat: (format: SchemaFormat) => void;
  validate: () => Promise<void>;
  saveSchema: () => Promise<boolean>;
}

const SchemaContext = createContext<SchemaContextValue | null>(null);

export function SchemaProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [content, setContentState] = useState(DEFAULT_SCHEMA);
  const [format, setFormatState] = useState<SchemaFormat>('yaml');
  const [errors, setErrors] = useState<string[]>([]);
  const [spec, setSpec] = useState<ParsedOpenAPISpec | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);

  const validate = useCallback(async () => {
    setIsValidating(true);
    const result = await validateOpenAPISpec(content);
    setErrors(result.errors);
    setSpec(result.spec ?? null);
    setIsValidating(false);
  }, [content]);

  const setContent = useCallback((newContent: string) => {
    const repaired = repairBrokenDemoSchema(newContent);
    setContentState(repaired);
    const detected = detectFormat(repaired);
    if (detected) setFormatState(detected);
  }, []);

  const setFormat = useCallback((newFormat: SchemaFormat) => {
    setFormatState(newFormat);
  }, []);

  const saveSchema = useCallback(async () => {
    if (!user) return false;
    const response = await fetch('/api/schema', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, format }),
    });
    return response.ok;
  }, [user, content, format]);

  useEffect(() => {
    const timer = setTimeout(() => {
      validate();
    }, 500);
    return () => clearTimeout(timer);
  }, [content, validate]);

  useEffect(() => {
    if (!user) return;
    if (loadedUserId === user.id) return;

    let cancelled = false;
    fetch('/api/schema')
      .then((res) => (res.ok ? res.json() : null))
      .then(async (data) => {
        if (cancelled) return;

        if (typeof data?.content === 'string') {
          const repaired = repairBrokenDemoSchema(data.content);
          const nextFormat =
            repaired !== data.content ? 'yaml' : (data.format ?? detectFormat(repaired) ?? 'yaml');
          setContentState(repaired);
          setFormatState(nextFormat);

          if (repaired !== data.content) {
            await fetch('/api/schema', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: repaired, format: nextFormat }),
            });
          }
        }

        setLoadedUserId(user.id);
      })
      .catch(() => {
        if (!cancelled) setLoadedUserId(user.id);
      });

    return () => {
      cancelled = true;
    };
  }, [user, loadedUserId]);

  return (
    <SchemaContext.Provider
      value={{
        content,
        format,
        errors,
        spec,
        isValid: errors.length === 0 && spec !== null,
        isValidating,
        isLoading: user !== null && loadedUserId !== user.id,
        setContent,
        setFormat,
        validate,
        saveSchema,
      }}
    >
      {children}
    </SchemaContext.Provider>
  );
}

export function useSchema() {
  const ctx = useContext(SchemaContext);
  if (!ctx) throw new Error('useSchema must be used within SchemaProvider');
  return ctx;
}

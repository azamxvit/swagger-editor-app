'use client';

import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { CloseIcon } from '@/components/ui/icons';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--surface)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <button
                  type="button"
                  className="ml-1 rounded p-0.5 text-[var(--muted)] transition-colors hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
                  onClick={() => toast.dismiss(t.id)}
                  aria-label="Dismiss"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}

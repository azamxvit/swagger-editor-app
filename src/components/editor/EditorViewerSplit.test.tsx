import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { EditorViewerSplit } from '@/components/editor/EditorViewerSplit';

vi.mock('@/components/editor/SwaggerEditorPanel', () => ({
  SwaggerEditorPanel: () => <div data-testid="editor" />,
}));

vi.mock('@/components/viewer/SwaggerViewerPanel', () => ({
  SwaggerViewerPanel: () => <div data-testid="viewer" />,
}));

vi.mock('@/components/providers/SchemaProvider', () => ({
  SchemaProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
}

describe('EditorViewerSplit', () => {
  it('uses a horizontal split in landscape orientation', () => {
    const { container } = render(<EditorViewerSplit />);
    act(() => setViewport(1200, 800));
    expect(container.firstElementChild!.className).toContain('flex-row');
  });

  it('switches to a vertical split in portrait orientation', () => {
    const { container } = render(<EditorViewerSplit />);
    act(() => setViewport(600, 900));
    expect(container.firstElementChild!.className).toContain('flex-col');
  });
});

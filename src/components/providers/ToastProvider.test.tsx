import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '@/components/providers/ToastProvider';
import toast from 'react-hot-toast';

describe('ToastProvider', () => {
  it('renders a dismiss button on toasts', async () => {
    render(
      <>
        <ToastProvider />
        <button type="button" onClick={() => toast.success('Signed in successfully')}>
          trigger
        </button>
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'trigger' }));
    const dismiss = await screen.findByRole('button', { name: 'Dismiss' });
    expect(dismiss).toBeInTheDocument();
    expect(screen.getByText('Signed in successfully')).toBeInTheDocument();

    fireEvent.click(dismiss);
    await waitFor(
      () => {
        expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});

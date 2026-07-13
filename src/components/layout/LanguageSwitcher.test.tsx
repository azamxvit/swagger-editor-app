import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

const replaceMock = vi.fn();

vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/about',
}));

function renderSwitcher() {
  return render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <LanguageSwitcher />
    </NextIntlClientProvider>,
  );
}

describe('LanguageSwitcher', () => {
  it('renders both locales', () => {
    renderSwitcher();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('RU')).toBeInTheDocument();
  });

  it('switches to the selected locale keeping the current path', () => {
    renderSwitcher();
    fireEvent.click(screen.getByText('RU'));
    expect(replaceMock).toHaveBeenCalledWith('/about', { locale: 'ru' });
  });
});

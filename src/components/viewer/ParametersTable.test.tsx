import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { ParametersTable } from '@/components/viewer/ParametersTable';
import type { OpenAPIParameter } from '@/lib/openapi/types';

const messages = {
  viewer: {
    noParameters: 'No parameters',
    name: 'Name',
    in: 'In',
    required: 'required',
    optional: 'optional',
    example: 'Example',
  },
};

const parameters: OpenAPIParameter[] = [
  { name: 'id', in: 'path', required: true, example: '1' },
  { name: 'q', in: 'query', schema: { type: 'string' } },
];

describe('ParametersTable', () => {
  it('shows empty state', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ParametersTable parameters={[]} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText('No parameters')).toBeInTheDocument();
  });

  it('renders parameter rows', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ParametersTable parameters={parameters} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('path')).toBeInTheDocument();
    expect(screen.getAllByText('required').length).toBeGreaterThan(0);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('optional')).toBeInTheDocument();
  });
});

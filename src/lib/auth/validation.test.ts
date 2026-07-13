import { describe, it, expect } from 'vitest';
import { signInSchema, signUpSchema } from '@/lib/auth/validation';

describe('signInSchema', () => {
  it('accepts valid credentials', () => {
    const result = signInSchema.safeParse({
      email: 'user@example.com',
      password: 'Password1!',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = signInSchema.safeParse({
      email: 'not-an-email',
      password: 'Password1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects weak password', () => {
    const result = signInSchema.safeParse({
      email: 'user@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('accepts unicode letters in password', () => {
    const result = signInSchema.safeParse({
      email: 'user@example.com',
      password: 'Пароль123!',
    });
    expect(result.success).toBe(true);
  });
});

describe('signUpSchema', () => {
  it('rejects mismatched passwords', () => {
    const result = signUpSchema.safeParse({
      email: 'user@example.com',
      password: 'Password1!',
      confirmPassword: 'Different1!',
    });
    expect(result.success).toBe(false);
  });

  it('accepts matching passwords', () => {
    const result = signUpSchema.safeParse({
      email: 'user@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    });
    expect(result.success).toBe(true);
  });
});

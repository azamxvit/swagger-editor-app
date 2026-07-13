import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z\u00C0-\u024F\u0400-\u04FF]/, 'Password must contain at least one letter')
  .regex(/\d/, 'Password must contain at least one digit')
  .regex(
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/,
    'Password must contain at least one special character',
  );

export const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: passwordSchema,
});

export const signUpSchema = z
  .object({
    email: z.string().email('Invalid email format'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;

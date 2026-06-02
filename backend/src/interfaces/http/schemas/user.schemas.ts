import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format (e.g. +919876543210)')
    .optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
});

export const updateEmailSchema = z.object({
  newEmail: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required for email updates'),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

export const deleteUserSchema = z.object({
  password: z.string().min(1, 'Password is required to confirm deletion'),
});

export const createAddressSchema = z.object({
  label: z.string().max(20).optional(),
  recipientName: z.string().min(2, 'Recipient name is required'),
  recipientPhone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Recipient phone must be in E.164 format (e.g. +919876543210)'),
  line1: z.string().min(3, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(3, 'Zip/postal code is required'),
  country: z.string().min(2, 'Country code is required').default('IN'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

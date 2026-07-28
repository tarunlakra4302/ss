import { z } from 'zod';

const phoneRegex = /^(\+?[1-9]\d{1,14})$/;

export const VolunteerApplicationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format (E.164 required)'),
  expertise: z
    .string()
    .min(2, 'Please specify your area of expertise')
    .max(200, 'Expertise must not exceed 200 characters'),
  availability: z.enum(['WEEKDAYS', 'WEEKENDS', 'EVENINGS', 'FLEXIBLE'], {
    error: 'Please select a valid availability option',
  }),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters'),
});

export const MemberEnrollmentSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
  city: z
    .string()
    .min(2, 'City is required')
    .max(100, 'City name must not exceed 100 characters'),
  reason: z
    .string()
    .min(10, 'Please provide a detailed reason (min 10 characters)')
    .max(500, 'Reason must not exceed 500 characters'),
});

export const EventRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
  eventName: z.string().min(2, 'Event name is required'),
});

export const CreateOrderSchema = z.object({
  amount: z
    .number()
    .int('Amount must be an integer in currency subunits (e.g. paise)')
    .min(100, 'Minimum amount is 100 subunits (INR 1.00)'),
  currency: z.enum(['INR']).default('INR'),
  purpose: z.enum(['ticket', 'donation']),
  quantity: z.number().int().min(1).default(1),
  note: z.string().max(255).optional(),
});

export const VerifyPaymentSchema = z.object({
  razorpay_order_id: z
    .string()
    .min(1, 'razorpay_order_id is required')
    .startsWith('order_', 'Invalid Razorpay order ID format'),
  razorpay_payment_id: z
    .string()
    .min(1, 'razorpay_payment_id is required')
    .startsWith('pay_', 'Invalid Razorpay payment ID format'),
  razorpay_signature: z
    .string()
    .length(64, 'Razorpay signature must be a 64-character hex string'),
});

export type VolunteerApplicationInput = z.infer<typeof VolunteerApplicationSchema>;
export type MemberEnrollmentInput = z.infer<typeof MemberEnrollmentSchema>;
export type EventRegistrationInput = z.infer<typeof EventRegistrationSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;

import { z } from 'zod';

/**
 * Shared Zod schemas for "Sustainable Sundays" form validation.
 * These are used both for client-side validation and server-side logic.
 */

// Phone number regex (flexible for common formats)
const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;

/**
 * Members Form Schema
 */
export const MemberFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
  city: z.string().min(2, "City is required"),
  reason: z.string().min(10, "Please provide a more detailed reason (min 10 characters)"),
});

/**
 * Volunteers Form Schema
 */
export const VolunteerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
  expertise: z.string().min(2, "Please specify your expertise"),
  availability: z.enum(["WEEKDAYS", "WEEKENDS", "EVENINGS", "FLEXIBLE"], {
    error: "Please select a valid availability option",
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

/**
 * Events Form Schema
 */
export const EventFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
  eventName: z.string().min(2, "Event name is required"),
});

// Export inferred types for convenience within this file if needed
export type MemberFormValues = z.infer<typeof MemberFormSchema>;
export type VolunteerFormValues = z.infer<typeof VolunteerFormSchema>;
export type EventFormValues = z.infer<typeof EventFormSchema>;

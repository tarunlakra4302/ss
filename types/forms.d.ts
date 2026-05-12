import { z } from 'zod';
import { MemberFormSchema, VolunteerFormSchema, EventFormSchema } from '@/lib/validators/forms';

/**
 * Shared Type Definitions for Form Submissions
 * These are inferred from Zod schemas to maintain a single source of truth.
 * Usage:
 * import { IMemberSubmission } from '@/types/forms';
 */

export type IMemberSubmission = z.infer<typeof MemberFormSchema>;
export type IVolunteerSubmission = z.infer<typeof VolunteerFormSchema>;
export type IEventSubmission = z.infer<typeof EventFormSchema>;

/**
 * API Response Interfaces (Standardized)
 */
export interface FormResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<keyof T, string[]>;
}

/**
 * Google Integration Types
 */
export interface GoogleAuthCredentials {
  client_email: string;
  private_key: string;
}

export type GoogleServiceAccountEnv = {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SPREADSHEET_ID: string;
  GOOGLE_DRIVE_FOLDER_ID: string;
};

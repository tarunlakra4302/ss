import { NextResponse } from 'next/server';
import { EventFormSchema } from '@/lib/validators/forms';
import { appendToSheet } from '@/lib/google/sheets';
import { checkRateLimit } from '@/lib/rate-limit';
import { isAllowedOrigin } from '@/lib/security/origin';
import { checkHoneypot } from '@/lib/security/honeypot';

/**
 * Hardened API Route: Event Registration
 * Includes:
 * 1. Trusted IP Rate Limiting (5 req/min)
 * 2. Origin & CSRF Validation
 * 3. Off-Screen Honeypot & Timing Anti-Spam (Silent Success)
 * 4. Text-only validation (No user file upload attack surface)
 */
export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const rateStatus = await checkRateLimit(request, 'event_form_submit');
    if (!rateStatus.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again in a minute.',
        },
        {
          status: 429,
          headers: rateStatus.headers,
        }
      );
    }

    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ success: false, message: 'Forbidden: Invalid origin' }, { status: 403 });
    }

    // 2. Body Parsing (JSON or FormData)
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData().catch(() => null);
      if (formData) data = Object.fromEntries(formData.entries());
    } else {
      data = await request.json().catch(() => ({}));
    }

    // 3. Honeypot & Time-to-submit Bot Detection (Silent 200 Success)
    const honeypotStatus = checkHoneypot(data);
    if (honeypotStatus.isSpam) {
      return NextResponse.json(
        {
          success: true,
          message: 'Registration successful! We look forward to seeing you.',
        },
        { status: 200 }
      );
    }

    // 4. Schema Validation
    const result = EventFormSchema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // 5. Append Registration to Google Sheets
    const { name, email, phone, eventName } = result.data;
    const timestamp = new Date().toISOString();
    const row = [timestamp, name, email, phone, eventName];

    await appendToSheet('Events', row);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! We look forward to seeing you.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Hardened Event Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An internal server error occurred during secured submission.',
      },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { MemberFormSchema } from '@/lib/validators/forms';
import { appendToSheet } from '@/lib/google/sheets';
import { checkRateLimit } from '@/lib/rate-limit';
import { isAllowedOrigin } from '@/lib/security/origin';
import { checkHoneypot } from '@/lib/security/honeypot';

/**
 * API Route: Member Form Submission
 * Handles POST requests from the Member Enrollment form.
 */
export async function POST(request: Request) {
  try {
    // 0. SECURITY CHECK: Rate Limiting & CSRF / Origin Validation
    const rateStatus = await checkRateLimit(request, 'member_form_submit');
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

    const contentType = request.headers.get('content-type') || '';
    let data: any = {};
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData().catch(() => null);
      if (formData) data = Object.fromEntries(formData.entries());
    } else {
      data = await request.json().catch(() => ({}));
    }

    // 1. Honeypot & Time-to-submit Check (Silent 200 Success)
    const honeypotStatus = checkHoneypot(data);
    if (honeypotStatus.isSpam) {
      return NextResponse.json(
        {
          success: true,
          message: 'Form submitted successfully. Welcome to the movement!',
        },
        { status: 200 }
      );
    }

    // 2. Validate the incoming form data
    const result = MemberFormSchema.safeParse(data);

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

    const { name, email, phone, city, reason } = result.data;

    // 3. Prepare the row for Google Sheets (Timestamp + Fields)
    const timestamp = new Date().toISOString();
    const row = [timestamp, name, email, phone, city, reason];

    // 4. Append to the 'Members' tab in the Google Spreadsheet
    await appendToSheet('Members', row);

    return NextResponse.json(
      {
        success: true,
        message: 'Form submitted successfully. Welcome to the movement!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Member Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An internal server error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}


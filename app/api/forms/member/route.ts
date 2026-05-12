import { NextResponse } from 'next/server';
import { MemberFormSchema } from '@/lib/validators/forms';
import { appendToSheet } from '@/lib/google/sheets';
import { checkRateLimit } from '@/lib/security/rateLimit';

/**
 * API Route: Member Form Submission
 * Handles POST requests from the Member Enrollment form.
 */
export async function POST(request: Request) {
  try {
    // 0. SECURITY CHECK: Rate Limiting & CSRF
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    
    const rateStatus = await checkRateLimit(ip);
    if (!rateStatus.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again in a minute.',
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateStatus.limit.toString(),
            'X-RateLimit-Remaining': rateStatus.remaining.toString(),
            'X-RateLimit-Reset': rateStatus.reset.toString(),
          }
        }
      );
    }

    const origin = request.headers.get('origin');
    const allowed = [process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000'];
    if (!origin || !allowed.includes(origin)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    // 1. Validate the incoming form data
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

    // 2. Prepare the row for Google Sheets (Timestamp + Fields)
    const timestamp = new Date().toISOString();
    const row = [timestamp, name, email, phone, city, reason];

    // 3. Append to the 'Members' tab in the Google Spreadsheet
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

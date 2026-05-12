import { NextResponse } from 'next/server';
import { EventFormSchema } from '@/lib/validators/forms';
import { appendToSheet } from '@/lib/google/sheets';
import { uploadToDrive } from '@/lib/google/drive';
import { checkRateLimit } from '@/lib/security/rateLimit';

/**
 * Hardened API Route: Event Registration
 * Includes:
 * 1. IP Extraction for Rate Limiting
 * 2. 429 Too Many Requests Handling (via Upstash Redis)
 * 3. Strict 5MB File Size Validation
 * 4. Image/* MIME Type Enforcement
 */
export async function POST(request: Request) {
  try {
    // A. SECURITY CHECK: Rate Limiting
    // -------------------------------------------------------------
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    
    const rateStatus = await checkRateLimit(ip);
    if (!rateStatus.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again in a minute.',
          remaining: rateStatus.remaining,
          reset: rateStatus.reset,
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

    // B. EXTRACT PAYLOAD
    // -------------------------------------------------------------
    const formData = await request.formData();
    
    // Extract base data for validation
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      eventName: formData.get('eventName'),
    };

    // 1. Zod validation for text fields
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

    // C. STRICT FILE VALIDATION
    // -------------------------------------------------------------
    const screenshot = formData.get('screenshot') as File;
    if (!screenshot || !(screenshot instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'A valid screenshot file is required.' },
        { status: 400 }
      );
    }

    // 1. File Size Check (Max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (screenshot.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File is too large. Max size allowed is 5MB.' },
        { status: 400 }
      );
    }

    // 2. File Type Enforcement (Whitelist extensions + Reject SVG)
    const ALLOWED_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    const ext = '.' + screenshot.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json({ success: false, message: 'File type not allowed.' }, { status: 400 });
    }
    if (ext === '.svg') {
      return NextResponse.json({ success: false, message: 'SVG files are not permitted.' }, { status: 400 });
    }

    // D. EXTERNAL INTEGRATION (Google APIs)
    // -------------------------------------------------------------
    // Convert File to Buffer for Google Drive upload
    const buffer = Buffer.from(await screenshot.arrayBuffer());
    
    // 3. Upload to Google Drive
    const driveResult = await uploadToDrive(buffer, `${result.data.eventName}_screenshot_${Date.now()}`, screenshot.type);

    if (!driveResult.webViewLink) {
      throw new Error('Failed to retrieve Drive link after security checks.');
    }

    // 4. Prepare and Append to Google Sheets
    const { name, email, phone, eventName } = result.data;
    const timestamp = new Date().toISOString();
    const row = [timestamp, name, email, phone, eventName, driveResult.webViewLink];

    try {
      await appendToSheet('Events', row);
    } catch (sheetsError) {
      // Rollback: Delete the Drive file if Sheets write fails
      const drive = await import('@/lib/google/auth').then(m => m.getDriveClient());
      await drive.files.delete({ fileId: driveResult.fileId }).catch(() => {});
      throw sheetsError;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Rate limited and validated for your security.',
        driveLink: driveResult.webViewLink,
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

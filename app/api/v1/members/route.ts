import { NextRequest, NextResponse } from 'next/server';
import { MemberEnrollmentSchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rate-limit';
import { getCachedIdempotentResponse, saveIdempotentResponse } from '@/lib/idempotency';
import { badRequest, tooManyRequests, internalServerError } from '@/lib/errors';
import { appendToSheet } from '@/lib/google/sheets';
import { checkHoneypot } from '@/lib/security/honeypot';

export async function POST(req: NextRequest) {
  const instancePath = '/api/v1/members';

  try {
    // 1. Rate Limiting Check
    const rateStatus = await checkRateLimit(req, 'member_enrollment');
    if (!rateStatus.success) {
      return tooManyRequests('Rate limit exceeded for member enrollments.', instancePath, rateStatus.headers);
    }

    // 2. Idempotency Check
    const idempotencyKey = req.headers.get('idempotency-key');
    const { validKey, cachedRecord } = await getCachedIdempotentResponse(idempotencyKey);

    if (!validKey) {
      return badRequest('Invalid Idempotency-Key format. Must be a valid UUIDv4.', instancePath);
    }

    if (cachedRecord) {
      return new NextResponse(JSON.stringify(cachedRecord.body), {
        status: cachedRecord.status,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
          ...cachedRecord.headers,
        },
      });
    }

    // 3. Body Parsing & Zod Validation
    const contentType = req.headers.get('content-type') || '';
    let data: any = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData().catch(() => null);
      if (!formData) return badRequest('Failed to parse form data.', instancePath);
      data = Object.fromEntries(formData.entries());
    } else {
      data = await req.json().catch(() => null);
      if (!data) return badRequest('Request body must be a valid JSON object or form-data.', instancePath);
    }

    // 4. Honeypot & Time-to-submit Bot Detection (Silent 201 Success)
    const honeypotStatus = checkHoneypot(data);
    if (honeypotStatus.isSpam) {
      const fakePayload = {
        status: 'SUCCESS',
        message: 'Member enrollment received successfully.',
      };
      return new NextResponse(JSON.stringify(fakePayload), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...rateStatus.headers },
      });
    }

    const validationResult = MemberEnrollmentSchema.safeParse(data);
    if (!validationResult.success) {
      const invalidParams = Object.entries(
        validationResult.error.flatten().fieldErrors
      ).map(([name, reasons]) => ({
        name,
        reason: reasons?.join(', ') || 'Invalid value',
      }));

      return badRequest('Validation failed for member enrollment payload.', instancePath, invalidParams);
    }

    const { name, email, phone, city, reason } = validationResult.data;

    // 5. Append to Google Sheets
    const timestamp = new Date().toISOString();
    const row = [timestamp, name, email, phone, city, reason];

    await appendToSheet('Members', row);

    const responsePayload = {
      status: 'SUCCESS',
      message: 'Member enrollment received successfully.',
    };

    // 6. Cache for Idempotency
    if (idempotencyKey) {
      await saveIdempotentResponse(idempotencyKey, 201, responsePayload, rateStatus.headers);
    }

    return new NextResponse(JSON.stringify(responsePayload), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...rateStatus.headers,
      },
    });
  } catch (error) {
    console.error('[API v1 Members POST] Error:', error);
    return internalServerError('Failed to submit member enrollment.', instancePath);
  }
}


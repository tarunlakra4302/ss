import { NextRequest, NextResponse } from 'next/server';
import { EventRegistrationSchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rate-limit';
import { getCachedIdempotentResponse, saveIdempotentResponse } from '@/lib/idempotency';
import { badRequest, tooManyRequests, internalServerError } from '@/lib/errors';
import { appendToSheet } from '@/lib/google/sheets';
import { checkHoneypot } from '@/lib/security/honeypot';

export async function POST(req: NextRequest) {
  const instancePath = '/api/v1/events/registrations';

  try {
    // 1. Rate Limiting Check
    const rateStatus = await checkRateLimit(req, 'event_registration');
    if (!rateStatus.success) {
      return tooManyRequests('Rate limit exceeded for event registration.', instancePath, rateStatus.headers);
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

    // 3. Extract Form Data (JSON or Multipart)
    const contentType = req.headers.get('content-type') || '';
    let rawData: any = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData().catch(() => null);
      if (!formData) return badRequest('Failed to parse form data.', instancePath);
      rawData = Object.fromEntries(formData.entries());
    } else {
      rawData = await req.json().catch(() => null);
      if (!rawData) return badRequest('Request body must be a valid JSON object or form-data.', instancePath);
    }

    // 4. Honeypot & Time-to-submit Bot Detection (Silent 201 Success)
    const honeypotStatus = checkHoneypot(rawData);
    if (honeypotStatus.isSpam) {
      const fakePayload = {
        status: 'SUCCESS',
        message: 'Event registration submitted successfully.',
      };
      return new NextResponse(JSON.stringify(fakePayload), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...rateStatus.headers },
      });
    }

    const textFields = {
      name: rawData.name?.toString() || '',
      email: rawData.email?.toString() || '',
      phone: rawData.phone?.toString() || '',
      eventName: rawData.eventName?.toString() || '',
    };

    // 5. Validate Text Fields
    const validationResult = EventRegistrationSchema.safeParse(textFields);
    if (!validationResult.success) {
      const invalidParams = Object.entries(
        validationResult.error.flatten().fieldErrors
      ).map(([name, reasons]) => ({
        name,
        reason: reasons?.join(', ') || 'Invalid value',
      }));

      return badRequest('Validation failed for registration form fields.', instancePath, invalidParams);
    }

    // 6. Append Application Record to Google Sheets
    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      validationResult.data.name,
      validationResult.data.email,
      validationResult.data.phone,
      validationResult.data.eventName,
    ];

    await appendToSheet('Events', row);

    const responsePayload = {
      status: 'SUCCESS',
      message: 'Event registration submitted successfully.',
    };

    // 7. Cache for Idempotency
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
    console.error('[API v1 Event Registrations POST] Error:', error);
    return internalServerError('An internal server error occurred while processing event registration.', instancePath);
  }
}


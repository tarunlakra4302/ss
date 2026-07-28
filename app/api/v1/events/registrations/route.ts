import { NextRequest, NextResponse } from 'next/server';
import { EventRegistrationSchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateFileMagicBytes } from '@/lib/file-validation';
import { getCachedIdempotentResponse, saveIdempotentResponse } from '@/lib/idempotency';
import { badRequest, unprocessableEntity, tooManyRequests, internalServerError } from '@/lib/errors';
import { uploadToDrive } from '@/lib/google/drive';
import { appendToSheet } from '@/lib/google/sheets';

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

    // 3. Extract Form Data
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return badRequest('Request payload must be valid multipart/form-data.', instancePath);
    }

    const textFields = {
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      eventName: formData.get('eventName')?.toString() || '',
    };

    // 4. Validate Text Fields
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

    // 5. Extract & Validate Screenshot File via Magic Bytes
    const screenshot = formData.get('screenshot');
    if (!screenshot || !(screenshot instanceof File)) {
      return badRequest('A valid screenshot file is required in multipart field "screenshot".', instancePath);
    }

    const fileBuffer = Buffer.from(await screenshot.arrayBuffer());
    const magicValidation = validateFileMagicBytes(fileBuffer);

    if (!magicValidation.valid || !magicValidation.mimeType) {
      return unprocessableEntity(
        magicValidation.error || 'Invalid file type signature.',
        instancePath
      );
    }

    // 6. Upload File to Google Drive
    const fileName = `${validationResult.data.eventName}_screenshot_${Date.now()}`;
    const driveResult = await uploadToDrive(
      fileBuffer,
      fileName,
      magicValidation.mimeType
    );

    if (!driveResult.webViewLink || !driveResult.fileId) {
      throw new Error('Failed to obtain Google Drive file upload response.');
    }

    // 7. Append Application Record to Google Sheets
    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      validationResult.data.name,
      validationResult.data.email,
      validationResult.data.phone,
      validationResult.data.eventName,
      driveResult.webViewLink,
    ];

    try {
      await appendToSheet('Events', row);
    } catch (sheetsError) {
      // Rollback Google Drive file upload on sheet write failure
      const drive = await import('@/lib/google/auth').then((m) => m.getDriveClient());
      if (driveResult.fileId) {
        await drive.files.delete({ fileId: driveResult.fileId }).catch(() => {});
      }
      throw sheetsError;
    }

    const responsePayload = {
      status: 'SUCCESS',
      message: 'Event registration submitted successfully.',
      driveLink: driveResult.webViewLink,
    };

    // 8. Cache for Idempotency
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

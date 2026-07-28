import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { VerifyPaymentSchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rate-limit';
import { badRequest, unauthorized, tooManyRequests, internalServerError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  const instancePath = '/api/v1/orders/verify';

  try {
    // 1. Rate Limiting Check
    const rateStatus = await checkRateLimit(req, 'orders_verify');
    if (!rateStatus.success) {
      return tooManyRequests('Rate limit exceeded for payment verification.', instancePath, rateStatus.headers);
    }

    // 2. Parse & Validate Payload
    const body = await req.json().catch(() => null);
    if (!body) {
      return badRequest('Request body must be a valid JSON object.', instancePath);
    }

    const validationResult = VerifyPaymentSchema.safeParse(body);
    if (!validationResult.success) {
      const invalidParams = Object.entries(
        validationResult.error.flatten().fieldErrors
      ).map(([name, reasons]) => ({
        name,
        reason: reasons?.join(', ') || 'Invalid value',
      }));

      return badRequest('Validation failed for payment verification payload.', instancePath, invalidParams);
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = validationResult.data;

    // 3. Compute Expected HMAC Digest
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('[API v1 Orders Verify] RAZORPAY_KEY_SECRET is missing from env.');
      return internalServerError('Server payment configuration error.', instancePath);
    }

    const payloadToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignatureHex = crypto
      .createHmac('sha256', secret)
      .update(payloadToSign)
      .digest('hex');

    // 4. Secure Constant-Time Cryptographic Comparison
    const expectedBuffer = Buffer.from(expectedSignatureHex, 'hex');
    const providedBuffer = Buffer.from(razorpay_signature, 'hex');

    if (
      expectedBuffer.length !== providedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
      return unauthorized(
        'Invalid payment signature. Cryptographic digest verification failed.',
        instancePath
      );
    }

    // 5. Success Response
    return new NextResponse(
      JSON.stringify({
        status: 'SUCCESS',
        verified: true,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...rateStatus.headers,
        },
      }
    );
  } catch (error) {
    console.error('[API v1 Orders Verify POST] Error:', error);
    return internalServerError('Payment signature verification encountered a processing failure.', instancePath);
  }
}

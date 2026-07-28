import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { CreateOrderSchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rate-limit';
import { getCachedIdempotentResponse, saveIdempotentResponse } from '@/lib/idempotency';
import { badRequest, tooManyRequests, internalServerError } from '@/lib/errors';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export async function POST(req: NextRequest) {
  const instancePath = '/api/v1/orders';

  try {
    // 1. Rate Limiting Check
    const rateStatus = await checkRateLimit(req, 'orders_create');
    if (!rateStatus.success) {
      return tooManyRequests('Rate limit exceeded for order creation.', instancePath, rateStatus.headers);
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
    const body = await req.json().catch(() => null);
    if (!body) {
      return badRequest('Request body must be a valid JSON object.', instancePath);
    }

    const validationResult = CreateOrderSchema.safeParse(body);
    if (!validationResult.success) {
      const invalidParams = Object.entries(
        validationResult.error.flatten().fieldErrors
      ).map(([name, reasons]) => ({
        name,
        reason: reasons?.join(', ') || 'Invalid value',
      }));

      return badRequest('Validation failed for order request payload.', instancePath, invalidParams);
    }

    const { amount, currency, purpose, quantity, note } = validationResult.data;

    // 4. Create Razorpay Order
    const receiptId = `rcpt_${crypto.randomBytes(8).toString('hex')}`;
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receiptId,
      notes: {
        purpose,
        quantity: String(quantity),
        note: note || '',
        source: 'sustainable_sundays_v1_api',
      },
    });

    const responsePayload = {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    };

    // 5. Cache for Idempotency if key was provided
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
    console.error('[API v1 Orders POST] Error:', error);
    return internalServerError('Failed to process payment order with gateway.', instancePath);
  }
}

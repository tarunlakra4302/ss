import { NextResponse } from 'next/server';

export interface InvalidParam {
  name: string;
  reason: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code?: string;
  invalidParams?: InvalidParam[];
}

/**
 * Creates an RFC 7807 compliant Problem Details HTTP response.
 */
export function createProblemDetailsResponse(
  problem: ProblemDetails,
  customHeaders?: Record<string, string>
): NextResponse {
  const headers = new Headers(customHeaders);
  headers.set('Content-Type', 'application/problem+json');

  return new NextResponse(JSON.stringify(problem), {
    status: problem.status,
    headers,
  });
}

export function badRequest(
  detail: string,
  instance: string,
  invalidParams?: InvalidParam[]
): NextResponse {
  return createProblemDetailsResponse({
    type: 'https://sustainablesundays.org/errors/bad-request',
    title: 'Bad Request',
    status: 400,
    detail,
    instance,
    code: 'BAD_REQUEST',
    invalidParams,
  });
}

export function unauthorized(
  detail: string,
  instance: string
): NextResponse {
  return createProblemDetailsResponse({
    type: 'https://sustainablesundays.org/errors/unauthorized',
    title: 'Unauthorized',
    status: 401,
    detail,
    instance,
    code: 'UNAUTHORIZED',
  });
}

export function unprocessableEntity(
  detail: string,
  instance: string,
  invalidParams?: InvalidParam[]
): NextResponse {
  return createProblemDetailsResponse({
    type: 'https://sustainablesundays.org/errors/unprocessable-entity',
    title: 'Unprocessable Entity',
    status: 422,
    detail,
    instance,
    code: 'UNPROCESSABLE_ENTITY',
    invalidParams,
  });
}

export function tooManyRequests(
  detail: string,
  instance: string,
  rateLimitHeaders?: Record<string, string>
): NextResponse {
  return createProblemDetailsResponse(
    {
      type: 'https://sustainablesundays.org/errors/too-many-requests',
      title: 'Too Many Requests',
      status: 429,
      detail,
      instance,
      code: 'TOO_MANY_REQUESTS',
    },
    rateLimitHeaders
  );
}

export function internalServerError(
  detail: string = 'An unexpected internal server error occurred.',
  instance: string
): NextResponse {
  return createProblemDetailsResponse({
    type: 'https://sustainablesundays.org/errors/internal-server-error',
    title: 'Internal Server Error',
    status: 500,
    detail,
    instance,
    code: 'INTERNAL_SERVER_ERROR',
  });
}

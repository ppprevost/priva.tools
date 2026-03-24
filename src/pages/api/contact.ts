export const prerender = false;

import type { APIRoute } from 'astro';
import { requireDatabaseUrl, requireAuth, getClientIp, createRateLimiter, jsonResponse, jsonError, handleUseCaseError } from '../../lib/api-helpers';
import { submitContact } from '@/use-cases/submit-contact';
import * as contactRepo from '@/infra/contact.repo';
import * as captcha from '@/infra/turnstile';

const isRateLimited = createRateLimiter({ windowMs: 60_000, max: 5 });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const dbGuard = requireDatabaseUrl();
  if (dbGuard) return dbGuard;

  const authGuard = requireAuth(request);
  if (authGuard) return authGuard;

  const ip = getClientIp(clientAddress, request);
  if (isRateLimited(ip)) {
    return jsonError('Too many requests. Please try again later.', 429);
  }

  try {
    const body = await request.json();
    const { name, email, message, turnstileToken } = body;

    await submitContact({ contactRepo, captcha }, { name, email, message, turnstileToken });

    return jsonResponse({ success: true });
  } catch (e) {
    return handleUseCaseError(e);
  }
};

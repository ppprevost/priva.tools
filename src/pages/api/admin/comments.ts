export const prerender = false;

import type { APIRoute } from 'astro';
import { requireDatabaseUrl, getClientIp, requireAdmin, createRateLimiter, jsonResponse, jsonError, handleUseCaseError } from '../../../lib/api-helpers';
import { listAllComments, approveComment, removeComment } from '@/use-cases/admin-comments';
import * as commentRepo from '@/infra/comment.repo';
import { validationError } from '@/domain/errors';

const isRateLimited = createRateLimiter({
  windowMs: 60_000,
  max: 10,
  lockoutThreshold: 20,
  lockoutDurationMs: 15 * 60_000,
});

function guardAll(request: Request, clientAddress: string | undefined): Response | null {
  const ip = getClientIp(clientAddress, request);
  if (isRateLimited(ip)) return jsonError('Too many requests.', 429);

  const dbGuard = requireDatabaseUrl();
  if (dbGuard) return dbGuard;

  return requireAdmin(request);
}

const deps = { commentRepo };

export const GET: APIRoute = async ({ request, clientAddress }) => {
  const guard = guardAll(request, clientAddress);
  if (guard) return guard;

  try {
    const rows = await listAllComments(deps);
    return jsonResponse(rows);
  } catch (e) {
    return handleUseCaseError(e);
  }
};

export const PATCH: APIRoute = async ({ request, clientAddress }) => {
  const guard = guardAll(request, clientAddress);
  if (guard) return guard;

  try {
    const body = await request.json();
    const { id, approved } = body;

    if (typeof id !== 'number' || typeof approved !== 'boolean') {
      throw validationError('id (number) and approved (boolean) are required.');
    }

    const { comment } = await approveComment(deps, id, approved);
    return jsonResponse(comment);
  } catch (e) {
    return handleUseCaseError(e);
  }
};

export const DELETE: APIRoute = async ({ request, clientAddress }) => {
  const guard = guardAll(request, clientAddress);
  if (guard) return guard;

  try {
    const body = await request.json();
    const { id } = body;

    if (typeof id !== 'number') {
      throw validationError('id (number) is required.');
    }

    await removeComment(deps, id);
    return jsonResponse({ deleted: true, id });
  } catch (e) {
    return handleUseCaseError(e);
  }
};

export const prerender = false;

import type { APIRoute } from 'astro';
import { requireDatabaseUrl, jsonResponse, handleUseCaseError } from '../../../lib/api-helpers';
import { getComments } from '@/use-cases/get-comments';
import * as commentRepo from '@/infra/comment.repo';

export const GET: APIRoute = async ({ params }) => {
  const dbGuard = requireDatabaseUrl();
  if (dbGuard) return dbGuard;

  try {
    const rows = await getComments({ commentRepo }, params.slug ?? '');
    return jsonResponse(rows);
  } catch (e) {
    return handleUseCaseError(e);
  }
};

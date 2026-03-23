export const prerender = false;

import type { APIRoute } from 'astro';
import { requireDatabaseUrl, requireAuth, jsonResponse, handleUseCaseError } from '../../../lib/api-helpers';
import { listPosts } from '@/use-cases/get-blog-posts';
import * as blogRepo from '@/infra/blog.repo';

export const GET: APIRoute = async ({ request }) => {
  const dbGuard = requireDatabaseUrl();
  if (dbGuard) return dbGuard;

  const authGuard = requireAuth(request);
  if (authGuard) return authGuard;

  try {
    const posts = await listPosts({ blogRepo });
    return jsonResponse(posts);
  } catch (e) {
    return handleUseCaseError(e);
  }
};

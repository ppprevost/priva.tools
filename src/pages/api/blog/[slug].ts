export const prerender = false;

import type { APIRoute } from 'astro';
import { getPostBySlug } from '../../../lib/blog';
import { requireDatabaseUrl, requireAuth, jsonResponse, jsonError } from '../../../lib/api-helpers';

export const GET: APIRoute = async ({ params, request }) => {
  const dbGuard = requireDatabaseUrl();
  if (dbGuard) return dbGuard;

  const authGuard = requireAuth(request);
  if (authGuard) return authGuard;

  const { slug } = params;
  if (!slug) return jsonError('Missing slug.');

  try {
    const post = await getPostBySlug(slug);
    if (!post) return jsonError('Post not found.', 404);
    return jsonResponse(post);
  } catch (e) {
    console.error('Blog post error:', (e as Error).message);
    return jsonError('Something went wrong.', 500);
  }
};

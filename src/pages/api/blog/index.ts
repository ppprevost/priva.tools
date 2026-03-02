export const prerender = false;

import type { APIRoute } from 'astro';
import { getAllPosts } from '../../../lib/blog';
import { requireDatabaseUrl, requireAuth, jsonResponse, jsonError } from '../../../lib/api-helpers';

export const GET: APIRoute = async ({ request }) => {
  const dbGuard = requireDatabaseUrl();
  if (dbGuard) return dbGuard;

  const authGuard = requireAuth(request);
  if (authGuard) return authGuard;

  try {
    const posts = await getAllPosts();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const listing = posts.map(({ content, ...rest }) => rest);
    return jsonResponse(listing);
  } catch (e) {
    console.error('Blog list error:', (e as Error).message);
    return jsonError('Something went wrong.', 500);
  }
};

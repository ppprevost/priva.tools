export const prerender = false;

import type { APIRoute } from 'astro';
import { hasDatabaseUrl } from '../lib/blog';
import { listPosts } from '../use-cases/get-blog-posts';
import * as blogRepo from '../infra/blog.repo';

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  if (!hasDatabaseUrl()) {
    return new Response('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>', {
      headers: { 'Content-Type': 'application/xml' },
    });
  }

  const posts = await listPosts({ blogRepo });

  const urls = [
    { loc: 'https://priva.tools/blog', priority: '0.7' },
    ...posts.map((p) => ({
      loc: `https://priva.tools/blog/${escapeXml(p.slug)}`,
      lastmod: escapeXml(p.date),
      priority: '0.6',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${'lastmod' in u ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};

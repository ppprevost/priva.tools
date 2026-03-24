import { sql } from './neon';
import type { Comment, PublicComment } from '@/domain/entities';

export async function getApproved(toolSlug: string): Promise<PublicComment[]> {
  const rows = await sql`
    SELECT id, author_name, content, created_at, rating
    FROM comments
    WHERE tool_slug = ${toolSlug} AND approved = true
    ORDER BY created_at DESC
    LIMIT 50
  `;
  return rows as PublicComment[];
}

export async function countRecentByIp(ipHash: string): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*)::int AS cnt FROM comments
    WHERE ip_hash = ${ipHash} AND created_at > NOW() - INTERVAL '1 hour'
  `;
  return rows[0].cnt;
}

export async function insert(toolSlug: string, name: string, content: string, ipHash: string, rating?: number | null): Promise<void> {
  await sql`
    INSERT INTO comments (tool_slug, author_name, content, ip_hash, rating)
    VALUES (${toolSlug}, ${name}, ${content}, ${ipHash}, ${rating ?? null})
  `;
}

export async function getAll(): Promise<Omit<Comment, 'ip_hash'>[]> {
  const rows = await sql`
    SELECT id, tool_slug, author_name, content, approved, created_at, rating
    FROM comments ORDER BY created_at DESC LIMIT 100
  `;
  return rows as Omit<Comment, 'ip_hash'>[];
}

export async function setApproval(id: number, approved: boolean): Promise<Omit<Comment, 'ip_hash'> | null> {
  const rows = await sql`
    UPDATE comments SET approved = ${approved} WHERE id = ${id}
    RETURNING id, tool_slug, author_name, content, approved, created_at, rating
  `;
  return (rows[0] as Omit<Comment, 'ip_hash'>) ?? null;
}

export async function remove(id: number): Promise<boolean> {
  const rows = await sql`DELETE FROM comments WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

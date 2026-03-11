export type { BlogPost } from '@/domain/entities';

export function hasDatabaseUrl(): boolean {
  return !!process.env.DATABASE_URL;
}

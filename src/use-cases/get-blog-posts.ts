import { notFoundError } from '@/domain/errors';
import type { BlogRepo } from '@/domain/ports';
import type { BlogPost, BlogPostSummary } from '@/domain/entities';

type Deps = {
  blogRepo: BlogRepo;
};

export async function listPosts(deps: Deps): Promise<BlogPostSummary[]> {
  const posts = await deps.blogRepo.getAll();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return posts.map(({ content, ...rest }) => rest);
}

export async function getPost(deps: Deps, slug: string): Promise<BlogPost> {
  const post = await deps.blogRepo.getBySlug(slug);
  if (!post) throw notFoundError('Post not found.');
  return post;
}

export async function getRelatedPosts(deps: Deps, toolSlug: string): Promise<BlogPost[]> {
  return deps.blogRepo.getByTool(toolSlug);
}

import { tools } from '@/lib/tools-config';
import { validationError } from '@/domain/errors';
import type { CommentRepo } from '@/domain/ports';
import type { PublicComment } from '@/domain/entities';

type Deps = {
  commentRepo: Pick<CommentRepo, 'getApproved'>;
};

export async function getComments(deps: Deps, slug: string): Promise<PublicComment[]> {
  if (!slug || !tools[slug]) {
    throw validationError('Invalid tool.');
  }
  return deps.commentRepo.getApproved(slug);
}

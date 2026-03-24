import { notFoundError } from '@/domain/errors';
import type { CommentRepo } from '@/domain/ports';
import type { Comment } from '@/domain/entities';
import type { CommentApproved, CommentRemoved } from '@/domain/events';

type Deps = {
  commentRepo: Pick<CommentRepo, 'getAll' | 'setApproval' | 'remove'>;
};

export async function listAllComments(deps: Deps): Promise<Omit<Comment, 'ip_hash'>[]> {
  return deps.commentRepo.getAll();
}

export async function approveComment(deps: Deps, id: number, approved: boolean): Promise<{ comment: Omit<Comment, 'ip_hash'>; event: CommentApproved }> {
  const comment = await deps.commentRepo.setApproval(id, approved);
  if (!comment) throw notFoundError('Comment not found.');
  return { comment, event: { type: 'CommentApproved', commentId: id, approved } };
}

export async function removeComment(deps: Deps, id: number): Promise<CommentRemoved> {
  const deleted = await deps.commentRepo.remove(id);
  if (!deleted) throw notFoundError('Comment not found.');
  return { type: 'CommentRemoved', commentId: id };
}

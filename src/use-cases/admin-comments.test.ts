import { describe, it, expect, vi } from 'vitest';
import { listAllComments, approveComment, removeComment } from './admin-comments';

const createDeps = () => ({
  commentRepo: {
    getAll: vi.fn(),
    setApproval: vi.fn(),
    remove: vi.fn(),
  },
});

describe('listAllComments', () => {
  it('returns all comments', async () => {
    const deps = createDeps();
    const mockComments = [{ id: 1, tool_slug: 'compress-pdf', author_name: 'Alice', content: 'Great', approved: false, created_at: '2024-01-01' }];
    deps.commentRepo.getAll.mockResolvedValue(mockComments);

    const result = await listAllComments(deps);
    expect(result).toEqual(mockComments);
  });
});

describe('approveComment', () => {
  it('returns comment and event', async () => {
    const deps = createDeps();
    const updated = { id: 1, approved: true };
    deps.commentRepo.setApproval.mockResolvedValue(updated);

    const { comment, event } = await approveComment(deps, 1, true);
    expect(comment).toEqual(updated);
    expect(event).toEqual({ type: 'CommentApproved', commentId: 1, approved: true });
  });

  it('throws NotFoundError when comment does not exist', async () => {
    const deps = createDeps();
    deps.commentRepo.setApproval.mockResolvedValue(null);
    await expect(approveComment(deps, 999, true))
      .rejects.toThrow('Comment not found.');
  });
});

describe('removeComment', () => {
  it('returns event on success', async () => {
    const deps = createDeps();
    deps.commentRepo.remove.mockResolvedValue(true);
    const event = await removeComment(deps, 1);
    expect(event).toEqual({ type: 'CommentRemoved', commentId: 1 });
  });

  it('throws NotFoundError when comment does not exist', async () => {
    const deps = createDeps();
    deps.commentRepo.remove.mockResolvedValue(false);
    await expect(removeComment(deps, 999))
      .rejects.toThrow('Comment not found.');
  });
});

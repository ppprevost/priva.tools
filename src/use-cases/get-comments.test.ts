import { describe, it, expect, vi } from 'vitest';
import { getComments } from './get-comments';

const createDeps = () => ({
  commentRepo: {
    getApproved: vi.fn(),
  },
});

describe('getComments', () => {
  it('throws ValidationError for invalid tool slug', async () => {
    const deps = createDeps();
    await expect(getComments(deps, 'nonexistent'))
      .rejects.toThrow('Invalid tool.');
  });

  it('throws ValidationError for empty slug', async () => {
    const deps = createDeps();
    await expect(getComments(deps, ''))
      .rejects.toThrow('Invalid tool.');
  });

  it('returns approved comments for valid tool', async () => {
    const deps = createDeps();
    const mockComments = [
      { id: 1, author_name: 'Alice', content: 'Great!', created_at: '2024-01-01', rating: null },
    ];
    deps.commentRepo.getApproved.mockResolvedValue(mockComments);

    const result = await getComments(deps, 'compress-pdf');
    expect(result).toEqual(mockComments);
    expect(deps.commentRepo.getApproved).toHaveBeenCalledWith('compress-pdf');
  });
});

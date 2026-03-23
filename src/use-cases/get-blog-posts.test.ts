import { describe, it, expect, vi } from 'vitest';
import { listPosts, getPost, getRelatedPosts } from './get-blog-posts';

const createDeps = () => ({
  blogRepo: {
    getAll: vi.fn(),
    getBySlug: vi.fn(),
    getByTool: vi.fn(),
  },
});

const mockPost = {
  slug: 'test-post',
  title: 'Test',
  description: 'A test post',
  content: '<p>Full content</p>',
  date: '2024-01-01',
  category: 'tips',
  related_tools: ['compress-pdf'],
  og_image: null,
};

describe('listPosts', () => {
  it('returns posts without content', async () => {
    const deps = createDeps();
    deps.blogRepo.getAll.mockResolvedValue([mockPost]);

    const result = await listPosts(deps);
    expect(result).toHaveLength(1);
    expect(result[0]).not.toHaveProperty('content');
    expect(result[0].title).toBe('Test');
  });
});

describe('getPost', () => {
  it('returns post by slug', async () => {
    const deps = createDeps();
    deps.blogRepo.getBySlug.mockResolvedValue(mockPost);

    const result = await getPost(deps, 'test-post');
    expect(result).toEqual(mockPost);
  });

  it('throws NotFoundError for missing slug', async () => {
    const deps = createDeps();
    deps.blogRepo.getBySlug.mockResolvedValue(null);
    await expect(getPost(deps, 'nonexistent'))
      .rejects.toThrow('Post not found.');
  });
});

describe('getRelatedPosts', () => {
  it('returns related posts by tool slug', async () => {
    const deps = createDeps();
    deps.blogRepo.getByTool.mockResolvedValue([mockPost]);

    const result = await getRelatedPosts(deps, 'compress-pdf');
    expect(result).toEqual([mockPost]);
  });
});

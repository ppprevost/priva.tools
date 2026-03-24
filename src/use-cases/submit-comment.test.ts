import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitComment } from './submit-comment';

const createDeps = () => ({
  commentRepo: {
    countRecentByIp: vi.fn().mockResolvedValue(0),
    insert: vi.fn(),
  },
  captcha: { verify: vi.fn().mockResolvedValue(true) },
  ipHasher: { hash: vi.fn().mockResolvedValue('abc123hash') },
});

const validInput = {
  toolSlug: 'compress-pdf',
  authorName: 'Alice',
  content: 'This is a great tool for compressing!',
  turnstileToken: 'valid-token',
  ip: '127.0.0.1',
  isMobile: false,
};

describe('submitComment', () => {
  let deps: ReturnType<typeof createDeps>;

  beforeEach(() => {
    deps = createDeps();
  });

  it('returns null on honeypot trigger', async () => {
    const result = await submitComment(deps, { ...validInput, website: 'spam.com' });
    expect(result).toBeNull();
    expect(deps.commentRepo.insert).not.toHaveBeenCalled();
  });

  it('throws ValidationError for invalid tool', async () => {
    await expect(submitComment(deps, { ...validInput, toolSlug: 'nonexistent' }))
      .rejects.toThrow('Invalid tool.');
  });

  it('throws ValidationError for short name', async () => {
    await expect(submitComment(deps, { ...validInput, authorName: 'AB' }))
      .rejects.toThrow('Name');
  });

  it('throws ValidationError for short content', async () => {
    await expect(submitComment(deps, { ...validInput, content: 'Short' }))
      .rejects.toThrow('Comment');
  });

  it('throws CaptchaError when turnstile fails', async () => {
    deps.captcha.verify.mockResolvedValue(false);
    await expect(submitComment(deps, validInput))
      .rejects.toThrow('Captcha verification failed.');
  });

  it('skips captcha for mobile clients', async () => {
    deps.captcha.verify.mockResolvedValue(false);
    await submitComment(deps, { ...validInput, isMobile: true, turnstileToken: undefined });
    expect(deps.captcha.verify).not.toHaveBeenCalled();
    expect(deps.commentRepo.insert).toHaveBeenCalled();
  });

  it('throws RateLimitError when too many comments', async () => {
    deps.commentRepo.countRecentByIp.mockResolvedValue(3);
    await expect(submitComment(deps, validInput))
      .rejects.toThrow('Too many comments');
  });

  it('inserts comment and returns event on success', async () => {
    const event = await submitComment(deps, validInput);
    expect(deps.commentRepo.insert).toHaveBeenCalledWith(
      'compress-pdf',
      'Alice',
      'This is a great tool for compressing!',
      'abc123hash',
      null,
    );
    expect(event).toEqual({ type: 'CommentSubmitted', toolSlug: 'compress-pdf', authorName: 'Alice' });
  });

  it('passes rating to insert', async () => {
    await submitComment(deps, { ...validInput, rating: 4 });
    expect(deps.commentRepo.insert).toHaveBeenCalledWith(
      'compress-pdf',
      'Alice',
      'This is a great tool for compressing!',
      'abc123hash',
      4,
    );
  });

  it('throws ValidationError for invalid rating', async () => {
    await expect(submitComment(deps, { ...validInput, rating: 6 }))
      .rejects.toThrow('Rating');
  });
});

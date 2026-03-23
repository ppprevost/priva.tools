import { tools } from '@/lib/tools-config';
import { validationError, captchaError, rateLimitError } from '@/domain/errors';
import { createAuthorName, createCommentContent, createRating } from '@/domain/values';
import type { CommentRepo, CaptchaVerifier, IpHasher } from '@/domain/ports';
import type { CommentSubmitted } from '@/domain/events';

type Deps = {
  commentRepo: Pick<CommentRepo, 'countRecentByIp' | 'insert'>;
  captcha: CaptchaVerifier;
  ipHasher: IpHasher;
};

type SubmitCommentInput = {
  toolSlug: string;
  authorName: string;
  content: string;
  rating?: number | null;
  turnstileToken?: string;
  website?: string;
  ip: string;
  isMobile: boolean;
};

export async function submitComment(deps: Deps, input: SubmitCommentInput): Promise<CommentSubmitted | null> {
  if (input.website) return null;

  if (!input.toolSlug || !tools[input.toolSlug]) {
    throw validationError('Invalid tool.');
  }

  const authorName = createAuthorName(input.authorName);
  const content = createCommentContent(input.content);
  const rating = createRating(input.rating);

  if (!input.isMobile && (!input.turnstileToken || !(await deps.captcha.verify(input.turnstileToken)))) {
    throw captchaError();
  }

  const ipHash = await deps.ipHasher.hash(input.ip);

  const recentCount = await deps.commentRepo.countRecentByIp(ipHash);
  if (recentCount >= 3) {
    throw rateLimitError('Too many comments. Please try again later.');
  }

  await deps.commentRepo.insert(input.toolSlug, authorName, content, ipHash, rating);

  return { type: 'CommentSubmitted', toolSlug: input.toolSlug, authorName };
}

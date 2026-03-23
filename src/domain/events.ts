export type CommentSubmitted = {
  readonly type: 'CommentSubmitted';
  readonly toolSlug: string;
  readonly authorName: string;
};

export type CommentApproved = {
  readonly type: 'CommentApproved';
  readonly commentId: number;
  readonly approved: boolean;
};

export type CommentRemoved = {
  readonly type: 'CommentRemoved';
  readonly commentId: number;
};

export type ContactSubmitted = {
  readonly type: 'ContactSubmitted';
  readonly email: string;
};

export type DomainEvent = CommentSubmitted | CommentApproved | CommentRemoved | ContactSubmitted;

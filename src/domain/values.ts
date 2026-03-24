import { validationError } from './errors';

type Brand<T, B extends string> = T & { readonly __brand: B };

export type AuthorName = Brand<string, 'AuthorName'>;
export type CommentContent = Brand<string, 'CommentContent'>;
export type Rating = Brand<number, 'Rating'>;
export type ContactName = Brand<string, 'ContactName'>;
export type ContactEmail = Brand<string, 'ContactEmail'>;
export type ContactMsg = Brand<string, 'ContactMsg'>;

const AUTHOR_NAME = { min: 3, max: 100 } as const;
const COMMENT_CONTENT = { min: 10, max: 2000 } as const;
const CONTACT_NAME_MAX = 200;
const CONTACT_EMAIL_MAX = 320;
const CONTACT_MSG_MAX = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // eslint-disable-line sonarjs/slow-regex

export function createAuthorName(raw: string): AuthorName {
  const trimmed = raw?.trim() ?? '';
  if (trimmed.length < AUTHOR_NAME.min || trimmed.length > AUTHOR_NAME.max) {
    throw validationError(`Name must be between ${AUTHOR_NAME.min} and ${AUTHOR_NAME.max} characters.`);
  }
  return trimmed as AuthorName;
}

export function createCommentContent(raw: string): CommentContent {
  const trimmed = raw?.trim() ?? '';
  if (trimmed.length < COMMENT_CONTENT.min || trimmed.length > COMMENT_CONTENT.max) {
    throw validationError(`Comment must be between ${COMMENT_CONTENT.min} and ${COMMENT_CONTENT.max} characters.`);
  }
  return trimmed as CommentContent;
}

export function createRating(raw: number | null | undefined): Rating | null {
  if (raw == null) return null;
  if (!Number.isInteger(raw) || raw < 1 || raw > 5) {
    throw validationError('Rating must be an integer between 1 and 5.');
  }
  return raw as Rating;
}

export function createContactName(raw: string): ContactName {
  const trimmed = raw?.trim() ?? '';
  if (!trimmed) throw validationError('Name is required.');
  if (trimmed.length > CONTACT_NAME_MAX) throw validationError('Name is too long.');
  return trimmed as ContactName;
}

export function createContactEmail(raw: string): ContactEmail {
  const trimmed = raw?.trim() ?? '';
  if (!trimmed) throw validationError('Email is required.');
  if (trimmed.length > CONTACT_EMAIL_MAX) throw validationError('Email is too long.');
  if (!EMAIL_REGEX.test(trimmed)) throw validationError('Invalid email address.');
  return trimmed as ContactEmail;
}

export function createContactMsg(raw: string): ContactMsg {
  const trimmed = raw?.trim() ?? '';
  if (!trimmed) throw validationError('Message is required.');
  if (trimmed.length > CONTACT_MSG_MAX) throw validationError('Message is too long.');
  return trimmed as ContactMsg;
}

import { describe, it, expect } from 'vitest';
import {
  createAuthorName, createCommentContent, createRating,
  createContactName, createContactEmail, createContactMsg,
} from './values';

describe('createAuthorName', () => {
  it('returns trimmed name for valid input', () => {
    expect(createAuthorName('  Alice  ')).toBe('Alice');
  });

  it('throws for name too short', () => {
    expect(() => createAuthorName('AB')).toThrow('Name');
  });

  it('throws for name too long', () => {
    expect(() => createAuthorName('A'.repeat(101))).toThrow('Name');
  });

  it('handles null gracefully', () => {
    expect(() => createAuthorName(null as unknown as string)).toThrow('Name');
  });
});

describe('createCommentContent', () => {
  it('returns trimmed content for valid input', () => {
    expect(createCommentContent('  This is great!  ')).toBe('This is great!');
  });

  it('throws for content too short', () => {
    expect(() => createCommentContent('Short')).toThrow('Comment');
  });

  it('throws for content too long', () => {
    expect(() => createCommentContent('X'.repeat(2001))).toThrow('Comment');
  });
});

describe('createRating', () => {
  it('returns null for null or undefined', () => {
    expect(createRating(null)).toBeNull();
    expect(createRating(undefined)).toBeNull();
  });

  it('returns rating for valid input', () => {
    expect(createRating(1)).toBe(1);
    expect(createRating(5)).toBe(5);
  });

  it('throws for rating below 1', () => {
    expect(() => createRating(0)).toThrow('Rating');
  });

  it('throws for rating above 5', () => {
    expect(() => createRating(6)).toThrow('Rating');
  });

  it('throws for non-integer rating', () => {
    expect(() => createRating(3.5)).toThrow('Rating');
  });
});

describe('createContactName', () => {
  it('returns trimmed name', () => {
    expect(createContactName('  Alice  ')).toBe('Alice');
  });

  it('throws for empty name', () => {
    expect(() => createContactName('')).toThrow('required');
  });

  it('throws for name too long', () => {
    expect(() => createContactName('A'.repeat(201))).toThrow('long');
  });
});

describe('createContactEmail', () => {
  it('accepts valid email', () => {
    expect(createContactEmail('test@example.com')).toBe('test@example.com');
  });

  it('accepts email with subdomain and tag', () => {
    expect(createContactEmail('user+tag@sub.domain.org')).toBe('user+tag@sub.domain.org');
  });

  it('throws for empty email', () => {
    expect(() => createContactEmail('')).toThrow('required');
  });

  it('throws for invalid format', () => {
    expect(() => createContactEmail('nope')).toThrow('Invalid email');
    expect(() => createContactEmail('no spaces@test.com')).toThrow('Invalid email');
    expect(() => createContactEmail('@missing.com')).toThrow('Invalid email');
    expect(() => createContactEmail('missing@')).toThrow('Invalid email');
  });

  it('throws for email too long', () => {
    expect(() => createContactEmail('a'.repeat(312) + '@test.com')).toThrow('long');
  });
});

describe('createContactMsg', () => {
  it('returns trimmed message', () => {
    expect(createContactMsg('  Hello!  ')).toBe('Hello!');
  });

  it('throws for empty message', () => {
    expect(() => createContactMsg('')).toThrow('required');
  });

  it('throws for message too long', () => {
    expect(() => createContactMsg('M'.repeat(5001))).toThrow('long');
  });
});

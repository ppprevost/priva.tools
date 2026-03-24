import type { Comment, PublicComment, BlogPost } from './entities';

export type CommentRepo = {
  getApproved: (toolSlug: string) => Promise<PublicComment[]>;
  countRecentByIp: (ipHash: string) => Promise<number>;
  insert: (toolSlug: string, name: string, content: string, ipHash: string, rating?: number | null) => Promise<void>;
  getAll: () => Promise<Omit<Comment, 'ip_hash'>[]>;
  setApproval: (id: number, approved: boolean) => Promise<Omit<Comment, 'ip_hash'> | null>;
  remove: (id: number) => Promise<boolean>;
};

export type BlogRepo = {
  getAll: () => Promise<BlogPost[]>;
  getBySlug: (slug: string) => Promise<BlogPost | null>;
  getByTool: (toolSlug: string) => Promise<BlogPost[]>;
};

export type ContactRepo = {
  insert: (name: string, email: string, message: string) => Promise<void>;
};

export type CaptchaVerifier = {
  verify: (token: string) => Promise<boolean>;
};

export type IpHasher = {
  hash: (ip: string) => Promise<string>;
};

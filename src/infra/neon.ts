import { neon } from '@neondatabase/serverless';
import type { NeonQueryFunction } from '@neondatabase/serverless';

let _sql: NeonQueryFunction<false, false> | undefined;

export const sql: NeonQueryFunction<false, false> = new Proxy(
  (() => {}) as unknown as NeonQueryFunction<false, false>,
  {
    apply: (_t, thisArg, args) => {
      if (!_sql) {
        const url = process.env.DATABASE_URL;
        if (!url) throw new Error('DATABASE_URL is not set');
        _sql = neon(url);
      }
      return Reflect.apply(_sql, thisArg, args);
    },
    get: (_t, prop) => {
      if (!_sql) {
        const url = process.env.DATABASE_URL;
        if (!url) throw new Error('DATABASE_URL is not set');
        _sql = neon(url);
      }
      return Reflect.get(_sql, prop);
    },
  }
);

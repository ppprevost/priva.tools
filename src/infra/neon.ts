import { neon } from '@neondatabase/serverless';
import type { NeonQueryFunction } from '@neondatabase/serverless';

let _sql: NeonQueryFunction<false, false> | undefined;

export const sql: NeonQueryFunction<false, false> = new Proxy(
  (() => {}) as unknown as NeonQueryFunction<false, false>,
  {
    apply: (_t, thisArg, args) => {
      _sql ??= neon(process.env.DATABASE_URL!);
      return Reflect.apply(_sql, thisArg, args);
    },
    get: (_t, prop) => {
      _sql ??= neon(process.env.DATABASE_URL!);
      return Reflect.get(_sql, prop);
    },
  }
);

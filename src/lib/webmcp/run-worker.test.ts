import { describe, it, expect, vi } from 'vitest';
import { b64ToBuffer, bufferToB64, runWorker } from './run-worker';

const makeWorkerFactory = (behavior: 'result' | 'error' | 'onerror', payload?: ArrayBuffer) => () => {
  const worker = {
    onmessage: null as ((e: MessageEvent) => void) | null,
    onerror: null as ((e: ErrorEvent) => void) | null,
    terminate: vi.fn(),
    postMessage() {
      setTimeout(() => {
        if (behavior === 'result') {
          worker.onmessage?.({ data: { type: 'result', result: payload ?? new ArrayBuffer(4), filename: 'out.pdf' } } as MessageEvent);
        } else if (behavior === 'error') {
          worker.onmessage?.({ data: { type: 'error', error: 'Processing failed' } } as MessageEvent);
        } else {
          worker.onerror?.(new ErrorEvent('error', { message: 'Worker crashed' }));
        }
      }, 0);
    },
  };
  return worker as unknown as Worker;
};

describe('runWorker', () => {
  it('resolves with result and filename', async () => {
    const buf = new ArrayBuffer(4);
    const result = await runWorker(makeWorkerFactory('result', buf), {});
    expect(result.result).toBe(buf);
    expect(result.filename).toBe('out.pdf');
  });

  it('uses "output" as default filename when none provided', async () => {
    const factory = () => {
      const worker = {
        onmessage: null as ((e: MessageEvent) => void) | null,
        onerror: null,
        terminate: vi.fn(),
        postMessage() {
          setTimeout(() => {
            worker.onmessage?.({ data: { type: 'result', result: new ArrayBuffer(4) } } as MessageEvent);
          }, 0);
        },
      };
      return worker as unknown as Worker;
    };
    const result = await runWorker(factory, {});
    expect(result.filename).toBe('output');
  });

  it('rejects on error message', async () => {
    await expect(runWorker(makeWorkerFactory('error'), {})).rejects.toThrow('Processing failed');
  });

  it('rejects on worker onerror', async () => {
    await expect(runWorker(makeWorkerFactory('onerror'), {})).rejects.toBeDefined();
  });
});

describe('b64ToBuffer / bufferToB64', () => {
  it('round-trips arbitrary bytes', () => {
    const original = new Uint8Array([0, 1, 127, 128, 255]);
    const b64 = bufferToB64(original.buffer);
    const restored = new Uint8Array(b64ToBuffer(b64));
    expect(Array.from(restored)).toEqual(Array.from(original));
  });

  it('round-trips a UTF-8 string', () => {
    const str = 'Hello WebMCP';
    const encoder = new TextEncoder();
    const buf = encoder.encode(str).buffer;
    const b64 = bufferToB64(buf);
    const restored = new TextDecoder().decode(b64ToBuffer(b64));
    expect(restored).toBe(str);
  });

  it('bufferToB64 returns a valid base64 string', () => {
    const buf = new Uint8Array([72, 101, 108, 108, 111]).buffer;
    const b64 = bufferToB64(buf);
    expect(b64).toBe('SGVsbG8=');
  });

  it('b64ToBuffer accepts URL-safe base64 (- and _)', () => {
    const original = new Uint8Array([0xfb, 0xff, 0xfe]);
    const standard = bufferToB64(original.buffer);
    const urlSafe = standard.replace(/\+/g, '-').replace(/\//g, '_');
    const restored = new Uint8Array(b64ToBuffer(urlSafe));
    expect(Array.from(restored)).toEqual(Array.from(original));
  });

  it('b64ToBuffer ignores whitespace', () => {
    const original = new Uint8Array([1, 2, 3, 4, 5, 6]);
    const b64 = bufferToB64(original.buffer);
    const withSpaces = b64.slice(0, 4) + '\n' + b64.slice(4);
    const restored = new Uint8Array(b64ToBuffer(withSpaces));
    expect(Array.from(restored)).toEqual(Array.from(original));
  });
});

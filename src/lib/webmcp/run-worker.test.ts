import { describe, it, expect } from 'vitest';
import { b64ToBuffer, bufferToB64 } from './run-worker';

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
    expect(b64).toBe(btoa('Hello'));
  });
});

type WorkerFactory = () => Worker;

type WorkerMessage =
  | { type: 'result'; result: ArrayBuffer | string | Array<{ filename: string; data: ArrayBuffer }>; filename?: string }
  | { type: 'error'; error: string }
  | { type: 'progress'; progress: number };

export type WorkerResult = { result: ArrayBuffer | string | Array<{ filename: string; data: ArrayBuffer }>; filename: string };

export const runWorker = (factory: WorkerFactory, message: object, transferable: Transferable[] = []): Promise<WorkerResult> =>
  new Promise((resolve, reject) => {
    const worker = factory();
    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
      if (e.data.type === 'result') {
        resolve({ result: e.data.result, filename: e.data.filename ?? 'output' });
        worker.terminate();
      } else if (e.data.type === 'error') {
        reject(new Error(e.data.error));
        worker.terminate();
      }
    };
    worker.onerror = (err) => { reject(err); worker.terminate(); };
    worker.postMessage(message, transferable);
  });

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const B64_IDX = Object.fromEntries([...B64].map((c, i) => [c, i]));

const countPadding = (b64: string): number => {
  if (b64.endsWith('==')) return 2;
  if (b64.endsWith('=')) return 1;
  return 0;
};

export const b64ToBuffer = (b64: string): ArrayBuffer => {
  const norm = b64.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
  const pad = countPadding(norm);
  const s = norm.slice(0, norm.length - pad);
  const out = new Uint8Array(Math.floor(s.length * 3 / 4));
  let j = 0;
  for (let i = 0; i < s.length; i += 4) {
    const a = B64_IDX[s[i]] ?? 0, b = B64_IDX[s[i + 1]] ?? 0;
    const c = B64_IDX[s[i + 2]] ?? 0, d = B64_IDX[s[i + 3]] ?? 0;
    out[j++] = (a << 2) | (b >> 4);
    if (i + 2 < s.length) out[j++] = ((b & 0xf) << 4) | (c >> 2);
    if (i + 3 < s.length) out[j++] = ((c & 0x3) << 6) | d;
  }
  return out.buffer;
};

export const bufferToB64 = (buf: ArrayBuffer): string => {
  const bytes = new Uint8Array(buf);
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i], b = i + 1 < bytes.length ? bytes[i + 1] : 0, c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += B64[a >> 2] + B64[((a & 3) << 4) | (b >> 4)];
    out += i + 1 < bytes.length ? B64[((b & 0xf) << 2) | (c >> 6)] : '=';
    out += i + 2 < bytes.length ? B64[c & 0x3f] : '=';
  }
  return out;
};

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

export const b64ToBuffer = (b64: string): ArrayBuffer => {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
};

export const bufferToB64 = (buf: ArrayBuffer): string => {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};

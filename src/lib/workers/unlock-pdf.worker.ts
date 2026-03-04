import { unlockPdf } from '../pdf/unlock';

self.onmessage = async (e: MessageEvent) => {
  try {
    const { data, options, filename } = e.data;
    const result = await unlockPdf(data, {
      password: options.password,
    }, (progress) => {
      self.postMessage({ type: 'progress', progress });
    });
    self.postMessage(
      { type: 'result', result: result.buffer, filename: (filename ?? 'unlocked.pdf').replace(/\.pdf$/i, '_unlocked.pdf') },
      [result.buffer],
    );
  } catch (err) {
    self.postMessage({ type: 'error', error: (err as Error).message });
  }
};

import { protectPdf } from '../pdf/protect';

self.onmessage = async (e: MessageEvent) => {
  try {
    const { data, options, filename } = e.data;
    const result = await protectPdf(data, {
      userPassword: options.userPassword,
      ownerPassword: options.ownerPassword,
      allowPrint: options.allowPrint,
      allowModify: options.allowModify,
      allowExtract: options.allowExtract,
    }, (progress) => {
      self.postMessage({ type: 'progress', progress });
    });
    self.postMessage(
      { type: 'result', result: result.buffer, filename: (filename ?? 'protected.pdf').replace(/\.pdf$/i, '_protected.pdf') },
      { transfer: [result.buffer] },
    );
  } catch (err) {
    self.postMessage({ type: 'error', error: (err as Error).message });
  }
};

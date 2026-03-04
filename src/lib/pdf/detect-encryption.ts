import { PDFDocument } from 'pdf-lib';

export type EncryptionStatus = { isEncrypted: boolean; error?: string };

export async function detectEncryption(data: ArrayBuffer): Promise<EncryptionStatus> {
  try {
    await PDFDocument.load(data);
    return { isEncrypted: false };
  } catch (err) {
    const msg = (err as Error).message ?? '';
    if (msg.includes('encrypted') || msg.includes('password')) {
      return { isEncrypted: true };
    }
    return { isEncrypted: false, error: msg };
  }
}

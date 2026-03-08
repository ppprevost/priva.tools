import { z } from 'zod';
import { runWorker, b64ToBuffer, bufferToB64 } from './run-worker';

type Tool = {
  name: string;
  description: string;
  inputSchema: Record<string, z.ZodTypeAny>;
  handler: (input: Record<string, unknown>) => Promise<unknown>;
};

const fileB64 = z.string().describe('Base64-encoded file content');
const filename = z.string().optional().describe('Original filename');

const singleFileResult = async (
  factory: () => Worker,
  msg: object,
  transfer: Transferable[],
) => {
  const { result, filename: outName } = await runWorker(factory, msg, transfer);
  return { filename: outName, data: bufferToB64(result as ArrayBuffer) };
};

export const tools: Tool[] = [
  {
    name: 'compress_pdf',
    description: 'Reduce PDF file size. Returns a base64-encoded compressed PDF.',
    inputSchema: {
      file: fileB64,
      filename,
      stripMetadata: z.boolean().optional().default(true).describe('Strip metadata (default: true)'),
    },
    handler: async ({ file, filename: name, stripMetadata }) => {
      const buf = b64ToBuffer(file as string);
      return singleFileResult(
        () => new Worker(new URL('../workers/compress-pdf.worker.ts', import.meta.url), { type: 'module' }),
        { data: buf, options: { stripMetadata }, filename: name },
        [buf],
      );
    },
  },
  {
    name: 'merge_pdf',
    description: 'Merge multiple PDFs into one. Returns a base64-encoded merged PDF.',
    inputSchema: {
      files: z.array(fileB64).min(2).describe('Array of base64-encoded PDFs to merge'),
    },
    handler: async ({ files }) => {
      const buffers = (files as string[]).map(b64ToBuffer);
      return singleFileResult(
        () => new Worker(new URL('../workers/merge-pdf.worker.ts', import.meta.url), { type: 'module' }),
        { options: { files: buffers } },
        buffers,
      );
    },
  },
  {
    name: 'split_pdf',
    description: 'Split a PDF into separate files by page ranges (e.g. "1-3,5,7-9").',
    inputSchema: {
      file: fileB64,
      filename,
      pageRanges: z.string().optional().describe('Page ranges e.g. "1-3,5,7-9". Empty = one file per page.'),
    },
    handler: async ({ file, filename: name, pageRanges }) => {
      const buf = b64ToBuffer(file as string);
      const { result } = await runWorker(
        () => new Worker(new URL('../workers/split-pdf.worker.ts', import.meta.url), { type: 'module' }),
        { data: buf, options: { pageRanges }, filename: name },
        [buf],
      );
      return (result as Array<{ filename: string; data: ArrayBuffer }>).map((r) => ({
        filename: r.filename,
        data: bufferToB64(r.data),
      }));
    },
  },
  {
    name: 'jpg_to_pdf',
    description: 'Convert images (JPG, PNG, WebP) to a PDF document.',
    inputSchema: {
      files: z.array(fileB64).min(1).describe('Array of base64-encoded images'),
      filenames: z.array(z.string()).describe('Corresponding filenames (used to detect mime type)'),
    },
    handler: async ({ files, filenames }) => {
      const buffers = (files as string[]).map(b64ToBuffer);
      return singleFileResult(
        () => new Worker(new URL('../workers/jpg-to-pdf.worker.ts', import.meta.url), { type: 'module' }),
        { options: { files: buffers, names: filenames } },
        buffers,
      );
    },
  },
  {
    name: 'protect_pdf',
    description: 'Password-protect a PDF with AES-256 encryption.',
    inputSchema: {
      file: fileB64,
      filename,
      userPassword: z.string().describe('Password required to open the PDF'),
      ownerPassword: z.string().optional().describe('Owner password (for permissions)'),
      allowPrint: z.boolean().optional().default(true),
      allowModify: z.boolean().optional().default(false),
      allowExtract: z.boolean().optional().default(false),
    },
    handler: async ({ file, filename: name, ...options }) => {
      const buf = b64ToBuffer(file as string);
      return singleFileResult(
        () => new Worker(new URL('../workers/protect-pdf.worker.ts', import.meta.url), { type: 'module' }),
        { data: buf, options, filename: name },
        [buf],
      );
    },
  },
  {
    name: 'unlock_pdf',
    description: 'Remove password protection from an encrypted PDF.',
    inputSchema: {
      file: fileB64,
      filename,
      password: z.string().describe('Password to unlock the PDF'),
    },
    handler: async ({ file, filename: name, password }) => {
      const buf = b64ToBuffer(file as string);
      return singleFileResult(
        () => new Worker(new URL('../workers/unlock-pdf.worker.ts', import.meta.url), { type: 'module' }),
        { data: buf, options: { password }, filename: name },
        [buf],
      );
    },
  },
  {
    name: 'sign_pdf',
    description: 'Embed a signature image into a PDF at given coordinates.',
    inputSchema: {
      file: fileB64,
      filename,
      placements: z.array(z.object({
        page: z.number().describe('0-indexed page number'),
        x: z.number().describe('X coordinate in PDF points'),
        y: z.number().describe('Y coordinate in PDF points'),
        width: z.number().describe('Width in PDF points'),
        height: z.number().describe('Height in PDF points'),
        imageData: z.string().describe('Base64-encoded PNG/JPEG signature image'),
      })).min(1).describe('Signature placements'),
    },
    handler: async ({ file, filename: name, placements }) => {
      const buf = b64ToBuffer(file as string);
      return singleFileResult(
        () => new Worker(new URL('../workers/sign-pdf.worker.ts', import.meta.url), { type: 'module' }),
        { data: buf, options: { placements }, filename: name },
        [buf],
      );
    },
  },
  {
    name: 'get_form_fields',
    description: 'List all AcroForm fields in a PDF (name, type, current value).',
    inputSchema: {
      file: fileB64,
    },
    handler: async ({ file }) => {
      const buf = b64ToBuffer(file as string);
      const { result } = await runWorker(
        () => new Worker(new URL('../workers/edit-pdf.worker.ts', import.meta.url), { type: 'module' }),
        { action: 'get_form_fields', data: buf },
        [buf],
      );
      return JSON.parse(result as string);
    },
  },
  {
    name: 'edit_pdf',
    description: 'Apply edits to a PDF: add text, highlight, fill forms, overlay text. Returns base64-encoded result.',
    inputSchema: {
      file: fileB64,
      filename,
      ops: z.array(z.record(z.unknown())).describe('Array of edit operations (see @ppprevost/pdf-wasm for schema)'),
    },
    handler: async ({ file, filename: name, ops }) => {
      const buf = b64ToBuffer(file as string);
      return singleFileResult(
        () => new Worker(new URL('../workers/edit-pdf.worker.ts', import.meta.url), { type: 'module' }),
        { action: 'apply_edits', data: buf, options: { editsJson: JSON.stringify(ops) }, filename: name },
        [buf],
      );
    },
  },
  {
    name: 'compress_image',
    description: 'Reduce image file size (JPG/PNG/WebP). Returns base64-encoded compressed image.',
    inputSchema: {
      file: fileB64,
      filename,
      quality: z.number().min(0).max(1).optional().default(0.8).describe('Quality 0-1 (default 0.8)'),
      type: z.enum(['image/jpeg', 'image/png', 'image/webp']).optional().default('image/jpeg'),
    },
    handler: async ({ file, filename: name, quality, type }) => {
      const buf = b64ToBuffer(file as string);
      return singleFileResult(
        () => new Worker(new URL('../workers/compress-image.worker.ts', import.meta.url), { type: 'module' }),
        { data: buf, options: { quality, type }, filename: name },
        [buf],
      );
    },
  },
  {
    name: 'resize_image',
    description: 'Resize an image to specified dimensions.',
    inputSchema: {
      file: fileB64,
      filename,
      width: z.number().positive().describe('Target width in pixels'),
      height: z.number().positive().describe('Target height in pixels'),
      maintainAspectRatio: z.boolean().optional().default(true),
      type: z.enum(['image/jpeg', 'image/png', 'image/webp']).optional().default('image/jpeg'),
    },
    handler: async ({ file, filename: name, width, height, maintainAspectRatio, type }) => {
      const buf = b64ToBuffer(file as string);
      return singleFileResult(
        () => new Worker(new URL('../workers/resize-image.worker.ts', import.meta.url), { type: 'module' }),
        { data: buf, options: { width, height, maintainAspectRatio, type }, filename: name },
        [buf],
      );
    },
  },
  {
    name: 'convert_to_jpg',
    description: 'Convert an image (PNG, WebP, HEIC, BMP, GIF) to JPG format.',
    inputSchema: {
      file: fileB64,
      filename,
      quality: z.number().min(0).max(1).optional().default(0.92),
      type: z.string().optional().default('image/png').describe('Source mime type'),
    },
    handler: async ({ file, filename: name, quality, type }) => {
      const buf = b64ToBuffer(file as string);
      return singleFileResult(
        () => new Worker(new URL('../workers/convert-to-jpg.worker.ts', import.meta.url), { type: 'module' }),
        { data: buf, options: { quality, type }, filename: name },
        [buf],
      );
    },
  },
  {
    name: 'crop_image',
    description: 'Crop an image to given coordinates and dimensions.',
    inputSchema: {
      file: fileB64,
      filename,
      x: z.number().min(0).describe('Left offset in pixels'),
      y: z.number().min(0).describe('Top offset in pixels'),
      width: z.number().positive().describe('Crop width in pixels'),
      height: z.number().positive().describe('Crop height in pixels'),
      type: z.enum(['image/jpeg', 'image/png', 'image/webp']).optional().default('image/jpeg'),
    },
    handler: async ({ file, filename: name, x, y, width, height, type }) => {
      const buf = b64ToBuffer(file as string);
      return singleFileResult(
        () => new Worker(new URL('../workers/crop-image.worker.ts', import.meta.url), { type: 'module' }),
        { data: buf, options: { x, y, width, height, type }, filename: name },
        [buf],
      );
    },
  },
  {
    name: 'remove_background',
    description: 'Remove the background from an image using AI. Returns a base64-encoded PNG with transparent background.',
    inputSchema: {
      file: fileB64,
      filename,
    },
    handler: async ({ file, filename: name }) => {
      const { removeBackground } = await import('@imgly/background-removal');
      const buf = b64ToBuffer(file as string);
      const blob = new Blob([buf]);
      const result = await removeBackground(blob);
      const out = await result.arrayBuffer();
      const outName = ((name as string | undefined) ?? 'image.png').replace(/\.[^.]+$/, '_nobg.png');
      return { filename: outName, data: bufferToB64(out) };
    },
  },
];

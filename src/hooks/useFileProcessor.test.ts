import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileProcessor } from './useFileProcessor';
import type { WorkerMessage } from './useWorker';

type MockWorker = {
  postMessage: ReturnType<typeof vi.fn>;
  terminate: ReturnType<typeof vi.fn>;
  onmessage: ((e: MessageEvent<WorkerMessage>) => void) | null;
  onerror: ((e: ErrorEvent) => void) | null;
};

const makeMockWorker = (): MockWorker => ({
  postMessage: vi.fn(),
  terminate: vi.fn(),
  onmessage: null,
  onerror: null,
});

const makeFile = (name: string, content = 'data') =>
  new File([content], name, { type: 'application/pdf' });

const sendMessage = (mock: MockWorker, msg: WorkerMessage) => {
  act(() => {
    mock.onmessage?.({ data: msg } as MessageEvent<WorkerMessage>);
  });
};

describe('useFileProcessor', () => {
  let mockWorker: MockWorker;
  let createWorker: () => Worker;

  beforeEach(() => {
    mockWorker = makeMockWorker();
    createWorker = vi.fn(() => mockWorker as unknown as Worker) as unknown as () => Worker;
  });

  it('has correct initial state', () => {
    const { result } = renderHook(() => useFileProcessor({ createWorker }));

    expect(result.current.files).toEqual([]);
    expect(result.current.progress).toBe(0);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.resultBlob).toBeNull();
    expect(result.current.resultFilename).toBe('output');
  });

  it('addFiles appends files to the list', () => {
    const { result } = renderHook(() => useFileProcessor({ createWorker }));
    const file = makeFile('a.pdf');

    act(() => {
      result.current.addFiles([file]);
    });

    expect(result.current.files).toHaveLength(1);
    expect(result.current.files[0].name).toBe('a.pdf');
  });

  it('addFiles appends without replacing existing files', () => {
    const { result } = renderHook(() => useFileProcessor({ createWorker }));

    act(() => {
      result.current.addFiles([makeFile('a.pdf')]);
    });

    act(() => {
      result.current.addFiles([makeFile('b.pdf')]);
    });

    expect(result.current.files).toHaveLength(2);
  });

  it('removeFile removes the file at the given index', () => {
    const { result } = renderHook(() => useFileProcessor({ createWorker }));

    act(() => {
      result.current.addFiles([makeFile('a.pdf'), makeFile('b.pdf'), makeFile('c.pdf')]);
    });

    act(() => {
      result.current.removeFile(1);
    });

    expect(result.current.files).toHaveLength(2);
    expect(result.current.files.map((f) => f.name)).toEqual(['a.pdf', 'c.pdf']);
  });

  it('clearFiles empties the list', () => {
    const { result } = renderHook(() => useFileProcessor({ createWorker }));

    act(() => {
      result.current.addFiles([makeFile('a.pdf'), makeFile('b.pdf')]);
    });

    act(() => {
      result.current.clearFiles();
    });

    expect(result.current.files).toHaveLength(0);
  });

  it('processFiles does nothing when no files are added', async () => {
    const { result } = renderHook(() => useFileProcessor({ createWorker }));

    await act(async () => {
      await result.current.processFiles();
    });

    expect(createWorker).not.toHaveBeenCalled();
  });

  it('processFiles with a single file calls worker.process with its buffer', async () => {
    const { result } = renderHook(() => useFileProcessor({ createWorker }));
    const file = makeFile('single.pdf', 'pdf-content');

    act(() => {
      result.current.addFiles([file]);
    });

    await act(async () => {
      await result.current.processFiles({ quality: 90 });
    });

    expect(createWorker).toHaveBeenCalledTimes(1);
    expect(mockWorker.postMessage).toHaveBeenCalledTimes(1);

    const [payload] = mockWorker.postMessage.mock.calls[0] as [
      { data: ArrayBuffer; options: Record<string, unknown>; filename: string },
      ArrayBuffer[],
    ];
    expect(payload.filename).toBe('single.pdf');
    expect(payload.options).toEqual({ quality: 90 });
    expect(payload.data.byteLength).toBe(new TextEncoder().encode('pdf-content').byteLength);
  });

  it('processFiles with multiple files passes combined ArrayBuffer and file metadata', async () => {
    const { result } = renderHook(() => useFileProcessor({ createWorker }));

    act(() => {
      result.current.addFiles([makeFile('a.pdf'), makeFile('b.pdf')]);
    });

    await act(async () => {
      await result.current.processFiles();
    });

    expect(createWorker).toHaveBeenCalledTimes(1);

    const [payload] = mockWorker.postMessage.mock.calls[0] as [
      { options: { files: ArrayBuffer[]; names: string[] }; filename: string },
      ArrayBuffer[],
    ];
    expect(payload.filename).toBe('a.pdf');
    expect(payload.options.names).toEqual(['a.pdf', 'b.pdf']);
    expect(payload.options.files).toHaveLength(2);
  });

  it('exposes resultBlob and resultFilename when processing succeeds', async () => {
    const { result } = renderHook(() => useFileProcessor({ createWorker }));
    const output = new ArrayBuffer(16);

    act(() => {
      result.current.addFiles([makeFile('doc.pdf')]);
    });

    await act(async () => {
      await result.current.processFiles();
    });

    sendMessage(mockWorker, { type: 'result', result: output, filename: 'doc-out.pdf' });

    expect(result.current.resultBlob).toBeInstanceOf(Blob);
    expect(result.current.resultFilename).toBe('doc-out.pdf');
  });

  it('exposes error when worker emits error message', async () => {
    const { result } = renderHook(() => useFileProcessor({ createWorker }));

    act(() => {
      result.current.addFiles([makeFile('bad.pdf')]);
    });

    await act(async () => {
      await result.current.processFiles();
    });

    sendMessage(mockWorker, { type: 'error', error: 'Corrupt file' });

    expect(result.current.error).toBe('Corrupt file');
    expect(result.current.isProcessing).toBe(false);
  });

  it('reset clears files and worker state', async () => {
    const { result } = renderHook(() => useFileProcessor({ createWorker }));

    act(() => {
      result.current.addFiles([makeFile('a.pdf')]);
    });

    await act(async () => {
      await result.current.processFiles();
    });

    sendMessage(mockWorker, { type: 'progress', progress: 50 });

    act(() => {
      result.current.reset();
    });

    expect(result.current.files).toHaveLength(0);
    expect(result.current.progress).toBe(0);
    expect(result.current.isProcessing).toBe(false);
  });
});

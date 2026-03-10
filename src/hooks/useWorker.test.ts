import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWorker } from './useWorker';
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

const makeCreateWorker = (mock: MockWorker): (() => Worker) =>
  vi.fn(() => mock as unknown as Worker) as unknown as () => Worker;

const sendMessage = (mock: MockWorker, msg: WorkerMessage) => {
  act(() => {
    mock.onmessage?.({ data: msg } as MessageEvent<WorkerMessage>);
  });
};

describe('useWorker', () => {
  let mockWorker: MockWorker;
  let createWorker: () => Worker;

  beforeEach(() => {
    mockWorker = makeMockWorker();
    createWorker = makeCreateWorker(mockWorker);
  });

  it('has correct initial state', () => {
    const { result } = renderHook(() => useWorker({ createWorker }));

    expect(result.current.progress).toBe(0);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
  });

  it('sets isProcessing to true when process is called', () => {
    const { result } = renderHook(() => useWorker({ createWorker }));
    const buffer = new ArrayBuffer(4);

    act(() => {
      result.current.process(buffer);
    });

    expect(result.current.isProcessing).toBe(true);
    expect(createWorker).toHaveBeenCalledTimes(1);
    expect(mockWorker.postMessage).toHaveBeenCalledTimes(1);
  });

  it('posts the buffer with transfer', () => {
    const { result } = renderHook(() => useWorker({ createWorker }));
    const buffer = new ArrayBuffer(4);

    act(() => {
      result.current.process(buffer, { quality: 80 }, 'file.pdf');
    });

    expect(mockWorker.postMessage).toHaveBeenCalledWith(
      { data: buffer, options: { quality: 80 }, filename: 'file.pdf' },
      { transfer: [buffer] }
    );
  });

  it('updates progress on progress messages', () => {
    const { result } = renderHook(() => useWorker({ createWorker }));

    act(() => {
      result.current.process(new ArrayBuffer(4));
    });

    sendMessage(mockWorker, { type: 'progress', progress: 42 });

    expect(result.current.progress).toBe(42);
    expect(result.current.isProcessing).toBe(true);
  });

  it('sets result and stops processing on result message', () => {
    const { result } = renderHook(() => useWorker({ createWorker }));
    const output = new ArrayBuffer(8);

    act(() => {
      result.current.process(new ArrayBuffer(4), {}, 'out.pdf');
    });

    sendMessage(mockWorker, { type: 'result', result: output, filename: 'out.pdf' });

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.progress).toBe(100);
    expect(result.current.result).toEqual({ data: output, filename: 'out.pdf' });
    expect(mockWorker.terminate).toHaveBeenCalledTimes(1);
  });

  it('uses fallback filename when result message has none', () => {
    const { result } = renderHook(() => useWorker({ createWorker }));

    act(() => {
      result.current.process(new ArrayBuffer(4), {}, 'fallback.pdf');
    });

    sendMessage(mockWorker, { type: 'result', result: new ArrayBuffer(0) });

    expect(result.current.result?.filename).toBe('fallback.pdf');
  });

  it('sets error and stops processing on error message', () => {
    const { result } = renderHook(() => useWorker({ createWorker }));

    act(() => {
      result.current.process(new ArrayBuffer(4));
    });

    sendMessage(mockWorker, { type: 'error', error: 'Something went wrong' });

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBe('Something went wrong');
    expect(mockWorker.terminate).toHaveBeenCalledTimes(1);
  });

  it('uses "Unknown error" fallback when error message has no text', () => {
    const { result } = renderHook(() => useWorker({ createWorker }));

    act(() => {
      result.current.process(new ArrayBuffer(4));
    });

    sendMessage(mockWorker, { type: 'error' });

    expect(result.current.error).toBe('Unknown error');
  });

  it('sets error on worker onerror event', () => {
    const { result } = renderHook(() => useWorker({ createWorker }));

    act(() => {
      result.current.process(new ArrayBuffer(4));
    });

    act(() => {
      mockWorker.onerror?.({ message: 'Worker crashed' } as ErrorEvent);
    });

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBe('Worker crashed');
    expect(mockWorker.terminate).toHaveBeenCalledTimes(1);
  });

  it('reset clears all state', () => {
    const { result } = renderHook(() => useWorker({ createWorker }));

    act(() => {
      result.current.process(new ArrayBuffer(4));
    });

    sendMessage(mockWorker, { type: 'progress', progress: 60 });

    act(() => {
      result.current.reset();
    });

    expect(result.current.progress).toBe(0);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
  });

  it('terminates the worker on unmount', () => {
    const { result, unmount } = renderHook(() => useWorker({ createWorker }));

    act(() => {
      result.current.process(new ArrayBuffer(4));
    });

    unmount();

    expect(mockWorker.terminate).toHaveBeenCalled();
  });

  it('resets state before starting a new process call', () => {
    const secondWorker = makeMockWorker();
    let callCount = 0;
    const multiCreateWorker = vi.fn(() => {
      callCount++;
      return (callCount === 1 ? mockWorker : secondWorker) as unknown as Worker;
    }) as unknown as () => Worker;

    const { result } = renderHook(() => useWorker({ createWorker: multiCreateWorker }));

    act(() => {
      result.current.process(new ArrayBuffer(4));
    });

    sendMessage(mockWorker, { type: 'progress', progress: 75 });

    act(() => {
      result.current.process(new ArrayBuffer(4));
    });

    expect(result.current.progress).toBe(0);
    expect(result.current.isProcessing).toBe(true);
  });
});

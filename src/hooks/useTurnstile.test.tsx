import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { useTurnstile } from './useTurnstile';

type TurnstileWindow = {
  turnstile?: {
    render: (el: HTMLElement, opts: Record<string, unknown>) => string;
    reset: (id: string) => void;
  };
};

const makeTurnstile = () => ({
  render: vi.fn(() => 'widget-id-123'),
  reset: vi.fn(),
});

type HookResult = ReturnType<typeof useTurnstile>;
type TestComponentProps = { siteKey: string; onMount: (hook: HookResult) => void };

const TestComponent = ({ siteKey, onMount }: TestComponentProps) => {
  const hook = useTurnstile(siteKey);
  onMount(hook);
  return <div ref={hook.containerRef} data-testid="turnstile-container" />;
};

const renderTurnstile = (siteKey: string) => {
  let hookResult: HookResult | null = null;
  const utils = render(
    <TestComponent siteKey={siteKey} onMount={(h) => { hookResult = h; }} />
  );
  return { utils, getHook: () => hookResult as HookResult };
};

describe('useTurnstile', () => {
  beforeEach(() => {
    delete (window as TurnstileWindow).turnstile;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the widget immediately when turnstile is already available', () => {
    const turnstile = makeTurnstile();
    (window as TurnstileWindow).turnstile = turnstile;

    const { getHook } = renderTurnstile('site-key-abc');

    expect(turnstile.render).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      { sitekey: 'site-key-abc', theme: 'light' }
    );
    expect(getHook()).not.toBeNull();
  });

  it('does not render the widget twice on repeated effects', () => {
    const turnstile = makeTurnstile();
    (window as TurnstileWindow).turnstile = turnstile;

    renderTurnstile('site-key-abc');

    expect(turnstile.render).toHaveBeenCalledTimes(1);
  });

  it('polls until turnstile is available then renders', () => {
    const turnstile = makeTurnstile();
    renderTurnstile('site-key-poll');

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(turnstile.render).not.toHaveBeenCalled();

    act(() => {
      (window as TurnstileWindow).turnstile = turnstile;
      vi.advanceTimersByTime(200);
    });

    expect(turnstile.render).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      { sitekey: 'site-key-poll', theme: 'light' }
    );
  });

  it('clears the polling interval on unmount before turnstile is available', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const { utils } = renderTurnstile('site-key-unmount');

    utils.unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('getToken returns null when no input is present in the container', () => {
    renderTurnstile('site-key-abc');
    const { getHook } = renderTurnstile('site-key-abc');

    expect(getHook().getToken()).toBeNull();
  });

  it('getToken returns the token from the hidden input', () => {
    const turnstile = makeTurnstile();
    (window as TurnstileWindow).turnstile = turnstile;

    const { utils, getHook } = renderTurnstile('site-key-abc');
    const container = utils.getByTestId('turnstile-container');

    const input = document.createElement('input');
    input.setAttribute('name', 'cf-turnstile-response');
    input.value = 'token-xyz';
    container.appendChild(input);

    expect(getHook().getToken()).toBe('token-xyz');
  });

  it('getToken returns null when the input value is empty string', () => {
    const turnstile = makeTurnstile();
    (window as TurnstileWindow).turnstile = turnstile;

    const { utils, getHook } = renderTurnstile('site-key-abc');
    const container = utils.getByTestId('turnstile-container');

    const input = document.createElement('input');
    input.setAttribute('name', 'cf-turnstile-response');
    input.value = '';
    container.appendChild(input);

    expect(getHook().getToken()).toBeNull();
  });

  it('reset calls turnstile.reset with the widget id after render', () => {
    const turnstile = makeTurnstile();
    (window as TurnstileWindow).turnstile = turnstile;

    const { getHook } = renderTurnstile('site-key-abc');

    getHook().reset();

    expect(turnstile.reset).toHaveBeenCalledWith('widget-id-123');
  });

  it('reset does nothing when turnstile is not available on window', () => {
    const { getHook } = renderTurnstile('site-key-abc');

    expect(() => getHook().reset()).not.toThrow();
  });

  it('reset does nothing when widget was never rendered (no containerRef)', () => {
    const turnstile = makeTurnstile();
    (window as TurnstileWindow).turnstile = turnstile;

    let hookResult: HookResult | null = null;
    render(
      <TestComponent siteKey="site-key-abc" onMount={(h) => { hookResult = h; }} />
    );

    turnstile.render.mockReturnValue('never-called');
    turnstile.reset.mockClear();
    hookResult!.reset();

    expect(turnstile.reset).not.toHaveBeenCalledWith('never-called');
  });
});

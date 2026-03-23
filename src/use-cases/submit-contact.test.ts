import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitContact } from './submit-contact';

const createDeps = () => ({
  contactRepo: { insert: vi.fn() },
  captcha: { verify: vi.fn().mockResolvedValue(true) },
});

const validInput = {
  name: 'Alice',
  email: 'alice@test.com',
  message: 'Hello, I have a question.',
  turnstileToken: 'valid-token',
};

describe('submitContact', () => {
  let deps: ReturnType<typeof createDeps>;

  beforeEach(() => {
    deps = createDeps();
  });

  it('throws CaptchaError when turnstile fails', async () => {
    deps.captcha.verify.mockResolvedValue(false);
    await expect(submitContact(deps, validInput))
      .rejects.toThrow('Captcha verification failed.');
  });

  it('throws CaptchaError when no token', async () => {
    await expect(submitContact(deps, { ...validInput, turnstileToken: undefined }))
      .rejects.toThrow('Captcha verification failed.');
  });

  it('throws ValidationError for empty name', async () => {
    await expect(submitContact(deps, { ...validInput, name: '' }))
      .rejects.toThrow('Name is required.');
  });

  it('throws ValidationError for invalid email', async () => {
    await expect(submitContact(deps, { ...validInput, email: 'not-email' }))
      .rejects.toThrow('Invalid email');
  });

  it('inserts contact and returns event on success', async () => {
    const event = await submitContact(deps, validInput);
    expect(deps.contactRepo.insert).toHaveBeenCalledWith('Alice', 'alice@test.com', 'Hello, I have a question.');
    expect(event).toEqual({ type: 'ContactSubmitted', email: 'alice@test.com' });
  });
});

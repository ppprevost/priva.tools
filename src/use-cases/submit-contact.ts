import { captchaError } from '@/domain/errors';
import { createContactName, createContactEmail, createContactMsg } from '@/domain/values';
import type { ContactRepo, CaptchaVerifier } from '@/domain/ports';
import type { ContactSubmitted } from '@/domain/events';

type Deps = {
  contactRepo: ContactRepo;
  captcha: CaptchaVerifier;
};

type SubmitContactInput = {
  name: string;
  email: string;
  message: string;
  turnstileToken?: string;
};

export async function submitContact(deps: Deps, input: SubmitContactInput): Promise<ContactSubmitted> {
  if (!input.turnstileToken || !(await deps.captcha.verify(input.turnstileToken))) {
    throw captchaError();
  }

  const name = createContactName(input.name);
  const email = createContactEmail(input.email);
  const message = createContactMsg(input.message);

  await deps.contactRepo.insert(name, email, message);

  return { type: 'ContactSubmitted' };
}

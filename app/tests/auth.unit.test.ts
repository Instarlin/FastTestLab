import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('~/modules/session.server', () => {
  const getUserID = vi.fn(async (_req: Request) => undefined as string | undefined);
  const createUserSession = vi.fn(async (_args: any) => new Response(null, { status: 302, headers: { Location: '/home' } }));
  return { getUserID, createUserSession };
});

vi.mock('~/modules/db.server', () => {
  const db = {
    user: {
      findUnique: vi.fn(async (_args: any) => null as any),
      create: vi.fn(async ({ data }: any) => ({ id: 'u1', email: data.email, password: data.password })),
    },
  };
  return { db };
});

vi.mock('~/modules/auth.server', () => {
  const authenticator = { authenticate: vi.fn(async (_strategy: string, _request: Request) => ({ id: 'u1' })) };
  return { authenticator };
});

vi.mock('bcryptjs', () => ({ default: { hash: vi.fn(async () => 'hashed') } }));

// Import after mocks
import { loader, action } from '~/routes/auth';
import * as session from '~/modules/session.server';
import { db } from '~/modules/db.server';
import { authenticator } from '~/modules/auth.server';

function req(url: string, init?: RequestInit) {
  return new Request(url, init);
}

describe('auth.loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /home when already authenticated', async () => {
    vi.mocked(session.getUserID).mockResolvedValueOnce('u1');
    const res = await loader({ request: req('http://x') } as any);
    // redirect returns a Response
    expect(res).toBeInstanceOf(Response);
    const r = res as Response;
    expect(r.status).toBe(302);
    expect(r.headers.get('Location')).toBe('/home');
  });

  it('does nothing for unauthenticated users', async () => {
    vi.mocked(session.getUserID).mockResolvedValueOnce(undefined);
    const res = await loader({ request: req('http://x') } as any);
    expect(res).toBeUndefined();
  });
});

describe('auth.action register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns error on invalid payload', async () => {
    const form = new FormData();
    form.set('formType', 'register');
    form.set('email', 'not-an-email');
    const res = await action({ request: req('http://x', { method: 'POST', body: form }) } as any);
    expect(res).toEqual(expect.objectContaining({ formType: 'register' }));
  });

  it('returns error when user exists', async () => {
    vi.mocked(db.user.findUnique).mockResolvedValueOnce({ id: 'existing' } as any);
    const form = new FormData();
    form.set('formType', 'register');
    form.set('username', 'john');
    form.set('email', 'john@example.com');
    form.set('password', 'secret12');
    const res = await action({ request: req('http://x', { method: 'POST', body: form }) } as any);
    expect(res).toEqual({ formType: 'register', error: 'Bad request' });
  });

  it('creates user and redirects on success', async () => {
    vi.mocked(db.user.findUnique).mockResolvedValueOnce(null as any);
    const form = new FormData();
    form.set('formType', 'register');
    form.set('username', 'john');
    form.set('email', 'john@example.com');
    form.set('password', 'secret12');
    const res = await action({ request: req('http://x', { method: 'POST', body: form }) } as any);
    expect(session.createUserSession).toHaveBeenCalledWith(expect.objectContaining({ userID: 'u1' }));
    expect(res).toBeInstanceOf(Response);
    const r = res as Response;
    expect(r.status).toBe(302);
    expect(r.headers.get('Location')).toBe('/home');
  });
});

describe('auth.action login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects on successful login', async () => {
    vi.mocked(authenticator.authenticate).mockResolvedValueOnce({ id: 'u123' } as any);
    const form = new FormData();
    form.set('formType', 'login');
    form.set('email', 'john@example.com');
    form.set('password', 'secret12');
    form.set('remember', 'on');
    const res = await action({ request: req('http://x', { method: 'POST', body: form }) } as any);
    expect(session.createUserSession).toHaveBeenCalledWith(expect.objectContaining({ remember: true }));
    expect(res).toBeInstanceOf(Response);
    const r = res as Response;
    expect(r.status).toBe(302);
  });

  it('returns error on authentication failure', async () => {
    console.log('\x1b[41m\x1b[33m⚠️  Error is intentionally thrown! ⚠️  (at auth.unit.test.ts:118)\x1b[0m');
    vi.mocked(authenticator.authenticate).mockRejectedValueOnce(new Error('Invalid'));
    const form = new FormData();
    form.set('formType', 'login');
    form.set('email', 'john@example.com');
    form.set('password', 'wrong');
    const res = await action({ request: req('http://x', { method: 'POST', body: form }) } as any);
    expect(res).toEqual({ formType: 'login', error: 'Bad request' });
  });

  it('returns default error on unknown formType', async () => {
    const form = new FormData();
    form.set('formType', 'unknown');
    const res = await action({ request: req('http://x', { method: 'POST', body: form }) } as any);
    expect(res).toEqual({ formType: 'login', error: 'Something went wrong' });
  });
});

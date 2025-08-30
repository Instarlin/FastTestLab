import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mocks
type Chat = { id: string; title: string; pinned: boolean; lastMessage?: string | null; userId: string; updatedAt: Date; createdAt: Date };
type Message = { id: string; content: string; role: string; files: string[]; chatId: string; createdAt: Date };

let chats: Chat[] = [];
let messages: Message[] = [];
let currentUserId: string | undefined = 'user-1';

vi.mock('~/modules/session.server', () => ({
  getUserID: vi.fn(async (_req: Request) => currentUserId),
}));

vi.mock('~/modules/minio.server', () => ({
  signKeys: vi.fn(async (keys: string[]) => keys.filter(Boolean).map((k) => `signed:${k}`)),
}));

vi.mock('~/modules/db.server', () => {
  const db = {
    chat: {
      findMany: vi.fn(async ({ where, orderBy }: any) => {
        let result = chats.filter((c) => (!where?.userId || c.userId === where.userId));
        if (orderBy) {
          // sort pinned desc, updatedAt desc
          result = [...result].sort((a, b) => {
            const p = (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
            if (p !== 0) return p;
            return b.updatedAt.getTime() - a.updatedAt.getTime();
          });
        }
        return result;
      }),
      create: vi.fn(async ({ data }: any) => {
        const chat: Chat = {
          id: `c_${Math.random().toString(36).slice(2)}`,
          title: data.title,
          pinned: false,
          lastMessage: null,
          userId: data.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        chats.push(chat);
        return chat;
      }),
      update: vi.fn(async ({ where, data }: any) => {
        const idx = chats.findIndex((c) => c.id === where.id);
        if (idx === -1) throw new Error('not found');
        const updated: Chat = { ...chats[idx], ...data, updatedAt: new Date() };
        chats[idx] = updated;
        return updated;
      }),
      deleteMany: vi.fn(async ({ where }: any) => {
        const before = chats.length;
        chats = chats.filter((c) => !(c.id === where.id && c.userId === where.userId));
        const deleted = before - chats.length;
        // cascade
        if (deleted) messages = messages.filter((m) => m.chatId !== where.id);
        return { count: deleted } as any;
      }),
      findFirst: vi.fn(async ({ where }: any) => {
        return chats.find((c) => c.id === where.id && c.userId === where.userId) || null;
      }),
    },
    message: {
      findMany: vi.fn(async ({ where, orderBy }: any) => {
        let result = messages.filter((m) => m.chatId === where.chatId);
        if (orderBy?.createdAt === 'asc') {
          result = [...result].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        }
        return result;
      }),
      create: vi.fn(async ({ data }: any) => {
        const msg: Message = {
          id: `m_${Math.random().toString(36).slice(2)}`,
          content: data.content,
          role: data.role,
          chatId: data.chatId,
          files: data.files || [],
          createdAt: new Date(),
        };
        messages.push(msg);
        return msg;
      }),
    },
  };
  return { db };
});

// Import handlers after mocks
import { loader as loadChats } from '~/routes/api/chat/loadChats';
import { action as createChat } from '~/routes/api/chat/createChat';
import { loader as loadChatData } from '~/routes/api/chat/loadChatData';
import { action as createMessage } from '~/routes/api/chat/createMessage';
import { action as updateChat } from '~/routes/api/chat/updateChat';

function req(url: string, init?: RequestInit) {
  return new Request(url, init);
}

async function json(res: Response) {
  const txt = await res.text();
  try { return JSON.parse(txt); } catch { return txt; }
}

beforeEach(() => {
  chats = [];
  messages = [];
  currentUserId = 'user-1';
});

describe('loadChats', () => {
  it('rejects unauthorized', async () => {
    currentUserId = undefined;
    const res = await loadChats({ request: req('http://x') } as any);
    expect(res.status).toBe(401);
  });

  it('returns user chats mapped', async () => {
    // seed
    chats.push(
      { id: 'a', title: 'A', pinned: false, lastMessage: 'hi', userId: 'user-1', createdAt: new Date(), updatedAt: new Date(1000) },
      { id: 'b', title: 'B', pinned: true, lastMessage: null, userId: 'user-1', createdAt: new Date(), updatedAt: new Date(2000) },
      { id: 'c', title: 'C', pinned: false, lastMessage: null, userId: 'user-2', createdAt: new Date(), updatedAt: new Date(3000) },
    );
    const res = await loadChats({ request: req('http://x') } as any);
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body).toHaveLength(2);
    expect(body[0].id).toBe('b'); // pinned first
    expect(body[1].id).toBe('a');
    expect(body[1].lastMessage).toBe('hi');
  });
});

describe('createChat', () => {
  it('rejects unauthorized', async () => {
    currentUserId = undefined;
    const res = await createChat({ request: req('http://x') } as any);
    expect(res.status).toBe(401);
  });

  it('creates chat on POST', async () => {
    const res = await createChat({ request: req('http://x', { method: 'POST', body: JSON.stringify({ title: 'New' }) }) } as any);
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.title).toBe('New');
    expect(body.pinned).toBe(false);
  });

  it('method not allowed otherwise', async () => {
    const res = await createChat({ request: req('http://x', { method: 'GET' }) } as any);
    expect(res.status).toBe(405);
  });
});

describe('loadChatData', () => {
  it('enforces ownership, returns 404 if not owned', async () => {
    chats.push({ id: 'x', title: 'X', pinned: false, lastMessage: null, userId: 'user-2', createdAt: new Date(), updatedAt: new Date() });
    const res = await loadChatData({ request: req('http://x'), params: { chatId: 'x' } } as any);
    expect(res.status).toBe(404);
  });

  it('returns messages with signed file URLs', async () => {
    chats.push({ id: 'x', title: 'X', pinned: false, lastMessage: null, userId: 'user-1', createdAt: new Date(), updatedAt: new Date() });
    messages.push(
      { id: 'm1', content: 'hello', role: 'user', files: ['k1', ''], chatId: 'x', createdAt: new Date(1) },
      { id: 'm2', content: 'there', role: 'assistant', files: [], chatId: 'x', createdAt: new Date(2) },
    );
    const res = await loadChatData({ request: req('http://x'), params: { chatId: 'x' } } as any);
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body).toHaveLength(2);
    expect(body[0].files).toEqual(['signed:k1']);
  });
});

describe('createMessage', () => {
  beforeEach(() => {
    chats.push({ id: 'x', title: 'X', pinned: false, lastMessage: null, userId: 'user-1', createdAt: new Date(), updatedAt: new Date() });
  });

  it('requires content', async () => {
    const res = await createMessage({ request: req('http://x', { method: 'POST', body: JSON.stringify({}) }), params: { chatId: 'x' } } as any);
    expect(res.status).toBe(400);
  });

  it('rejects unauthorized', async () => {
    currentUserId = undefined;
    const res = await createMessage({ request: req('http://x', { method: 'POST', body: JSON.stringify({ content: 'hi' }) }), params: { chatId: 'x' } } as any);
    expect(res.status).toBe(401);
  });

  it('creates user and assistant messages and returns both', async () => {
    const res = await createMessage({ request: req('http://x', { method: 'POST', body: JSON.stringify({ content: 'hi', files: ['k1',''] }) }), params: { chatId: 'x' } } as any);
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body).toHaveLength(2);
    expect(body[0].role).toBe('user');
    expect(body[0].files).toEqual(['signed:k1']);
  });
});

describe('updateChat', () => {
  beforeEach(() => {
    chats.push({ id: 'x', title: 'X', pinned: false, lastMessage: null, userId: 'user-1', createdAt: new Date(), updatedAt: new Date() });
  });

  it('updates title and pinned', async () => {
    const res = await updateChat({
      request: req('http://x', { method: 'PATCH', body: JSON.stringify({ title: 'Y', pinned: true }) }),
      params: { chatId: 'x' },
    } as any);
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.title).toBe('Y');
    expect(body.pinned).toBe(true);
  });

  it('deletes chat', async () => {
    const res = await updateChat({ request: req('http://x', { method: 'DELETE' }), params: { chatId: 'x' } } as any);
    expect(res.status).toBe(204);
  });
});


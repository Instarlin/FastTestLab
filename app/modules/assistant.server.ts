import OpenAI from 'openai';

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

//TODO: Remake system prompt and make it more accurate to the task
//TODO: Maybe host own openai instance?
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_SYSTEM_PROMPT = process.env.ASSISTANT_SYSTEM_PROMPT || 'You are a helpful assistant.';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';

export interface StreamArgs {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  signal?: AbortSignal;
}

export interface StreamResult {
  stream: ReadableStream<Uint8Array>;
  onDone: Promise<{ content: string }>;
}

let client: OpenAI | undefined;
function getClient(): OpenAI | undefined {
  if (!OPENAI_API_KEY) return undefined;
  if (!client) {
    client = new OpenAI({ apiKey: OPENAI_API_KEY });
  }
  return client;
}

export async function streamAssistantCompletion(args: StreamArgs): Promise<StreamResult> {
  const withSystem: ChatMessage[] = [
    { role: 'system', content: ASSISTANT_SYSTEM_PROMPT },
    ...args.messages,
  ];

  const c = getClient();
  if (!c) return mockStream(withSystem);
  return sdkStream(c, withSystem, args.model || DEFAULT_MODEL, args.temperature ?? 1.0, args.signal);
}

async function sdkStream(c: OpenAI, messages: ChatMessage[], model: string, temperature: number, _signal?: AbortSignal): Promise<StreamResult> {
  const encoder = new TextEncoder();
  const streamResp = await c.chat.completions.create({
    model,
    messages,
    temperature,
    stream: true,
  });

  let full = '';
  let resolveDone: (v: { content: string }) => void;
  const onDone = new Promise<{ content: string }>((resolve) => (resolveDone = resolve));

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const part of streamResp) {
          const delta: string | undefined | null = part?.choices?.[0]?.delta?.content;
          if (delta) {
            full += delta;
            controller.enqueue(encoder.encode(delta));
          }
        }
      } catch {
        // swallow
      } finally {
        controller.close();
        resolveDone!({ content: full });
      }
    },
  });

  return { stream, onDone };
}

function mockStream(_messages: ChatMessage[]): StreamResult {
  const text = '⚠️ Seems like something went wrong! ⚠️ Try again later...';
  const encoder = new TextEncoder();
  let final = '';
  let resolveDone: (v: { content: string }) => void;
  const onDone = new Promise<{ content: string }>((resolve) => (resolveDone = resolve));
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const parts = text.match(/.{1,8}/g) || [text];
      let i = 0;
      const tick = () => {
        if (i < parts.length) {
          const p = parts[i++];
          final += p;
          controller.enqueue(encoder.encode(p));
          setTimeout(tick, 10);
        } else {
          controller.close();
          resolveDone!({ content: final });
        }
      };
      tick();
    },
  });
  return { stream, onDone };
}

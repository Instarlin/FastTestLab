import { type ActionFunctionArgs } from "react-router";
import { db } from "~/modules/db.server";
import { getUserID } from "~/modules/session.server";
import { streamAssistantCompletion } from "~/modules/assistant.server";

//* POST /api/chat/streamMessage/:chatId
// Streams the assistant reply as plain text chunks. Also persists user and assistant messages.
export async function action({ params, request }: ActionFunctionArgs) {
    const userId = await getUserID(request);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const chatId = params.chatId;
    if (!chatId) return Response.json({ error: "Not Found" }, { status: 404 });
    if (request.method !== "POST") {
        return Response.json({ error: "Method Not Allowed" }, { status: 405 });
    }
    const chat = await db.chat.findFirst({ where: { id: chatId, userId } });
    if (!chat) return Response.json({ error: "Chat not found" }, { status: 404 });
    const body = await request.json().catch(() => ({}));
    const content: string = typeof body.content === 'string' ? body.content : '';
    const files: string[] = Array.isArray(body.files) ? body.files.filter((f: unknown) => typeof f === 'string' && f) : [];
    const model: string | undefined = typeof body.model === 'string' ? body.model : undefined;
    if (!content) return Response.json({ error: "Content is required" }, { status: 400 });
    // Persist user message first
    await db.message.create({ data: { content, role: 'user', chatId, files } });
    // Prepare streaming assistant
    const abort = new AbortController();
    const { stream, onDone } = await streamAssistantCompletion({
        messages: [
            //TODO: Load history here for better responses.
            { role: 'user', content },
        ],
        model,
        signal: abort.signal,
    });
    // When stream completes, persist assistant message and update chat
    onDone.then(async ({ content }) => {
        try {
            await db.message.create({ data: { content, role: 'assistant', chatId, files: [] } });
            await db.chat.update({ where: { id: chatId }, data: { lastMessage: content.slice(0, 200) } });
        } catch { }
    }).catch(() => { });
    const headers = new Headers({
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
    });
    return new Response(stream, { headers });
}

import { type ActionFunctionArgs } from "react-router";
import { db } from "~/modules/db.server";
import { getUserID } from "~/modules/session.server";

// PATCH/DELETE /api/chat/updateChat/:chatId
export async function action({ params, request }: ActionFunctionArgs) {
  const userId = await getUserID(request);
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const chatId = params.chatId;
  if (!chatId) return Response.json({ error: "Not Found" }, { status: 404 });

  if (request.method === "DELETE") {
    await db.chat.deleteMany({ where: { id: chatId, userId } });
    return new Response(null, { status: 204 });
  }

  if (request.method === "PATCH") {
    const data = await request.json().catch(() => ({}));
    const chat = await db.chat.findFirst({ where: { id: chatId, userId } });
    if (!chat) return Response.json({ error: "Chat not found" }, { status: 404 });
    const updated = await db.chat.update({
      where: { id: chatId },
      data: {
        title: typeof data.title === "string" ? data.title : undefined,
        pinned: typeof data.pinned === "boolean" ? data.pinned : undefined,
      },
    });
    return Response.json({
      id: updated.id,
      title: updated.title,
      lastMessage: updated.lastMessage ?? "Start chatting!",
      timestamp: updated.updatedAt,
      pinned: updated.pinned,
    });
  }

  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}


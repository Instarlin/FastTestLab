import { type ActionFunctionArgs } from "react-router";
import { db } from "~/modules/db.server";
import { getUserID } from "~/modules/session.server";

//* POST /api/chats/createChat
export async function action({ request }: ActionFunctionArgs) {
    const userId = await getUserID(request);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (request.method === "POST") {
        const data = await request.json().catch(() => ({}));
        const chat = await db.chat.create({
            data: {
                title: data.title ?? "New Chat",
                userId,
            },
        });
        return Response.json({
            id: chat.id,
            title: chat.title,
            lastMessage: chat.lastMessage ?? "Start chatting!",
            timestamp: chat.updatedAt,
            pinned: chat.pinned,
        });
    }
    return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}

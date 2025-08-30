import { type ActionFunctionArgs } from "react-router";
import { db } from "~/modules/db.server";
import { getUserID } from "~/modules/session.server";

export async function action({ request }: ActionFunctionArgs) {
    const userId = await getUserID(request);
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }
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
    return new Response("Method Not Allowed", { status: 405 });
}
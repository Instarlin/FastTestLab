import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { db } from "~/modules/db.server";
import { getUserID } from "~/modules/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserID(request);
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }
    const chats = await db.chat.findMany({
        where: { userId },
        orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    });
    return Response.json(
        chats.map((c) => ({
            id: c.id,
            title: c.title,
            lastMessage: c.lastMessage ?? "Start chatting!",
            timestamp: c.updatedAt,
            pinned: c.pinned,
        }))
    );
}

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
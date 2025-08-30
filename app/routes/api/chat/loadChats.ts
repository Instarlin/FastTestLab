import { type LoaderFunctionArgs } from "react-router";
import { db } from "~/modules/db.server";
import { getUserID } from "~/modules/session.server";

//* GET /api/chat/loadChats
// Loads all chats of the user
export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserID(request);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
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

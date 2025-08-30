import { type LoaderFunctionArgs } from "react-router";
import { db } from "~/modules/db.server";
import { getUserID } from "~/modules/session.server";
import { signKeys } from "~/modules/minio.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
    const userId = await getUserID(request);
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const chatId = params.chatId;
    if (!chatId) return new Response("Not Found", { status: 404 });

    const messages = await db.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "asc" },
    });

    const transformed = await Promise.all(messages.map(async (m) => {
        const keys: string[] = (m.files as string[]) || [];
        const urls = await signKeys(keys, 300);
        return {
            id: m.id,
            content: m.content,
            role: m.role as "user" | "assistant",
            timestamp: m.createdAt,
            files: urls,
        };
    }));

    return Response.json(transformed);
}
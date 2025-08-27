import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { db } from "~/modules/db.server";
import { getUserID } from "~/modules/session.server";
import { loadFromMinio } from "~/modules/minio.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
    const userId = await getUserID(request);
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }
    const chatId = params.chatId;
    if (!chatId) {
        return new Response("Not Found", { status: 404 });
    }
    const messages = await db.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "asc" },
    });
    return Response.json(
        messages.map((m) => ({
            id: m.id,
            content: m.content,
            role: m.role as "user" | "assistant",
            timestamp: m.createdAt,
            files: m.files,
        }))
    );
}

export async function action({ params, request }: ActionFunctionArgs) {
    const userId = await getUserID(request);
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }
    const chatId = params.chatId;
    if (!chatId) {
        return new Response("Not Found", { status: 404 });
    }

    if (request.method === "POST") {
        const { content, files = [] } = await request.json();
        const loaded = await Promise.all(
            files.map((url: string) => loadFromMinio(url))
        );
        const userMessage = await db.message.create({
            data: {
                content,
                role: "user",
                chatId,
                files,
            },
        });
        const assistantMessage = await db.message.create({
            data: {
                content: `This is a mock response. Loaded ${loaded.length} file(s).`,
                role: "assistant",
                chatId,
                files: [],
            },
        });
        await db.chat.update({
            where: { id: chatId },
            data: { lastMessage: content },
        });
        return Response.json([
            {
                id: userMessage.id,
                content: userMessage.content,
                role: "user" as const,
                timestamp: userMessage.createdAt,
                files: userMessage.files,
            },
            {
                id: assistantMessage.id,
                content: assistantMessage.content,
                role: "assistant" as const,
                timestamp: assistantMessage.createdAt,
                files: assistantMessage.files,
            },
        ]);
    }

    if (request.method === "DELETE") {
        await db.chat.deleteMany({ where: { id: chatId, userId } });
        return new Response(null, { status: 204 });
    }

    if (request.method === "PATCH") {
        const data = await request.json();
        const chat = await db.chat.update({
            where: { id: chatId },
            data: {
                title: data.title,
                pinned: data.pinned,
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
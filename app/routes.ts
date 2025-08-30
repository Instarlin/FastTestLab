import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("/auth", "routes/auth.tsx"),
  route("/logout", "routes/logout.tsx"),

  layout("routes/sidebar.tsx", [
    route("/home", "routes/home.tsx"),
    route("/chat", "routes/chat.tsx"),
    route("/tests", "routes/tests.tsx", [
    ]),
  ]),
  route("/api/chat/uploadFile", "routes/api/chat/uploadFile.ts"),
  route("/api/chat/loadChats", "routes/api/chat/loadChats.ts"),
  route("/api/chat/createChat", "routes/api/chat/createChat.ts"),
  route("/api/chat/loadChat/:chatId", "routes/api/chat/loadChatData.ts"),
  route("/api/chat/chatActions/:chatId", "routes/api/chat/chatActions.ts"),
] satisfies RouteConfig;

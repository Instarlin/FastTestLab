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
  route("/api/upload", "routes/api/upload.ts"),
  route("/api/chats", "routes/api/chats.ts"),
  route("/api/chats/:chatId", "routes/api/chats.$chatid.ts"),
] satisfies RouteConfig;

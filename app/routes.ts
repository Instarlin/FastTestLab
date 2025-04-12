import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("/login", "routes/login.tsx"),

  layout("routes/sidebar.tsx", [
    route("/home", "routes/home.tsx"),
    route("/chat", "routes/chat.tsx"),
    route("/tests", "routes/tests.tsx", [
      route("extrachimin", "routes/chimin/extrachimin.tsx"),
    ]),
  ]),
] satisfies RouteConfig;

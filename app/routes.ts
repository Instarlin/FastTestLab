import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),

  layout("routes/sidebar.tsx", [
    route("/home", "routes/home.tsx"),
    route("/tests", "routes/tests.tsx", [
      route("extrachimin", "routes/chimin/extrachimin.tsx"),
    ]),
    // route("/login", "routes/login.tsx"),
  ]),
] satisfies RouteConfig;

import { redirect } from "react-router";
import { sessionStorage } from "~/modules/session.server";

export async function loader({ request }: { request: Request }) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  return redirect("/auth?formType=login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export default function Logout() {
  return null;
}
import { useEffect } from "react";
import { redirect, useSubmit } from "react-router";
import { sessionStorage } from "~/modules/session.server";

export async function action({ request }: { request: Request }) {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  return redirect("/auth?formType=login", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
}

export default function Logout() {
  const submit = useSubmit();
  useEffect(() => {
    submit(null, { method: "post" });
  }, [submit]);
  return null;
}
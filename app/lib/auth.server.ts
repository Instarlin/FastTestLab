import { redirect } from "react-router";

export async function requireUser(request: Request) {
  const cookie = request.headers.get("Cookie");

  const res = await fetch(`${process.env.VITE_API_BASE_URL}/auth/login`, {
    method: "GET",
    headers: {
      Cookie: cookie ?? "",
    },
    credentials: "include",
  });

  if (!res.ok) {
    console.log("res", res);
    // throw redirect("/login");
  }

  const user = await res.json();
  return user;
}
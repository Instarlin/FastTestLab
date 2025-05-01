import { redirect } from "react-router";

export async function requireUser(request: Request) {
  console.log(request)
  const cookieHeader = request.headers.get("Cookie") || "";
  console.log("cookieHeader", cookieHeader);

  const res = await fetch(`${process.env.VITE_API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    // console.log("res", res);
    throw redirect("/login");
  }

  const user = await res.json();

  const setCookie = res.headers.get("set-cookie");
  const headers: HeadersInit = {};
  if (setCookie) {
    headers["Set-Cookie"] = setCookie;
  }

  return json({ user }, { headers });
}

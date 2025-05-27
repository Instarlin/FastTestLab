import type { User } from "@prisma/client";
import { createCookieSessionStorage, redirect } from "react-router";

if (!process.env.SESSION_SECRET) throw new Error("Missing SESSION_SECRET");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production" && process.env.USE_HTTPS === "true",
  },
});

export const { commitSession, destroySession } = sessionStorage;

export const getUserSession = async (request: Request) => {
  return await sessionStorage.getSession(request.headers.get("Cookie"));
};

export const getUserID = async (request: Request): Promise<User["id"] | undefined> => {
  const session = await getUserSession(request);
  const userID = session.get("userID");
  return userID;
};

export async function createUserSession({
  request,
  userID,
  redirectTo,
  remember,
}: {
  request: Request;
  userID: string;
  redirectTo: string;
  remember: boolean;
}) {
  const session = await getUserSession(request);
  session.set("userID", userID);
  return redirect(redirectTo || "/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" && process.env.USE_HTTPS === "true",
        sameSite: "lax",
        maxAge: remember ? 60 * 60 * 24 * 30 : undefined,
      }),
    },
  });
}

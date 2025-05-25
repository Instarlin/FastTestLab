import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { db } from "./db.server";
import { compare } from "bcryptjs";

export type User = { id: string; email: string };

export let authenticator = new Authenticator<User>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email") as string;
    let password = form.get("password") as string;

    let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    let valid = await compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid email or password");
    }

    return { id: user.id, email: user.email };
  }),
  "form"
);

import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
// import { TOTPStrategy } from "remix-auth-totp";
import { db } from "./db.server";
import { compare } from "bcryptjs";
import { loginSchema } from "~/schemas/auth";

export type User = { id: string; email: string };

export let authenticator = new Authenticator<User>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const payload = Object.fromEntries(form) as Record<string, string>;
    const result = loginSchema.safeParse(payload);
    if (!result.success) {
      throw new Error("Invalid request");
    }

    const { email, password } = result.data;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid email or password");
    }

    return { id: user.id, email: user.email };
  }),
  "form",
);


//* For future use, 2FA?
// authenticator.use(
//   new TOTPStrategy(
//     {
//       secret: process.env.ENCRYPTION_SECRET,
//       emailSentRedirect: "/verify",
//       magicLinkPath: "/verify",
//       successRedirect: "/dashboard",
//       failureRedirect: "/verify",
//       sendTOTP: async ({ email, code, magicLink }) => {},
//     },
//     async ({ email }) => {}
//   ),
//   "totp"
// );

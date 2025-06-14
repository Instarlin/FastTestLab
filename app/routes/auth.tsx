import { Lock, Mail, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { redirect, Form, useActionData, useLocation, type ActionFunctionArgs, type LoaderFunctionArgs, useNavigation } from "react-router";
import { Input } from "~/components/ui/hoverInput";
import type { Route } from "./+types/home";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type RegisterFormData,
  type LoginFormData,
  registerSchema,
  loginSchema,
} from "~/schemas/auth";
import { Waves } from "~/components/widgets/Waves";
import bcrypt from "bcryptjs";
import { authenticator } from "~/modules/auth.server";
import { createUserSession, getUserID } from "~/modules/session.server";
import { db } from "~/modules/db.server";

type ActionData =
  | { formType: "login"; error?: string }
  | { formType: "register"; error?: string };

export function meta({}: Route.MetaArgs) {
  return [{ title: "Authentication" }, { name: "description", content: "Authentication page" }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userID = await getUserID(request);
  if (userID) return redirect("/home");
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.clone().formData();
    const formType = formData.get("formType") as string;
    
    if (formType === "register") {
      const payload = Object.fromEntries(formData) as Record<string, string>

      const result = registerSchema.safeParse(payload);
      if (!result.success) {
        const { fieldErrors } = result.error.flatten()
        return { formType: "register", error: JSON.stringify(fieldErrors) };
      }

      const { username, email, password } = result.data

      let exists = await db.user.findUnique({ where: { email } });
      if (exists) {
        return { formType: "register", error: "Bad request" };
      }

      let user = await db.user.create({
        data: { username, email, password: await bcrypt.hash(password, 10) },
      });

      const response = await createUserSession({
        request,
        userID: user.id,
        redirectTo: "/home",
        remember: formData.get("remember") === "on",
      });

      if (!response) return { formType: "register", error: "Something went wrong" };

      return response;
    }
    
    if (formType === "login") {
      const user = await authenticator.authenticate("form", request);
      
      const response = await createUserSession({
        request,
        userID: user.id,
        redirectTo: "/home",
        remember: formData.get("remember") === "on",
      });

      if (!response) return { formType: "login", error: "Something went wrong" };

      return response;
    }
  } catch (error) {
    console.log(error)
    return { formType: "login", error: "Bad request" };
  }
  return { formType: "login", error: "Something went wrong" };
}

const MotionForm = motion.create(Form);

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [remember, setRemember] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const actionData = useActionData<ActionData>();
  const location = useLocation();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlError = params.get("error");
    if (urlError) setError(decodeURIComponent(urlError));
    else setError(null);
    const urlFormType = params.get("formType");
    if (urlFormType === "register") setIsLogin(false);
    else if (urlFormType === "login") setIsLogin(true);
  }, [location.search]);

  useEffect(() => {
    setError(actionData?.error || null);
  }, [actionData]);

  const {
    register: registerForm,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const {
    register: loginForm,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center px-4 relative transition-colors duration-300 ${darkMode ? "bg-zinc-900" : "bg-zinc-100"} ${darkMode ? "text-white" : "text-black"}`}
    >
      <button
        className={`absolute z-10 bottom-4 right-4 text-sm px-3 py-1 rounded-md border border-gray-400 hover:cursor-pointer transition-colors duration-200 ${
          darkMode ? "hover:bg-zinc-700" : "hover:bg-gray-200"
        }`}
        onClick={() => setDarkMode(!darkMode)}
      >
        Switch to {darkMode ? "Light" : "Dark"}
      </button>

      {/* Auth Form */}
      <motion.div
        layout
        animate={{ height: "auto" }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`w-full max-w-md rounded-xl p-6 shadow-2xl border transition-colors duration-200 ${darkMode ? "bg-zinc-800 border-zinc-600" : "bg-white border-zinc-200"}`}
      >
        <h2 className="text-2xl text-center font-semibold mb-6 transition-all duration-300">
          {isLogin ? "Login" : "Register"}
        </h2>
        <AnimatePresence mode="wait">
          <motion.div layout="position">
            {isLogin ? (
              //* Login Form
              <MotionForm
                key="login"
                method="post"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <input type="hidden" name="formType" value="login" />
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute top-3 left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className={`w-full p-3 pl-10 rounded-md focus:outline-none focus:ring-2 ${
                      darkMode
                        ? "bg-zinc-700 text-white placeholder-zinc-400"
                        : "bg-zinc-100 text-black placeholder-gray-500"
                    }`}
                    {...loginForm("email")}
                  />
                  {loginErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    className={`w-full p-3 pl-10 rounded-md focus:outline-none ${
                      darkMode
                        ? "bg-zinc-700 text-white placeholder-zinc-400"
                        : "bg-zinc-100 text-black placeholder-gray-500"
                    }`}
                    {...loginForm("password")}
                  />
                  {loginErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                <div
                  className={`flex justify-between items-center text-sm ${
                    darkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-zinc-800"
                      checked={remember}
                      onChange={() => setRemember(!remember)}
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-all duration-300 cursor-pointer underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`block w-full text-center font-semibold py-2 rounded-md transition-colors duration-200 hover:cursor-pointer text-white ${
                    darkMode
                      ? "hover:bg-zinc-600 bg-zinc-700"
                      : "hover:bg-zinc-700 bg-zinc-800"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </button>
              </MotionForm>
            ) : (
              //* Register Form
              <MotionForm
                key="register"
                method="post"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <input type="hidden" name="formType" value="register" />
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="relative">
                  <User className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                    className={`w-full p-3 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-zinc-700 text-white placeholder-zinc-400"
                        : "bg-zinc-100 text-black placeholder-gray-500"
                    }`}
                    {...registerForm("username")}
                  />
                  {registerErrors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {registerErrors.username.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Mail className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className={`w-full p-3 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-zinc-700 text-white placeholder-zinc-400"
                        : "bg-zinc-100 text-black placeholder-gray-500"
                    }`}
                    {...registerForm("email")}
                  />
                  {registerErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {registerErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    className={`w-full p-3 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-zinc-700 text-white placeholder-zinc-400"
                        : "bg-zinc-100 text-black placeholder-gray-500"
                    }`}
                    {...registerForm("password")}
                  />
                  {registerErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {registerErrors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`block w-full text-center font-semibold py-2 rounded-md transition-colors duration-200 hover:cursor-pointer text-white ${
                    darkMode
                      ? "bg-zinc-700 hover:bg-zinc-600"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </button>
              </MotionForm>
            )}
          </motion.div>
        </AnimatePresence>

        <div
          className={`text-center mt-6 text-sm ${
            darkMode ? "text-zinc-400" : "text-gray-600"
          }`}
        >
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className={`underline transition duration-200 cursor-pointer hover:text-blue-400`}
            onClick={() => setIsLogin(!isLogin)}
            disabled={isSubmitting}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </motion.div>
      <Waves />
    </div>
  );
}
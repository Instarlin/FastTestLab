import { Lock, Mail, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "~/components/Input";
import type { Route } from "./+types/home";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "~/lib/api";
import type { RegisterRequest, LoginRequest } from "~/lib/api";
import { Waves } from "~/components/Waves";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

type RegisterFormData = z.infer<typeof registerSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login" }, { name: "description", content: "Login page" }];
}

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [remember, setRemember] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const {
    register: loginForm,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const backgroundColor = darkMode ? "bg-zinc-900" : "bg-zinc-100";
  const textColor = darkMode ? "text-white" : "text-black";
  const cardBg = darkMode
    ? "bg-zinc-800 border-zinc-600"
    : "bg-white border-zinc-200";

  const onRegister = async (data: RegisterFormData) => {
    try {
      setError(null);
      await authApi.register(data as RegisterRequest);
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  const onLogin = async (data: LoginFormData) => {
    try {
      setError(null);
      await authApi.login(data as LoginRequest);
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center px-4 relative transition-colors duration-300 ${backgroundColor} ${textColor}`}
    >
      <button
        className={`absolute z-10 bottom-4 right-4 text-sm px-3 py-1 rounded-md border border-gray-400 hover:cursor-pointer transition-colors duration-200 ${
          darkMode ? "hover:bg-zinc-700" : "hover:bg-gray-200"
        }`}
        onClick={() => setDarkMode(!darkMode)}
      >
        Switch to {darkMode ? "Light" : "Dark"}
      </button>

      <motion.div
        layout
        animate={{ height: "auto" }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`w-full max-w-md rounded-xl p-6 shadow-2xl border transition-colors duration-200 ${cardBg}`}
      >
        <h2 className="text-2xl text-center font-semibold mb-6 transition-all duration-300">
          {isLogin ? "Login" : "Register"}
        </h2>

        <AnimatePresence mode="wait">
          <motion.div layout="position">
            {isLogin ? (
              <motion.form
                key="login"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
                onSubmit={handleLoginSubmit(onLogin)}
              >
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
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
                    <p className="text-red-500 text-xs mt-1">{loginErrors.email.message}</p>
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
                    <p className="text-red-500 text-xs mt-1">{loginErrors.password.message}</p>
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
                  disabled={isLoginSubmitting}
                  className={`block w-full text-center font-semibold py-2 rounded-md transition-colors duration-200 hover:cursor-pointer text-white ${
                    darkMode ? "hover:bg-zinc-600 bg-zinc-700" : "hover:bg-zinc-700 bg-zinc-800"
                  } ${isLoginSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoginSubmitting ? "Logging in..." : "Log In"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
                onSubmit={handleRegisterSubmit(onRegister)}
              >
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
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
                    <p className="text-red-500 text-xs mt-1">{registerErrors.username.message}</p>
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
                    <p className="text-red-500 text-xs mt-1">{registerErrors.email.message}</p>
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
                    <p className="text-red-500 text-xs mt-1">{registerErrors.password.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isRegisterSubmitting}
                  className={`block w-full text-center font-semibold py-2 rounded-md transition-colors duration-200 hover:cursor-pointer text-white ${
                    darkMode ? "bg-zinc-700 hover:bg-zinc-600" : "bg-zinc-800 hover:bg-zinc-700"
                  } ${isRegisterSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isRegisterSubmitting ? "Signing Up..." : "Sign Up"}
                </button>
              </motion.form>
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
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </motion.div>
      <Waves/>
    </div>
  );
}

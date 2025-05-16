import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, loginSchema, type RegisterFormData, type LoginFormData } from "~/schemas/auth";
import { useNavigate } from "react-router";

export function useAuthForm(isLogin: boolean) {
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
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

  const onRegister = async (data: RegisterFormData) => {
    try {
      setError(null);
      const form = new FormData();
      form.set("intent", "register");
      form.set("email", data.email);
      form.set("username", data.username);
      form.set("password", data.password);

      const res = await fetch("/api/auth", { method: "POST", body: form });

      if (!res.ok) {
        const { errors } = await res.json();
        setError(errors?.form || "Registration failed");
        return;
      }

      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  const onLogin = async (data: LoginFormData) => {
    try {
      setError(null);
      const form = new FormData();
      form.set("intent", "login");
      form.set("email", data.email);
      form.set("password", data.password);

      const res = await fetch("/api/auth", { method: "POST", body: form });

      if (!res.ok) {
        const { errors } = await res.json();
        setError(errors?.form || "Login failed");
        return;
      }

      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return {
    error,
    remember,
    setRemember,
    registerForm,
    loginForm,
    registerErrors,
    loginErrors,
    isRegisterSubmitting,
    isLoginSubmitting,
    handleRegisterSubmit,
    handleLoginSubmit,
    onRegister,
    onLogin
  };
} 
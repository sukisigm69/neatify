"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { api, useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { roleHome } from "@/lib/roles";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError("");
    try {
      const res = await api.post("/auth/login", data);
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        const role = res.data.data.user.roles?.name;
        const redirect = new URLSearchParams(window.location.search).get("redirect");
        const safeRedirect = redirect?.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : roleHome(role);
        router.push(safeRedirect);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setServerError(error.response?.data?.message || "Login gagal. Coba lagi.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-heading">Selamat datang kembali</h1>
        <p className="text-brand-paragraph mt-2 text-[15px]">Masuk ke akun Konsera kamu</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase text-brand-paragraph mb-1.5 tracking-wide">Email</label>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary focus:outline-none transition-all duration-200 text-[15px] placeholder:text-brand-paragraph/40"
            placeholder="email@contoh.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase text-brand-paragraph tracking-wide">Password</label>
            <Link href="/forgot-password" className="text-xs text-brand-primary font-medium hover:underline">Lupa password?</Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary focus:outline-none transition-all duration-200 text-[15px] placeholder:text-brand-paragraph/40"
              placeholder="Masukkan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-brand-paragraph/40 hover:text-brand-paragraph transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{serverError}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary-container text-white rounded-xl font-semibold hover:bg-brand-primary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-[15px] cursor-pointer"
        >
          {isSubmitting && <Loader2 className="animate-spin" size={16} />}
          Masuk
        </button>
      </form>

      <p className="text-center text-sm text-brand-paragraph mt-8">
        Belum punya akun?{" "}
        <Link href="/register" className="text-brand-primary font-semibold hover:underline">Daftar</Link>
      </p>
    </div>
  );
}

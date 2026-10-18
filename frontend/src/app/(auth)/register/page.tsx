"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { api, useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: reg,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError("");
    try {
      const payload: Record<string, string> = { name: data.name, email: data.email, password: data.password };
      if (data.phone) payload.phone = data.phone;

      const res = await api.post("/auth/register", payload);
      if (res.data.success) {
        const loginRes = await api.post("/auth/login", { email: data.email, password: data.password });
        if (loginRes.data.success) {
          login(loginRes.data.data.token, loginRes.data.data.user);
          router.push("/");
        }
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setServerError(error.response?.data?.message || "Registrasi gagal. Coba lagi.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-heading">Buat akun baru</h1>
        <p className="text-brand-paragraph mt-2 text-[15px]">Bergabung dengan Konsera</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase text-brand-paragraph mb-1.5 tracking-wide">Nama Lengkap</label>
          <input
            type="text"
            autoComplete="name"
            {...reg("name")}
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary focus:outline-none transition-all duration-200 text-[15px] placeholder:text-brand-paragraph/40"
            placeholder="Nama lengkap"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-brand-paragraph mb-1.5 tracking-wide">Email</label>
          <input
            type="email"
            autoComplete="email"
            {...reg("email")}
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary focus:outline-none transition-all duration-200 text-[15px] placeholder:text-brand-paragraph/40"
            placeholder="email@contoh.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-brand-paragraph mb-1.5 tracking-wide">Telepon (Opsional)</label>
          <input
            type="tel"
            autoComplete="tel"
            {...reg("phone")}
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary focus:outline-none transition-all duration-200 text-[15px] placeholder:text-brand-paragraph/40"
            placeholder="08xxxxxxxxxx"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-brand-paragraph mb-1.5 tracking-wide">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...reg("password")}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary focus:outline-none transition-all duration-200 text-[15px] placeholder:text-brand-paragraph/40"
              placeholder="Minimal 8 karakter"
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
          Buat Akun
        </button>
      </form>

      <p className="text-center text-sm text-brand-paragraph mt-8">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-brand-primary font-semibold hover:underline">Masuk</Link>
      </p>
    </div>
  );
}

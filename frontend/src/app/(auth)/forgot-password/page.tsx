"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { api } from "@/lib/store";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError("");
    try {
      await api.post("/auth/forgot-password", data);
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setServerError(error.response?.data?.message || "Failed to send reset email. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-xl bg-brand-muted flex items-center justify-center mx-auto mb-5">
          <Mail className="text-brand-primary" size={24} />
        </div>
        <h1 className="font-display text-3xl font-bold text-brand-heading mb-3">Check your email</h1>
        <p className="text-brand-paragraph mb-8 leading-relaxed text-[15px]">
          We&apos;ve sent a password reset link to <span className="font-semibold text-brand-heading">{getValues("email")}</span>
        </p>
        <Link href="/login" className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:underline text-sm">
          <ArrowLeft size={15} /> Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-brand-paragraph hover:text-brand-heading transition-colors mb-8">
        <ArrowLeft size={15} /> Back to Sign In
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-heading">Forgot password?</h1>
        <p className="text-brand-paragraph mt-2 text-[15px]">Enter your email and we&apos;ll send you a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase text-brand-paragraph mb-1.5 tracking-wide">Email</label>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary focus:outline-none transition-all duration-200 text-[15px] placeholder:text-brand-paragraph/40"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{serverError}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 gradient-brand text-white rounded-lg font-semibold shadow-brand hover:shadow-brand-lg disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 text-[15px] cursor-pointer"
        >
          {isSubmitting && <Loader2 className="animate-spin" size={16} />}
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { api } from "@/lib/store";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError("");
    if (!token) {
      setServerError("Invalid or missing reset token.");
      return;
    }
    try {
      await api.post("/auth/reset-password", { token, password: data.password });
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setServerError(error.response?.data?.message || "Failed to reset password. The link may have expired.");
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="text-red-400" size={24} />
        </div>
        <h1 className="font-display text-3xl font-bold text-brand-heading mb-3">Invalid link</h1>
        <p className="text-brand-paragraph mb-8 text-[15px]">This password reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="inline-flex items-center gap-2 px-5 py-2.5 gradient-brand text-white rounded-lg font-semibold shadow-brand hover:shadow-brand-lg transition-all duration-200 text-sm cursor-pointer">
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-xl bg-brand-muted flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="text-brand-primary" size={24} />
        </div>
        <h1 className="font-display text-3xl font-bold text-brand-heading mb-3">Password reset</h1>
        <p className="text-brand-paragraph mb-8 text-[15px]">Your password has been successfully reset. You can now sign in with your new password.</p>
        <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 gradient-brand text-white rounded-lg font-semibold shadow-brand hover:shadow-brand-lg transition-all duration-200 text-sm cursor-pointer">
          Sign In
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
        <h1 className="font-display text-3xl font-bold text-brand-heading">Reset password</h1>
        <p className="text-brand-paragraph mt-2 text-[15px]">Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase text-brand-paragraph mb-1.5 tracking-wide">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("password")}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary focus:outline-none transition-all duration-200 text-[15px] placeholder:text-brand-paragraph/40"
              placeholder="Minimum 8 characters"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-brand-paragraph/40 hover:text-brand-paragraph transition-colors cursor-pointer">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-brand-paragraph mb-1.5 tracking-wide">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              {...register("confirmPassword")}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary focus:outline-none transition-all duration-200 text-[15px] placeholder:text-brand-paragraph/40"
              placeholder="Re-enter your password"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-3.5 text-brand-paragraph/40 hover:text-brand-paragraph transition-colors cursor-pointer">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword.message}</p>}
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
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={32} /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

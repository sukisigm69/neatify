"use client";

import { useState, useEffect, Suspense } from "react";
import { api } from "@/lib/store";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : "Invalid or missing verification token.");

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await api.post("/auth/verify-email", { token });
        if (res.data.success) {
          setStatus("success");
          setMessage("Your email has been successfully verified.");
        } else {
          setStatus("error");
          setMessage("Verification failed. Please try again.");
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. The link may have expired.");
      }
    };

    verify();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-xl bg-brand-muted flex items-center justify-center mx-auto mb-5">
          <Loader2 className="animate-spin text-brand-primary" size={24} />
        </div>
        <h1 className="font-display text-3xl font-bold text-brand-heading mb-3">Verifying your email</h1>
        <p className="text-brand-paragraph text-[15px]">Please wait while we verify your email address...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-xl bg-brand-muted flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="text-brand-primary" size={24} />
        </div>
        <h1 className="font-display text-3xl font-bold text-brand-heading mb-3">Email verified</h1>
        <p className="text-brand-paragraph mb-8 text-[15px]">{message}</p>
        <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 gradient-brand text-white rounded-lg font-semibold shadow-brand hover:shadow-brand-lg transition-all duration-200 text-sm cursor-pointer">
          Continue to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-5">
        <XCircle className="text-red-400" size={24} />
      </div>
      <h1 className="font-display text-3xl font-bold text-brand-heading mb-3">Verification failed</h1>
      <p className="text-brand-paragraph mb-8 text-[15px]">{message}</p>
      <div className="flex flex-col items-center gap-3">
        <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 gradient-brand text-white rounded-lg font-semibold shadow-brand hover:shadow-brand-lg transition-all duration-200 text-sm cursor-pointer">
          Go to Sign In
        </Link>
        <button
          onClick={() => {
            setStatus("loading");
            setMessage("");
            if (token) {
              api.post("/auth/verify-email", { token })
                .then((res) => {
                  if (res.data.success) {
                    setStatus("success");
                    setMessage("Your email has been successfully verified.");
                  } else {
                    setStatus("error");
                    setMessage("Verification failed. Please try again.");
                  }
                })
                .catch(() => {
                  setStatus("error");
                  setMessage("Verification failed. The link may have expired.");
                });
            }
          }}
          className="text-brand-primary font-semibold text-sm hover:underline inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Mail size={14} /> Retry verification
        </button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={32} /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

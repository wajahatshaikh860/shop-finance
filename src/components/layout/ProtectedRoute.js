"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { booting, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!booting && !isAuthenticated) router.replace("/login");
  }, [booting, isAuthenticated, router]);

  if (booting || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-500" />
      </main>
    );
  }

  return children;
}

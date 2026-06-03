"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("shop_finance_token");
    router.replace(token ? "/dashboard" : "/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-500" />
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLock, FiMail } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, booting } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!booting && isAuthenticated) router.replace("/dashboard");
  }, [booting, isAuthenticated, router]);

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email";
    if (!form.password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await login(form);
    } catch (error) {
      setServerError(error.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-[linear-gradient(135deg,#102018,#0f172a_48%,#12312a)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="text-xl font-black">Shop Finance Manager</div>
          <div className="max-w-xl">
            <p className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100">
              Daily finance control for busy shops
            </p>
            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Keep cash, online income, and expenses organized every day.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              A clean operating dashboard for daily entries, summaries, invoice-style reports, and PDF exports.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-slate-300">
            <span className="rounded-xl bg-white/10 p-4">JWT secured</span>
            <span className="rounded-xl bg-white/10 p-4">Mobile ready</span>
            <span className="rounded-xl bg-white/10 p-4">No refresh</span>
          </div>
        </section>
        <section className="flex items-center justify-center bg-slate-100 px-4 py-10">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl shadow-slate-950/10 ring-1 ring-slate-200 sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Welcome back</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Login</h2>
              <p className="mt-2 text-sm text-slate-500">Access your shop finance dashboard.</p>
            </div>
            <div className="space-y-5">
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-4 top-11 text-slate-400" />
                <Input
                  label="Email"
                  type="email"
                  placeholder="owner@shop.com"
                  value={form.email}
                  error={errors.email}
                  className="pl-11"
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
              </div>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-11 text-slate-400" />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Your password"
                  value={form.password}
                  error={errors.password}
                  className="pl-11"
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                />
              </div>
            </div>
            {serverError ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{serverError}</p> : null}
            <Button type="submit" loading={loading} className="mt-7 w-full">
              Login securely
            </Button>
            <p className="mt-5 text-center text-sm text-slate-500">
              New shop owner?{" "}
              <Link href="/signup" className="font-bold text-emerald-700 transition hover:text-emerald-800">
                Create an account
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiBarChart2, FiLock, FiMail, FiShield, FiTrendingUp } from "react-icons/fi";
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
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#d8f7e8_0,#f7fafc_34%,#eef2ff_68%,#f8fafc_100%)] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden min-h-screen overflow-hidden bg-[linear-gradient(135deg,#07111f,#0f172a_46%,#0b3a31)] p-10 text-white lg:flex lg:flex-col lg:justify-center xl:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(16,185,129,0.30),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(59,130,246,0.18),transparent_34%)]" />
          <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative mx-auto flex w-full max-w-xl flex-col justify-center">
            <div className="mb-16 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-emerald-300 ring-1 ring-white/15">
                <FiBarChart2 className="text-2xl" />
              </span>
              <div>
                <p className="text-xl font-black tracking-tight">Shop Finance Manager</p>
                <p className="text-sm font-medium text-slate-300">Production finance dashboard</p>
              </div>
            </div>

            <p className="mb-5 inline-flex w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-white/15">
              Daily finance control for busy shops
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight xl:text-6xl">
              Keep every rupee moving with clarity.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-300 xl:text-lg">
              Track daily cash, online income, expenses, rent payments, and reports from one calm finance workspace.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-4 text-sm text-slate-200">
              <span className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <FiShield className="mb-3 text-xl text-emerald-300" />
                JWT secured
              </span>
              <span className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <FiTrendingUp className="mb-3 text-xl text-emerald-300" />
                Live summary
              </span>
              <span className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <FiBarChart2 className="mb-3 text-xl text-emerald-300" />
                Reports ready
              </span>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:bg-white/35 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-emerald-300 shadow-xl shadow-slate-950/15">
                <FiBarChart2 className="text-2xl" />
              </div>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-950">Shop Finance Manager</h1>
              <p className="mt-2 text-sm font-medium text-slate-600">Daily income, expense, and rent control.</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-[1.75rem] border border-white/70 bg-white/72 p-6 shadow-2xl shadow-slate-950/12 backdrop-blur-xl sm:p-8"
            >
              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Welcome back</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Login</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Access your finance workspace and continue tracking today.</p>
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
                  className="border-white/70 bg-white/85 pl-11 shadow-sm"
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
                  className="border-white/70 bg-white/85 pl-11 shadow-sm"
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                />
              </div>
            </div>
            {serverError ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{serverError}</p> : null}
            <Button
              type="submit"
              loading={loading}
              className="mt-7 w-full rounded-2xl bg-slate-950 shadow-xl shadow-slate-950/15 hover:bg-slate-800"
            >
              Login securely
            </Button>
            <p className="mt-5 text-center text-sm text-slate-500">
              New shop owner?{" "}
              <Link href="/signup" className="font-bold text-emerald-700 transition hover:text-emerald-800">
                Create an account
              </Link>
            </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

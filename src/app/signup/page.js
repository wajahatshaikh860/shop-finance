"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { register, isAuthenticated, booting } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!booting && isAuthenticated) router.replace("/dashboard");
  }, [booting, isAuthenticated, router]);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email";
    if (!form.password) nextErrors.password = "Password is required";
    if (form.password && form.password.length < 6) nextErrors.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = "Passwords do not match";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
    } catch (error) {
      setServerError(error.response?.data?.message || "Could not create account. Try again.");
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
              Start tracking your shop today
            </p>
            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Create your account and manage daily finance in minutes.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Register once, then record income, expenses, daily reports, and PDF exports from one dashboard.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-slate-300">
            <span className="rounded-xl bg-white/10 p-4">Secure login</span>
            <span className="rounded-xl bg-white/10 p-4">Daily reports</span>
            <span className="rounded-xl bg-white/10 p-4">PDF export</span>
          </div>
        </section>
        <section className="flex items-center justify-center bg-slate-100 px-4 py-10">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl shadow-slate-950/10 ring-1 ring-slate-200 sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Create account</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Signup</h2>
              <p className="mt-2 text-sm text-slate-500">Register your shopkeeper dashboard account.</p>
            </div>
            <div className="space-y-5">
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-4 top-11 text-slate-400" />
                <Input
                  label="Name"
                  type="text"
                  placeholder="Shop Owner"
                  value={form.name}
                  error={errors.name}
                  className="pl-11"
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                />
              </div>
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
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  error={errors.password}
                  className="pl-11"
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                />
              </div>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-11 text-slate-400" />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  error={errors.confirmPassword}
                  className="pl-11"
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                />
              </div>
            </div>
            {serverError ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{serverError}</p> : null}
            <Button type="submit" loading={loading} className="mt-7 w-full">
              Create account
            </Button>
            <p className="mt-5 text-center text-sm text-slate-500">
              Already registered?{" "}
              <Link href="/login" className="font-bold text-emerald-700 transition hover:text-emerald-800">
                Login
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

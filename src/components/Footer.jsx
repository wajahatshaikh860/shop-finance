"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowRight, FiBarChart2, FiMail, FiPhone } from "react-icons/fi";

const quickLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Shop Rent", href: "/shop-rent" },
  { label: "Reports", href: "/dashboard#transactions" },
  { label: "Transactions", href: "/dashboard#transactions" },
];

const features = ["Income Tracking", "Expense Management", "PDF Reports", "Monthly Summary"];

function FooterHeading({ children }) {
  return <h3 className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-emerald-300/90">{children}</h3>;
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-9 items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white md:justify-start md:-ml-2"
    >
      {children}
      <FiArrowRight className="hidden text-xs opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 sm:block" />
    </Link>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isDashboardShell = pathname === "/dashboard" || pathname === "/shop-rent";

  return (
    <footer
      className={`mt-8 overflow-hidden rounded-t-[2rem] bg-slate-950 text-slate-300 shadow-[0_-18px_60px_rgba(15,23,42,0.14)] ${
        isDashboardShell ? "lg:ml-72" : ""
      }`}
    >
      <div className="h-1 bg-[linear-gradient(90deg,#10b981,#38bdf8,#6366f1)]" />
      <div className="bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.12),transparent_28%)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-9 text-center sm:px-6 md:grid-cols-2 md:gap-10 md:py-11 md:text-left lg:grid-cols-[1.25fr_0.85fr_1fr_1fr] lg:px-8 lg:py-14">
          <section className="space-y-3 md:space-y-4">
            <div className="flex flex-col items-center gap-3 md:items-start">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-emerald-300 ring-1 ring-white/10">
                <FiBarChart2 className="text-2xl" />
              </span>
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">Shop Finance Manager</h2>
                <p className="mt-1 text-sm font-bold text-emerald-300">Smart daily finance tracking for modern shop owners.</p>
              </div>
            </div>
            <p className="mx-auto max-w-sm text-sm leading-6 text-slate-400 md:mx-0">
              Track income, expenses, rent payments, and daily financial performance with ease.
            </p>
          </section>

          <div className="grid grid-cols-2 gap-5 text-center md:contents md:text-left">
            <section>
              <FooterHeading>Quick Links</FooterHeading>
              <div className="mt-3 flex flex-col items-center gap-1 md:mt-4 md:items-start">
                {quickLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </div>
            </section>

            <section>
              <FooterHeading>Features</FooterHeading>
              <ul className="mt-3 grid gap-1 text-sm font-semibold text-slate-300 md:mt-4 md:gap-2">
                {features.map((feature) => (
                  <li key={feature} className="rounded-xl px-2 py-2 transition hover:bg-white/10 hover:text-white">
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="md:col-span-2 lg:col-span-1">
            <FooterHeading>Contact Us</FooterHeading>
            <div className="mt-3 flex flex-col items-center gap-2 md:mt-4 md:items-start">
              <a
                href="mailto:wajahatshaikh860@gmail.com"
                className="inline-flex min-h-10 max-w-full items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white md:-ml-2 md:justify-start"
              >
                <FiMail className="shrink-0 text-emerald-300" />
                <span className="break-all">wajahatshaikh860@gmail.com</span>
              </a>
              <a
                href="tel:+919371300127"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white md:-ml-2 md:justify-start"
              >
                <FiPhone className="shrink-0 text-emerald-300" />
                <span>9371300127</span>
              </a>
            </div>
          </section>
        </div>

        <div className="border-t border-white/10 bg-slate-950/50 px-5 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 text-center text-xs font-semibold text-slate-400 md:flex-row md:text-left">
            <p>&copy; 2026 Shop Finance Manager</p>
            <p>All Rights Reserved &mdash; Shaikh Wajahat</p>
            <p className="hidden sm:block">Built with Next.js, MongoDB and Tailwind CSS</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

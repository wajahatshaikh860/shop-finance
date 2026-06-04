"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBarChart2, FiGrid, FiHome, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: FiGrid },
  { label: "Shop Rent", href: "/shop-rent", icon: FiHome },
];

function SidebarContent({ onClose }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="flex h-full flex-col bg-slate-950 text-white">
      <div className="flex h-20 items-center justify-between px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20">
            <FiBarChart2 className="text-xl" />
          </div>
          <div className="min-w-0">
          <p className="truncate text-lg font-black tracking-tight">Shop Finance Manager</p>
          <p className="text-xs text-slate-400">{user?.name || "Manager"}</p>
          </div>
        </div>
        <button
          className="grid h-11 w-11 place-items-center rounded-xl text-slate-300 transition hover:bg-white/10 lg:hidden"
          onClick={onClose}
          type="button"
          aria-label="Close navigation"
        >
          <FiX />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-950/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="text-lg" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-white/10 hover:text-white" onClick={logout}>
          <FiLogOut />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/70 bg-white/90 px-4 py-3 shadow-sm shadow-slate-950/5 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-950 text-emerald-300 shadow-lg shadow-slate-950/10">
              <FiBarChart2 className="text-lg" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black tracking-tight text-slate-950">Shop Finance Manager</span>
              <span className="block text-xs font-semibold text-slate-500">Daily finance control</span>
            </span>
          </Link>
          <button
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 transition active:scale-95"
            onClick={() => setOpen(true)}
            type="button"
            aria-label="Open navigation"
          >
            <FiMenu className="text-xl" />
          </button>
        </div>
      </header>

      <div className="fixed left-0 top-0 z-30 hidden h-screen w-72 lg:block">
        <SidebarContent />
      </div>

      <div
        className={`fixed inset-0 z-50 transition lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <button
          className={`absolute inset-0 bg-slate-950/55 backdrop-blur-[2px] transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
          type="button"
          aria-label="Close navigation overlay"
        />
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-[88vw] shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SidebarContent onClose={() => setOpen(false)} />
        </div>
      </div>
    </>
  );
}

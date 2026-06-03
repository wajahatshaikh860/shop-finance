"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiHome, FiLogOut, FiMenu, FiX } from "react-icons/fi";
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
        <div>
          <p className="text-lg font-black tracking-tight">Shop Finance</p>
          <p className="text-xs text-slate-400">{user?.name || "Manager"}</p>
        </div>
        <button className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 lg:hidden" onClick={onClose} type="button">
          <FiX />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-950/30" : "text-slate-300 hover:bg-white/10 hover:text-white"
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
      <button
        className="fixed left-4 top-4 z-40 rounded-xl bg-slate-950 p-3 text-white shadow-lg lg:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <FiMenu />
      </button>

      <div className="fixed left-0 top-0 z-30 hidden h-screen w-72 lg:block">
        <SidebarContent />
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/50" onClick={() => setOpen(false)} type="button" />
          <div className="relative h-full w-80 max-w-[88vw] shadow-2xl">
            <SidebarContent onClose={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}

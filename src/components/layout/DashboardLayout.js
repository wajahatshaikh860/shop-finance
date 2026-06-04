"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#f5f7fb]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="px-4 pb-10 pt-24 sm:px-6 lg:ml-72 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

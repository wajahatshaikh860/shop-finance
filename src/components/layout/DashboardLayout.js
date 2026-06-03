"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="min-h-screen px-4 py-20 sm:px-6 lg:ml-72 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

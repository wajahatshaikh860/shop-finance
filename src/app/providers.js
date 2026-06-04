"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function AppFooter() {
  const pathname = usePathname();
  const { booting, isAuthenticated } = useAuth();
  const hiddenRoutes = ["/", "/login", "/signup", "/register"];

  if (booting || !isAuthenticated || hiddenRoutes.includes(pathname)) return null;

  return <Footer />;
}

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <AppFooter />
      </div>
    </AuthProvider>
  );
}
